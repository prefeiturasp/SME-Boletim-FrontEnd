import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setUserLogged } from "../redux/slices/authSlice";
import { servicos } from "../servicos";

const Auth: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get("codigo");

  const apiUrl = import.meta.env.VITE_API_URL;
  console.log(apiUrl);

  useEffect(() => {
    const fetchData = async () => {
      if (codigo) {
        try {
          // const data = { codigo: codigo };
          // const resposta = await servicos.post(
          //   "/v1/autenticacao/validar",
          //   data
          // );
          // console.log(resposta);

          dispatch(setUserLogged(true));
          navigate("/");
        } catch (error) {
          console.error("Erro ao autenticar:", error);
        }
      } else {
        navigate("/sem-acesso");
      }
    };

    fetchData();
  }, [codigo, dispatch, navigate]);

  return <div>Autenticando...</div>;
};

export default Auth;
