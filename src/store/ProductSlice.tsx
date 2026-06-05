import { createSlice } from "@reduxjs/toolkit";
import type { Product } from "../@types";



interface ProductState {
    items: Product[]
  }
  

  const initialState: ProductState = {
    items: [
      {
        id: 1,
        title: "flower",
        price: 14,
        stock: 5
      },
      {
        id: 2,
        title: "cactus",
        price: 99,
        stock: 10
      }
    ]
  }
export const ProductSlice = createSlice({
    name: "CartSlice",
    initialState,
    reducers: {}
})

export default ProductSlice.reducer