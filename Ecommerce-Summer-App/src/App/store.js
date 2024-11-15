import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../Features/Auth/authSlice";
import cartSlice from "../Features/Cart/cartSlice";
import categorySlice from "../Features/Category/categorySlice";
import orderSlice from "../Features/Order/orderSlice";
import productSlice from "../Features/Product/productSlice";
import variantReducer from "../Features/Variant/variantSlice";
import wishListSlice from "../Features/Wishlist/wishListSlice";
const store = configureStore({
  reducer: {
    cart: cartSlice,
    wishlist: wishListSlice,
    auth: authSlice,
    products: productSlice,
    categories: categorySlice, 
    variants: variantReducer,
    order: orderSlice
  },

  // middleware
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(
    {
      serializableCheck: false
    }
  ),
});

export default store;
