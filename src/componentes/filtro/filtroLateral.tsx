import { Button, Checkbox, Divider, Drawer, Flex, Input, Select } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import "./filtroLateral.css";

interface FilterDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedFilters: Filtro;
  handleFilterChange: (
    filterType: keyof Filtro,
    value: number | string | FiltroChaveValor
  ) => void;
  handleResetFilters: () => void;
  handleApplyFilters: () => void;
  filtroDados: Filtro;
}

const FiltroLateral: React.FC<FilterDrawerProps> = ({
  open,
  setOpen,
  selectedFilters,
  handleFilterChange,
  handleResetFilters,
  handleApplyFilters,
  filtroDados,
}) => {
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const initialValue: number = filtroDados.nivelMinimo;
  const limit: number = filtroDados.nivelMaximo;
  const generateOptions = () => {
    const options = [];
    for (let i = initialValue; i <= limit; i += 25) {
      options.push(i);
    }
    return options;
  };

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
            <span> Filtrar</span>
          </p>
        }
        placement="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        {activeTab == "1" && (
          <>
            <Divider className="separador" />
            <div className="filtro-secao">
              <h3 className="filtro-titulo">Níveis</h3>
              {filtroDados.niveis.map((nivel) => (
                <Checkbox
                  defaultChecked={true}
                  key={nivel.valor}
                  checked={selectedFilters.niveisAbaPrincipal.some(
                    (item) => item.valor === nivel.valor
                  )}
                  onChange={() =>
                    handleFilterChange("niveisAbaPrincipal", nivel)
                  }
                >
                  {nivel.texto}
                </Checkbox>
              ))}
            </div>
          </>
        )}

        {activeTab == "3" && (
          <>
            <Divider className="separador" />

            <div className="filtro-secao">
              <h3 className="filtro-titulo">Nome do estudante</h3>
              <Input
                className="filtro-input"
                placeholder="Digite o nome do estudante"
                value={selectedFilters.nomeEstudante}
                onChange={(e) =>
                  handleFilterChange("nomeEstudante", e.target.value)
                }
              />
            </div>

            <Divider className="separador" />

            <div className="filtro-secao">
              <h3 className="filtro-titulo">EOL do estudante</h3>
              <Input
                className="filtro-input"
                placeholder="Digite o EOL do estudante"
                value={selectedFilters.eolEstudante}
                onChange={(e) =>
                  handleFilterChange("eolEstudante", e.target.value)
                }
              />
            </div>
          </>
        )}

        <Divider className="separador" />
        <div className="filtro-secao">
          <h3 className="filtro-titulo">Ano letivo</h3>
          {filtroDados.anosEscolares.map((ano) => (
            <Checkbox
              key={ano.valor}
              checked={selectedFilters.anosEscolares.some(
                (item) => item.valor === ano.valor
              )}
              onChange={() => handleFilterChange("anosEscolares", ano.valor)}
            >
              {ano.texto + "º ano"}
            </Checkbox>
          ))}
        </div>
        <Divider className="separador" />
        <div className="filtro-secao">
          <h3 className="filtro-titulo">Componente curricular</h3>
          {filtroDados.componentesCurriculares.map((comp) => (
            <Checkbox
              key={comp.valor}
              checked={selectedFilters.componentesCurriculares.some(
                (item) => item.valor === comp.valor
              )}
              onChange={() =>
                handleFilterChange("componentesCurriculares", comp.valor)
              }
            >
              {comp.texto}
            </Checkbox>
          ))}
        </div>

        {activeTab == "3" && (
          <>
            <Divider className="separador" />
            <div className="filtro-secao">
              <h3 className="filtro-titulo">Nível</h3>
              {filtroDados.niveis.map((nivel) => (
                <Checkbox
                  key={nivel.valor}
                  checked={selectedFilters.niveis.some(
                    (item) => item.valor === nivel.valor
                  )}
                  onChange={() => handleFilterChange("niveis", nivel.valor)}
                >
                  {nivel.texto}
                </Checkbox>
              ))}
            </div>
          </>
        )}

        {activeTab == "3" && (
          <>
            <Divider className="separador" />
            <div className="filtro-secao">
              <h3 className="filtro-titulo">Proficiência</h3>
              Selecione um intervalo de proficiência.
              <div className="select-caixa">
                <span className="label">Nível inicial:</span>
                <Select
                  defaultValue={initialValue}
                  className="select"
                  value={selectedFilters.nivelMinimoEscolhido}
                  onChange={(value) =>
                    handleFilterChange("nivelMinimoEscolhido", value)
                  }
                >
                  {generateOptions().map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <div className="select-caixa">
                <span className="label">Nível final:</span>
                <Select
                  defaultValue={limit}
                  className="select"
                  value={selectedFilters.nivelMaximoEscolhido}
                  onChange={(value) =>
                    handleFilterChange("nivelMaximoEscolhido", value)
                  }
                >
                  {generateOptions().map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </>
        )}

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
