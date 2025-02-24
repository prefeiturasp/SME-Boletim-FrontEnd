import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EscolaState {
  escolaSelecionada: {
    ueId: string | null;
    descricao: string | null;
  };
}

const initialState: EscolaState = {
  escolaSelecionada: { ueId: null, descricao: null },
};

const escolaSlice = createSlice({
  name: "escola",
  initialState,
  reducers: {
    selecionarEscola: (
      state,
      action: PayloadAction<{ ueId: string; descricao: string }>
    ) => {
      state.escolaSelecionada = action.payload;
    },
  },
});

export const { selecionarEscola } = escolaSlice.actions;
export default escolaSlice.reducer;
