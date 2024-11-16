import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCartPlus, FaStar } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { FiHeart } from "react-icons/fi";
import { IoClose, IoFilterSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { addToCart } from "../../../Features/Cart/cartSlice";
import { fetchProducts } from "../../../Features/Product/productSlice"; // Import the fetchProducts action
import Filter from "../Filters/Filter";
import "./ShopDetails.css";

const ShopDetails = () => {
  const dispatch = useDispatch();
  const [wishList, setWishList] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10; // Number of products per page

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPriceRange, setSelectedPriceRange] = useState([0, 1000]);
  const [searchTerm, setSearchTerm] = useState("");

  const products = useSelector((state) => state.products.items);
  const productStatus = useSelector((state) => state.products.status);
  const productError = useSelector((state) => state.products.error);
  const totalPages = useSelector((state) => state.products.totalPages);

  useEffect(() => {
    dispatch(fetchProducts({
      page,
      limit,
      title: searchTerm,
      category: selectedCategory,
      price: selectedPriceRange,
    }));
  }, [page, selectedCategory, selectedPriceRange, searchTerm, dispatch]);

  const handleWishlistClick = (productID) => {
    setWishList((prevWishlist) => ({
      ...prevWishlist,
      [productID]: !prevWishlist[productID],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

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

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRange(range);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="shopDetails">
        <div className="shopDetailMain">
          <div className="shopDetails__left">
            <Filter
              onCategoryChange={handleCategoryChange}
              onPriceRangeChange={handlePriceRangeChange}
              onSearchChange={handleSearchChange}
            />
          </div>
          <div className="shopDetails__right">
            <div className="shopDetailsSorting">
              <div className="shopDetailsBreadcrumbLink">
                <Link to="/" onClick={scrollToTop}>
                  Home
                </Link>
                &nbsp;/&nbsp;
                <Link to="/shop">The Shop</Link>
              </div>
              <div className="filterLeft" onClick={toggleDrawer}>
                <IoFilterSharp />
                <p>Filter</p>
              </div>
              <div className="shopDetailsSort">
                <select name="sort" id="sort">
                  <option value="default">Default Sorting</option>
                  <option value="Featured">Featured</option>
                  <option value="bestSelling">Best Selling</option>
                  <option value="a-z">Alphabetically, A-Z</option>
                  <option value="z-a">Alphabetically, Z-A</option>
                  <option value="lowToHigh">Price, Low to high</option>
                  <option value="highToLow">Price, high to low</option>
                  <option value="oldToNew">Date, old to new</option>
                  <option value="newToOld">Date, new to old</option>
                </select>
                <div className="filterRight" onClick={toggleDrawer}>
                  <div className="filterSeprator"></div>
                  <IoFilterSharp />
                  <p>Filter</p>
                </div>
              </div>
            </div>
            <div className="shopDetailsProducts">
              <div className="shopDetailsProductsContainer">
                {productStatus === 'loading' && <p>Loading...</p>}
                {productStatus === 'failed' && <p>{productError}</p>}
                {productStatus === 'succeeded' &&
                // nếu rỗng thì hiển thị là không có sản phẩm nào
               
                // nếu có sản phẩm thì hiển thị sản phẩm

                // check if products is an array and has length
                Array.isArray(products) && products.length > 0 &&
                  products.map((product,index) => (
                    <div className="sdProductContainer" key={index}>
                      <div className="sdProductImages">
                        <Link to={`/Product/${product._id}`} onClick={scrollToTop}>
                          <img
                            src={product.image[0]}
                            alt=""
                            className="sdProduct_front"
                          />
                          <img
                            src={product.image[1]}
                            alt=""
                            className="sdProduct_back"
                          />
                        </Link>
                        
                      </div>
                      <div
                        className="sdProductImagesCart"
                        onClick={() => handleAddToCart(product)}
                      >
                        <FaCartPlus />
                      </div>
                      <div className="sdProductInfo">
                        <div className="sdProductCategoryWishlist">
                          <p>{product.category.name}</p>
                          <FiHeart
                            onClick={() => handleWishlistClick(product.productID)}
                            style={{
                              color: wishList[product.productID]
                                ? "red"
                                : "#767676",
                              cursor: "pointer",
                            }}
                          />
                        </div>
                        <div className="sdProductNameInfo">
                          <Link to="/Product" onClick={scrollToTop}>
                            <h5>{product.title}</h5>
                          </Link>
                          <p>${product.prices.price ? product.prices.price : product.prices.originalPrice}</p>
                          <div className="sdProductRatingReviews">
                            <div className="sdProductRatingStar">
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
            </div>
            <div className="shopDetailsPagination">
              <div className="sdPaginationPrev">
                <p onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                  <FaAngleLeft />
                  Prev
                </p>
              </div>
              <div className="sdPaginationNumber">
                {Array.from({ length: totalPages }, (_, index) => (
                  <p
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={page === index + 1 ? "active" : ""}
                  >
                    {index + 1}
                  </p>
                ))}
              </div>
              <div className="sdPaginationNext">
                <p onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                  Next
                  <FaAngleRight />
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Drawer */}
        <div className={`filterDrawer ${isDrawerOpen ? "open" : ""}`}>
          <div className="drawerHeader">
            <p>Filter By</p>
            <IoClose onClick={closeDrawer} className="closeButton" size={26} />
          </div>
          <div className="drawerContent">
            <Filter
              onCategoryChange={handleCategoryChange}
              onPriceRangeChange={handlePriceRangeChange}
              onSearchChange={handleSearchChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ShopDetails;