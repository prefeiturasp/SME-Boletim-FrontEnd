import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Card } from "antd";
const SemAcesso = () => {
    return (_jsx("div", { style: styles.container, children: _jsxs(Card, { variant: "borderless", style: styles.card, children: [_jsx("div", { style: styles.imageContainer, children: _jsx("img", { src: "/acesso_negado.svg", alt: "Acesso Negado", style: styles.image }) }), _jsx("h2", { style: styles.title, children: "Desculpe, voc\u00EA n\u00E3o est\u00E1 autorizado a acessar esta p\u00E1gina" }), _jsx("p", { style: styles.subtitle, children: "Para acessar, primeiro voc\u00EA precisa realizar o seu login com usu\u00E1rio e senha." }), _jsx(Button, { type: "primary", size: "large", style: styles.button, href: "https://serap.sme.prefeitura.sp.gov.br/", children: "Fazer login" })] }) }));
};
const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
    },
    imageContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginBottom: "20px",
    },
    image: {
        width: "300px",
        height: "auto",
    },
    card: {
        width: "100%",
        maxWidth: "500px",
        padding: "20px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
        fontSize: "20px",
        fontWeight: "bold",
    },
    subtitle: {
        fontSize: "14px",
        color: "#666",
        marginBottom: "20px",
    },
    button: {
        width: "150px",
    },
};
export default SemAcesso;
