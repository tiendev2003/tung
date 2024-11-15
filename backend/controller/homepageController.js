const HomePage = require('./../models/HomePage');
const Product = require('./../models/Product');

const fetchProductByProductId = async(productId) => {
    const product = await Product.findOne({productId})
    return product;
}

const addProductToHomePage = async(req, res) => {
    try {
        
    } catch (error) {
        
    }
}

const getNewArrivalProducts = async(req, res) => {
    try {
        const newArrivals = await HomePage.find({sectionCode: 'NAP'})
            .populate({
                path: "productRef",
                populate: {
                    path: 'product'
                }
            })
            .populate({
                path: "productRef",
                populate: {
                    path: 'category'
                }
            });
        return res.status(200).json({
            products: newArrivals
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server Error Occured",
            error
        })   
    }
}

const addNewArrivalsProducts = async(req, res) => {
    try {
        // const produts = 
        const newArrivals = new HomePage({
            sectionCode: 'NAP',
            sectionTitle: req.body.title,
            productRef: req.body.products
        });
        // newArrivals.prodcutRef.push(produts)
        await newArrivals.save();
        return res.status(200).json({
            newArrivals,
            message: "Updated New Arrival Products Successful!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to Update New Arrivals Products!",
            error
        })
    }
}


const getTopSellingCategories = async(req, res) => {
    try {
        const topSellingCategories = await HomePage.find({sectionCode: 'TSC'})
            .populate({
                path: "categoryRef",
                populate: {
                    path: "category"
                }
            });
        return res.status(200).json({
            categories: topSellingCategories
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server Error Occured",
            error
        })   
    }
}

const addTopSellingProducts = async(req, res) => {
    try {
        // const produts = 
        const topSellingCategories = new HomePage({
            sectionCode: 'TSC',
            sectionTitle: req.body.title,
            categoryRef: req.body.categories
        });
        await topSellingCategories.save();
        return res.status(200).json({
            topSellingCategories,
            message: "Updated Top Selling Categories Successful!"
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to Update top selling categories!",
            error
        })
    }
}

const getOfferZone = async(req, res) => {
    try {
        const offerZone = await HomePage.find({sectionCode: 'OZ'})
            // .populate({});
        return res.status(200).json({
            data: offerZone
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error Occured",
            error
        })   
    }
}

const addOfferZone = async(req, res) => {
    try {
        const offerzone = await HomePage.findOne({sectionCode: 'OZ'})
        if(offerzone){
            const updatedOfferZone = await HomePage.findOneAndUpdate(
                {sectionCode: 'OZ'},
                {
                    sectionTitle: req.body.title,
                    offerBlock: req.body.offerBlockData
                },
                {new: true}
            )
            return res.status(200).json({
                message: "Updated Offer Zone successfully!",
                updatedOfferZone
            })
        } else {
            const offerZone = new HomePage({
                sectionCode: 'OZ',
                sectionTitle: req.body.title,
                offerBlock: req.body.offerBlockData
            })
            await offerZone.save();
            return res.status(200).json({
                message: "Updated Offer Zone successfully!",
                offerZone
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            error
        })
    }
}


const getOfferBanner = async(req, res) => {
    try {
        const offerBanner = await HomePage.find({sectionCode: 'OB'});
        return res.status(200).json({
            data: offerBanner
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error Occured",
            error
        })   
    }
}

const addOfferBanner = async(req, res) => {
    try {
        const offerbanners = await HomePage.findOne({sectionCode: 'OB'});
        if(offerbanners){
            const udpatedOfferBanners = await HomePage.findOneAndUpdate(
                {sectionCode: 'OB'},
                {
                    sectionTitle: req.body.title,
                    imageRef: req.body.imageRef,
                    linkReference: req.body.link,
                    offerBlock: req.body.offerBlock
                },
                {new: true}
            )
            return res.status(200).json({
                message: "Updated Offer Zone successfully!",
                udpatedOfferBanners
            })
        } else {
            const offerBanner = new HomePage({
                sectionCode: 'OB',
                sectionTitle: req.body.title,
                imageRef: req.body.imageRef,
                linkReference: req.body.link,
                offerBlock: req.body.offerBlock
            })
            await offerBanner.save();
            return res.status(200).json({
                message: "Updated Offer Zone successfully!",
                offerBanner
            })
        }
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            error
        })
    }
}


