import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCartPlus, FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import StoreData from "../../../Data/StoreData";
import { addToCart } from "../../../Features/Cart/cartSlice";
import { fetchProducts } from "../../../Features/Product/productSlice";
import "./Trendy.css";

const Trendy = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("tab1");
  const [wishList, setWishList] = useState({});
  const products = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const productError = useSelector((state) => state.products.error);
  const totalPages = useSelector((state) => state.products.totalPages);
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleWishlistClick = (productID) => {
    setWishList((prevWishlist) => ({
      ...prevWishlist,
      [productID]: !prevWishlist[productID],
    }));
  };

  const sortByPrice = (a, b) => a.productPrice - b.productPrice;

  const sortByReviews = (a, b) => {
    const reviewsA = parseInt(
      a.productReviews.replace("k+ reviews", "").replace(",", "")
    );
    const reviewsB = parseInt(
      b.productReviews.replace("k+ reviews", "").replace(",", "")
    );
    return reviewsB - reviewsA;
  };
  useEffect(() => {
    dispatch(
      fetchProducts({
        page: 1,
        limit: 100,
        title: "",
        category: "",
        price: null,
      })
    );
  }, [dispatch]);

  const cartItems = useSelector((state) => state.cart.items);

  const handleAddToCart = (product) => {
    const productInCart = cartItems.find(
      (item) => item.productID === product.productID
    );

    if (productInCart && productInCart.quantity >= 20) {
      toast.error("Product limit reached", {
        duration: 2000,
        style: {
          backgroundColor: "#ff4b4b",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ff4b4b",
        },
      });
    } else {
      dispatch(addToCart(product));
      toast.success(`Added to cart!`, {
        duration: 2000,
        style: {
          backgroundColor: "#07bc0c",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#07bc0c",
        },
      });
    }
  };

  return (
    <>
      <div className="trendyProducts">
        <h2>
          Our Trendy <span>Products</span>
        </h2>
        <div className="trendyTabs">
          <div className="tabs">
            <p
              onClick={() => handleTabClick("tab1")}
              className={activeTab === "tab1" ? "active" : ""}
            >
              All
            </p>
            <p
              onClick={() => handleTabClick("tab2")}
              className={activeTab === "tab2" ? "active" : ""}
            >
              New Arrivals
            </p>
            {/* <p
              onClick={() => handleTabClick("tab3")}
              className={activeTab === "tab3" ? "active" : ""}
            >
              Best Seller
            </p>
            <p
              onClick={() => handleTabClick("tab4")}
              className={activeTab === "tab4" ? "active" : ""}
            >
              Top Rated
            </p> */}
          </div>
          <div className="trendyTabContent">
            {/* Tab 1 */}
            {activeTab === "tab1" && (
              <div className="trendyMainContainer">
                {productStatus === "succeeded" &&
                  Array.isArray(products) &&
                  products.length > 0 &&
                  products.slice(0, 8).map((product, index) => (
                    <div className="trendyProductContainer" key={index}>
                      <div className="trendyProductImages">
                        <Link
                          to={`/Product/${product._id}`}
                          onClick={scrollToTop}
                        >
                          <img
                            src={product.image[0]}
                            alt=""
                            className="trendyProduct_front"
                          />
                          <img
                            src={product.image[1]}
                            alt=""
                            className="trendyProduct_back"
                          />
                        </Link>
                      </div>

                      <div className="trendyProductInfo">
                        <div className="trendyProductCategoryWishlist">
                          <p>{product.category.name}</p>
                          <FiHeart
                            onClick={() =>
                              handleWishlistClick(product.productID)
                            }
                            style={{
                              color: wishList[product.productID]
                                ? "red"
                                : "#767676",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                        <div className="trendyProductNameInfo">
                          <Link to="product" onClick={scrollToTop}>
                            <h5>{product.title}</h5>
                          </Link>
                          <p>
                            $
                            {product.prices.price
                              ? product.prices.price
                              : product.prices.originalPrice}
                          </p>
                          <div className="trendyProductRatingReviews">
                            <div className="trendyProductRatingStar">
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                            </div>
                            <span>{product.reviews.length} reviews</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Tab 2 */}
            {activeTab === "tab2" && (
              <div className="trendyMainContainer">
                {productStatus === "succeeded" &&
                  Array.isArray(products) &&
                  products.length > 0 &&
                  products
                    .slice(0, 8)
                    .reverse()
                    .map((product, index) => (
                      <div className="trendyProductContainer" key={index}>
                        <div className="trendyProductImages">
                          <Link
                            to={`/Product/${product._id}`}
                            onClick={scrollToTop}
                          >
                            <img
                              src={product.image[0]}
                              alt=""
                              className="trendyProduct_front"
                            />
                            <img
                              src={product.image[1]}
                              alt=""
                              className="trendyProduct_back"
                            />
                          </Link>
                        </div>

                        <div className="trendyProductInfo">
                          <div className="trendyProductCategoryWishlist">
                            <p>{product.category.name}</p>
                            <FiHeart
                              onClick={() =>
                                handleWishlistClick(product.productID)
                              }
                              style={{
                                color: wishList[product.productID]
                                  ? "red"
                                  : "#767676",
                                cursor: "pointer",
                              }}
                            />
                          </div>
                          <div className="trendyProductNameInfo">
                            <Link to="product" onClick={scrollToTop}>
                              <h5>{product.title}</h5>
                            </Link>
                            <p>
                              $
                              {product.prices.price
                                ? product.prices.price
                                : product.prices.originalPrice}
                            </p>
                            <div className="trendyProductRatingReviews">
                              <div className="trendyProductRatingStar">
                                <FaStar color="#FEC78A" size={10} />
                                <FaStar color="#FEC78A" size={10} />
                                <FaStar color="#FEC78A" size={10} />
                                <FaStar color="#FEC78A" size={10} />
                                <FaStar color="#FEC78A" size={10} />
                              </div>
                              <span>{product.reviews.length} reviews</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            )}

            {/* Tab 3 */}
            {activeTab === "tab3" && (
              <div className="trendyMainContainer">
                {StoreData.slice(0, 8)
                  .sort(sortByReviews)
                  .map((product) => (
                    <div className="trendyProductContainer" key={product.id}>
                      <div className="trendyProductImages">
                        <Link to="/Product" onClick={scrollToTop}>
                          <img
                            src={product.frontImg}
                            alt=""
                            className="trendyProduct_front"
                          />
                          <img
                            src={product.backImg}
                            alt=""
                            className="trendyProduct_back"
                          />
                        </Link>
                        <h4 onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </h4>
                      </div>
                      <div
                        className="trendyProductImagesCart"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaCartPlus />
                      </div>
                      <div className="trendyProductInfo">
                        <div className="trendyProductCategoryWishlist">
                          <p>Dresses</p>
                          <FiHeart
                            onClick={() =>
                              handleWishlistClick(product.productID)
                            }
                            style={{
                              color: wishList[product.productID]
                                ? "red"
                                : "#767676",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                        <div className="trendyProductNameInfo">
                          <Link to="product" onClick={scrollToTop}>
                            <h5>{product.productName}</h5>
                          </Link>

                          <p>${product.productPrice}</p>
                          <div className="trendyProductRatingReviews">
                            <div className="trendyProductRatingStar">
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                            </div>
                            <span>{product.productReviews}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {/* Tab 4 */}
            {activeTab === "tab4" && (
              <div className="trendyMainContainer">
                {StoreData.slice(0, 8)
                  .sort(sortByPrice)
                  .map((product) => (
                    <div className="trendyProductContainer" key={product.id}>
                      <div className="trendyProductImages">
                        <Link to="/Product">
                          <img
                            src={product.frontImg}
                            alt=""
                            className="trendyProduct_front"
                          />
                          <img
                            src={product.backImg}
                            alt=""
                            className="trendyProduct_back"
                          />
                        </Link>
                        <h4 onClick={() => handleAddToCart(product)}>
                          Add to Cart
                        </h4>
                      </div>
                      <div
                        className="trendyProductImagesCart"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaCartPlus />
                      </div>
                      <div className="trendyProductInfo">
                        <div className="trendyProductCategoryWishlist">
                          <p>Dresses</p>
                          <FiHeart
                            onClick={() =>
                              handleWishlistClick(product.productID)
                            }
                            style={{
                              color: wishList[product.productID]
                                ? "red"
                                : "#767676",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                        <div className="trendyProductNameInfo">
                          <Link to="/product" onClick={scrollToTop}>
                            <h5>{product.productName}</h5>
                          </Link>

                          <p>${product.productPrice}</p>
                          <div className="trendyProductRatingReviews">
                            <div className="trendyProductRatingStar">
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                              <FaStar color="#FEC78A" size={10} />
                            </div>
                            <span>{product.productReviews}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div className="discoverMore">
          <Link to="/shop" onClick={scrollToTop}>
            <p>Discover More</p>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Trendy;
