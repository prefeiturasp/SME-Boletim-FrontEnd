import { createSlice } from "@reduxjs/toolkit";
const storedToken = localStorage.getItem("authToken");
const storedExpiresAt = localStorage.getItem("authExpiresAt");
const isTokenValid = storedToken && storedExpiresAt && new Date(storedExpiresAt) > new Date();
const initialState = {
    isAuthenticated: isTokenValid,
    token: storedToken || null,
    dataHoraExpiracao: storedExpiresAt || null,
};
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUserLogged: (state, action) => {
            const { token, dataHoraExpiracao } = action.payload;
            state.isAuthenticated = true;
            state.token = token;
            state.dataHoraExpiracao = dataHoraExpiracao;
            localStorage.setItem("authToken", token);
            localStorage.setItem("authExpiresAt", dataHoraExpiracao);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.token = null;
            state.dataHoraExpiracao = null;
            localStorage.removeItem("authToken");
            localStorage.removeItem("authExpiresAt");
        },
    },
});
export const { setUserLogged, logout } = authSlice.actions;
export default authSlice.reducer;
