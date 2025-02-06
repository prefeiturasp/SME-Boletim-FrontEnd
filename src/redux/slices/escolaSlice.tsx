import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EscolaState {
  escolaSelecionada: string | null;
}

const initialState: EscolaState = {
  escolaSelecionada: null,
};

const escolaSlice = createSlice({
  name: "escola",
  initialState,
  reducers: {
    selecionarEscola: (state, action: PayloadAction<string>) => {
      state.escolaSelecionada = action.payload;
    },
  },
});

export const { selecionarEscola } = escolaSlice.actions;
export default escolaSlice.reducer;
