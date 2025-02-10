import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserLogged: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const { setUserLogged } = authSlice.actions;
export default authSlice.reducer;
