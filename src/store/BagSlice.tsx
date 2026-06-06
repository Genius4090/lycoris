import { createSlice } from "@reduxjs/toolkit";

// This slice is kept for backwards compatibility but is no longer used.
// Cart state is managed by React Query + Supabase.

interface CartItem {
  id: number
  title: string
  price: number
  stock: number
  quantity: number
}

interface CartState {
  bag: CartItem[]
}

const initialState: CartState = {
  bag: [],
}

export const BagSlice = createSlice({
  name: "BagSlice",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.bag.find(item => item.id === action.payload.id)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.bag.push({ ...action.payload, quantity: 1 })
      }
    },
    removeFromCart: (state, action) => {
      const findItem = state.bag.find(item => item.id === action.payload)
      if (!findItem) return
      if (findItem.quantity > 1) {
        findItem.quantity -= 1
      } else {
        state.bag = state.bag.filter(item => item.id !== action.payload)
      }
    },
    clearCart: (state) => {
      state.bag = []
    }
  }
})

export const { addToCart, removeFromCart, clearCart } = BagSlice.actions
export default BagSlice.reducer
