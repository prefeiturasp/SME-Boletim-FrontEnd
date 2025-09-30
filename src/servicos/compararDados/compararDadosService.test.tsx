import { 
  getComparativoAlunoUe,
  getAnosAplicacaoDre,
  getComponentesCurricularesDre,
  getAnosEscolaresUe,
  getDadosTabela,
  getComporativoUe,
  getListaUes
} from './compararDadosService';
import { servicos } from '../../servicos';

// Mock do módulo de serviços
jest.mock('../../servicos', () => ({
  servicos: {
    get: jest.fn(),
  },
}));

// Type assertion para o mock
const mockServicos = servicos as jest.Mocked<typeof servicos>;

// Limpa os mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
});

describe('compararDadosService', () => {
  
  describe('getComparativoAlunoUe', () => {
    it('chama a API com a URL correta incluindo todos os parâmetros', async () => {
      const mockResponse = [
        { aluno: 'João', nota: 8.5 },
        { aluno: 'Maria', nota: 9.0 },
      ];
      
      mockServicos.get.mockResolvedValueOnce(mockResponse);

      const ueId = 123;
      const disciplinaId = 1;
      const anoEscolar = 5;
      const turma = 'A';
      const loteId = 'lote2025';
      
      const resultado = await getComparativoAlunoUe(ueId, disciplinaId, anoEscolar, turma, loteId);

      expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/comparativo-aluno-ue/123/1/5/A/lote2025');
      expect(mockServicos.get).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(mockResponse);
    });

    it('constrói URL corretamente com diferentes combinações de parâmetros', async () => {
      const mockResponse: any[] = [];
      mockServicos.get.mockResolvedValue(mockResponse);

      const testCases = [
        { ueId: 100, disciplinaId: 1, anoEscolar: 5, turma: 'A', loteId: 'lote1', expectedUrl: '/api/BoletimEscolar/comparativo-aluno-ue/100/1/5/A/lote1' },
        { ueId: 200, disciplinaId: 2, anoEscolar: 9, turma: 'B', loteId: 'lote2', expectedUrl: '/api/BoletimEscolar/comparativo-aluno-ue/200/2/9/B/lote2' },
        { ueId: 300, disciplinaId: 10, anoEscolar: 3, turma: 'C1', loteId: 'lote2025', expectedUrl: '/api/BoletimEscolar/comparativo-aluno-ue/300/10/3/C1/lote2025' },
      ];

      for (const testCase of testCases) {
        mockServicos.get.mockClear();
        
        await getComparativoAlunoUe(testCase.ueId, testCase.disciplinaId, testCase.anoEscolar, testCase.turma, testCase.loteId);
        
        expect(mockServicos.get).toHaveBeenCalledWith(testCase.expectedUrl);
        expect(mockServicos.get).toHaveBeenCalledTimes(1);
      }
    });

    it('retorna dados do comparativo aluno-ue', async () => {
      const dadosEsperados = [
        { alunoId: 1, nome: 'João Silva', proficiencia: 245.5 },
        { alunoId: 2, nome: 'Maria Santos', proficiencia: 280.3 },
      ];
      
      mockServicos.get.mockResolvedValueOnce(dadosEsperados);

      const resultado = await getComparativoAlunoUe(123, 1, 5, 'A', 'lote2025');

      expect(resultado).toEqual(dadosEsperados);
      expect(Array.isArray(resultado)).toBe(true);
      expect(resultado).toHaveLength(2);
    });

    it('propaga erro quando a API falha', async () => {
      const erro = new Error('Erro na API');
      mockServicos.get.mockRejectedValueOnce(erro);

      await expect(getComparativoAlunoUe(123, 1, 5, 'A', 'lote2025'))
        .rejects
        .toThrow('Erro na API');
        
      expect(mockServicos.get).toHaveBeenCalledTimes(1);
    });

    it('funciona com diferentes tipos de parâmetros string', async () => {
      mockServicos.get.mockResolvedValue([]);

      const testCases = [
        { turma: 'A', loteId: 'lote2025' },
        { turma: '1A', loteId: 'LOTE_ESPECIAL' },
        { turma: '', loteId: '' },
        { turma: '123', loteId: 'test-lote' },
      ];

      for (const testCase of testCases) {
        mockServicos.get.mockClear();
        await getComparativoAlunoUe(123, 1, 5, testCase.turma, testCase.loteId);
        
        expect(mockServicos.get).toHaveBeenCalledWith(`/api/BoletimEscolar/comparativo-aluno-ue/123/1/5/${testCase.turma}/${testCase.loteId}`);
      }
    });

    it('lida com resposta vazia da API', async () => {
      mockServicos.get.mockResolvedValueOnce([]);

      const resultado = await getComparativoAlunoUe(123, 1, 5, 'A', 'lote2025');

      expect(resultado).toEqual([]);
      expect(Array.isArray(resultado)).toBe(true);
      expect(resultado).toHaveLength(0);
    });
  });

  describe('getAnosAplicacaoDre', () => {
    it('chama a API com a URL correta incluindo dreId', async () => {
      const mockResponse = [
        { ano: 2025, descricao: '2025' },
        { ano: 2024, descricao: '2024' },
      ];
      
      mockServicos.get.mockResolvedValueOnce(mockResponse);

      const dreId = 456;
      const resultado = await getAnosAplicacaoDre(dreId);

      expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/anos-aplicacao-dre/456');
      expect(mockServicos.get).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(mockResponse);
    });

    it('usa corretamente o dreId na URL', async () => {
      mockServicos.get.mockResolvedValue([]);

      const dreIds = [1, 100, 999, 0];
      
      for (const dreId of dreIds) {
        mockServicos.get.mockClear();
        await getAnosAplicacaoDre(dreId);
        
        expect(mockServicos.get).toHaveBeenCalledWith(`/api/BoletimEscolar/anos-aplicacao-dre/${dreId}`);
        expect(mockServicos.get).toHaveBeenCalledTimes(1);
      }
    });

    it('propaga erro quando a API falha', async () => {
      const erro = new Error('Erro 404');
      mockServicos.get.mockRejectedValueOnce(erro);

      await expect(getAnosAplicacaoDre(789))
        .rejects
        .toThrow('Erro 404');
    });

    it('lida com resposta null da API', async () => {
      mockServicos.get.mockResolvedValueOnce(null);

      const resultado = await getAnosAplicacaoDre(123);

      expect(resultado).toBeNull();
    });
  });

  describe('getComponentesCurricularesDre', () => {
    it('chama a API com a URL correta incluindo dreId e anoAplicacao', async () => {
      const mockResponse = [
        { id: 1, nome: 'Língua Portuguesa' },
        { id: 2, nome: 'Matemática' },
      ];
      
      mockServicos.get.mockResolvedValueOnce(mockResponse);

      const dreId = 123;
      const anoAplicacao = 2025;
      const resultado = await getComponentesCurricularesDre(dreId, anoAplicacao);

      expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/componentes-curriculares-dre/123/2025');
      expect(mockServicos.get).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(mockResponse);
    });

    it('constrói URL corretamente com diferentes parâmetros', async () => {
      mockServicos.get.mockResolvedValue([]);

      const testCases = [
        { dreId: 100, anoAplicacao: 2025, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-dre/100/2025' },
        { dreId: 200, anoAplicacao: 2024, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-dre/200/2024' },
        { dreId: 0, anoAplicacao: 0, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-dre/0/0' },
      ];

      for (const testCase of testCases) {
        mockServicos.get.mockClear();
        
        await getComponentesCurricularesDre(testCase.dreId, testCase.anoAplicacao);
        
        expect(mockServicos.get).toHaveBeenCalledWith(testCase.expectedUrl);
        expect(mockServicos.get).toHaveBeenCalledTimes(1);
      }
    });

    it('retorna dados dos componentes curriculares', async () => {
      const dadosEsperados = [
        { id: 1, nome: 'Língua Portuguesa', codigo: 'LP' },
        { id: 2, nome: 'Matemática', codigo: 'MAT' },
      ];
      
      mockServicos.get.mockResolvedValueOnce(dadosEsperados);

      const resultado = await getComponentesCurricularesDre(123, 2025);

      expect(resultado).toEqual(dadosEsperados);
      expect(Array.isArray(resultado)).toBe(true);
      expect(resultado).toHaveLength(2);
    });

    it('propaga erro quando a API falha', async () => {
      const erro = new Error('Erro 500');
      mockServicos.get.mockRejectedValueOnce(erro);

      await expect(getComponentesCurricularesDre(123, 2025))
        .rejects
        .toThrow('Erro 500');
    });
  });

  describe('getAnosEscolaresUe', () => {
    it('chama a API com a URL correta incluindo todos os parâmetros', async () => {
      const mockResponse = [
        { ano: 5, descricao: '5º ano' },
        { ano: 9, descricao: '9º ano' },
      ];
      
      mockServicos.get.mockResolvedValueOnce(mockResponse);

      const dreId = 123;
      const anoAplicacao = 2025;
      const disciplinaId = 1;
      const resultado = await getAnosEscolaresUe(dreId, anoAplicacao, disciplinaId);

      expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/anos-escolares-dre/123/2025/1');
      expect(mockServicos.get).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(mockResponse);
    });

    it('constrói URL corretamente com diferentes combinações', async () => {
      mockServicos.get.mockResolvedValue([]);

      const testCases = [
        { dreId: 100, anoAplicacao: 2025, disciplinaId: 1, expectedUrl: '/api/BoletimEscolar/anos-escolares-dre/100/2025/1' },
        { dreId: 200, anoAplicacao: 2024, disciplinaId: 2, expectedUrl: '/api/BoletimEscolar/anos-escolares-dre/200/2024/2' },
        { dreId: 0, anoAplicacao: 0, disciplinaId: 0, expectedUrl: '/api/BoletimEscolar/anos-escolares-dre/0/0/0' },
      ];

      for (const testCase of testCases) {
        mockServicos.get.mockClear();
        
        await getAnosEscolaresUe(testCase.dreId, testCase.anoAplicacao, testCase.disciplinaId);
        
        expect(mockServicos.get).toHaveBeenCalledWith(testCase.expectedUrl);
        expect(mockServicos.get).toHaveBeenCalledTimes(1);
      }
    });

    it('propaga erro quando a API falha', async () => {
      const erro = new Error('Erro 404');
      mockServicos.get.mockRejectedValueOnce(erro);

      await expect(getAnosEscolaresUe(123, 2025, 1))
        .rejects
        .toThrow('Erro 404');
    });
  });

  describe('getDadosTabela', () => {
    it('chama a API com a URL correta incluindo todos os parâmetros', async () => {
      const mockResponse = [
        { dre: 'DRE Centro', media: 245.5 },
        { dre: 'DRE Norte', media: 230.2 },
      ];
      
      mockServicos.get.mockResolvedValueOnce(mockResponse);

      const dreId = 123;
      const anoAplicacao = 2025;
      const disciplinaId = 1;
      const anoEscolar = 5;
      const resultado = await getDadosTabela(dreId, anoAplicacao, disciplinaId, anoEscolar);

      expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/dres-comparacao-por-dre/123/2025/1/5');
      expect(mockServicos.get).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(mockResponse);
    });

    it('constrói URL corretamente com diferentes parâmetros', async () => {
      mockServicos.get.mockResolvedValue([]);

      const testCases = [
        { dreId: 100, anoAplicacao: 2025, disciplinaId: 1, anoEscolar: 5, expectedUrl: '/api/BoletimEscolar/dres-comparacao-por-dre/100/2025/1/5' },
        { dreId: 200, anoAplicacao: 2024, disciplinaId: 2, anoEscolar: 9, expectedUrl: '/api/BoletimEscolar/dres-comparacao-por-dre/200/2024/2/9' },
      ];

      for (const testCase of testCases) {
        mockServicos.get.mockClear();
        
        await getDadosTabela(testCase.dreId, testCase.anoAplicacao, testCase.disciplinaId, testCase.anoEscolar);
        
        expect(mockServicos.get).toHaveBeenCalledWith(testCase.expectedUrl);
        expect(mockServicos.get).toHaveBeenCalledTimes(1);
      }
    });

    it('propaga erro quando a API falha', async () => {
      const erro = new Error('Erro 500');
      mockServicos.get.mockRejectedValueOnce(erro);

      await expect(getDadosTabela(123, 2025, 1, 5))
        .rejects
        .toThrow('Erro 500');
    });
  });

  describe('getComporativoUe', () => {
    it('chama a API com a URL correta incluindo query parameters', async () => {
      const mockResponse = [
        { ue: 'Escola A', media: 245.5 },
        { ue: 'Escola B', media: 230.2 },
      ];
      
      mockServicos.get.mockResolvedValueOnce(mockResponse);

      const dreId = 123;
      const disciplinaId = 1;
      const anoLetivo = 2025;
      const anoEscolar = 5;
      const limite = 10;
      const ueId = 'ue123';
      
      const resultado = await getComporativoUe(dreId, disciplinaId, anoLetivo, anoEscolar, limite, ueId);

      expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/comparativo-ue/123/1/2025/5?pagina=1&itensPorPagina=10&ueId=ue123');
      expect(mockServicos.get).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(mockResponse);
    });

    it('constrói URL com query parameters corretamente', async () => {
      mockServicos.get.mockResolvedValue([]);

      const testCases = [
        { 
          dreId: 100, disciplinaId: 1, anoLetivo: 2025, anoEscolar: 5, limite: 20, ueId: 'ue100',
          expectedUrl: '/api/BoletimEscolar/comparativo-ue/100/1/2025/5?pagina=1&itensPorPagina=20&ueId=ue100'
        },
        { 
          dreId: 200, disciplinaId: 2, anoLetivo: 2024, anoEscolar: 9, limite: 50, ueId: 'escola-teste',
          expectedUrl: '/api/BoletimEscolar/comparativo-ue/200/2/2024/9?pagina=1&itensPorPagina=50&ueId=escola-teste'
        },
      ];

      for (const testCase of testCases) {
        mockServicos.get.mockClear();
        
        await getComporativoUe(testCase.dreId, testCase.disciplinaId, testCase.anoLetivo, testCase.anoEscolar, testCase.limite, testCase.ueId);
        
        expect(mockServicos.get).toHaveBeenCalledWith(testCase.expectedUrl);
        expect(mockServicos.get).toHaveBeenCalledTimes(1);
      }
    });

    it('funciona com diferentes valores de ueId string', async () => {
      mockServicos.get.mockResolvedValue([]);

      const testCases = ['ue123', 'ESCOLA_ESPECIAL', '', '123-abc', 'ue com espaços'];

      for (const ueId of testCases) {
        mockServicos.get.mockClear();
        await getComporativoUe(123, 1, 2025, 5, 10, ueId);
        
        expect(mockServicos.get).toHaveBeenCalledWith(`/api/BoletimEscolar/comparativo-ue/123/1/2025/5?pagina=1&itensPorPagina=10&ueId=${ueId}`);
      }
    });

    it('propaga erro quando a API falha', async () => {
      const erro = new Error('Erro 404');
      mockServicos.get.mockRejectedValueOnce(erro);

      await expect(getComporativoUe(123, 1, 2025, 5, 10, 'ue123'))
        .rejects
        .toThrow('Erro 404');
    });
  });

  describe('getListaUes', () => {
    it('chama a API com a URL correta incluindo todos os parâmetros', async () => {
      const mockResponse = [
        { ueId: 1, nome: 'Escola Municipal A' },
        { ueId: 2, nome: 'Escola Municipal B' },
      ];
      
      mockServicos.get.mockResolvedValueOnce(mockResponse);

      const dreId = 123;
      const anoAplicacao = 2025;
      const disciplinaId = 1;
      const anoEscolar = 5;
      const resultado = await getListaUes(dreId, anoAplicacao, disciplinaId, anoEscolar);

      expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/ues-comparacao-por-dre/123/2025/1/5');
      expect(mockServicos.get).toHaveBeenCalledTimes(1);
      expect(resultado).toEqual(mockResponse);
    });

    it('constrói URL corretamente com diferentes parâmetros', async () => {
      mockServicos.get.mockResolvedValue([]);

      const testCases = [
        { dreId: 100, anoAplicacao: 2025, disciplinaId: 1, anoEscolar: 5, expectedUrl: '/api/BoletimEscolar/ues-comparacao-por-dre/100/2025/1/5' },
        { dreId: 200, anoAplicacao: 2024, disciplinaId: 2, anoEscolar: 9, expectedUrl: '/api/BoletimEscolar/ues-comparacao-por-dre/200/2024/2/9' },
      ];

      for (const testCase of testCases) {
        mockServicos.get.mockClear();
        
        await getListaUes(testCase.dreId, testCase.anoAplicacao, testCase.disciplinaId, testCase.anoEscolar);
        
        expect(mockServicos.get).toHaveBeenCalledWith(testCase.expectedUrl);
        expect(mockServicos.get).toHaveBeenCalledTimes(1);
      }
    });

    it('propaga erro quando a API falha', async () => {
      const erro = new Error('Erro 500');
      mockServicos.get.mockRejectedValueOnce(erro);

      await expect(getListaUes(123, 2025, 1, 5))
        .rejects
        .toThrow('Erro 500');
    });
  });

  describe('Testes de integração e fluxo completo', () => {
    it('sequência típica de uso das funções DRE', async () => {
      // Simula fluxo: anos aplicação → componentes → anos escolares → dados tabela
      const anosResponse = [{ ano: 2025 }];
      const componentesResponse = [{ id: 1, nome: 'Português' }];
      const anosEscolaresResponse = [{ ano: 5, descricao: '5º ano' }];
      const dadosResponse = [{ dre: 'Centro', media: 245.5 }];

      mockServicos.get
        .mockResolvedValueOnce(anosResponse)
        .mockResolvedValueOnce(componentesResponse)
        .mockResolvedValueOnce(anosEscolaresResponse)
        .mockResolvedValueOnce(dadosResponse);

      const dreId = 123;

      // 1. Busca anos de aplicação DRE
      const anos = await getAnosAplicacaoDre(dreId);
      expect(anos).toEqual(anosResponse);

      // 2. Busca componentes curriculares DRE
      const componentes = await getComponentesCurricularesDre(dreId, anos[0].ano);
      expect(componentes).toEqual(componentesResponse);

      // 3. Busca anos escolares
      const anosEscolares = await getAnosEscolaresUe(dreId, anos[0].ano, componentes[0].id);
      expect(anosEscolares).toEqual(anosEscolaresResponse);

      // 4. Busca dados da tabela
      const dados = await getDadosTabela(dreId, anos[0].ano, componentes[0].id, anosEscolares[0].ano);
      expect(dados).toEqual(dadosResponse);

      // Verifica todas as chamadas
      expect(mockServicos.get).toHaveBeenNthCalledWith(1, '/api/BoletimEscolar/anos-aplicacao-dre/123');
      expect(mockServicos.get).toHaveBeenNthCalledWith(2, '/api/BoletimEscolar/componentes-curriculares-dre/123/2025');
      expect(mockServicos.get).toHaveBeenNthCalledWith(3, '/api/BoletimEscolar/anos-escolares-dre/123/2025/1');
      expect(mockServicos.get).toHaveBeenNthCalledWith(4, '/api/BoletimEscolar/dres-comparacao-por-dre/123/2025/1/5');
      expect(mockServicos.get).toHaveBeenCalledTimes(4);
    });

    it('permite chamadas concorrentes das funções', async () => {
      const responses = [
        [{ ano: 2025 }],
        [{ id: 1, nome: 'Português' }],
        [{ ano: 5 }],
        [{ dre: 'Centro' }],
        [{ ue: 'Escola A' }],
        [{ ueId: 1 }],
        [{ aluno: 'João' }],
      ];

      mockServicos.get
        .mockResolvedValueOnce(responses[0])
        .mockResolvedValueOnce(responses[1])
        .mockResolvedValueOnce(responses[2])
        .mockResolvedValueOnce(responses[3])
        .mockResolvedValueOnce(responses[4])
        .mockResolvedValueOnce(responses[5])
        .mockResolvedValueOnce(responses[6]);

      // Executa todas as funções simultaneamente
      const promises = [
        getAnosAplicacaoDre(123),
        getComponentesCurricularesDre(123, 2025),
        getAnosEscolaresUe(123, 2025, 1),
        getDadosTabela(123, 2025, 1, 5),
        getComporativoUe(123, 1, 2025, 5, 10, 'ue123'),
        getListaUes(123, 2025, 1, 5),
        getComparativoAlunoUe(123, 1, 5, 'A', 'lote2025'),
      ];

      const resultados = await Promise.all(promises);

      expect(resultados).toHaveLength(7);
      expect(mockServicos.get).toHaveBeenCalledTimes(7);
    });
  });

  describe('Tratamento de erros específicos', () => {
    it.each([
      { status: 400, message: 'Bad Request' },
      { status: 401, message: 'Unauthorized' },
      { status: 403, message: 'Forbidden' },
      { status: 404, message: 'Not Found' },
      { status: 500, message: 'Internal Server Error' },
      { status: 503, message: 'Service Unavailable' },
    ])('lida com erro HTTP $status para todas as funções', async ({ status, message }) => {
      const erro = new Error(`${status} - ${message}`);

      // Testa getAnosAplicacaoDre
      mockServicos.get.mockRejectedValueOnce(erro);
      await expect(getAnosAplicacaoDre(123))
        .rejects
        .toThrow(`${status} - ${message}`);

      // Testa getComponentesCurricularesDre
      mockServicos.get.mockRejectedValueOnce(erro);
      await expect(getComponentesCurricularesDre(123, 2025))
        .rejects
        .toThrow(`${status} - ${message}`);

      // Testa getAnosEscolaresUe
      mockServicos.get.mockRejectedValueOnce(erro);
      await expect(getAnosEscolaresUe(123, 2025, 1))
        .rejects
        .toThrow(`${status} - ${message}`);

      // Testa getDadosTabela
      mockServicos.get.mockRejectedValueOnce(erro);
      await expect(getDadosTabela(123, 2025, 1, 5))
        .rejects
        .toThrow(`${status} - ${message}`);

      // Testa getComporativoUe
      mockServicos.get.mockRejectedValueOnce(erro);
      await expect(getComporativoUe(123, 1, 2025, 5, 10, 'ue123'))
        .rejects
        .toThrow(`${status} - ${message}`);

      // Testa getListaUes
      mockServicos.get.mockRejectedValueOnce(erro);
      await expect(getListaUes(123, 2025, 1, 5))
        .rejects
        .toThrow(`${status} - ${message}`);

      // Testa getComparativoAlunoUe
      mockServicos.get.mockRejectedValueOnce(erro);
      await expect(getComparativoAlunoUe(123, 1, 5, 'A', 'lote2025'))
        .rejects
        .toThrow(`${status} - ${message}`);
    });

    it('lida com timeout da API', async () => {
      const timeoutError = new Error('Request timeout');

      // Testa todas as funções com timeout
      const funções = [
        () => getAnosAplicacaoDre(123),
        () => getComponentesCurricularesDre(123, 2025),
        () => getAnosEscolaresUe(123, 2025, 1),
        () => getDadosTabela(123, 2025, 1, 5),
        () => getComporativoUe(123, 1, 2025, 5, 10, 'ue123'),
        () => getListaUes(123, 2025, 1, 5),
        () => getComparativoAlunoUe(123, 1, 5, 'A', 'lote2025'),
      ];

      for (const fn of funções) {
        mockServicos.get.mockRejectedValueOnce(timeoutError);
        await expect(fn()).rejects.toThrow('Request timeout');
      }
    });
  });

  describe('Performance e edge cases', () => {
    it('funciona com valores extremos', async () => {
      mockServicos.get.mockResolvedValue([] as any[]);

      const testCases = [
        { dreId: Number.MAX_SAFE_INTEGER, anoAplicacao: Number.MAX_SAFE_INTEGER, disciplinaId: Number.MAX_SAFE_INTEGER, anoEscolar: Number.MAX_SAFE_INTEGER },
        { dreId: 0, anoAplicacao: 0, disciplinaId: 0, anoEscolar: 0 },
        { dreId: -1, anoAplicacao: -1, disciplinaId: -1, anoEscolar: -1 },
      ];

      for (const testCase of testCases) {
        await getDadosTabela(testCase.dreId, testCase.anoAplicacao, testCase.disciplinaId, testCase.anoEscolar);
        
        const expectedUrl = `/api/BoletimEscolar/dres-comparacao-por-dre/${testCase.dreId}/${testCase.anoAplicacao}/${testCase.disciplinaId}/${testCase.anoEscolar}`;
        expect(mockServicos.get).toHaveBeenCalledWith(expectedUrl);
      }
    });

    it('confirma que as funções retornam promises', () => {
      mockServicos.get.mockResolvedValue([] as any[]);

      const results = [
        getAnosAplicacaoDre(123),
        getComponentesCurricularesDre(123, 2025),
        getAnosEscolaresUe(123, 2025, 1),
        getDadosTabela(123, 2025, 1, 5),
        getComporativoUe(123, 1, 2025, 5, 10, 'ue123'),
        getListaUes(123, 2025, 1, 5),
        getComparativoAlunoUe(123, 1, 5, 'A', 'lote2025'),
      ];

      results.forEach(result => {
        expect(result).toBeInstanceOf(Promise);
      });
    });
  });
});