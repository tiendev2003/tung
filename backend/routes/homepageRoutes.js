const express = require('express')
const router = express.Router();

const {
    getNewArrivalProducts,
    addNewArrivalsProducts,
    getTopSellingCategories,
    addTopSellingProducts,
    getOfferZone,
    addOfferZone,
    getOfferBanner,
    addOfferBanner,
    getFlashSale,
    addFlashSale,
    getRecentlyViewedProducts,
    addRecentlyViewProducts,
    addSmallBizStars,
    getSmallBizStars,
    getFoundersPick,
    addFoundersPick,
    getHomepageBanners,
    addHomepageBanners,
    getBlogSection,
    addBlogSection
} = require('./../controller/homepageController')

router.get("/new-arrivals", getNewArrivalProducts);

router.post("/new-arrivals", addNewArrivalsProducts);

router.get("/top-selling-categories", getTopSellingCategories)

router.post('/top-selling-categories', addTopSellingProducts)

router.get('/offer-zone', getOfferZone)

router.post('/offer-zone', addOfferZone)

router.get('/offer-banner', getOfferBanner)

router.post('/offer-banner', addOfferBanner)

router.get('/flash-sale', getFlashSale)

router.post('/flash-sale', addFlashSale)

router.get('/recently-viewed-products', getRecentlyViewedProducts)

router.post('/recently-viewed-products', addRecentlyViewProducts)

router.get('/small-biz-stars', getSmallBizStars)

router.post('/small-biz-stars', addSmallBizStars)

router.get('/featured-products', getFoundersPick)

router.post('/founders-pick', addFoundersPick)

router.get('/banners', getHomepageBanners)

router.post('/banners', addHomepageBanners)

router.get('/featured-blogs', getBlogSection)

router.post('/featured-blogs', addBlogSection)



// router.get('/recently-viewed', getRecentlyViewedProducts);

// router.get('/homepage-details')

module.exports = router;