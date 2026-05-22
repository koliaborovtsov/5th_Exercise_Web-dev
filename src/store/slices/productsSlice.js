import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productsApi } from "../../api/productsApi";

// Экшен для загрузки всех товаров
export const fetchProducts = createAsyncThunk(
        "products/fetchProducts",
        async (filters = {}, { rejectWithValue }) => {
                try {
                        const response = await productsApi.getAll(filters);
                        return response.data;
                } catch (error) {
                        return rejectWithValue(error.message);
                }
        },
);

// Экшен для загрузки одного товара
export const fetchProductById = createAsyncThunk(
        "products/fetchProductById",
        async (id, { rejectWithValue }) => {
                try {
                        const response = await productsApi.getById(id);
                        return response.data;
                } catch (error) {
                        return rejectWithValue(error.message);
                }
        },
);

const productsSlice = createSlice({
        name: "products",
        initialState: {
                items: [],
                selectedProduct: null,
                loading: false,
                error: null,
        },
        reducers: {
                clearSelectedProduct: (state) => {
                        state.selectedProduct = null;
                },
                clearError: (state) => {
                        state.error = null;
                },
        },
        extraReducers: (builder) => {
                builder
                        .addCase(fetchProducts.pending, (state) => {
                                state.loading = true;
                                state.error = null;
                        })
                        .addCase(fetchProducts.fulfilled, (state, action) => {
                                state.loading = false;
                                state.items = action.payload;
                        })
                        .addCase(fetchProducts.rejected, (state, action) => {
                                state.loading = false;
                                state.error = action.payload;
                        })
                        .addCase(fetchProductById.pending, (state) => {
                                state.loading = true;
                                state.error = null;
                                state.selectedProduct = null;
                        })
                        .addCase(fetchProductById.fulfilled, (state, action) => {
                                state.loading = false;
                                state.selectedProduct = action.payload;
                        })
                        .addCase(fetchProductById.rejected, (state, action) => {
                                state.loading = false;
                                state.error = action.payload;
                        });
        },
});

export const { clearSelectedProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;

export const selectProducts = (state) => state.products.items;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;
