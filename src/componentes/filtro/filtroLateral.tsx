import { Button, Checkbox, Divider, Drawer, Flex } from "antd";

interface selectedFilters {
  niveis: string[];
  anoLetivo: string[];
  componentesCurriculares: string[];
}

interface FilterDrawerProps {
  aba: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedFilters: selectedFilters;
  handleFilterChange: (
    filterType: keyof selectedFilters,
    value: string
  ) => void;
  handleResetFilters: () => void;
  handleApplyFilters: () => void;
  filtroDados: Filtro;
}

const FiltroLateral: React.FC<FilterDrawerProps> = ({
  aba,
  open,
  setOpen,
  selectedFilters,
  handleFilterChange,
  handleResetFilters,
  handleApplyFilters,
  filtroDados,
}) => {
  console.log(aba);
  return (
    <>
      <Drawer
        className="custom-drawer"
        closable
        destroyOnClose
        title={
          <p>
            <img
              src="/icon_filter_white.svg"
              alt="Filtrar"
              className="icone-filtrar-drawer"
            />
            <span>Filtrar</span>
          </p>
        }
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Divider className="separador" />
        <div className="filtro-secao">
          <h3 className="filtro-titulo">Ano letivo</h3>
          {filtroDados.anosEscolares.map((ano) => (
            <Checkbox
              key={ano.texto + "º ano"}
              checked={selectedFilters.anoLetivo.includes(ano.texto + "º ano")}
              onChange={() =>
                handleFilterChange("anoLetivo", ano.texto + "º ano")
              }
            >
              {ano.texto + "º ano"}
            </Checkbox>
          ))}
        </div>
        <Divider className="separador" />
        <div className="filtro-secao">
          <h3 className="filtro-titulo">Componente curricularjjji</h3>
          {filtroDados.componentesCurriculares.map((comp) => (
            <Checkbox
              key={comp.texto}
              checked={selectedFilters.componentesCurriculares.includes(
                comp.texto
              )}
              onChange={() =>
                handleFilterChange("componentesCurriculares", comp.texto)
              }
            >
              {comp.texto}
            </Checkbox>
          ))}
        </div>
        <Divider className="separador" />
        <Flex gap="small" wrap>
          <Button className="botao-remover" onClick={handleResetFilters}>
            Remover Filtros
          </Button>
          <Button
            type="primary"
            className="botao-filtrar"
            onClick={handleApplyFilters}
          >
            Filtrar
          </Button>
        </Flex>
      </Drawer>
    </>
  );
};

export default FiltroLateral;
