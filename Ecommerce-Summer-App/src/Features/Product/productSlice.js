import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import baseApi from './../../utils/api';

// Fetch products with pagination
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({  page, limit, title, category, price }) => {
    
    const response = await baseApi.get('/products', {
      params: {
        page,
        limit,
        title,
        category,
        minPrice: price ? price[0] : undefined,
        maxPrice: price ? price[1] : undefined,
      },
    });
    return response.data;
  }
);
export const fetchProductDetails = createAsyncThunk('productDetails/fetchProductDetails', async (productId) => {
  const response = await baseApi.post(`/products/${productId}`); // Adjust the URL as needed
  return response.data;
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    product: {},
    status: 'idle',
    error: null,
    totalDocs: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload.products;
        state.totalDocs = action.payload.totalDoc;
        state.totalPages = action.payload.pages;
        state.currentPage = action.meta.arg.page;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default productSlice.reducer;