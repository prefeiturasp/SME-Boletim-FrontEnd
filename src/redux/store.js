import { configureStore } from "@reduxjs/toolkit";
import escolaReducer from "./slices/escolaSlice";
import authReducer from "./slices/authSlice";
import filtrosReducer from "./slices/filtrosSlice";
import filtroCompletoReducer from "./slices/filtroCompletoSlice";
import tabReducer from "./slices/tabSlice";
import nomeAplicacaoReducer from "./slices/nomeAplicacaoSlice";
import filtroCarregadoReducer from "./slices/filtroCarregado";
export const store = configureStore({
    reducer: {
        escola: escolaReducer,
        auth: authReducer,
        filtros: filtrosReducer,
        filtroCompleto: filtroCompletoReducer,
        tab: tabReducer,
        nomeAplicacao: nomeAplicacaoReducer,
        filtroCarregado: filtroCarregadoReducer,
    },
});
