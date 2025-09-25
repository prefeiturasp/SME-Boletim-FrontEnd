import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./botaoIrParaComparativo.css";
import { BtnConferirDadosProps } from "../../../interfaces/btnConferirDadosProps";

const BotaoIrParaComparativo: React.FC<BtnConferirDadosProps> = ({
    dreId,
    escola,
    aplicacaoId,
    componenteCurricularId,    
    ano
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/", {
            state: {
                abrirComparativo: true,
                dreId: dreId,
                ueId: escola.ueId,                
                aplicacaoId,
                componenteCurricularId,
                ano,
            },
        });
    };

    return (
        <>
            <Button
                type="primary"
                onClick={handleClick}
                className="cards-comparativa-rodape-btn"
            >
                Conferir dados da UE
            </Button>
        </>)
};

export default BotaoIrParaComparativo;