const Product = require("../models/Product");
const mongoose = require("mongoose");
const Category = require("../models/Category");
const Attribute = require("../models/Attribute");
const Review = require("../models/Review");

const addProduct = async (req, res) => {
  console.log("fda", req.body);
  try {
    const newProduct = new Product({
      ...req.body,

      productId: req.body.productId
        ? req.body.productId
        : new mongoose.Types.ObjectId(),
    });

    await newProduct.save();
    res.send(newProduct);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const getProductByCategory = async (req, res) => {
  console.log("Get Product BY Category");
  try {
    let category;
    // category = await Category.find({slug: req.params.category});
    // if(!category){
    // console.log(`Not found by slug. Searching by name: ${req.params.category}`)
    category = await Category.find({ name: req.params.category });
    // }

    // console.log(category)
    const categoryId = category[0]._id;
    // const category = req.params.category;
    const products = await Product.find({
      $or: [
        { category: mongoose.Types.ObjectId(categoryId) },
        { categories: mongoose.Types.ObjectId(categoryId) },
      ],
    })
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "categories", select: "_id name" });

    // console.log(products)
    return res.status(200).json({
      products,
      status: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
      status: false,
    });
  }
};

const addAllProducts = async (req, res) => {
  try {
    // console.log('product data',req.body)
    await Product.deleteMany();
    await Product.insertMany(req.body);
    res.status(200).send({
      status: false,
      message: "Product Added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      status: false,
      message: err.message,
    });
  }
};

const getShowingProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "show" }).sort({ _id: -1 });
    res.send(products);
    // console.log("products", products);
  } catch (err) {
    res.status(500).send({
      message: err.message,
      status: false,
    });
  }
};

const getAllProducts = async (req, res) => {
  let { title, category, price, page, limit } = req.query;
  console.log({ title, category, price, page, limit });
  if (!page) {
    page = 1;
  }
  if (!limit) {
    limit = 10;
  }
  if (title === undefined) {
    title = "";
  }
  if (price === undefined) {
    price = "";
  }
  if (category === undefined) {
    category = "";
  }
  //  console.log('title',title)
  let queryObject = {};
  let sortObject = {};
  if (title) {
    queryObject.$or = [{ title: { $regex: `${title}`, $options: "i" } }];
  }

  if (price === "low") {
    sortObject = {
      "prices.originalPrice": 1,
    };
  } else if (price === "high") {
    sortObject = {
      "prices.originalPrice": -1,
    };
  } else if (price === "published") {
    queryObject.status = "show";
  } else if (price === "unPublished") {
    queryObject.status = "hide";
  } else if (price === "status-selling") {
    queryObject.stock = { $gt: 0 };
  } else if (price === "status-out-of-stock") {
    queryObject.stock = { $lt: 1 };
  } else if (price === "date-added-asc") {
    sortObject.createdAt = 1;
  } else if (price === "date-added-desc") {
    sortObject.createdAt = -1;
  } else if (price === "date-updated-asc") {
    sortObject.updatedAt = 1;
  } else if (price === "date-updated-desc") {
    sortObject.updatedAt = -1;
  } else {
    sortObject = { _id: -1 };
  }

  // console.log('sortObject', sortObject);

  if (category || category == null) {
    queryObject.categories = category;
  }
  console.log("queryObject", queryObject);

  const pages = Number(page);
  const limits = Number(limit);
  const skip = (pages - 1) * limits;

  try {
    const totalDoc = await Product.countDocuments(queryObject);

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "_id name" })
      .populate({ path: "categories", select: "_id name" })
      .sort(sortObject)
      .skip(skip)
      .limit(limits);

    res.send({
      products,
      totalDoc,
      limits,
      pages,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).send({
      message: err.message,
      status: false,
    });
  }
};

