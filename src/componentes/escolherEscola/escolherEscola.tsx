import React, { useEffect, useState } from "react";
import { Flex } from "antd";
import {
  Col,
  Divider,
  Row,
  Card,
  Drawer,
  Button,
  Checkbox,
  Select,
  Badge,
} from "antd";
import "./escolherEscola.css";
import { useDispatch, useSelector } from "react-redux";
import { selecionarEscola } from "../../redux/slices/escolaSlice";
import { RootState } from "../../redux/store";
import { servicos } from "../../servicos";
import { setFilters, resetFilters } from "../../redux/slices/filtrosSlice";

const EscolherEscola = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [abrangencia, setAbrangencia] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<{
    niveis: string[];
    anoLetivo: string[];
    componentesCurriculares: string[];
  }>({
    niveis: [],
    anoLetivo: [],
    componentesCurriculares: [],
  });

  const dispatch = useDispatch();
  const escolaSelecionada = useSelector(
    (state: RootState) => state.escola.escolaSelecionada
  );

  const buscarAbrangencias = async () => {
    try {
      const resposta = await servicos.get("/abrangencia", {});

      const escolasValidas = resposta.filter(
        (item: any) => item && item.ueId && item.descricao
      );

      setAbrangencia(escolasValidas);
    } catch (error) {
      console.error("Erro ao buscar escolas:", error);
    }
  };

  useEffect(() => {
    buscarAbrangencias();
  }, []);

  useEffect(() => {
    if (abrangencia.length > 0 && escolaSelecionada.ueId == null) {
      const primeiraEscola = abrangencia[0];

      dispatch(
        selecionarEscola({
          ueId: primeiraEscola.ueId,
          descricao: primeiraEscola.descricao,
        })
      );
    }
  }, [abrangencia, escolaSelecionada, dispatch]);

  const handleChange = (value: string, option: any) => {
    dispatch(selecionarEscola({ ueId: value, descricao: option.label }));
  };

  const abrirFiltro = () => {
    setOpen(true);
    setLoading(false);
  };

  const opcoes = abrangencia.map((item) => ({
    value: `${item.ueId}`,
    label: item.descricao,
  }));

  const handleResetFilters = () => {
    setSelectedFilters({
      niveis: [],
      anoLetivo: [],
      componentesCurriculares: [],
    });
  };

  const handleApplyFilters = () => {
    dispatch(setFilters(selectedFilters));
    setOpen(false);
  };

  const handleFilterChange = (
    filterType: keyof typeof selectedFilters,
    value: string
  ) => {
    setSelectedFilters((prevFilters) => {
      const newFilters = { ...prevFilters };

      if (newFilters[filterType].includes(value)) {
        newFilters[filterType] = newFilters[filterType].filter(
          (item) => item !== value
        );
      } else {
        newFilters[filterType] = [...newFilters[filterType], value];
      }

      return newFilters;
    });
  };

  const totalFiltrosSelecionados =
    selectedFilters.niveis.length +
    selectedFilters.anoLetivo.length +
    selectedFilters.componentesCurriculares.length;

  return (
    <div className="conteudo-fixo">
      <Row className="escolher-escola" justify="space-between" align="middle">
        <Col>
          <span className="nome-escola">{escolaSelecionada?.descricao}</span>
        </Col>
        <Col>
          <Badge
            count={totalFiltrosSelecionados}
            className="badge-notificacoes"
          >
            <img
              src="/icon_filter_default.svg"
              alt="Filtrar"
              className="icone-filtrar"
              onClick={abrirFiltro}
            />

            <span className="texto-filtrar" onClick={abrirFiltro}>
              {" "}
              Filtrar{" "}
            </span>
          </Badge>
        </Col>
      </Row>

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
          <h3 className="filtro-titulo">Níveis</h3>
          {["Abaixo do básico", "Básico", "Adequado", "Avançado"].map(
            (nivel) => (
              <Checkbox
                key={nivel}
                checked={selectedFilters.niveis.includes(nivel)}
                onChange={() => handleFilterChange("niveis", nivel)}
              >
                {nivel}
              </Checkbox>
            )
          )}
        </div>
        <Divider className="separador" />
        <div className="filtro-secao">
          <h3 className="filtro-titulo">Ano letivo</h3>
          {["5º ano", "9º ano"].map((ano) => (
            <Checkbox
              key={ano}
              checked={selectedFilters.anoLetivo.includes(ano)}
              onChange={() => handleFilterChange("anoLetivo", ano)}
            >
              {ano}
            </Checkbox>
          ))}
        </div>
        <Divider className="separador" />
        <div className="filtro-secao">
          <h3 className="filtro-titulo">Componente curricular</h3>
          {["Língua Portuguesa", "Matemática"].map((comp) => (
            <Checkbox
              key={comp}
              checked={selectedFilters.componentesCurriculares.includes(comp)}
              onChange={() =>
                handleFilterChange("componentesCurriculares", comp)
              }
            >
              {comp}
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

      <div className="conteudo-principal">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card title="" variant="borderless">
              <div className="card-escolher-escolas">
                Você pode filtrar por Diretoria Regional de Educação (DRE) ou
                Unidade Educacional (UE).
              </div>
              <Select
                showSearch
                placeholder="Selecione ou digite a DRE ou UE..."
                style={{ width: "100%" }}
                onChange={handleChange}
                value={
                  escolaSelecionada ? escolaSelecionada.descricao : undefined
                }
                notFoundContent="Não encontramos nenhuma DRE ou UE com o nome digitado..."
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={opcoes}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EscolherEscola;
