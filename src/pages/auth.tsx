import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setUserLogged } from "../redux/slices/authSlice";

const Auth: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const codigo = searchParams.get("codigo");

  useEffect(() => {
    if (codigo) {
      console.log("Enviando código para o backend:", codigo);

      dispatch(setUserLogged(true));
      navigate("/");
    } else {
      navigate("/sem-acesso");
    }
  }, [codigo, dispatch, navigate]);

  return <div>Autenticando...</div>;
};

export default Auth;
