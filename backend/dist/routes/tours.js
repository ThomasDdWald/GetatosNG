import { Router } from 'express';
import { prisma } from '../index.js';
const router = Router();
// Count all active tours
router.get('/count', async (req, res) => {
    try {
        const count = await prisma.tour.count({ where: { isActive: true } });
        res.json({ count });
    }
    catch (error) {
        console.error('Error counting tours:', error);
        res.status(500).json({ error: 'Failed to count tours' });
    }
});
router.get('/', async (req, res) => {
    try {
        const { type, featured, lang } = req.query;
        const where = { isActive: true };
        if (type && type !== 'all')
            where.tourType = type;
        if (featured === 'true')
            where.isFeatured = true;
        console.log("Finding tours...");
        let tours;
        try {
            tours = await prisma.tour.findMany({
                where,
                orderBy: { id: 'asc' },
                include: { images: { where: { isCover: true }, take: 1 } }
            });
            console.log("Found tours:", tours.length);
        }
        catch (err) {
            console.error("Prisma error details:", err.message, err.meta?.cause);
            throw err;
        }
        const mapped = tours.map(t => ({
            id: t.id,
            title: lang ? getLocalized(t, 'title', lang) : t.titleEn,
            titleDe: t.titleDe, titleEn: t.titleEn, titleEs: t.titleEs, titleFr: t.titleFr, titleZh: t.titleZh,
            slug: t.slugEn, slugDe: t.slugDe, slugEn: t.slugEn, slugEs: t.slugEs, slugFr: t.slugFr, slugZh: t.slugZh,
            description: lang ? getLocalized(t, 'description', lang) : t.descriptionEn,
            descriptionDe: t.descriptionDe, descriptionEn: t.descriptionEn, descriptionEs: t.descriptionEs, descriptionFr: t.descriptionFr, descriptionZh: t.descriptionZh,
            short_description: lang ? getLocalized(t, 'shortDescription', lang) : t.shortDescriptionEn,
            shortDescriptionDe: t.shortDescriptionDe, shortDescriptionEn: t.shortDescriptionEn, shortDescriptionEs: t.shortDescriptionEs, shortDescriptionFr: t.shortDescriptionFr, shortDescriptionZh: t.shortDescriptionZh,
            // SEO meta fields
            metaTitle: lang ? getLocalized(t, 'metaTitle', lang) : t.metaTitleEn,
            metaTitleDe: t.metaTitleDe, metaTitleEn: t.metaTitleEn, metaTitleEs: t.metaTitleEs, metaTitleFr: t.metaTitleFr, metaTitleZh: t.metaTitleZh,
            metaDescription: lang ? getLocalized(t, 'metaDescription', lang) : t.metaDescriptionEn,
            metaDescriptionDe: t.metaDescriptionDe, metaDescriptionEn: t.metaDescriptionEn, metaDescriptionEs: t.metaDescriptionEs, metaDescriptionFr: t.metaDescriptionFr, metaDescriptionZh: t.metaDescriptionZh,
            tour_type: t.tourType, duration_days: t.durationDays, difficulty: t.difficulty,
            price: t.priceEn, price_de: t.priceDe, price_en: t.priceEn, price_es: t.priceEs, price_fr: t.priceFr, price_zh: t.priceZh,
            currency: t.currencyEn, currency_de: t.currencyDe, currency_en: t.currencyEn, currency_es: t.currencyEs, currency_fr: t.currencyFr, currency_zh: t.currencyZh,
            max_group_size: t.maxGroupSize,
            highlights: t.highlightsEn, included: t.includedEn, not_included: t.notIncludedEn,
            featured_image: t.images?.[0]?.url || null,
            images: t.images,
            is_featured: t.isFeatured, is_active: t.isActive,
        }));
        res.json(mapped);
    }
    catch (error) {
        console.error('Error fetching tours:', JSON.stringify(error));
        res.status(500).json({ error: 'Failed to fetch tours' });
    }
});
router.get('/featured', async (req, res) => {
    try {
        const { lang } = req.query;
        console.log("Finding tours...");
        const tours = await prisma.tour.findMany({
            where: { isFeatured: true, isActive: true },
            include: { images: { where: { isCover: true }, take: 1 } }
        });
        const mapped = tours.map(t => ({
            id: t.id,
            title: lang ? getLocalized(t, 'title', lang) : t.titleEn,
            titleDe: t.titleDe, titleEn: t.titleEn, titleEs: t.titleEs, titleFr: t.titleFr, titleZh: t.titleZh,
            slug: t.slugEn, slugDe: t.slugDe, slugEn: t.slugEn, slugEs: t.slugEs, slugFr: t.slugFr, slugZh: t.slugZh,
            description: lang ? getLocalized(t, 'description', lang) : t.descriptionEn,
            descriptionDe: t.descriptionDe, descriptionEn: t.descriptionEn, descriptionEs: t.descriptionEs, descriptionFr: t.descriptionFr, descriptionZh: t.descriptionZh,
            short_description: lang ? getLocalized(t, 'shortDescription', lang) : t.shortDescriptionEn,
            shortDescriptionDe: t.shortDescriptionDe, shortDescriptionEn: t.shortDescriptionEn, shortDescriptionEs: t.shortDescriptionEs, shortDescriptionFr: t.shortDescriptionFr, shortDescriptionZh: t.shortDescriptionZh,
            // SEO meta fields
            metaTitle: lang ? getLocalized(t, 'metaTitle', lang) : t.metaTitleEn,
            metaTitleDe: t.metaTitleDe, metaTitleEn: t.metaTitleEn, metaTitleEs: t.metaTitleEs, metaTitleFr: t.metaTitleFr, metaTitleZh: t.metaTitleZh,
            metaDescription: lang ? getLocalized(t, 'metaDescription', lang) : t.metaDescriptionEn,
            metaDescriptionDe: t.metaDescriptionDe, metaDescriptionEn: t.metaDescriptionEn, metaDescriptionEs: t.metaDescriptionEs, metaDescriptionFr: t.metaDescriptionFr, metaDescriptionZh: t.metaDescriptionZh,
            tour_type: t.tourType, duration_days: t.durationDays, difficulty: t.difficulty,
            price: t.priceEn, price_de: t.priceDe, price_en: t.priceEn, price_es: t.priceEs, price_fr: t.priceFr, price_zh: t.priceZh,
            currency: t.currencyEn, currency_de: t.currencyDe, currency_en: t.currencyEn, currency_es: t.currencyEs, currency_fr: t.currencyFr, currency_zh: t.currencyZh,
            images: t.images,
            is_featured: t.isFeatured, is_active: t.isActive,
        }));
        res.json(mapped);
    }
    catch (error) {
        console.error('Error fetching featured tours:', error);
        res.status(500).json({ error: 'Failed to fetch featured tours' });
    }
});
router.get('/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        const { lang } = req.query;
        // Build the slug filter based on language
        let slugFilter = {};
        if (lang === 'de') {
            slugFilter.slugDe = slug;
        }
        else if (lang === 'en') {
            slugFilter.slugEn = slug;
        }
        else if (lang === 'es') {
            slugFilter.slugEs = slug;
        }
        else if (lang === 'fr') {
            slugFilter.slugFr = slug;
        }
        else if (lang === 'zh') {
            slugFilter.slugZh = slug;
        }
        else {
            // No lang - search any slug field
            slugFilter = { OR: [{ slugDe: slug }, { slugEn: slug }, { slugEs: slug }, { slugFr: slug }, { slugZh: slug }] };
        }
        const tour = await prisma.tour.findFirst({
            where: { isActive: true, ...slugFilter },
            include: { images: { orderBy: { displayOrder: 'asc' } }, itinerary: { orderBy: { dayNumber: 'asc' } } }
        });
        if (!tour)
            return res.status(404).json({ error: 'Tour not found' });
        const mapped = {
            id: tour.id,
            title: lang ? getLocalized(tour, 'title', lang) : tour.titleEn,
            titleDe: tour.titleDe, titleEn: tour.titleEn, titleEs: tour.titleEs, titleFr: tour.titleFr, titleZh: tour.titleZh,
            slug: tour.slugEn, slugDe: tour.slugDe, slugEn: tour.slugEn, slugEs: tour.slugEs, slugFr: tour.slugFr, slugZh: tour.slugZh,
            description: lang ? getLocalized(tour, 'description', lang) : tour.descriptionEn,
            descriptionDe: tour.descriptionDe, descriptionEn: tour.descriptionEn, descriptionEs: tour.descriptionEs, descriptionFr: tour.descriptionFr, descriptionZh: tour.descriptionZh,
            short_description: lang ? getLocalized(tour, 'shortDescription', lang) : tour.shortDescriptionEn,
            shortDescriptionDe: tour.shortDescriptionDe, shortDescriptionEn: tour.shortDescriptionEn, shortDescriptionEs: tour.shortDescriptionEs, shortDescriptionFr: tour.shortDescriptionFr, shortDescriptionZh: tour.shortDescriptionZh,
            // SEO meta fields
            metaTitle: lang ? getLocalized(tour, 'metaTitle', lang) : tour.metaTitleEn,
            metaTitleDe: tour.metaTitleDe, metaTitleEn: tour.metaTitleEn, metaTitleEs: tour.metaTitleEs, metaTitleFr: tour.metaTitleFr, metaTitleZh: tour.metaTitleZh,
            metaDescription: lang ? getLocalized(tour, 'metaDescription', lang) : tour.metaDescriptionEn,
            metaDescriptionDe: tour.metaDescriptionDe, metaDescriptionEn: tour.metaDescriptionEn, metaDescriptionEs: tour.metaDescriptionEs, metaDescriptionFr: tour.metaDescriptionFr, metaDescriptionZh: tour.metaDescriptionZh,
            tour_type: tour.tourType, duration_days: tour.durationDays, difficulty: tour.difficulty,
            price: tour.priceEn, price_de: tour.priceDe, price_en: tour.priceEn, price_es: tour.priceEs, price_fr: tour.priceFr, price_zh: tour.priceZh,
            currency: tour.currencyEn, currency_de: tour.currencyDe, currency_en: tour.currencyEn, currency_es: tour.currencyEs, currency_fr: tour.currencyFr, currency_zh: tour.currencyZh,
            max_group_size: tour.maxGroupSize,
            highlights: lang ? getLocalizedJson(tour, 'highlights', lang) : tour.highlightsEn,
            included: lang ? getLocalizedJson(tour, 'included', lang) : tour.includedEn,
            not_included: lang ? getLocalizedJson(tour, 'notIncluded', lang) : tour.notIncludedEn,
            is_featured: tour.isFeatured, is_active: tour.isActive,
            images: tour.images.map((img) => ({ id: img.id, tour_id: img.tourId, url: img.url, alt_text: img.altText, is_cover: img.isCover, display_order: img.displayOrder })),
            itinerary: tour.itinerary.map((it) => ({
                id: it.id,
                tour_id: it.tourId,
                day_number: it.dayNumber,
                title: it.title,
                description: it.description,
                accommodation: it.accommodation,
                meals: it.meals,
                titleDe: it.titleDe,
                titleEn: it.titleEn,
                titleEs: it.titleEs,
                titleFr: it.titleFr,
                titleZh: it.titleZh,
                descriptionDe: it.descriptionDe,
                descriptionEn: it.descriptionEn,
                descriptionEs: it.descriptionEs,
                descriptionFr: it.descriptionFr,
                descriptionZh: it.descriptionZh,
                accommodationDe: it.accommodationDe,
                accommodationEn: it.accommodationEn,
                accommodationEs: it.accommodationEs,
                accommodationFr: it.accommodationFr,
                accommodationZh: it.accommodationZh,
                mealsDe: it.mealsDe,
                mealsEn: it.mealsEn,
                mealsEs: it.mealsEs,
                mealsFr: it.mealsFr,
                mealsZh: it.mealsZh,
            }))
        };
        res.json(mapped);
    }
    catch (error) {
        console.error('Error fetching tour:', error);
        res.status(500).json({ error: 'Failed to fetch tour' });
    }
});
function getLocalized(tour, field, lang) {
    const fieldMap = { de: field + 'De', en: field + 'En', es: field + 'Es', fr: field + 'Fr', zh: field + 'Zh' };
    return tour[fieldMap[lang] || field] || tour[field] || '';
}
function getLocalizedJson(tour, field, lang) {
    const fieldMap = { de: field + 'De', en: field + 'En', es: field + 'Es', fr: field + 'Fr', zh: field + 'Zh' };
    return tour[fieldMap[lang] || field] || tour[field] || [];
}
export default router;
//# sourceMappingURL=tours.js.map