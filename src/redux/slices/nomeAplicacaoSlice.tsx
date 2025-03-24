import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: NomeAplicacao = {
  id: 0,
  nome: "-",
  tipoTai: true,
  dataInicioLote: new Date(),
};

const nomeAplicacaoSlice = createSlice({
  name: "nomeAplicacao",
  initialState,
  reducers: {
    setNomeAplicacao: (state, action: PayloadAction<NomeAplicacao>) => {
      return action.payload;
    },
  },
});

export const { setNomeAplicacao } = nomeAplicacaoSlice.actions;
export default nomeAplicacaoSlice.reducer;
