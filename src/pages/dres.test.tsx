import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import DresPage, { estiloNivel } from "./dres";

// ====== Mocks base ======
jest.mock("antd", () => {
  const actual = jest.requireActual("antd");
  // Evita warnings e complexidades internas do Select/Card/Tooltip
  return {
    ...actual,
    Select: ({ options = [], value, onChange, ...props }: any) => (
      <select
        data-testid={props["data-testid"] || "antd-select"}
        value={value ?? ""}
        onChange={(e) => onChange?.(Number(e.target.value) || undefined)}
      >
        <option value="" />
        {options.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    ),
    Card: ({ children, ...rest }: any) => <div data-testid="antd-card" {...rest}>{children}</div>,
    Tooltip: ({ children }: any) => <>{children}</>,
    Layout: ({ children }: any) => <div>{children}</div>,
    Row: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
    Col: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
    Button: ({ children, onClick, disabled, ...rest }: any) => (
      <button onClick={onClick} disabled={disabled} {...rest}>
        {children}
      </button>
    ),
    Breadcrumb: ({ children }: any) => <nav>{children}</nav>,
    Pagination: (props: any) => <div data-testid="pagination" {...props} />,
  };
});

const mockDispatch = jest.fn();
let mockState = {
  nomeAplicacao: { id: undefined, nome: "", tipoTai: true, dataInicioLote: new Date().toISOString() },
} as any;

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
  useSelector: (sel: any) => sel(mockState),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children, to, ...rest }: any) => <a href={typeof to === "string" ? to : "#"} {...rest}>{children}</a>,
}));

// imagens e css
// jest.mock("../assets/Imagem_fluxo_DRE_2.jpg", () => "imagem.jpg");
// jest.mock("../assets/icon-port.svg", () => "port.svg");
// jest.mock("../assets/icon-mat.svg", () => "mat.svg");
// jest.mock("../assets/icon-alunos.svg", () => "alunos.svg");
// jest.mock("../assets/icon-dados.svg", () => "dados.svg");
// jest.mock("../assets/icon-mais.svg", () => "mais.svg");
// jest.mock("../assets/icon-ue.svg", () => "ue.svg");
jest.mock("./DresPage.css", () => ({}));
jest.mock("./ues_dres.css", () => ({}));

// componentes filhos pesados -> mocks simples
jest.mock("../componentes/grafico/desempenhoPorMateria", () => () => <div data-testid="grafico-materia" />);
jest.mock("../componentes/grafico/desempenhoPorMediaProficiencia", () => () => <div data-testid="grafico-media" />);
jest.mock("../componentes/relatorio/relatorioAlunosPorDres", () => () => <div data-testid="relatorio-dres" />);

// ====== Mock de servicos.get com roteamento por URL ======
const getMock = jest.fn((url: string) => {
  // buscarAplicacoes
  if (url.includes("/api/boletimescolar/aplicacoes-prova")) {
    return Promise.resolve([
      { id: 10, nome: "Prova Municipal 2025", tipoTai: true, dataInicioLote: "2025-03-01T00:00:00Z" },
      { id: 11, nome: "Prova Diagnóstica 2025", tipoTai: false, dataInicioLote: "2025-02-01T00:00:00Z" },
    ]);
  }

  // buscarAnos
  if (url.match(/\/api\/boletimescolar\/\d+\/anos-escolares/i)) {
    return Promise.resolve([
      { ano: 3, descricao: "3º ano" },
      { ano: 5, descricao: "5º ano" },
    ]);
  }

  // buscarDres (lista para selects iniciais)
  if (url.endsWith("/api/Abrangencia/dres")) {
    return Promise.resolve([
      { id: 101, nome: "DRE Campo Limpo" },
      { id: 102, nome: "DRE Ipiranga" },
    ]);
  }

  // buscarResumoDre
  if (url.match(/\/api\/BoletimEscolar\/\d+\/\d+\/resumo-sme/i)) {
    return Promise.resolve({
      totalDres: 13,
      totalUes: 1245,
      totalAlunos: 45321,
      proficienciaDisciplina: [
        { disciplinaNome: "Língua portuguesa", mediaProficiencia: 238.7 },
        { disciplinaNome: "Matemática", mediaProficiencia: 242.2 },
      ],
    });
  }

  // buscarUes (no seu código retorna DREs/labels para o multiselect)
  if (url.match(/\/api\/BoletimEscolar\/\d+\/\d+\/dres$/i)) {
    return Promise.resolve([
      { dreId: 101, dreNome: "DRE Campo Limpo" },
      { dreId: 102, dreNome: "DRE Ipiranga" },
    ]);
  }

  // buscaDesempenhoPorMateria
  if (url.match(/\/api\/boletimescolar\/\d+\/\d+\/grafico\/niveis-proficiencia-disciplina/i)) {
    return Promise.resolve({ disciplinas: [] });
  }

  // buscaDesempenhoPorMediaProficiencia
  if (url.match(/\/api\/BoletimEscolar\/\d+\/ano-escolar\/\d+\/grafico\/media-proficiencia/i)) {
    return Promise.resolve([]);
  }

  // fetchDresListagem
  if (url.match(/\/api\/BoletimEscolar\/\d+\/\d+\/dres\/proficiencia/i)) {
    // Simula 1ª chamada com 2 itens e total 3, e 2ª chamada (Exibir mais) com +1
    const calls = getMock.mock.calls.filter(([u]: any) => u.includes("/dres/proficiencia")).length;
    if (calls <= 1) {
      return Promise.resolve({
        itens: [
          {
            dreId: 101,
            dreNome: "DRE Campo Limpo",
            anoEscolar: 3,
            totalUes: 100,
            totalAlunos: 10000,
            totalRealizaramProva: 9000,
            percentualParticipacao: 90,
            disciplinas: [
              {
                disciplina: "Língua portuguesa",
                nivelProficiencia: "Básico",
                mediaProficiencia: 240.12,
              },
            ],
          },
          {
            dreId: 102,
            dreNome: "DRE Ipiranga",
            anoEscolar: 5,
            totalUes: 80,
            totalAlunos: 7000,
            totalRealizaramProva: 6500,
            percentualParticipacao: 92,
            disciplinas: [], // sem disciplinas -> cartão “sem dados”
          },
        ],
        totalTipoDisciplina: 3,
      });
    } else {
      return Promise.resolve({
        itens: [
          {
            dreId: 103,
            dreNome: "DRE Pirituba",
            anoEscolar: 5,
            totalUes: 60,
            totalAlunos: 5000,
            totalRealizaramProva: 4500,
            percentualParticipacao: 90,
            disciplinas: [
              {
                disciplina: "Matemática",
                nivelProficiencia: "Adequado",
                mediaProficiencia: 250.5,
              },
            ],
          },
        ],
        totalTipoDisciplina: 3,
      });
    }
  }

  // fallback
  return Promise.resolve([]);
});

