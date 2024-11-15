import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdditionalInfo from "../Components/Product/AdditonInfo/AdditionalInfo";
import Product from "../Components/Product/ProductMain/Product";
import RelatedProducts from "../Components/Product/RelatedProducts/RelatedProducts";
import { fetchProductDetails } from "../Features/Product/productSlice";

const ProductDetails = () => {
  const id = window.location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.product);
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    dispatch(fetchProductDetails(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (product) {
      setProductData(product);
    }
  }, [product]);
 
  return (
    <>
      {productData && (
        <>
          <Product product={productData} />
          <AdditionalInfo product={productData} />
          <RelatedProducts productId={productData._id} />
        </>
      )}
    </>
  );
};

export default ProductDetails;