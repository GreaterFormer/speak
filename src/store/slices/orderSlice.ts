import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apis } from "apis";
import { LogInfo, OrderInfo } from "types";
import { BUY } from "constant";

const orderBookState = {
    orders: [] as OrderInfo[],
    bettingOptionLogs: [] as LogInfo[],
    loading: false,
    showNo: false,
    buyOrSell: BUY
};

export const fetchOrders = createAsyncThunk(
    "order/fetchOrders",
    async ({ bettingOptionUrl }: { bettingOptionUrl: string }) => {
        const response = await apis.GetOrders(bettingOptionUrl);
        return response;
    }
)

const orderSlice = createSlice({
    name: "order",
    initialState: orderBookState,
    reducers: {
        createOrder: (state, action) => {
            state.orders.push(action.payload);
        },
        updateOrder: (state, action) => {
            const index = state.orders.findIndex(order => order._id === action.payload._id);
            if (index !== -1) {
                state.orders[index] = action.payload;
            } else {
                state.orders.push(action.payload); // If not found, add the new item to the array
            }
        },
        removeOrder: (state, action) => {
            state.orders = state.orders.filter(order => order._id !== action.payload._id);
        },
        setShowNo: (state, action) => {
            state.showNo = action.payload;
        },
        setBuyOrSell: (state, action) => {
            state.buyOrSell = action.payload;
        },
        setBettingOptionLogs: (state, action) => {
            state.bettingOptionLogs = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchOrders.fulfilled, (state, action: any) => {
                state.loading = false;
                if (action.payload.status === 200) {
                    state.orders = action.payload.orders;
                }
            })
            .addCase(fetchOrders.rejected, (state, _) => {
                state.loading = false;
            })
    }
});

export default orderSlice.reducer;

export const { createOrder, updateOrder, removeOrder, setShowNo, setBuyOrSell, setBettingOptionLogs } = orderSlice.actions;
