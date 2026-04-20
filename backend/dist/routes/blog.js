import { Router } from 'express';
import { prisma } from '../index.js';
const router = Router();
// Count all published posts
router.get('/count', async (req, res) => {
    try {
        const count = await prisma.blogPost.count({ where: { isPublished: true } });
        res.json({ count });
    }
    catch (error) {
        console.error('Error counting posts:', error);
        res.status(500).json({ error: 'Failed to count posts' });
    }
});
// Get all published posts
router.get('/', async (req, res) => {
    try {
        const { lang } = req.query;
        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: 'desc' }
        });
        // Transform posts to include language-specific fields
        const langMap = {
            de: 'De',
            en: 'En',
            es: 'Es',
            fr: 'Fr',
            zh: 'Zh'
        };
        const suffix = langMap[lang] || 'En';
        const localizedPosts = posts.map(post => {
            // Get localized field - prefers language-specific field, falls back to base
            const getField = (field, suffix) => {
                // Try localized field first (e.g. titleDe)
                const localized = suffix ? post[`${field}${suffix}`] : null;
                if (localized)
                    return localized;
                // Fallback to base field (e.g. title, title_de)
                return post[field] || post[`${field}_${lang}`] || null;
            };
            return {
                id: post.id,
                slug: getField('slug', suffix) || post.slug,
                title: getField('title', suffix) || post.title || post.title_de || '',
                content: getField('content', suffix) || post.content || post.content_de || '',
                excerpt: getField('excerpt', suffix) || post.excerpt || post.excerpt_de || '',
                featuredImage: post.featuredImage,
                featuredImageAlt: getField('featuredImageAlt', suffix),
                author: post.author,
                category: getField('category', suffix),
                isPublished: post.isPublished,
                createdAt: post.createdAt,
                // SEO
                metaTitle: getField('metaTitle', suffix),
                metaDescription: getField('metaDescription', suffix),
                h1: getField('h1', suffix),
                // Include all language fields for frontend
                slug_de: post.slugDe || null,
                slug_en: post.slugEn || null,
                slug_es: post.slugEs || null,
                slug_fr: post.slugFr || null,
                slug_zh: post.slugZh || null,
                title_de: post.titleDe || null,
                title_en: post.titleEn || null,
                title_es: post.titleEs || null,
                title_fr: post.titleFr || null,
                title_zh: post.titleZh || null,
                content_de: post.contentDe || null,
                content_en: post.contentEn || null,
                content_es: post.contentEs || null,
                content_fr: post.contentFr || null,
                content_zh: post.contentZh || null,
                excerpt_de: post.excerptDe || null,
                excerpt_en: post.excerptEn || null,
                excerpt_es: post.excerptEs || null,
                excerpt_fr: post.excerptFr || null,
                excerpt_zh: post.excerptZh || null,
                category_de: post.categoryDe || null,
                category_en: post.categoryEn || null,
                category_es: post.categoryEs || null,
                category_fr: post.categoryFr || null,
                category_zh: post.categoryZh || null,
                metaTitle_de: post.metaTitleDe || null,
                metaTitle_en: post.metaTitleEn || null,
                metaTitle_es: post.metaTitleEs || null,
                metaTitle_fr: post.metaTitleFr || null,
                metaTitle_zh: post.metaTitleZh || null,
                metaDescription_de: post.metaDescriptionDe || null,
                metaDescription_en: post.metaDescriptionEn || null,
                metaDescription_es: post.metaDescriptionEs || null,
                metaDescription_fr: post.metaDescriptionFr || null,
                metaDescription_zh: post.metaDescriptionZh || null,
                h1_de: post.h1De || null,
                h1_en: post.h1En || null,
                h1_es: post.h1Es || null,
                h1_fr: post.h1Fr || null,
                h1_zh: post.h1Zh || null,
                featuredImageAlt_de: post.featuredImageAltDe || null,
                featuredImageAlt_en: post.featuredImageAltEn || null,
                featuredImageAlt_es: post.featuredImageAltEs || null,
                featuredImageAlt_fr: post.featuredImageAltFr || null,
                featuredImageAlt_zh: post.featuredImageAltZh || null
            };
        });
        res.json(localizedPosts);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
    }
});
// Get post by slug (supports localized slugs)
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { lang } = req.query;
        // Build slug fields to search
        const slugFields = ['slug'];
        if (lang) {
            const langMap = {
                de: 'slugDe',
                en: 'slugEn', // Fixed: use slugEn for English
                es: 'slugEs',
                fr: 'slugFr',
                zh: 'slugZh'
            };
            const langField = langMap[lang];
            if (langField) {
                slugFields.push(langField);
            }
        }
        // Try to find post by any of the slug fields
        let post = null;
        for (const field of slugFields) {
            post = await prisma.blogPost.findFirst({
                where: {
                    isPublished: true,
                    [field]: slug
                }
            });
            if (post)
                break;
        }
        // Fallback: find any published post with this slug
        if (!post) {
            post = await prisma.blogPost.findFirst({
                where: {
                    isPublished: true,
                    OR: [
                        { slug: slug },
                        { slugDe: slug },
                        { slugEn: slug },
                        { slugEs: slug },
                        { slugFr: slug },
                        { slugZh: slug }
                    ]
                }
            });
        }
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Transform response with language-specific fields
        const langMap = {
            de: 'De',
            en: 'En',
            es: 'Es',
            fr: 'Fr',
            zh: 'Zh'
        };
        const suffix = langMap[lang] || 'En';
        const localizedPost = {
            id: post.id,
            slug: suffix ? post[`slug${suffix}`] : post.slug,
            title: suffix ? post[`title${suffix}`] : post.title,
            content: suffix ? post[`content${suffix}`] : post.content,
            excerpt: suffix ? post[`excerpt${suffix}`] : post.excerpt,
            featuredImage: post.featuredImage,
            featuredImageAlt: suffix ? post[`featuredImageAlt${suffix}`] : null,
            author: post.author,
            category: suffix ? post[`category${suffix}`] : null,
            isPublished: post.isPublished,
            createdAt: post.createdAt,
            // SEO
            metaTitle: suffix ? post[`metaTitle${suffix}`] : null,
            metaDescription: suffix ? post[`metaDescription${suffix}`] : null,
            h1: suffix ? post[`h1${suffix}`] : null,
            // Include all language fields for frontend
            slug_de: post.slugDe || null,
            slug_en: post.slugEn || null,
            slug_es: post.slugEs || null,
            slug_fr: post.slugFr || null,
            slug_zh: post.slugZh || null,
            title_de: post.titleDe || null,
            title_en: post.titleEn || null,
            title_es: post.titleEs || null,
            title_fr: post.titleFr || null,
            title_zh: post.titleZh || null,
            content_de: post.contentDe || null,
            content_en: post.contentEn || null,
            content_es: post.contentEs || null,
            content_fr: post.contentFr || null,
            content_zh: post.contentZh || null,
            excerpt_de: post.excerptDe || null,
            excerpt_en: post.excerptEn || null,
            excerpt_es: post.excerptEs || null,
            excerpt_fr: post.excerptFr || null,
            excerpt_zh: post.excerptZh || null,
            category_de: post.categoryDe || null,
            category_en: post.categoryEn || null,
            category_es: post.categoryEs || null,
            category_fr: post.categoryFr || null,
            category_zh: post.categoryZh || null,
            metaTitle_de: post.metaTitleDe || null,
            metaTitle_en: post.metaTitleEn || null,
            metaTitle_es: post.metaTitleEs || null,
            metaTitle_fr: post.metaTitleFr || null,
            metaTitle_zh: post.metaTitleZh || null,
            metaDescription_de: post.metaDescriptionDe || null,
            metaDescription_en: post.metaDescriptionEn || null,
            metaDescription_es: post.metaDescriptionEs || null,
            metaDescription_fr: post.metaDescriptionFr || null,
            metaDescription_zh: post.metaDescriptionZh || null,
            h1_de: post.h1De || null,
            h1_en: post.h1En || null,
            h1_es: post.h1Es || null,
            h1_fr: post.h1Fr || null,
            h1_zh: post.h1Zh || null,
            featuredImageAlt_de: post.featuredImageAltDe || null,
            featuredImageAlt_en: post.featuredImageAltEn || null,
            featuredImageAlt_es: post.featuredImageAltEs || null,
            featuredImageAlt_fr: post.featuredImageAltFr || null,
            featuredImageAlt_zh: post.featuredImageAltZh || null
        };
        res.json(localizedPost);
    }
    catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
});
export default router;
//# sourceMappingURL=blog.js.map