const mongoose = require('mongoose')

const HomePageSchema = new mongoose.Schema(
    {
        sectionCode: {
            type: String,
            required: true,  
            enum: [
                'NAP', // New Arrival Products
                'TSC', // Top Selling Categories
                'OZ',  // Offer Zone 
                'OB',  // Offer Banner
                'FS',  // Flash Sale
                'RVP',  // Recently Viewed Products
                'SBS', // Small Bizz Stars
                'FP',  // Featured Products
                'BS',  // Blogs Section
                'HB'   // Homepage Banners
            ]
        },
        visible: {
            type: Boolean,
            required: true,
            default: true
        },
        offerBlock: [{ // for OB
            backgroundColor: String,
            offerTitle: String,
            offerLink: String,
            imageRef: String,
            mobileImageRef: String,
            state: Boolean
        }], 
        sectionTitle: { // for all the sections
            type: String,
            required: true
        },
        storeDetails: {  // Small Bizz Stars
            subtitle: String, 
            storeLink: String,
            description: String
        },
        productRef: [{ // for new arrivals, offer zone, flash sale, recently viewed, founders pick, Small Bizz Stars
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }],
        categoryRef: [{ // for top selling categories
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }],
        linkReference: {  // for offer banner, homepage banners, 
            type: String
        },
        imageRef: { // Small Biz Stars, Offer banner
            type: String,
        },
        BlogLinkReference: [{ // for blogs section
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }]
    }
)

const HomePage = mongoose.model("HomePage", HomePageSchema);
module.exports = HomePage;