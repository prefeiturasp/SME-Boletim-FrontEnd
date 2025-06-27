import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setUserLogged, logout } from "../redux/slices/authSlice";
import { servicos } from "../servicos";
const Auth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const codigo = searchParams.get("codigo");
    useEffect(() => {
        const verificarToken = async () => {
            const storedToken = localStorage.getItem("authToken");
            const dataHoraExpiracao = localStorage.getItem("authExpiresAt");
            if (storedToken && dataHoraExpiracao) {
                const expiraEm = new Date(dataHoraExpiracao);
                if (expiraEm > new Date()) {
                    dispatch(setUserLogged({
                        token: storedToken,
                        dataHoraExpiracao: dataHoraExpiracao,
                    }));
                    navigate("/");
                    return;
                }
                else {
                    dispatch(logout());
                }
            }
            if (codigo) {
                try {
                    const resposta = await servicos.post("/api/v1/autenticacao/validar", {
                        codigo,
                    });
                    const { token, dataHoraExpiracao } = resposta;
                    dispatch(setUserLogged({ token, dataHoraExpiracao }));
                    navigate("/");
                }
                catch (error) {
                    console.error("Erro ao autenticar:", error);
                    navigate("/sem-acesso");
                }
            }
            else {
                navigate("/sem-acesso");
            }
        };
        verificarToken();
    }, [codigo, dispatch, navigate]);
    return _jsx("div", { children: "Autenticando..." });
};
export default Auth;
