import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../@types";

interface OrderState {
    orders: Product[][]
}

const initialState: OrderState = {
    orders: []
}

export const OrderSlice = createSlice({
    name: "OrderList",
    initialState,
    reducers: {
        placeOrder: (state, action) => {
            if (action.payload.length > 0) {
                state.orders.push(action.payload)
            }
        }
    }
})

export const { placeOrder } = OrderSlice.actions
export default OrderSlice.reducer