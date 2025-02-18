import React from "react";
import { Button } from "antd";
import { UpOutlined } from "@ant-design/icons";
import "./rodape.css";

const Rodape: React.FC = () => {
  const voltarAoInicio = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="rodape">
      <Button type="primary" icon={<UpOutlined />} onClick={voltarAoInicio}>
        Voltar para o Início
      </Button>
    </div>
  );
};

export default Rodape;
