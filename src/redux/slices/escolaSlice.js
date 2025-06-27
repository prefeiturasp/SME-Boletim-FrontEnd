import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    escolaSelecionada: { ueId: null, descricao: null },
};
const escolaSlice = createSlice({
    name: "escola",
    initialState,
    reducers: {
        selecionarEscola: (state, action) => {
            state.escolaSelecionada = action.payload;
        },
    },
});
export const { selecionarEscola } = escolaSlice.actions;
export default escolaSlice.reducer;
