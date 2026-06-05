import { createSlice } from "@reduxjs/toolkit";
import type { CartItem } from "../@types";




interface CartState {
    bag: CartItem[]
  }
const initialState:CartState = {
    bag: [],
}


export const BagSlice = createSlice({
    name: "BagSlice",
    initialState,
    reducers: {
    // addToCart: (state,action) => {
    //     const existingItem = state.bag.find(item => item.id === action.payload.id)

    //     if(existingItem){
    //         existingItem.quantity += 1
         
    //     }else {
    //         state.bag.push({
    //             ...action.payload,
    //             quantity: 1
    //         }
    //         )
       
    //     }
    // },
    addToCart: (state, action) => {
        const existingItem = state.bag.find(
          item => item.id === action.payload.id
        )
      
        if (existingItem) {
          existingItem.quantity += 1
        } else {
          state.bag.push({
            ...action.payload,
            quantity: 1
          })
        }
      },
    removeFromCart: (state,action) => {
        const findItem = state.bag.find(item => item.id == action.payload)

        if(!findItem) return

        if(findItem.quantity > 1){
            findItem.quantity -= 1
         
        }else {
            state.bag = state.bag.filter(item => item.id != action.payload)
          
        }
    },
    clearCart: (state)=> {
    state.bag = []
    }
    }
})
export const {addToCart,removeFromCart,clearCart} = BagSlice.actions
export default BagSlice.reducer