import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    carregado: false,
};
const filtroCarregadoSlice = createSlice({
    name: "filtroCarregado",
    initialState,
    reducers: {
        filtroCarregado: (state, action) => {
            state.carregado = action.payload;
        },
    },
});
export const { filtroCarregado } = filtroCarregadoSlice.actions;
export default filtroCarregadoSlice.reducer;