const getFlashSale = async(req, res) => {
    try {
        const newArrivals = await HomePage.findOne({sectionCode: 'FS'})
            .populate({
                path: 'productRef',
                populate: {
                    path: 'product'
                }
            });
        return res.status(200).json({
            data: newArrivals
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error Occured",
            error
        })   
    }
}


const addFlashSale = async(req, res) => {
    try {
        // const produts = 
        const flashSale = await HomePage.findOne({sectionCode: 'FS'})
        if(flashSale){
            const updatedFlashSale = await HomePage.findOneAndUpdate(
                {sectionCode: 'FS'},
                {
                    sectionTitle: req.body.title,
                    productRef: req.body.products,
                    visible: req.body.visible
                },
                {new: true}
            )
            return res.status(200).json({
                products: updatedFlashSale,
                message: "Updated Flash Sale Products Successfully!"
            })
        } else {
            const flashSaleProducts = new HomePage({
                sectionCode: 'FS',
                sectionTitle: req.body.title,
                productRef: req.body.products
            });
            // newArrivals.prodcutRef.push(produts)
            await flashSaleProducts.save();
            return res.status(200).json({
                flashSaleProducts,
                message: "Updated Flash Sale Successful!"
            })
        }
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to Update Flash Sale Products!",
            error
        })
    }
}


const getRecentlyViewedProducts = async(req, res) => {
    try {
        const recentlyViewedProducts = await HomePage.find({sectionCode: 'RVP'})
            .populate({
                path: 'productRef',
                populate: {
                    path: 'product'
                }
            });
        return res.status(200).json({
            data: recentlyViewedProducts
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error Occured",
            error
        })   
    }
}