jest.mock("../servicos", () => ({
  servicos: {
    get: (url: string) => getMock(url),
  },
}));

// ====== Helpers ======
function renderPage() {
  // estado inicial do slice (useSelector)
  mockState = {
    nomeAplicacao: { id: undefined, nome: "", tipoTai: true, dataInicioLote: new Date().toISOString() },
  };
  mockDispatch.mockClear();
  mockNavigate.mockClear();
  getMock.mockClear();
  return render(<DresPage />);
}

// ====== Testes unitários da função estiloNivel ======
describe("estiloNivel", () => {
  it("retorna estilos corretos para níveis conhecidos", () => {
    expect(estiloNivel("Adequado").background).toMatch(/153/);
    expect(estiloNivel("Básico").background).toMatch(/254,222,153/);
    expect(estiloNivel("Abaixo do básico").background).toMatch(/255,89,89/);
    expect(estiloNivel("Avançado").background).toMatch(/153, 255, 153/);
  });

  it("retorna estilo padrão quando nível é vazio ou desconhecido", () => {
    expect(estiloNivel("").background).toBe("#f0f0f0");
    expect(estiloNivel("Desconhecido").background).toBe("#f0f0f0");
  });
});

// ====== Testes de integração do componente ======
describe("DresPage", () => {
  beforeAll(() => {
    // evita erro do scroll
    // @ts-ignore
    window.scrollTo = jest.fn();
  });

  it("renderiza cabeçalho e carrega dados iniciais (aplicações, anos, DREs, resumo)", async () => {
    renderPage();

    // Cabeçalho
    expect(screen.getAllByText(/Boletim de Provas/i)[0]).toBeInTheDocument();

    // Aguarda o resumo ser carregado
    await waitFor(() => {
      expect(screen.getByText(/Secretaria Municipal de Educação/i)).toBeInTheDocument();
      expect(screen.getByText("DREs")).toBeInTheDocument();
    });

    // Totais do resumo
    expect(screen.getByText("13")).toBeInTheDocument(); // totalDres
    expect(screen.getByText("1245")).toBeInTheDocument(); // totalUes
    expect(screen.getByText("45321")).toBeInTheDocument(); // totalAlunos

    // Dispatch chamado para setar a primeira aplicação na montagem
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("monta lista de cartões de DRE: um com disciplinas e outro 'sem dados'", async () => {
    renderPage();

    // 2 itens da primeira chamada
    await waitFor(() => {
      expect(screen.getByText("DRE Campo Limpo")).toBeInTheDocument();
      expect(screen.getByText("DRE Ipiranga")).toBeInTheDocument();
    });

    // cartão com disciplinas deve ter “Média de proficiência”
    expect(screen.getAllByText(/Média de proficiência/i).length).toBeGreaterThan(0);

    // cartão “sem dados”
    expect(screen.getByText(/Não há dados cadastrados/i)).toBeInTheDocument();

    // Botão “Acessar DRE” do cartão sem disciplinas deve estar desabilitado
    const buttons = screen.getAllByRole("button", { name: /Acessar DRE/i });
    const btnCampoLimpo = buttons[0];
    const btnIpiranga = buttons[1];

    expect(btnCampoLimpo).toBeEnabled();
    expect(btnIpiranga).toBeDisabled();
  });

  it("navega para página de UEs ao clicar em 'Acessar DRE' quando habilitado", async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("DRE Campo Limpo")).toBeInTheDocument();
    });

    const btns = screen.getAllByRole("button", { name: /Acessar DRE/i });
    fireEvent.click(btns[0]); // DRE Campo Limpo (tem disciplinas)

    expect(mockNavigate).toHaveBeenCalledWith("/ues?dreUrlSelecionada=101");
  });

  it("mostra 'Exibir mais' quando há mais itens e faz append ao clicar", async () => {
    renderPage();

    // depois da primeira chamada, dresTotal=3 e renderizamos 2 -> aparece o botão
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Exibir mais/i })).toBeInTheDocument();
    });

    // clica para carregar mais (segunda chamada devolve +1 item: DRE Pirituba)
    fireEvent.click(screen.getByRole("button", { name: /Exibir mais/i }));

    await waitFor(() => {
      expect(screen.getByText("DRE Pirituba")).toBeInTheDocument();
    });

    // Total de cartões agora = 3
    expect(screen.getAllByText(/Acessar DRE/i)).toHaveLength(3);
  });

  it("botão 'Voltar para o Início' chama window.scrollTo", async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Voltar para o Início/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Voltar para o Início/i }));
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});
