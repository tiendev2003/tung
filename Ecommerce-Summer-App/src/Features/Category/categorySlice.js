import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import baseApi from './../../utils/api';

// Fetch categories
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await baseApi.get('/category/all'); // Adjust the URL as needed
  return response.data;
});

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default categorySlice.reducer;