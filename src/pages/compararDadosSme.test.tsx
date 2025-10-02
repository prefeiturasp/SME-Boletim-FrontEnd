import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import CompararDadosSme from './compararDadosSme';

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => { });
  jest.spyOn(console, "warn").mockImplementation(() => { });
});

// Mock do CSS
jest.mock('./compararDadosDre.css', () => ({}));

// Mock dos componentes Ant Design
jest.mock('antd', () => ({
  Breadcrumb: ({ items, className, ...props }: any) => (
    <nav data-testid="breadcrumb" className={className} {...props}>
      {items?.map((item: any, index: number) => (
        <span key={index} data-testid={`breadcrumb-item-${index}`}>
          {item.title}
        </span>
      ))}
    </nav>
  ),
  Button: ({ children, ...props }: any) => (
    <button data-testid="ant-button" {...props}>{children}</button>
  ),
  Card: ({ children, title, variant, className, ...props }: any) => (
    <div data-testid="ant-card" className={className} data-variant={variant} {...props}>
      {title && <div data-testid="card-title">{title}</div>}
      {children}
    </div>
  ),
  Col: ({ children, span, ...props }: any) => (
    <div data-testid="ant-col" data-span={span} {...props}>{children}</div>
  ),
  Row: ({ children, gutter, ...props }: any) => (
    <div data-testid="ant-row" data-gutter={JSON.stringify(gutter)} {...props}>{children}</div>
  ),
  Select: ({ children, ...props }: any) => (
    <select data-testid="ant-select" {...props}>{children}</select>
  ),
}));

// Mock do Header do Ant Design
jest.mock('antd/es/layout/layout', () => ({
  Header: ({ children, className, ...props }: any) => (
    <header data-testid="ant-header" className={className} {...props}>
      {children}
    </header>
  ),
}));

// Mock dos ícones do Ant Design
jest.mock('@ant-design/icons', () => ({
  ArrowLeftOutlined: ({ className, style, ...props }: any) => (
    <span data-testid="arrow-left-icon" className={className} style={style} {...props}>
      ←
    </span>
  ),
}));

// Mock do useSearchParams para controlar os parâmetros da URL
const mockUseSearchParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => mockUseSearchParams(),
  Link: ({ children, to, className, style, ...props }: any) => (
    <a
      href={to}
      className={className}
      style={style}
      data-testid="react-router-link"
      data-to={to}
      {...props}
    >
      {children}
    </a>
  ),
}));

// Suprimir warnings do console durante os testes
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Wrapper para renderizar com router
const renderWithRouter = (component: React.ReactElement, initialEntries = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      {component}
    </MemoryRouter>
  );
};

