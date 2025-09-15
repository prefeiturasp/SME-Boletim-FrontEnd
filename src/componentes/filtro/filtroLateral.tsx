import {
  Button,
  Checkbox,
  Divider,
  Drawer,
  Flex,
  Input,
  Radio,
  Select,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import "./filtroLateral.css";
import { useEffect, useState } from "react";
import { setFilters } from "../../redux/slices/filtrosSlice";

interface FilterDrawerProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  filtroDados: Filtro;
}

const FiltroLateral: React.FC<FilterDrawerProps> = ({
  open,
  setOpen,
  filtroDados,
}) => {
  const activeTab = useSelector((state: RootState) => state.tab.activeTab);
  const filtrosSelecionados = useSelector((state: RootState) => state.filtros);

  const dispatch = useDispatch();

  const [selectedFilters, setSelectedFilters] =
    useState<Filtro>(filtrosSelecionados);

  useEffect(() => {
    if (open) {
      setSelectedFilters(filtrosSelecionados);
    }
  }, [open]);

  const initialValue: number = filtroDados.nivelMinimo;
  const limit: number = filtroDados.nivelMaximo;
  const generateOptions = () => {
    const options = [];
    for (let i = initialValue; i <= limit; i += 25) {
      options.push(i);
    }
    return options;
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      niveis: [],
      niveisAbaPrincipal: [
        { texto: "Abaixo do Básico", valor: 1 },
        { texto: "Básico", valor: 2 },
        { texto: "Adequado", valor: 3 },
        { texto: "Avançado", valor: 4 },
      ],
      anosEscolares: [],
      componentesCurriculares: [],
      anosEscolaresRadio: [filtroDados.anosEscolares[0]],
      componentesCurricularesRadio: [filtroDados.componentesCurriculares[0]],
      nomeEstudante: "",
      eolEstudante: "",
      nivelMinimo: filtroDados.nivelMinimo,
      nivelMinimoEscolhido: filtroDados.nivelMinimo,
      nivelMaximo: filtroDados.nivelMaximo,
      nivelMaximoEscolhido: filtroDados.nivelMaximo,
      turmas: [],
      variacoes: [],
    });
  };

  const handleApplyFilters = () => {
    dispatch(setFilters(selectedFilters));
    setOpen(false);
  };

  const handleFilterChange = (
    filterType: keyof Filtro,
    value: number | string | FiltroChaveValor,
    type: TipoComponente = "checkbox"
  ) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (
        filterType === "niveis" ||
        filterType === "niveisAbaPrincipal" ||
        filterType === "anosEscolares" ||
        filterType === "componentesCurriculares" ||
        filterType === "turmas" ||
        filterType === "anosEscolaresRadio" ||
        filterType === "componentesCurricularesRadio" ||
        filterType === "variacoes"
      ) {
        const arrayFiltro = newFilters[filterType] as FiltroChaveValor[];

        let item: FiltroChaveValor;
        if (typeof value === "object") {
          item = value;
        } else {
          item = { valor: value, texto: String(value) };
        }

        if (type === "radio") {
          newFilters[filterType] = [item];
        } else {
          const exists = arrayFiltro.some((f) => f.valor === item.valor);
          newFilters[filterType] = exists
            ? arrayFiltro.filter((f) => f.valor !== item.valor)
            : [...arrayFiltro, item];
        }
      } else if (
        filterType === "nomeEstudante" ||
        filterType === "eolEstudante"
      ) {
        newFilters[filterType] = value as string;
      } else if (
        filterType === "nivelMinimo" ||
        filterType === "nivelMinimoEscolhido" ||
        filterType === "nivelMaximo" ||
        filterType === "nivelMaximoEscolhido"
      ) {
        newFilters[filterType] = value as number;
      }

      return newFilters;
    });
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
        {activeTab == "4" && (
          <>
            <Divider className="separador" />
            <div className="filtro-secao">
              <h3 className="filtro-titulo">Turmas</h3>
              {filtroDados.turmas.map((turma) => (
                <Checkbox
                  key={turma.valor}
                  checked={selectedFilters.turmas.some(
                    (item) => item.valor === turma.valor
                  )}
                  onChange={() => handleFilterChange("turmas", turma.valor)}
                >
                  {turma.texto}
                </Checkbox>
              ))}
            </div>
          </>
        )}

        {(activeTab == "1" || activeTab == "2" || activeTab == "4") && (
          <>
            <Divider className="separador" />
            <div className="filtro-secao">
              <h3 className="filtro-titulo">Nível</h3>
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
                data-testid="input-nome-estudante"
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

        {activeTab != "4" && activeTab != "5" && (
          <>
            <Divider className="separador" />
            <div className="filtro-secao">
              <h3 className="filtro-titulo">Ano</h3>
              {filtroDados.anosEscolares.map((ano) => (
                <Checkbox
                  key={ano.valor}
                  checked={selectedFilters.anosEscolares.some(
                    (item) => item.valor === ano.valor
                  )}
                  onChange={() =>
                    handleFilterChange("anosEscolares", ano.valor)
                  }
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
          </>
        )}

        {activeTab == "9" && (
          <>
            <div className="filtro-secao">
              <h3 className="filtro-titulo">Ano</h3>
              {filtroDados.anosEscolares.map((ano) => (
                <Radio
                  key={ano.valor}
                  checked={selectedFilters.anosEscolaresRadio.some(
                    (item) => item.valor === ano.valor
                  )}
                  onChange={() =>
                    handleFilterChange("anosEscolaresRadio", ano, "radio")
                  }
                >
                  {ano.texto + "º ano"}
                </Radio>
              ))}
            </div>
            <Divider className="separador" />
            <div className="filtro-secao">
              <h3 className="filtro-titulo">Componente curricular</h3>
              {filtroDados.componentesCurriculares.map((comp) => (
                <Radio
                  key={comp.valor}
                  checked={selectedFilters.componentesCurricularesRadio.some(
                    (item) => item.valor === comp.valor
                  )}
                  onChange={() =>
                    handleFilterChange(
                      "componentesCurricularesRadio",
                      comp,
                      "radio"
                    )
                  }
                >
                  {comp.texto}
                </Radio>
              ))}
            </div>
          </>
        )}

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
                  options={generateOptions().map((v) => ({
                    value: v,
                    label: v,
                  }))}
                ></Select>
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
                  options={generateOptions().map((v) => ({
                    value: v,
                    label: v,
                  }))}
                ></Select>
              </div>
            </div>
          </>
        )}

        {activeTab == "5" && (
          <>
            <Divider className="separador" />

            <div className="filtro-secao">
              <h3 className="filtro-titulo">Nome do estudante</h3>
              <Input
                className="filtro-input"
                placeholder="Digite o nome do estudante"
                data-testid="input-nome-estudante"
                value={selectedFilters.nomeEstudante}
                onChange={(e) =>
                  handleFilterChange("nomeEstudante", e.target.value)
                }
              />
            </div>

            <Divider className="separador" />
            <div className="filtro-secao">
              <h3 className="filtro-titulo">Variação</h3>

              <p>
                Estudantes que aumentaram, diminuiram ou não obtiveram variação
                de proficiência nas aplicações.
              </p>

              {filtroDados.variacoes.map((variacoes) => (
                <Checkbox
                  key={variacoes.valor}
                  checked={selectedFilters.variacoes.some(
                    (item) => item.valor === variacoes.valor
                  )}
                  onChange={() =>
                    handleFilterChange("variacoes", variacoes.valor)
                  }
                >
                  {variacoes.texto}
                </Checkbox>
              ))}
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
