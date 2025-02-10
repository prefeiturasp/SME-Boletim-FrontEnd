import React from "react";
import { useNavigate } from "react-router-dom";

const SemAcesso: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Acesso Negado</h2>
      <p>Você não tem permissão para acessar esta página.</p>
      <button onClick={() => navigate("/")}>Voltar</button>
    </div>
  );
};

export default SemAcesso;
