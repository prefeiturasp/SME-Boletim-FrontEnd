import { configureStore } from "@reduxjs/toolkit";
import escolaReducer from "./slices/escolaSlice";

export const store = configureStore({
  reducer: {
    escola: escolaReducer, // Adiciona o reducer da escola ao store
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
