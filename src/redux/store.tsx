import { configureStore } from "@reduxjs/toolkit";
import escolaReducer from "./slices/escolaSlice";
import authReducer from "./slices/authSlice";
import desempenhoReducer from "./slices/desempenhoSlice";
import filtrosReducer from "./slices/filtrosSlice";
import filtroCompletoReducer from "./slices/filtroCompletoSlice";
import tabReducer from "./slices/tabSlice";

export const store = configureStore({
  reducer: {
    escola: escolaReducer,
    auth: authReducer,
    desempenho: desempenhoReducer,
    filtros: filtrosReducer,
    filtroCompleto: filtroCompletoReducer,
    tab: tabReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