const getProductBySlug = async (req, res) => {
  // console.log("slug", req.params.slug);
  try {
    const product = await Product.findOne({ slug: req.params.slug })
      .populate({
        path: "category",
        select: "_id name",
      })
      .populate({
        path: "categories",
        select: "_id name",
      });
    // return res.send(product)
    if (product.variants == []) {
      const variants = product.variants;
      const variantValues = variants.map((variant) => {
        const firstKey = Object.keys(variant)[0];
        return variant[firstKey];
      });
      const firstKey = Object.keys(variants[0])[0];
      console.log(variantValues);
      const attributeData = await Attribute.findById(firstKey);
      const modifiedVariants = variants.map((variant, idx) => {
        const attributeVariant = attributeData.variants.find(
          (v) => v._id.toString() === variantValues[idx]
        );
        console.log(attributeVariant);
        return {
          ...variant,
          name: attributeData.name,
          value: attributeVariant.name,
        };
      });
      console.log(modifiedVariants);
      product.variants = modifiedVariants;
    }

    res.send(product);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: `Slug problem, ${err.message}`,
      status: false,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate({ path: "category", select: "_id, name" })
      .populate({ path: "categories", select: "_id name" })
      .populate({
        path: "reviews",
        populate: { path: "user", select: "name" },
      });

    res.send(product);
  } catch (err) {
    res.status(500).send({
      message: err.message,
      status: false,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    // console.log("product", product);

    if (product) {
      product.title = req.body.title;
      product.description = req.body.description;

      product.productId = req.body.productId;
      product.sku = req.body.sku;
      product.barcode = req.body.barcode;
      product.slug = req.body.slug;
      product.categories = req.body.categories;
      product.category = req.body.category;
      product.show = req.body.show;
      product.isCombination = req.body.isCombination;
      product.variants = req.body.variants;
      product.stock = req.body.stock;
      product.prices = req.body.prices;
      product.image = req.body.image;
      product.tag = req.body.tag;

      await product.save();
      res.send({ data: product, message: "Product updated successfully!" });
    } else {
      res.status(404).send({
        message: "Product Not Found!",
      });
    }
  } catch (err) {
    res.status(404).send({
      message: err.message,
      status: false,
    });
    // console.log('err',err)
  }
};

const updateManyProducts = async (req, res) => {
  try {
    const updatedData = {};
    for (const key of Object.keys(req.body)) {
      if (
        req.body[key] !== "[]" &&
        Object.entries(req.body[key]).length > 0 &&
        req.body[key] !== req.body.ids
      ) {
        // console.log('req.body[key]', typeof req.body[key]);
        updatedData[key] = req.body[key];
      }
    }

    // console.log("updated data", updatedData);

    await Product.updateMany(
      { _id: { $in: req.body.ids } },
      {
        $set: updatedData,
      },
      {
        multi: true,
      }
    );
    res.send({
      message: "Products update successfully!",
      status: true,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
      status: false,
    });
  }
};

const updateStatus = (req, res) => {
  const newStatus = req.body.status;
  Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        status: newStatus,
      },
    },
    (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
          status: false,
        });
      } else {
        res.status(200).send({
          message: `Product ${newStatus} Successfully!`,
          status: true,
        });
      }
    }
  );
};

const deleteProduct = (req, res) => {
try {
  if (!req.params.id) {
    res.status(404).send({
      message: "Product Not Found!",
    });
  }
  Product.findByIdAndDelete(req.params.id, (err, product) => {
    if (err) {
      res.status(500).send({
        message: err.message,
        status: false,
      });
    } else {
      res.status(200).send({
        message: "Product Deleted Successfully!",
        status: true,
      });
    }
  });
} catch (error) {
  res.status(500).send({
    message: error.message,
    status: false,
  });
}
};

const getShowingStoreProducts = async (req, res) => {
  // console.log("req.body", req);
  try {
    const queryObject = {};

    const { category, title } = req.query;
    // console.log("category", category);

    queryObject.status = "show";

    if (category) {
      queryObject.categories = {
        $in: [category],
      };
    }

    if (title) {
      queryObject.$or = [
        { title: { $regex: `${title}`, $options: "i" } },

        { slug: `${title}` },
      ];
    }

    const products = await Product.find(queryObject)
      .populate({ path: "category", select: "name _id" })
      .sort({ _id: -1 })
      .limit(100);

    const relatedProduct = await Product.find({
      category: products[0]?.category,
    }).populate({ path: "category", select: "_id name" });

    res.send({
      products,
      relatedProduct,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteManyProducts = async (req, res) => {
  try {
    const cname = req.cname;
    // console.log("deleteMany", cname, req.body.ids);

    await Product.deleteMany({ _id: req.body.ids });

    res.send({
      message: `Products Delete Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const addReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({
        message: "Product not found!",
      });
    }
    const userId = req.user._id;
    if (!userId) {
      return res.status(401).send({
        message: "You need to login first!",
      });
    }
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });
    if (existingReview) {
      return res.status(400).send({
        message: "You already reviewed this product!",
      });
    }

    console.log("product", product._id);
    const review = new Review({
      product: productId,
      user: userId,
      rating,
      comment,
    });
    await review.save();
    product.reviews.push(review);
    await product.save();

    res.status(201).send({
      message: "Review added successfully!",
      review,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: err.message,
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate({
      path: "reviews",
    });
    res.send(product.reviews);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};
module.exports = {
  addProduct,
  addReview,
  getProductReviews,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
  getProductByCategory,
};
