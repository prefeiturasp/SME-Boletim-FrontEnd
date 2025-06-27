import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    id: 0,
    nome: "-",
    tipoTai: true,
    dataInicioLote: new Date().toISOString(),
};
const nomeAplicacaoSlice = createSlice({
    name: "nomeAplicacao",
    initialState,
    reducers: {
        setNomeAplicacao: (state, action) => {
            return action.payload;
        },
    },
});
export const { setNomeAplicacao } = nomeAplicacaoSlice.actions;
export default nomeAplicacaoSlice.reducer;
