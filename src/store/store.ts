import { configureStore, createSlice } from "@reduxjs/toolkit";

// Placeholder slice — Redux requires at least one reducer.
// All server state (products, cart, orders) is managed by React Query.
const appSlice = createSlice({
  name: "app",
  initialState: {},
  reducers: {},
});

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
