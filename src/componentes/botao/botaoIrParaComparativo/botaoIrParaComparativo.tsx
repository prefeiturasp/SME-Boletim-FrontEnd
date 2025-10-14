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
    ano,
    visao
}) => {

    const navigate = useNavigate();

    //manda urid por url
    const handleClick = () => {

        try {   
            
            let url: string = ''
            if(visao === "sme")
                url = `/dres?dreUrlSelecionada=${dreId}`
            else {
                url = `/?ueSelecionada=${escola.ueId}&dreUrlSelecionada=${dreId}`
            }
            navigate(url, {
                state: {
                    abrirComparativo: true,
                    componenteCurricularId,
                    ano,
                }
            });
            window.scrollTo(0, 0);

        } catch (error) {
            console.error("Erro ao processar os parâmetros da URL:", error);
        }
    };

    return (
        <>
            <Button
                type="primary"
                onClick={handleClick}
                className="cards-comparativa-rodape-btn"
            >
                {visao === "sme" ? "Conferir dados da DRE" : "Conferir dados da UE"}
            </Button>
        </>)
};

export default BotaoIrParaComparativo;