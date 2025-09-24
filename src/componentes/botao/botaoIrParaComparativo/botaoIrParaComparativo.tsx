import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import "./botaoIrParaComparativo.css";

interface Props {
    escola: { ueId: string; descricao: string };
    aplicacaoId: number;
    componenteCurricularId: number;
}

const BotaoIrParaComparativo: React.FC<Props> = ({
    escola,
    aplicacaoId,
    componenteCurricularId,
}) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/", {
            state: {
                abrirComparativo: true,
                aplicacaoId,
                componenteCurricularId,
                ueId: escola.ueId,
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