import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode';
import speakeasy from 'speakeasy';
import { prisma } from '../index.js';
import { getFirebaseAuth, verifyIdToken, listUsers, getUserByEmail, disableUser, enableUser } from '../services/firebaseAuth.js';
const router = Router();
// ===== 2FA with speakeasy =====
function generateTOTPSecret() {
    const secret = speakeasy.generateSecret({
        name: 'Getatos Safari Admin',
        length: 20
    });
    // Return base32 encoding for use with authenticator apps
    return secret.base32 || '';
}
function generateTOTPUri(secret, label) {
    return `otpauth://totp/${label}?secret=${secret}&issuer=Getatos%20Safari%20Admin&algorithm=SHA1&digits=6&period=30`;
}
// TOTP verification using speakeasy
function verifyTOTPCode(secret, token) {
    console.log('DEBUG verifyTOTPCode: secret =', secret);
    console.log('DEBUG verifyTOTPCode: token =', token);
    const cleanToken = token.replace(/\s/g, '');
    if (!/^\d{6}$/.test(cleanToken)) {
        console.log('DEBUG verifyTOTPCode: invalid format');
        return false;
    }
    const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: cleanToken,
        window: 1
    });
    console.log('DEBUG verifyTOTPCode: speakeasy result =', verified);
    return verified;
}
// JWT Secret - must be set in environment variables for production
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn('⚠️  WARNING: JWT_SECRET not set! Using default for development only.');
}
const effectiveJwtSecret = JWT_SECRET || 'dev-only-secret-do-not-use-in-production';
// Middleware to check admin auth mit Firebase Token
const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
        // Erst versuche Firebase Token zu verifizieren
        const decodedToken = await verifyIdToken(token);
        req.admin = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: 'admin'
        };
        next();
    }
    catch {
        // Fallback auf JWT (für alte Tokens)
        try {
            const decoded = jwt.verify(token, effectiveJwtSecret);
            req.admin = decoded;
            next();
        }
        catch {
            return res.status(401).json({ error: 'Invalid token' });
        }
    }
};
// ✅ Firebase Auth als Haupt-Authentifizierung
// ADMIN_USERS ENV ist nur FALLBACK falls Firebase nicht erreichbar ist
const fallbackUsersRaw = process.env.ADMIN_USERS || '[]';
let fallbackUsers = [];
try {
    fallbackUsers = JSON.parse(fallbackUsersRaw);
}
catch (e) {
    console.warn('⚠️  ADMIN_USERS parse error, using empty fallback');
}
// ✅ Firebase Console → Token-Only Login
// Frontend: Firebase Client SDK → Email/Passwort → ID Token
// Backend: Verifiziert Token → gibt Session JWT zurück
router.post('/login', async (req, res) => {
    const { firebaseToken } = req.body;
    if (!firebaseToken) {
        return res.status(400).json({ error: 'Firebase token required' });
    }
    try {
        // Verifiziere Firebase Token mit Admin SDK
        const decodedToken = await verifyIdToken(firebaseToken);
        const userRecord = await getFirebaseAuth()?.getUser(decodedToken.uid);
        // Hole User-Details aus Firebase
        if (!userRecord) {
            return res.status(401).json({ error: 'User not found' });
        }
        if (userRecord.disabled) {
            return res.status(401).json({ error: 'User is disabled' });
        }
        const email = decodedToken.email;
        // Prüfe ob der Benutzer 2FA aktiviert hat
        const adminUser = await prisma.adminUser.findUnique({ where: { email } });
        const requiresTwoFA = adminUser?.totpEnabled === true;
        if (requiresTwoFA) {
            // Generiere einen temporären 2FA-Verification Token
            const twofaToken = jwt.sign({
                uid: decodedToken.uid,
                email: email,
                type: '2fa_pending',
                requiresTwoFA: true
            }, effectiveJwtSecret, { expiresIn: '5m' });
            return res.json({
                requiresTwoFA: true,
                twofaToken: twofaToken,
                message: '2FA required. Please enter your code.'
            });
        }
        // Generiere eigenen JWT für die Session (kein 2FA)
        const sessionToken = jwt.sign({
            uid: decodedToken.uid,
            email: email,
            email_verified: decodedToken.email_verified,
            role: 'admin'
        }, effectiveJwtSecret, { expiresIn: '24h' });
        res.json({
            token: sessionToken,
            user: {
                uid: decodedToken.uid,
                email: email,
                displayName: userRecord?.displayName || email,
                emailVerified: decodedToken.email_verified,
                role: 'admin'
            }
        });
    }
    catch (error) {
        console.error('Firebase token verification failed:', error.message);
        res.status(401).json({ error: 'Invalid Firebase token' });
    }
});
// ===== TOTP 2FA ROUTES =====
// Generate TOTP 2FA setup (returns QR code for authenticator app)
router.post('/2fa/setup', authenticateAdmin, async (req, res) => {
    try {
        const admin = req.admin;
        const email = admin.email;
        // Check if admin exists in our database
        let adminUser = await prisma.adminUser.findUnique({ where: { email } });
        if (!adminUser) {
            // Create admin user if not exists
            adminUser = await prisma.adminUser.create({
                data: { email, passwordHash: '', fullName: '' }
            });
        }
        // Generate new TOTP secret
        const secret = generateTOTPSecret();
        const otpauth = generateTOTPUri(secret, email);
        // Generate QR code as data URL
        const qrCodeDataUrl = await QRCode.toDataURL(otpauth);
        // Store secret temporarily (not enabled yet until verified)
        // For security, we should encrypt this - storing plain for now, will encrypt in production
        await prisma.adminUser.update({
            where: { email },
            data: { totpSecret: secret }
        });
        res.json({
            secret,
            qrCode: qrCodeDataUrl,
            message: 'Scan the QR code with your authenticator app, then verify with a code'
        });
    }
    catch (error) {
        console.error('2FA setup error:', error.message);
        res.status(500).json({ error: 'Failed to setup 2FA' });
    }
});
// Verify and enable TOTP 2FA
router.post('/2fa/verify', authenticateAdmin, async (req, res) => {
    try {
        const { code } = req.body;
        const admin = req.admin;
        const email = admin.email;
        if (!code) {
            return res.status(400).json({ error: 'Verification code required' });
        }
        // Get admin user
        const adminUser = await prisma.adminUser.findUnique({ where: { email } });
        if (!adminUser || !adminUser.totpSecret) {
            return res.status(400).json({ error: 'No 2FA setup in progress. Generate QR code first.' });
        }
        // Verify the code
        const isValid = verifyTOTPCode(adminUser.totpSecret, req.body.code || "dummy");
        if (!isValid) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }
        // Enable 2FA
        await prisma.adminUser.update({
            where: { email },
            data: { totpEnabled: true }
        });
        res.json({ success: true, message: '2FA enabled successfully' });
    }
    catch (error) {
        console.error('2FA verify error:', error.message);
        res.status(500).json({ error: 'Failed to verify 2FA' });
    }
});
// Disable 2FA
router.post('/2fa/disable', authenticateAdmin, async (req, res) => {
    try {
        const { code } = req.body;
        const admin = req.admin;
        const email = admin.email;
        // Get admin user
        const adminUser = await prisma.adminUser.findUnique({ where: { email } });
        if (!adminUser || !adminUser.totpEnabled) {
            return res.status(400).json({ error: '2FA is not enabled' });
        }
        // Verify current code before disabling
        if (code && adminUser.totpSecret) {
            const isValid = verifyTOTPCode(adminUser.totpSecret, req.body.code || "dummy");
            if (!isValid) {
                return res.status(400).json({ error: 'Invalid verification code' });
            }
        }
        // Disable 2FA
        await prisma.adminUser.update({
            where: { email },
            data: { totpSecret: null, totpEnabled: false }
        });
        res.json({ success: true, message: '2FA disabled successfully' });
    }
    catch (error) {
        console.error('2FA disable error:', error.message);
        res.status(500).json({ error: 'Failed to disable 2FA' });
    }
});
// Check if 2FA is enabled for current user
router.get('/2fa/status', authenticateAdmin, async (req, res) => {
    try {
        const admin = req.admin;
        const email = admin.email;
        const adminUser = await prisma.adminUser.findUnique({ where: { email } });
        res.json({
            enabled: adminUser?.totpEnabled || false
        });
    }
    catch (error) {
        console.error('2FA status error:', error.message);
        res.status(500).json({ error: 'Failed to get 2FA status' });
    }
});
// Modified login that checks Firebase token and optionally TOTP
router.post('/login-with-2fa', async (req, res) => {
    const { twofaToken, totpCode } = req.body;
    if (!twofaToken) {
        return res.status(400).json({ error: '2FA token required' });
    }
    if (!totpCode) {
        return res.status(400).json({ error: 'TOTP code required' });
    }
    try {
        // Verify the 2FA pending token
        const decoded = jwt.verify(twofaToken, effectiveJwtSecret);
        if (decoded.type !== '2fa_pending') {
            return res.status(401).json({ error: 'Invalid 2FA token' });
        }
        const email = decoded.email;
        // Get admin user with 2FA config
        const adminUser = await prisma.adminUser.findUnique({ where: { email } });
        if (!adminUser?.totpEnabled) {
            return res.status(400).json({ error: '2FA not enabled for this user' });
        }
        // Verify TOTP code
        console.log('DEBUG: Verifying TOTP for email:', email);
        console.log('DEBUG: TOTP code received:', totpCode);
        console.log('DEBUG: totpSecret exists:', !!adminUser.totpSecret);
        console.log('DEBUG: totpSecret length:', adminUser.totpSecret?.length);
        const isValid = verifyTOTPCode(adminUser.totpSecret, totpCode);
        console.log('DEBUG: TOTP verification result:', isValid);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid 2FA code' });
        }
        // Generate final session JWT
        const sessionToken = jwt.sign({
            uid: decoded.uid,
            email: email,
            role: 'admin'
        }, effectiveJwtSecret, { expiresIn: '24h' });
        res.json({
            token: sessionToken,
            user: {
                uid: decoded.uid,
                email: email,
                role: 'admin',
                has2FA: true
            }
        });
    }
    catch (error) {
        console.error('Login with 2FA error:', error.message);
        res.status(401).json({ error: 'Invalid or expired token' });
    }
});
// 2FA wird jetzt über Firebase Authentication verwaltet
// Diese alten Routes werden nicht mehr benötigt
// Admin-Benutzer auflisten
router.get('/users', authenticateAdmin, async (req, res) => {
    try {
        const users = await listUsers();
        const adminList = users.map(u => ({
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            disabled: u.disabled,
            createdAt: u.metadata.creationTime
        }));
        res.json(adminList);
    }
    catch (e) {
        // Fallback auf lokale Admins
        res.json(fallbackUsers.map(u => ({
            email: u.email,
            full_name: u.full_name,
            has2FA: !!u.secret
        })));
    }
});
// Admin-Benutzer deaktivieren
router.post('/users/:email/disable', authenticateAdmin, async (req, res) => {
    const { email } = req.params;
    try {
        const user = await getUserByEmail(email);
        if (user) {
            await disableUser(user.uid);
            res.json({ success: true });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (e) {
        res.status(500).json({ error: 'Failed to disable user' });
    }
});
// Admin-Benutzer reaktivieren
router.post('/users/:email/enable', authenticateAdmin, async (req, res) => {
    const { email } = req.params;
    try {
        const user = await getUserByEmail(email);
        if (user) {
            await enableUser(user.uid);
            res.json({ success: true });
        }
        else {
            res.status(404).json({ error: 'User not found' });
        }
    }
    catch (e) {
        res.status(500).json({ error: 'Failed to enable user' });
    }
});
// Get current user
router.get('/me', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.replace('Bearer ', '');
    // Versuche Firebase Token zu verifizieren
    verifyIdToken(token)
        .then(decodedToken => {
        res.json({
            user: {
                uid: decodedToken.uid,
                email: decodedToken.email
            }
        });
    })
        .catch(() => {
        // Fallback auf JWT
        try {
            const decoded = jwt.verify(token, effectiveJwtSecret);
            res.json({ user: decoded });
        }
        catch {
            return res.status(401).json({ error: 'Invalid token' });
        }
    });
});
// Dashboard stats - PROTECTED
router.get('/dashboard/stats', authenticateAdmin, (req, res) => {
    res.json({
        totalBookings: 156,
        pendingBookings: 23,
        confirmedBookings: 89,
        totalRevenue: 285400,
        totalTours: 12,
        totalSubscribers: 342,
        recentBookings: []
    });
});
// ===== BLOG POSTS ADMIN =====
// Get all posts (including drafts)
router.get('/posts', authenticateAdmin, async (req, res) => {
    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(posts);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
// Get single post
router.get('/posts/:id', authenticateAdmin, async (req, res) => {
    try {
        const post = await prisma.blogPost.findUnique({
            where: { id: Number(req.params.id) }
        });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    }
    catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});
// Create post
router.post('/posts', authenticateAdmin, async (req, res) => {
    try {
        console.log('=== CREATE POST ===');
        console.log('req.body keys:', Object.keys(req.body));
        const { featured_image, featuredImage, author, is_published, isPublished, 
        // Alle Sprachen - camelCase (titleDe, contentDe, etc.)
        titleDe, titleEn, titleEs, titleFr, titleZh, contentDe, contentEn, contentEs, contentFr, contentZh, excerptDe, excerptEn, excerptEs, excerptFr, excerptZh, slugDe, slugEn, slugEs, slugFr, slugZh, 
        // Category
        categoryDe, categoryEn, categoryEs, categoryFr, categoryZh, 
        // SEO
        metaTitleDe, metaTitleEn, metaTitleEs, metaTitleFr, metaTitleZh, metaDescriptionDe, metaDescriptionEn, metaDescriptionEs, metaDescriptionFr, metaDescriptionZh, h1De, h1En, h1Es, h1Fr, h1Zh, featuredImageAltDe, featuredImageAltEn, featuredImageAltEs, featuredImageAltFr, featuredImageAltZh } = req.body;
        const post = await prisma.blogPost.create({
            data: {
                // slug ist nur für interne Referenz - nimm slugDe oder slugEn falls vorhanden
                slug: slugDe || slugEn || slugEs || slugFr || slugZh || `post-${Date.now()}`,
                featuredImage: featured_image || featuredImage || null,
                author: author || null,
                isPublished: is_published ?? isPublished ?? false,
                // Alle Sprachen - camelCase
                titleDe,
                titleEn,
                titleEs,
                titleFr,
                titleZh,
                contentDe,
                contentEn,
                contentEs,
                contentFr,
                contentZh,
                excerptDe,
                excerptEn,
                excerptEs,
                excerptFr,
                excerptZh,
                slugDe,
                slugEn,
                slugEs,
                slugFr,
                slugZh,
                // Category
                categoryDe,
                categoryEn,
                categoryEs,
                categoryFr,
                categoryZh,
                // SEO
                metaTitleDe,
                metaTitleEn,
                metaTitleEs,
                metaTitleFr,
                metaTitleZh,
                metaDescriptionDe,
                metaDescriptionEn,
                metaDescriptionEs,
                metaDescriptionFr,
                metaDescriptionZh,
                h1De,
                h1En,
                h1Es,
                h1Fr,
                h1Zh,
                featuredImageAltDe,
                featuredImageAltEn,
                featuredImageAltEs,
                featuredImageAltFr,
                featuredImageAltZh
            }
        });
        res.json(post);
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});
// Update post
router.put('/posts/:id', authenticateAdmin, async (req, res) => {
    try {
        const { featured_image, featuredImage, author, is_published, isPublished, 
        // Multi-language - camelCase
        titleDe, titleEn, titleEs, titleFr, titleZh, contentDe, contentEn, contentEs, contentFr, contentZh, excerptDe, excerptEn, excerptEs, excerptFr, excerptZh, slugDe, slugEn, slugEs, slugFr, slugZh, 
        // Category
        categoryDe, categoryEn, categoryEs, categoryFr, categoryZh, 
        // SEO
        metaTitleDe, metaTitleEn, metaTitleEs, metaTitleFr, metaTitleZh, metaDescriptionDe, metaDescriptionEn, metaDescriptionEs, metaDescriptionFr, metaDescriptionZh, h1De, h1En, h1Es, h1Fr, h1Zh, featuredImageAltDe, featuredImageAltEn, featuredImageAltEs, featuredImageAltFr, featuredImageAltZh } = req.body;
        const post = await prisma.blogPost.update({
            where: { id: Number(req.params.id) },
            data: {
                // slug ist nur für interne Referenz
                slug: slugDe || slugEn || slugEs || slugFr || slugZh || null,
                featuredImage: featured_image || featuredImage || null,
                author: author || null,
                isPublished: is_published ?? isPublished,
                // Alle Sprachen - camelCase
                titleDe,
                titleEn,
                titleEs,
                titleFr,
                titleZh,
                contentDe,
                contentEn,
                contentEs,
                contentFr,
                contentZh,
                excerptDe,
                excerptEn,
                excerptEs,
                excerptFr,
                excerptZh,
                slugDe,
                slugEn,
                slugEs,
                slugFr,
                slugZh,
                // Category
                categoryDe,
                categoryEn,
                categoryEs,
                categoryFr,
                categoryZh,
                // SEO
                metaTitleDe,
                metaTitleEn,
                metaTitleEs,
                metaTitleFr,
                metaTitleZh,
                metaDescriptionDe,
                metaDescriptionEn,
                metaDescriptionEs,
                metaDescriptionFr,
                metaDescriptionZh,
                h1De,
                h1En,
                h1Es,
                h1Fr,
                h1Zh,
                featuredImageAltDe,
                featuredImageAltEn,
                featuredImageAltEs,
                featuredImageAltFr,
                featuredImageAltZh
            }
        });
        res.json(post);
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
});
// Delete post
router.delete('/posts/:id', authenticateAdmin, async (req, res) => {
    try {
        await prisma.blogPost.delete({
            where: { id: Number(req.params.id) }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
});
// ===== TRANSLATIONS ADMIN =====
// Get all translations
router.get('/translations', authenticateAdmin, async (req, res) => {
    try {
        const translations = await prisma.translation.findMany({
            orderBy: [
                { languageCode: 'asc' },
                { pageKey: 'asc' },
                { key: 'asc' }
            ]
        });
        res.json(translations);
    }
    catch (error) {
        console.error('Error fetching translations:', error);
        res.status(500).json({ error: 'Failed to fetch translations' });
    }
});
// Create/update translation
router.post('/translations', authenticateAdmin, async (req, res) => {
    try {
        const { languageCode, pageKey, key, value } = req.body;
        const translation = await prisma.translation.upsert({
            where: {
                languageCode_pageKey_key: {
                    languageCode,
                    pageKey: pageKey || '',
                    key
                }
            },
            update: { value },
            create: {
                languageCode,
                pageKey: pageKey || '',
                key,
                value
            }
        });
        res.json(translation);
    }
    catch (error) {
        console.error('Error saving translation:', error);
        res.status(500).json({ error: 'Failed to save translation' });
    }
});
// Delete translation
router.delete('/translations/:id', authenticateAdmin, async (req, res) => {
    try {
        await prisma.translation.delete({
            where: { id: Number(req.params.id) }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting translation:', error);
        res.status(500).json({ error: 'Failed to delete translation' });
    }
});
// Bulk import translations
router.post('/translations/bulk', authenticateAdmin, async (req, res) => {
    try {
        const { translations } = req.body; // Array of { languageCode, pageKey, key, value }
        for (const t of translations) {
            await prisma.translation.upsert({
                where: {
                    languageCode_pageKey_key: {
                        languageCode: t.languageCode,
                        pageKey: t.pageKey || '',
                        key: t.key
                    }
                },
                update: { value: t.value },
                create: {
                    languageCode: t.languageCode,
                    pageKey: t.pageKey || '',
                    key: t.key,
                    value: t.value
                }
            });
        }
        res.json({ success: true, count: translations.length });
    }
    catch (error) {
        console.error('Error bulk import:', error);
        res.status(500).json({ error: 'Failed to import translations' });
    }
});
// ===== FAQ ADMIN =====
router.get('/faqs', authenticateAdmin, async (req, res) => {
    try {
        const faqs = await prisma.fAQ.findMany({
            orderBy: { displayOrder: 'asc' }
        });
        res.json(faqs);
    }
    catch (error) {
        console.error('Error fetching FAQs:', error);
        res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
});
router.post('/faqs', authenticateAdmin, async (req, res) => {
    try {
        const { question, answer, category, language, isActive, displayOrder } = req.body;
        const faq = await prisma.fAQ.create({
            data: {
                question,
                answer,
                category,
                language: language || 'en',
                isActive: isActive ?? true,
                displayOrder: displayOrder || 0
            }
        });
        res.json(faq);
    }
    catch (error) {
        console.error('Error creating FAQ:', error);
        res.status(500).json({ error: 'Failed to create FAQ' });
    }
});
router.put('/faqs/:id', authenticateAdmin, async (req, res) => {
    try {
        const { question, answer, category, language, isActive, displayOrder } = req.body;
        const faq = await prisma.fAQ.update({
            where: { id: Number(req.params.id) },
            data: {
                question,
                answer,
                category,
                language,
                isActive,
                displayOrder
            }
        });
        res.json(faq);
    }
    catch (error) {
        console.error('Error updating FAQ:', error);
        res.status(500).json({ error: 'Failed to update FAQ' });
    }
});
router.delete('/faqs/:id', authenticateAdmin, async (req, res) => {
    try {
        await prisma.fAQ.delete({
            where: { id: Number(req.params.id) }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting FAQ:', error);
        res.status(500).json({ error: 'Failed to delete FAQ' });
    }
});
// ===== GALLERY ADMIN =====
// Generate slug from title
function generateSlug(title) {
    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    const shortUuid = uuidv4().slice(0, 8);
    return `${slug}-${shortUuid}`;
}
router.get('/gallery', authenticateAdmin, async (req, res) => {
    try {
        const images = await prisma.galleryImage.findMany({
            orderBy: { displayOrder: 'asc' }
        });
        res.json(images);
    }
    catch (error) {
        console.error('Error fetching gallery:', error);
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
});
router.post('/gallery', authenticateAdmin, async (req, res) => {
    try {
        const { title, title_de, title_en, title_es, title_fr, title_zh, description, description_de, description_es, description_fr, description_zh, url, category, isActive, displayOrder } = req.body;
        const slug = generateSlug(title || 'image');
        const image = await prisma.galleryImage.create({
            data: {
                title,
                title_de,
                title_es,
                title_fr,
                title_zh,
                description,
                description_de,
                description_es,
                description_fr,
                description_zh,
                url,
                category,
                isActive: isActive ?? true,
                displayOrder: displayOrder || 0,
                slug
            }
        });
        res.json(image);
    }
    catch (error) {
        console.error('Error creating gallery image:', error);
        res.status(500).json({ error: 'Failed to create gallery image' });
    }
});
router.put('/gallery/:id', authenticateAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid image ID' });
        }
        const { title, title_de, title_en, title_es, title_fr, title_zh, description, description_de, description_es, description_fr, description_zh, url, category, isActive, displayOrder } = req.body;
        // Check if record exists
        const existingImage = await prisma.galleryImage.findUnique({
            where: { id }
        });
        if (!existingImage) {
            return res.status(404).json({ error: 'Image not found' });
        }
        const updateData = {
            title,
            title_de,
            title_es,
            title_fr,
            title_zh,
            description,
            description_de,
            description_es,
            description_fr,
            description_zh,
            url,
            category,
            isActive,
            displayOrder
        };
        // Regenerate slug if title changed
        if (title && title !== existingImage.title) {
            updateData.slug = generateSlug(title);
        }
        const image = await prisma.galleryImage.update({
            where: { id },
            data: updateData
        });
        res.json(image);
    }
    catch (error) {
        console.error('Error updating gallery image:', error);
        res.status(500).json({ error: 'Failed to update gallery image' });
    }
});
router.delete('/gallery/:id', authenticateAdmin, async (req, res) => {
    try {
        await prisma.galleryImage.delete({
            where: { id: Number(req.params.id) }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({ error: 'Failed to delete gallery image' });
    }
});
// ============ TOURS ADMIN ============
// Get all tours
router.get('/tours', authenticateAdmin, async (req, res) => {
    try {
        const tours = await prisma.tour.findMany({
            include: {
                images: { where: { isCover: true }, take: 1 },
                itinerary: { orderBy: { dayNumber: 'asc' } }
            },
            orderBy: { id: 'asc' }
        });
        res.json(tours);
    }
    catch (error) {
        console.error('Error fetching tours:', error);
        res.status(500).json({ error: 'Failed to fetch tours' });
    }
});
// Get single tour
router.get('/tours/:id', authenticateAdmin, async (req, res) => {
    try {
        const tour = await prisma.tour.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { images: { orderBy: { displayOrder: 'asc' } }, itinerary: { orderBy: { dayNumber: 'asc' } } }
        });
        if (!tour)
            return res.status(404).json({ error: 'Tour not found' });
        res.json(tour);
    }
    catch (error) {
        console.error('Error fetching tour:', error);
        res.status(500).json({ error: 'Failed to fetch tour' });
    }
});
// Create tour
router.post('/tours', authenticateAdmin, async (req, res) => {
    try {
        const { titleEn, titleDe, titleEs, titleFr, titleZh, descriptionEn, descriptionDe, descriptionEs, descriptionFr, descriptionZh, shortDescriptionEn, shortDescriptionDe, shortDescriptionEs, shortDescriptionFr, shortDescriptionZh, 
        // SEO meta fields
        metaTitleEn, metaTitleDe, metaTitleEs, metaTitleFr, metaTitleZh, metaDescriptionEn, metaDescriptionDe, metaDescriptionEs, metaDescriptionFr, metaDescriptionZh, slugEn, slugDe, slugEs, slugFr, slugZh, tourType, durationDays, difficulty, priceEn, priceDe, priceEs, priceFr, priceZh, currencyEn, currencyDe, currencyEs, currencyFr, currencyZh, maxGroupSize, highlightsEn, highlightsDe, highlightsEs, highlightsFr, highlightsZh, includedEn, includedDe, includedEs, includedFr, includedZh, notIncludedEn, notIncludedDe, notIncludedEs, notIncludedFr, notIncludedZh, isFeatured, isActive, startLat, startLng, startName, endLat, endLng, endName, waypoints, images, itinerary } = req.body;
        // Auto-generate slugs if not provided
        const timestamp = Date.now().toString(36).slice(-6);
        const slugEnFinal = slugEn?.trim() || (titleEn ? titleEn.toLowerCase().replace(/\s+/g, '-') + '-' + timestamp : null);
        const slugDeFinal = slugDe?.trim() || (titleDe ? titleDe.toLowerCase().replace(/\s+/g, '-') + '-' + timestamp : slugEnFinal);
        const slugEsFinal = slugEs?.trim() || (titleEs ? titleEs.toLowerCase().replace(/\s+/g, '-') + '-' + timestamp : slugEnFinal);
        const slugFrFinal = slugFr?.trim() || (titleFr ? titleFr.toLowerCase().replace(/\s+/g, '-') + '-' + timestamp : slugEnFinal);
        const slugZhFinal = slugZh?.trim() || (titleZh ? titleZh.toLowerCase().replace(/\s+/g, '-') + '-' + timestamp : slugEnFinal);
        const tour = await prisma.tour.create({
            data: {
                slugEn: slugEnFinal,
                slugDe: slugDeFinal,
                slugEs: slugEsFinal,
                slugFr: slugFrFinal,
                slugZh: slugZhFinal,
                tourType: tourType || 'safari', durationDays: durationDays || 1, difficulty: difficulty || 'easy',
                priceEn: priceEn || null,
                priceDe: priceDe || null,
                priceEs: priceEs || null,
                priceFr: priceFr || null,
                priceZh: priceZh || null,
                currencyEn: currencyEn || null,
                currencyDe: currencyDe || null,
                currencyEs: currencyEs || null,
                currencyFr: currencyFr || null,
                currencyZh: currencyZh || null,
                maxGroupSize: maxGroupSize || 10,
                highlightsEn: highlightsEn || null, highlightsDe: highlightsDe || null, highlightsEs: highlightsEs || null, highlightsFr: highlightsFr || null, highlightsZh: highlightsZh || null,
                includedEn: includedEn || null, includedDe: includedDe || null, includedEs: includedEs || null, includedFr: includedFr || null, includedZh: includedZh || null,
                notIncludedEn: notIncludedEn || null, notIncludedDe: notIncludedDe || null, notIncludedEs: notIncludedEs || null, notIncludedFr: notIncludedFr || null, notIncludedZh: notIncludedZh || null,
                isFeatured: isFeatured || false, isActive: isActive !== false,
                startLat: startLat || null, startLng: startLng || null, startName: startName || '',
                endLat: endLat || null, endLng: endLng || null, endName: endName || '',
                waypoints: waypoints || '',
                titleEn: titleEn || '', titleDe: titleDe || '', titleEs: titleEs || '', titleFr: titleFr || '', titleZh: titleZh || '',
                descriptionEn: descriptionEn || '', descriptionDe: descriptionDe || '', descriptionEs: descriptionEs || '', descriptionFr: descriptionFr || '', descriptionZh: descriptionZh || '',
                shortDescriptionEn: shortDescriptionEn || '', shortDescriptionDe: shortDescriptionDe || '', shortDescriptionEs: shortDescriptionEs || '', shortDescriptionFr: shortDescriptionFr || '', shortDescriptionZh: shortDescriptionZh || '',
                // SEO meta fields
                metaTitleEn: metaTitleEn || null, metaTitleDe: metaTitleDe || null, metaTitleEs: metaTitleEs || null, metaTitleFr: metaTitleFr || null, metaTitleZh: metaTitleZh || null,
                metaDescriptionEn: metaDescriptionEn || null, metaDescriptionDe: metaDescriptionDe || null, metaDescriptionEs: metaDescriptionEs || null, metaDescriptionFr: metaDescriptionFr || null, metaDescriptionZh: metaDescriptionZh || null,
            }
        });
        // Create images
        if (images && images.length > 0) {
            for (const img of images) {
                await prisma.tourImage.create({ data: { ...img, tourId: tour.id } });
            }
        }
        // Create itinerary
        if (itinerary && itinerary.length > 0) {
            for (const it of itinerary) {
                await prisma.itinerary.create({
                    data: {
                        tourId: tour.id,
                        dayNumber: it.dayNumber,
                        title: it.title || it.titleEn || it.titleDe || '',
                        description: it.description || it.descriptionEn || it.descriptionDe || '',
                        titleEn: it.titleEn || null,
                        titleDe: it.titleDe || null,
                        titleEs: it.titleEs || null,
                        titleFr: it.titleFr || null,
                        titleZh: it.titleZh || null,
                        descriptionEn: it.descriptionEn || null,
                        descriptionDe: it.descriptionDe || null,
                        descriptionEs: it.descriptionEs || null,
                        descriptionFr: it.descriptionFr || null,
                        descriptionZh: it.descriptionZh || null,
                        accommodationEn: it.accommodationEn || null,
                        accommodationDe: it.accommodationDe || null,
                        accommodationEs: it.accommodationEs || null,
                        accommodationFr: it.accommodationFr || null,
                        accommodationZh: it.accommodationZh || null,
                        mealsEn: it.mealsEn || null,
                        mealsDe: it.mealsDe || null,
                        mealsEs: it.mealsEs || null,
                        mealsFr: it.mealsFr || null,
                        mealsZh: it.mealsZh || null,
                    }
                });
            }
        }
        res.json(tour);
    }
    catch (error) {
        console.error('Error creating tour:', error);
        res.status(500).json({ error: 'Failed to create tour' });
    }
});
// Update tour
router.put('/tours/:id', authenticateAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { titleEn, titleDe, titleEs, titleFr, titleZh, descriptionEn, descriptionDe, descriptionEs, descriptionFr, descriptionZh, shortDescriptionEn, shortDescriptionDe, shortDescriptionEs, shortDescriptionFr, shortDescriptionZh, 
        // SEO meta fields
        metaTitleEn, metaTitleDe, metaTitleEs, metaTitleFr, metaTitleZh, metaDescriptionEn, metaDescriptionDe, metaDescriptionEs, metaDescriptionFr, metaDescriptionZh, slugEn, slugDe, slugEs, slugFr, slugZh, tourType, durationDays, difficulty, priceEn, priceDe, priceEs, priceFr, priceZh, currencyEn, currencyDe, currencyEs, currencyFr, currencyZh, maxGroupSize, highlightsEn, highlightsDe, highlightsEs, highlightsFr, highlightsZh, includedEn, includedDe, includedEs, includedFr, includedZh, notIncludedEn, notIncludedDe, notIncludedEs, notIncludedFr, notIncludedZh, isFeatured, isActive, startLat, startLng, startName, endLat, endLng, endName, waypoints, images, itinerary } = req.body;
        const tour = await prisma.tour.update({
            where: { id },
            data: {
                slugEn: slugEn || null,
                slugDe: slugDe || null,
                slugEs: slugEs || null,
                slugFr: slugFr || null,
                slugZh: slugZh || null,
                tourType: tourType || 'safari', durationDays: durationDays || 1, difficulty: difficulty || 'easy',
                priceEn: priceEn || null,
                priceDe: priceDe || null,
                priceEs: priceEs || null,
                priceFr: priceFr || null,
                priceZh: priceZh || null,
                currencyEn: currencyEn || null,
                currencyDe: currencyDe || null,
                currencyEs: currencyEs || null,
                currencyFr: currencyFr || null,
                currencyZh: currencyZh || null,
                maxGroupSize: maxGroupSize || 10,
                highlightsEn: highlightsEn || null, highlightsDe: highlightsDe || null, highlightsEs: highlightsEs || null, highlightsFr: highlightsFr || null, highlightsZh: highlightsZh || null,
                includedEn: includedEn || null, includedDe: includedDe || null, includedEs: includedEs || null, includedFr: includedFr || null, includedZh: includedZh || null,
                notIncludedEn: notIncludedEn || null, notIncludedDe: notIncludedDe || null, notIncludedEs: notIncludedEs || null, notIncludedFr: notIncludedFr || null, notIncludedZh: notIncludedZh || null,
                isFeatured: isFeatured || false, isActive: isActive !== false,
                startLat: startLat || null, startLng: startLng || null, startName: startName || '',
                endLat: endLat || null, endLng: endLng || null, endName: endName || '',
                waypoints: waypoints || '',
                titleEn: titleEn || '', titleDe: titleDe || '', titleEs: titleEs || '', titleFr: titleFr || '', titleZh: titleZh || '',
                descriptionEn: descriptionEn || '', descriptionDe: descriptionDe || '', descriptionEs: descriptionEs || '', descriptionFr: descriptionFr || '', descriptionZh: descriptionZh || '',
                shortDescriptionEn: shortDescriptionEn || '', shortDescriptionDe: shortDescriptionDe || '', shortDescriptionEs: shortDescriptionEs || '', shortDescriptionFr: shortDescriptionFr || '', shortDescriptionZh: shortDescriptionZh || '',
                // SEO meta fields
                metaTitleEn: metaTitleEn || null, metaTitleDe: metaTitleDe || null, metaTitleEs: metaTitleEs || null, metaTitleFr: metaTitleFr || null, metaTitleZh: metaTitleZh || null,
                metaDescriptionEn: metaDescriptionEn || null, metaDescriptionDe: metaDescriptionDe || null, metaDescriptionEs: metaDescriptionEs || null, metaDescriptionFr: metaDescriptionFr || null, metaDescriptionZh: metaDescriptionZh || null,
            }
        });
        // Update images
        if (images) {
            await prisma.tourImage.deleteMany({ where: { tourId: id } });
            for (const img of images) {
                await prisma.tourImage.create({ data: { ...img, tourId: id } });
            }
        }
        // Update itinerary
        if (itinerary) {
            await prisma.itinerary.deleteMany({ where: { tourId: id } });
            for (const it of itinerary) {
                await prisma.itinerary.create({
                    data: {
                        tourId: id,
                        dayNumber: it.dayNumber,
                        title: it.title || it.titleEn || it.titleDe || '',
                        description: it.description || it.descriptionEn || it.descriptionDe || '',
                        titleEn: it.titleEn || null,
                        titleDe: it.titleDe || null,
                        titleEs: it.titleEs || null,
                        titleFr: it.titleFr || null,
                        titleZh: it.titleZh || null,
                        descriptionEn: it.descriptionEn || null,
                        descriptionDe: it.descriptionDe || null,
                        descriptionEs: it.descriptionEs || null,
                        descriptionFr: it.descriptionFr || null,
                        descriptionZh: it.descriptionZh || null,
                        accommodationEn: it.accommodationEn || null,
                        accommodationDe: it.accommodationDe || null,
                        accommodationEs: it.accommodationEs || null,
                        accommodationFr: it.accommodationFr || null,
                        accommodationZh: it.accommodationZh || null,
                        mealsEn: it.mealsEn || null,
                        mealsDe: it.mealsDe || null,
                        mealsEs: it.mealsEs || null,
                        mealsFr: it.mealsFr || null,
                        mealsZh: it.mealsZh || null,
                    }
                });
            }
        }
        res.json(tour);
    }
    catch (error) {
        console.error('Error updating tour:', error);
        res.status(500).json({ error: 'Failed to update tour' });
    }
});
// Delete tour
router.delete('/tours/:id', authenticateAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma.tour.delete({ where: { id } });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting tour:', error);
        res.status(500).json({ error: 'Failed to delete tour' });
    }
});
// ============ BOOKINGS ADMIN ============
// Get all bookings (admin)
router.get('/bookings', authenticateAdmin, async (req, res) => {
    try {
        const { status } = req.query;
        const where = status ? { status: status } : {};
        const bookings = await prisma.booking.findMany({
            where,
            include: {
                tour: {
                    select: {
                        id: true,
                        titleEn: true,
                        titleDe: true,
                        titleEs: true,
                        titleFr: true,
                        titleZh: true,
                        slugEn: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(bookings);
    }
    catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});
// Get single booking (admin)
router.get('/bookings/:id', authenticateAdmin, async (req, res) => {
    try {
        const booking = await prisma.booking.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                tour: true
            }
        });
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json(booking);
    }
    catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
});
// Create booking (admin)
router.post('/bookings', authenticateAdmin, async (req, res) => {
    try {
        const { tour_id, full_name, email, phone, nationality, travel_date, number_of_guests, additionalGuests, special_requests, status } = req.body;
        const booking = await prisma.booking.create({
            data: {
                tourId: tour_id,
                fullName: full_name,
                email,
                phone,
                nationality,
                travelDate: travel_date ? new Date(travel_date) : null,
                numberOfGuests: number_of_guests || 1,
                additionalGuests,
                specialRequests: special_requests,
                status: status || 'pending'
            },
            include: {
                tour: true
            }
        });
        res.status(201).json(booking);
    }
    catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ error: 'Failed to create booking' });
    }
});
// Update booking (admin)
router.put('/bookings/:id', authenticateAdmin, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { status, total_price, full_name, email, phone, nationality, travel_date, number_of_guests, additional_guests, special_requests } = req.body;
        const booking = await prisma.booking.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(total_price !== undefined && { totalPrice: total_price }),
                ...(full_name && { fullName: full_name }),
                ...(email && { email }),
                ...(phone !== undefined && { phone }),
                ...(nationality !== undefined && { nationality }),
                ...(travel_date && { travelDate: new Date(travel_date) }),
                ...(number_of_guests && { numberOfGuests: number_of_guests }),
                ...(additional_guests !== undefined && { additionalGuests: additional_guests }),
                ...(special_requests !== undefined && { specialRequests: special_requests })
            },
            include: {
                tour: {
                    select: {
                        id: true,
                        titleEn: true,
                        titleDe: true,
                        titleEs: true,
                        titleFr: true,
                        titleZh: true,
                        slugEn: true
                    }
                }
            }
        });
        res.json(booking);
    }
    catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ error: 'Failed to update booking' });
    }
});
// Delete booking (admin)
router.delete('/bookings/:id', authenticateAdmin, async (req, res) => {
    try {
        await prisma.booking.delete({
            where: { id: parseInt(req.params.id) }
        });
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ error: 'Failed to delete booking' });
    }
});
// Get booking stats (admin)
router.get('/bookings/stats/summary', authenticateAdmin, async (req, res) => {
    try {
        const total = await prisma.booking.count();
        const pending = await prisma.booking.count({ where: { status: 'pending' } });
        const confirmed = await prisma.booking.count({ where: { status: 'confirmed' } });
        const cancelled = await prisma.booking.count({ where: { status: 'cancelled' } });
        res.json({ total, pending, confirmed, cancelled });
    }
    catch (error) {
        console.error('Error fetching booking stats:', error);
        res.status(500).json({ error: 'Failed to fetch booking stats' });
    }
});
export default router;
//# sourceMappingURL=admin.js.map