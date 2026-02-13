import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// API 1
export const fetchApi1 = createAsyncThunk(
  "products/fetchApi1",
  async () => {
    const res = await fetch("https://fakestoreapi.com/products");
    return res.json();
  }
);

// API 2
export const fetchApi2 = createAsyncThunk(
  "products/fetchApi2",
  async () => {
    const res = await fetch("https://dummyjson.com/products");
    const data = await res.json();
    return data.products;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApi1.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApi1.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchApi1.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchApi2.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApi2.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      });
  },
});

export default productSlice.reducer;
