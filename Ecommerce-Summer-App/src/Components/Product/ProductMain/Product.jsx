import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../../Features/Cart/cartSlice";

import { FaStar } from "react-icons/fa";
import { FiHeart } from "react-icons/fi";
import { GoChevronLeft, GoChevronRight } from "react-icons/go";
import { PiShareNetworkLight } from "react-icons/pi";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";

import { Tooltip, Zoom } from "@mui/material";
import { fetchVariants } from "../../../Features/Variant/variantSlice";
import "./Product.css";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const variants = useSelector((state) => state.variants.variants);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  useEffect(() => {
    dispatch(fetchVariants(123));
  }, [dispatch]);

  const attributes = {
    size: [],
    color: [],
  };
  product?.variants?.forEach((variant) => {
    Object.keys(variant).forEach((key) => {
      // Tìm thuộc tính title (Color hoặc Size) từ variantsData
      const variantData = variants.find((data) => data._id === key);

      // Nếu tìm thấy thuộc tính (Color hoặc Size)
      if (variantData) {
        const variantId = variant[key]; // lấy id của variant trong sản phẩm

        // Lặp qua các variants của loại thuộc tính đó trong variantsData
        variantData.variants.forEach((variantOption) => {
          // Nếu id trong variant của sản phẩm khớp với id trong variantsData
          if (variantOption._id === variantId) {
            // Nếu thuộc tính là màu (Color)
            if (variantData.title === 'Color') {
              // Thêm đối tượng {name, id} vào mảng color
              attributes.color.push({
                name: variantOption.name,
                id: variantOption._id
              });
            }

            // Nếu thuộc tính là kích cỡ (Size)
            if (variantData.title === 'Size') {
              // Thêm đối tượng {name, id} vào mảng size
              attributes.size.push({
                name: variantOption.name,
                id: variantOption._id
              });
            }
          }
        });
      }
    });
  });
  attributes.size = Array.from(new Map(attributes.size.map(item => [item?.id, item])).values());
  attributes.color = Array.from(new Map(attributes.color.map(item => [item?.id, item])).values());

  const [currentImg, setCurrentImg] = useState(0);

  const prevImg = () => {
    setCurrentImg(
      currentImg === 0 ? product?.image.length - 1 : currentImg - 1
    );
  };

  const nextImg = () => {
    setCurrentImg(
      currentImg === product?.image.length - 1 ? 0 : currentImg + 1
    );
  };

  // Product Quantity

  const [quantity, setQuantity] = useState(1);

  const increment = () => {
    setQuantity(quantity + 1);
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  // Product WishList

  const [clicked, setClicked] = useState(false);

  const handleWishClick = () => {
    setClicked(!clicked);
  };

  const handleAddToCart = async () => {
    // check user select size and color
    if (!selectedSize || !selectedColor) {
      toast.error(`Please select size and color!`, {
        duration: 2000,
        style: {
          backgroundColor: "#ff0000",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ff0000",
        },
      });
      return;
    }
    // check user login
    if (!localStorage.getItem("token")) {
      toast.error(`Please login to add to cart!`, {
        duration: 2000,
        style: {
          backgroundColor: "#ff0000",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ff0000",
        },
      });
      return;
    }
    // check use  select quantity
    if (quantity < 1) {
      toast.error(`Please select quantity!`, {
        duration: 2000,
        style: {
          backgroundColor: "#ff0000",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ff0000",
        },
      });
      return;
    }


    const productDetails = {
      variant: [
        {
          variantId: "size",
          variantValue: selectedSize,
        },
        {
          variantId: "color",
          variantValue: selectedColor,
        },
      ],
      productId: product._id,
      quantity: quantity,
      price: product.prices.price ? product.prices.price : product.prices.originalPrice,
    };
    try {
      await dispatch(addToCart(productDetails)).unwrap() ;
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
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        duration: 2000,
        style: {
          backgroundColor: "#ff0000",
          color: "white",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#ff0000",
        },
      });
    }
  };
  attributes.size.sort((a, b) => a.name.localeCompare(b.name));
  attributes.color.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <div className="productSection">
        <div className="productShowCase">
          <div className="productGallery">
            <div className="productThumb">
              {product?.image?.map((img, index) => (
                <img
                  key={img._id || index}
                  src={img}
                  alt=""
                  onClick={() => setCurrentImg(index)}
                />
              ))}
            </div>
            <div className="productFullImg">
              <img
                src={product?.image ? product?.image[currentImg] : ""}
                alt=""
              />
              <div className="buttonsGroup">
                <button onClick={prevImg} className="directionBtn">
                  <GoChevronLeft size={18} />
                </button>
                <button onClick={nextImg} className="directionBtn">
                  <GoChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="productDetails">
            <div className="productBreadcrumb">
              <div className="breadcrumbLink">
                <Link to="/">Home</Link>&nbsp;/&nbsp;
                <Link to="/shop">The Shop</Link>
              </div>
              <div className="prevNextLink">
                <Link to="/product">
                  <GoChevronLeft />
                  <p>Prev</p>
                </Link>
                <Link to="/product">
                  <p>Next</p>
                  <GoChevronRight />
                </Link>
              </div>
            </div>
            <div className="productName">
              <h1>{product?.title}</h1>
            </div>
            <div className="productRating">
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <FaStar color="#FEC78A" size={10} />
              <p>8k+ reviews</p>
            </div>
            <div className="productPrice">
              <h3>
                {product?.prices?.price
                  ? product?.prices?.price
                  : product?.prices?.originalPrice}{" "}
                đ
              </h3>
            </div>
            <div className="productDescription">
              <p>{product?.description}</p>
            </div>
            <div className="productSizeColor">
              <div className="productSize">
                <p>Sizes</p>
                <div className="sizeBtn">
                  {attributes.size &&
                    attributes.size.map((size, index) => (
                      <Tooltip
                        key={index}
                        title={size.name}
                        placement="top"
                        TransitionComponent={Zoom}
                        enterTouchDelay={0}
                        arrow
                      >
                        <button
                          onClick={() => setSelectedSize(size.id)}
                          style={{
                            borderColor:
                              selectedSize === size.id ? "#000" : "#e0e0e0",
                          }}
                        >
                          {size.name}
                        </button>
                      </Tooltip>
                    ))}
                </div>
              </div>
              <div className="productSize">
                <p>Color</p>
                <div className="sizeBtn">
                  {attributes.color &&
                    attributes.color?.map((color, index) => (
                      <Tooltip
                        key={index}
                        title={color.name}
                        placement="top"
                        TransitionComponent={Zoom}
                        enterTouchDelay={0}
                        arrow
                      >
                        <button
                          onClick={() => setSelectedColor(color.id)}
                          style={{
                            borderColor:
                              selectedColor === color.id ? "#000" : "#e0e0e0",
                          }}
                        >
                          {color.name}
                        </button>
                      </Tooltip>
                    ))}
                </div>
              </div>
            </div>

            <div className="productCartQuantity">
              <div className="productQuantity">
                <button onClick={decrement}>-</button>
                <input
                  type="text"
                  value={quantity}
                  onChange={handleInputChange}
                />
                <button onClick={increment}>+</button>
              </div>
              <div className="productCartBtn">
                <button onClick={handleAddToCart}>Add to Cart</button>
              </div>
            </div>
            <div className="productWishShare">
              <div className="productWishList">
                <button onClick={handleWishClick}>
                  <FiHeart color={clicked ? "red" : ""} size={17} />
                  <p>Add to Wishlist</p>
                </button>
              </div>
              <div className="productShare">
                <PiShareNetworkLight size={22} />
                <p>Share</p>
              </div>
            </div>
            <div className="productTags">
              <p>
                <span>SKU: </span>N/A
              </p>
              <p>
                <span>CATEGORIES: </span>Casual & Urban Wear, Jackets, Men
              </p>
              <p>
                <span>TAGS: </span>biker, black, bomber, leather
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
