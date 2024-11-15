// redux/slices/variantSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import baseApi from "./../../utils/api";

// Thunk để fetch data từ API
export const fetchVariants = createAsyncThunk(
  "variants/fetchVariants",
  async () => {
    const response = await baseApi.get(
      "/attributes?type=attribute&option=Dropdown&option1=Radio"
    ); // URL giả định
    console.log(response.data);
    return response.data;
  }
);

const variantSlice = createSlice({
  name: "variants",
  initialState: {
    variants: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariants.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchVariants.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.variants = action.payload;
      })
      .addCase(fetchVariants.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default variantSlice.reducer;
