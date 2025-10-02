const LoadingBox = ({ text = "Carregando..." }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.5)", // fundo branco semi-transparente
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 10000, // fica acima do conteúdo, abaixo do botão
    }}
  >
    <span
      style={{
        position: "fixed",
        top: 0,
        background: "#21C45D",
        color: "white",
        padding: "5px",
        borderRadius: "6px",
        fontWeight: "bold",
        width: "100px",
        textAlign: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
      }}
    >
      {text}
    </span>
  </div>
);

export default LoadingBox;