const addRecentlyViewProducts = async(req, res) => {
    try {
        const products = await HomePage.findOne({sectionCode: 'RVP'});
        if(products){
            const updatedRVP = await HomePage.findOneAndUpdate(
                {sectionCode: 'RVP'},
                {
                    sectionTitle: req.body.title,
                    productRef: req.body.products
                },
                {new: true}
            )
            return res.status(200).json({
                products: updatedRVP,
                message: "Updated Recently Viewed Products Successful!"
            })
        } else {
            const recentlyViewedProducts = new HomePage({
                sectionCode: 'RVP',
                sectionTitle: req.body.title,
                productRef: req.body.products
            });
            await recentlyViewedProducts.save();
            return res.status(200).json({
                recentlyViewedProducts,
                message: "Updated Recently Viewed Products Successful!"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to Update Flash Sale Products!",
            error
        })
    }
}


const getSmallBizStars = async(req, res) => {
    try {
        const smallBizStars = await HomePage.find({sectionCode: 'SBS'})
            .populate({
                path: 'productRef',
                populate: {
                    path: 'product'
                }
            });
        return res.status(200).json({
            data: smallBizStars,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error Occured",
            error
        })   
    }
}

const addSmallBizStars = async(req, res) => {
    try {
        const products = await HomePage.findOne({sectionCode: 'SBS'});
        if(products){
            const updatedRVP = await HomePage.findOneAndUpdate(
                {sectionCode: 'SBS'},
                {
                    sectionTitle: req.body.title,
                    storeDetails: {
                        subtitle: req.body.subtitle,
                        storeLink: req.body.link,
                        description: req.body.desc
                    },
                    imageRef: req.body.imageRef,
                    productRef: req.body.products,
                },
                {new: true}
            )
            return res.status(200).json({
                data: updatedRVP,
                message: "Updated Small Biz Stars Successful!"
            })
        } else {
            const smallBizStars = new HomePage({
                sectionCode: 'SBS',
                sectionTitle: req.body.title,
                storeDetails: {
                    subtitle: req.body.subtitle,
                    storeLink: req.body.link,
                    description: req.body.desc
                },
                imageRef: req.body.imageRef,
                productRef: req.body.products,
            });
            await smallBizStars.save();
            return res.status(200).json({
                data: smallBizStars,
                message: "Updated Small Biz Stars Successful!"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to Update Small Biz Stars!",
            error
        })
    }
}


const getFoundersPick = async(req, res) => {
    try {
        console.log("Featured products route")
        const newArrivals = await HomePage.find({sectionCode: 'FP'})
            .populate({
                path: "productRef",
                populate: {
                    path: 'product'
                }
            })
            .populate({
                path: "productRef",
                populate: {
                    path: 'category'
                }
            });
        console.log(newArrivals)
        return res.status(200).json({
            data: newArrivals
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error Occured",
            error
        })   
    }
}

const addFoundersPick = async(req, res) => {
    try {
        const products = await HomePage.findOne({sectionCode: 'FP'});
        if(products){
            const updatedRVP = await HomePage.findOneAndUpdate(
                {sectionCode: 'FP'},
                {
                    sectionTitle: req.body.title,
                    productRef: req.body.products,
                    imageRef: req.body.image
                },
                {new: true}
            )
            return res.status(200).json({
                products: updatedRVP,
                message: "Updated Founders Pick Successful!"
            })
        } else {
            const recentlyViewedProducts = new HomePage({
                sectionCode: 'FP',
                sectionTitle: req.body.title,
                productRef: req.body.products,
                imageRef: req.body.image
            });
            await recentlyViewedProducts.save();
            return res.status(200).json({
                recentlyViewedProducts,
                message: "Updated Founders Pick Successful!"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to Update Founders Pick!",
            error
        })
    }
}


const getBlogSection = async(req, res) => {
    try {
        const featuredBlogs = await HomePage.find({sectionCode: 'BS'})
            .populate({
                path: 'BlogLinkReference',
                populate: {
                    path: 'Blog'
                }
            });
        return res.status(200).json({
            blogs: featuredBlogs
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error Occured",
            error
        })   
    }
}


const addBlogSection = async(req, res) => {
    try {
        const blogs = await HomePage.findOne({sectionCode: 'BS'});
        if(blogs){
            const udpatedBlogs = await HomePage.findOneAndUpdate(
                {sectionCode: 'BS'},
                {
                    sectionTitle: req.body.title,
                    BlogLinkReference: req.body.blogs
                },
                {new: true}
            )
            return res.status(200).json({
                blogs: udpatedBlogs,
                message: "Updated Blog Section Successful!"
            })
        } else {
            const blogs = new HomePage({
                sectionCode: 'BS',
                sectionTitle: req.body.title,
                BlogLinkReference: req.body.blogs
            });
            await blogs.save();
            return res.status(200).json({
                blogs,
                message: "Updated Blog Section Successful!"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to Update Blog Section!",
            error
        })
    }
}

const getHomepageBanners = async(req, res) => {
    try {
        const newArrivals = await HomePage.find({sectionCode: 'HB'});
        return res.status(200).json({
            data: newArrivals
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error Occured",
            error
        })   
    }
}


const addHomepageBanners = async(req, res) => {
    try{
        const banners = await HomePage.findOne({sectionCode: 'HB'});
        if(banners){
            const updatedBanners = await HomePage.findOneAndUpdate(
                {sectionCode: 'HB'},
                {
                    sectionTitle: req.body.title,
                    offerBlock: req.body.bannerData,
                },
                {new: true}
            )
            return res.status(200).json({
                data: updatedBanners,
                message: "Updated Home Page Banners Successful!"
            })
        } else {
            const homepageBanners = new HomePage({
                sectionCode: 'HB',
                sectionTitle: req.body.title,
                offerBlock: req.body.bannerData,
            });
            await homepageBanners.save();
            return res.status(200).json({
                homepageBanners,
                message: "Updated Home Page Banners Successful!"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Failed to Update Homepage Banners!",
            error
        })
    }
}



module.exports = {
    getNewArrivalProducts,
    addNewArrivalsProducts,
    getTopSellingCategories,
    addTopSellingProducts,
    addOfferZone,
    getOfferZone,
    getOfferBanner,
    addOfferBanner,
    getFlashSale,
    addFlashSale,
    getRecentlyViewedProducts,
    addRecentlyViewProducts,
    getSmallBizStars,
    addSmallBizStars,
    getFoundersPick,
    addFoundersPick,
    getBlogSection,
    addBlogSection,
    getHomepageBanners,
    addHomepageBanners
}