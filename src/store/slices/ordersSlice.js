import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ordersApi } from "../../api/ordersApi";

export const createOrder = createAsyncThunk(
        "orders/createOrder",
        async (orderData, { rejectWithValue }) => {
                try {
                        const response = await ordersApi.create(orderData);
                        return response.data;
                } catch (error) {
                        return rejectWithValue(error.message);
                }
        },
);

const ordersSlice = createSlice({
        name: "orders",
        initialState: {
                currentOrder: null,
                loading: false,
                error: null,
        },
        reducers: {
                clearOrder: (state) => {
                        state.currentOrder = null;
                        state.error = null;
                },
        },
        extraReducers: (builder) => {
                builder
                        .addCase(createOrder.pending, (state) => {
                                state.loading = true;
                                state.error = null;
                        })
                        .addCase(createOrder.fulfilled, (state, action) => {
                                state.loading = false;
                                state.currentOrder = action.payload;
                        })
                        .addCase(createOrder.rejected, (state, action) => {
                                state.loading = false;
                                state.error = action.payload;
                        });
        },
});

export const { clearOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

export const selectCurrentOrder = (state) => state.orders.currentOrder;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;