describe('CompararDadosDre', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização básica', () => {
    // ... outros testes permanecem iguais ...

    it('renderiza o título principal', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      // Testa cada elemento pelo seu seletor específico
      expect(document.querySelector('.titulo-principal-compara-dre')).toHaveTextContent('Boletim de provas');
      expect(document.querySelector('.titulo-secundario-compara-dre')).toHaveTextContent('Comparativo de resultados');
      expect(screen.getByText('Secretaria Municipal de Educação')).toBeInTheDocument();
    });

    // TESTE ADICIONAL: Para verificar especificamente os elementos duplicados
    it('verifica elementos com texto duplicado', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      // Usa getAllByText para lidar com duplicatas
      const boletimTextos = screen.getAllByText('Boletim de provas');
      expect(boletimTextos).toHaveLength(2);

      // Verifica que um está no título principal e outro no breadcrumb
      const tituloBoletim = boletimTextos.find(el =>
        el.classList.contains('titulo-principal-compara-dre')
      );
      const breadcrumbBoletim = boletimTextos.find(el =>
        el.getAttribute('data-testid') === 'breadcrumb-item-2'
      );

      expect(tituloBoletim).toBeInTheDocument();
      expect(breadcrumbBoletim).toBeInTheDocument();
    });

    it('renderiza o texto descritivo', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      expect(screen.getByText(/Aqui, você pode acompanhar a evolução do nível/)).toBeInTheDocument();
      expect(screen.getByText(/proficiência da SME nas diferentes aplicações/)).toBeInTheDocument();
    });
  });

  describe('Links de navegação', () => {
    it('renderiza o link de retorno com URL correta', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      // ALTERNATIVA: Usa querySelector com classe específica
      const linkRetorno = document.querySelector('.retornar-compara-dre');

      expect(linkRetorno).toBeInTheDocument();
      expect(linkRetorno).toHaveAttribute('data-to', 'https://serap.sme.prefeitura.sp.gov.br/');
      expect(linkRetorno).toHaveAttribute('href', 'https://serap.sme.prefeitura.sp.gov.br/');
    });

    it('renderiza o link "Voltar a tela anterior"', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      // ALTERNATIVA: Usa querySelector com classe específica
      const linkVoltarUes = document.querySelector('.botao-voltar-ues');

      expect(linkVoltarUes).toBeInTheDocument();
      expect(linkVoltarUes).toHaveAttribute('data-to', '/ues');
      expect(linkVoltarUes).toHaveAttribute('href', '/ues');
      expect(screen.getByText('Voltar a tela anterior')).toBeInTheDocument();
    });

    it('renderiza texto do link de retorno', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      expect(screen.getByText('Retornar à tela inicial')).toBeInTheDocument();
    });
  });

  describe('Ícones', () => {
    it('renderiza os ícones ArrowLeftOutlined', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      const icones = screen.getAllByTestId('arrow-left-icon');
      expect(icones).toHaveLength(2);

      // Verifica que cada ícone existe e tem conteúdo
      icones.forEach(icone => {
        expect(icone).toBeInTheDocument();
        expect(icone.textContent).toBe('←');
      });
    });

    it('ícones são renderizados corretamente', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      const icones = screen.getAllByTestId('arrow-left-icon');

      // Verifica propriedades básicas
      expect(icones.length).toBeGreaterThan(0);

      icones.forEach(icone => {
        expect(icone).toBeInTheDocument();
        expect(icone).toHaveAttribute('data-testid', 'arrow-left-icon');
      });

      // Verifica se pelo menos um tem classe ou style
      const temPropriedades = icones.some(icone =>
        icone.className.length > 0 ||
        (icone.getAttribute('style') && icone.getAttribute('style')!.length > 0)
      );

      expect(temPropriedades).toBe(true);
    });
  });

  describe('Breadcrumb', () => {
    it('renderiza todos os itens do breadcrumb', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      expect(screen.getByTestId('breadcrumb-item-0')).toHaveTextContent('Home');
      expect(screen.getByTestId('breadcrumb-item-1')).toHaveTextContent('Provas');
      expect(screen.getByTestId('breadcrumb-item-2')).toHaveTextContent('Boletim de provas');
      expect(screen.getByTestId('breadcrumb-item-3')).toHaveTextContent('Comparativo de Resultados');
    });

    it('aplica classe CSS correta no breadcrumb', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      expect(screen.getByTestId('breadcrumb')).toHaveClass('breadcrumb-compara-dre');
    });
  });

  describe('useSearchParams', () => {
    it('chama useSearchParams corretamente', () => {
      const mockGet = jest.fn()
        .mockReturnValueOnce('dre123')
        .mockReturnValueOnce('DRE Norte');

      mockUseSearchParams.mockReturnValue([{ get: mockGet }]);

      renderWithRouter(<CompararDadosSme />);

      expect(mockGet).toHaveBeenCalledWith('dreUrlSelecionada');
      expect(mockGet).toHaveBeenCalledWith('dreSelecionadaNome');
      expect(mockGet).toHaveBeenCalledTimes(2);
    });

    it('usa valores padrão quando parâmetros são null', () => {
      const mockGet = jest.fn().mockReturnValue(null);
      mockUseSearchParams.mockReturnValue([{ get: mockGet }]);

      renderWithRouter(<CompararDadosSme />);

      expect(mockGet).toHaveBeenCalledWith('dreUrlSelecionada');
      expect(mockGet).toHaveBeenCalledWith('dreSelecionadaNome');
    });

    it('usa valores padrão quando parâmetros são undefined', () => {
      const mockGet = jest.fn().mockReturnValue(undefined);
      mockUseSearchParams.mockReturnValue([{ get: mockGet }]);

      renderWithRouter(<CompararDadosSme />);

      // O componente deve renderizar normalmente mesmo com undefined
      expect(screen.getByText('Secretaria Municipal de Educação')).toBeInTheDocument();
    });

    it('funciona com parâmetros de URL válidos', () => {
      const mockGet = jest.fn()
        .mockImplementation((param) => {
          if (param === 'dreUrlSelecionada') return 'dre-centro';
          if (param === 'dreSelecionadaNome') return 'DRE Centro';
          return null;
        });

      mockUseSearchParams.mockReturnValue([{ get: mockGet }]);

      renderWithRouter(<CompararDadosSme />);

      expect(screen.getByText('Secretaria Municipal de Educação')).toBeInTheDocument();
      expect(mockGet).toHaveBeenCalledWith('dreUrlSelecionada');
      expect(mockGet).toHaveBeenCalledWith('dreSelecionadaNome');
    });
  });

  describe('Classes CSS', () => {
    it('aplica todas as classes CSS corretas', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      // Verifica classes principais
      expect(document.querySelector('.app-container')).toBeInTheDocument();
      expect(screen.getByTestId('ant-header')).toHaveClass('cabecalho-compara-dre');
      expect(document.querySelector('.linha-superior-compara-dre')).toBeInTheDocument();
      expect(document.querySelector('.barra-azul-compara-dre')).toBeInTheDocument();
      expect(document.querySelector('.conteudo-principal-dres')).toBeInTheDocument();
      expect(document.querySelector('.titulo-ue-sme')).toBeInTheDocument();
      expect(document.querySelector('.ajustes-padding-cards')).toBeInTheDocument();
    });

    it('aplica classes específicas dos links', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      const links = screen.getAllByTestId('react-router-link');

      expect(links[0]).toHaveClass('retornar-compara-dre');
      expect(links[1]).toHaveClass('botao-voltar-ues');
    });

    it('aplica classes dos textos', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      expect(document.querySelector('.texto-retorno-compara-dre')).toBeInTheDocument();
      expect(document.querySelector('.titulo-principal-compara-dre')).toBeInTheDocument();
      expect(document.querySelector('.titulo-secundario-compara-dre')).toBeInTheDocument();
      expect(document.querySelector('.global-texto-padrao')).toBeInTheDocument();
    });
  });

  describe('Atributos e props', () => {
    it('aplica props corretas no Row com gutter', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      const rows = screen.getAllByTestId('ant-row');
      const rowComGutter = rows.find(row =>
        row.getAttribute('data-gutter') === '[16,16]'
      );
      expect(rowComGutter).toBeInTheDocument();
    });

    it('aplica span correto no Col', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      expect(screen.getByTestId('ant-col')).toHaveAttribute('data-span', '24');
    });

    it('aplica props corretas no Card', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      const card = screen.getByTestId('ant-card');
      expect(card).toHaveAttribute('data-variant', 'borderless');
      expect(card).toHaveClass('card-body-dre');
    });

    it('aplica estilos inline corretos', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      // Verifica estilos do h2
      const titulo = screen.getByText('Secretaria Municipal de Educação');
      expect(titulo).toHaveStyle({ fontSize: '24px' });

      // Verifica estilos do parágrafo
      const paragrafo = screen.getByText(/Aqui, você pode acompanhar/);
      expect(paragrafo).toHaveStyle({
        marginTop: '0px',
        marginBottom: '16px'
      });
    });
  });

  describe('Interações', () => {
    it('permite clicar nos links', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      const links = screen.getAllByTestId('react-router-link');

      // Simula clique nos links
      fireEvent.click(links[0]);
      fireEvent.click(links[1]);

      // Verifica se os links ainda estão presentes após o clique
      expect(links[0]).toBeInTheDocument();
      expect(links[1]).toBeInTheDocument();
    });

    it('permite hover nos elementos', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      const boletimTexts = screen.getAllByText('Boletim de provas');
      const tituloPrincipal = boletimTexts.find(el =>
        el.classList.contains('titulo-principal-compara-dre')
      );

      if (tituloPrincipal) {
        fireEvent.mouseEnter(tituloPrincipal);
        fireEvent.mouseLeave(tituloPrincipal);
        expect(tituloPrincipal).toBeInTheDocument();
      }
    });
  });

  describe('Integração com diferentes rotas', () => {
    it('funciona quando renderizado em rota específica', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />, ['/comparar-dados-dre']);

      expect(screen.getByText('Secretaria Municipal de Educação')).toBeInTheDocument();
    });

    it('funciona com parâmetros de query string', () => {
      const mockGet = jest.fn()
        .mockImplementation((param) => {
          if (param === 'dreUrlSelecionada') return 'dre-test';
          if (param === 'dreSelecionadaNome') return 'DRE Teste';
          return null;
        });

      mockUseSearchParams.mockReturnValue([{ get: mockGet }]);

      renderWithRouter(<CompararDadosSme />, ['/comparar-dados-dre?dreUrlSelecionada=dre-test&dreSelecionadaNome=DRE%20Teste']);

      expect(screen.getByText('Secretaria Municipal de Educação')).toBeInTheDocument();
    });
  });

  describe('Casos extremos', () => {
    it('funciona quando useSearchParams retorna função que lança erro', () => {
      const mockGet = jest.fn().mockImplementation(() => {
        throw new Error('Erro simulado');
      });

      mockUseSearchParams.mockReturnValue([{ get: mockGet }]);

      // Deve renderizar sem errar mesmo com erro no searchParams
      expect(() => {
        renderWithRouter(<CompararDadosSme />);
      }).not.toThrow();
    });

    it('funciona com strings vazias nos parâmetros', () => {
      const mockGet = jest.fn().mockReturnValue('');
      mockUseSearchParams.mockReturnValue([{ get: mockGet }]);

      renderWithRouter(<CompararDadosSme />);

      expect(screen.getByText('Secretaria Municipal de Educação')).toBeInTheDocument();
    });

    it('funciona com parâmetros muito longos', () => {
      const mockGet = jest.fn()
        .mockImplementation((param) => {
          if (param === 'dreUrlSelecionada') return 'a'.repeat(1000);
          if (param === 'dreSelecionadaNome') return 'b'.repeat(1000);
          return null;
        });

      mockUseSearchParams.mockReturnValue([{ get: mockGet }]);

      renderWithRouter(<CompararDadosSme />);

      expect(screen.getByText('Secretaria Municipal de Educação')).toBeInTheDocument();
    });
  });

  describe('Acessibilidade', () => {
    it('renderiza elementos com roles adequados', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      // Verifica se há elementos header
      expect(screen.getByTestId('ant-header')).toBeInTheDocument();

      // Verifica se há navegação (breadcrumb)
      expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    });

    it('todos os links têm texto descritivo', () => {
      mockUseSearchParams.mockReturnValue([
        {
          get: jest.fn().mockReturnValue(null),
        },
      ]);

      renderWithRouter(<CompararDadosSme />);

      const links = screen.getAllByTestId('react-router-link');

      links.forEach(link => {
        expect(link.textContent).toBeTruthy();
        expect(link.textContent!.trim().length).toBeGreaterThan(0);
      });
    });
  });
});