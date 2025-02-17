import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DataPoint {
  name: string;
  abaixoDoBasico: number;
  basico: number;
  adequado: number;
  avancado: number;
}

interface DesempenhoState {
  data: DataPoint[];
}

const initialState: DesempenhoState = {
  data: [],
};

const desempenhoSlice = createSlice({
  name: "desempenho",
  initialState,
  reducers: {
    setDesempenhoData: (state, action: PayloadAction<DataPoint[]>) => {
      state.data = action.payload;
    },
  },
});

// Export actions
export const { setDesempenhoData } = desempenhoSlice.actions;

// Export the reducer
export default desempenhoSlice.reducer;
