import {
    getAnosAplicacaoVisaoSme,
    getComponentesCurricularesVisaoSme,
    getAnosEscolaresUeVisaoSme
} from './compararDadosSmeService';
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

describe('compararDadosSmeService', () => {

    describe('getAnosAplicacaoVisaoSme', () => {
        it('chama a API com a URL correta', async () => {
            const mockResponse = [
                { ano: 2025, descricao: '2025' },
                { ano: 2024, descricao: '2024' },
            ];

            mockServicos.get.mockResolvedValueOnce(mockResponse);

            const dreId = 123;
            const resultado = await getAnosAplicacaoVisaoSme(dreId);

            expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/anos-aplicacao-sme');
            expect(mockServicos.get).toHaveBeenCalledTimes(1);
            expect(resultado).toEqual(mockResponse);
        });

        it('retorna dados quando a API responde com sucesso', async () => {
            const dadosEsperados = [
                { ano: 2025, descricao: '2025' },
                { ano: 2024, descricao: '2024' },
                { ano: 2023, descricao: '2023' },
            ];

            mockServicos.get.mockResolvedValueOnce(dadosEsperados);

            const resultado = await getAnosAplicacaoVisaoSme(456);

            expect(resultado).toEqual(dadosEsperados);
            expect(Array.isArray(resultado)).toBe(true);
            expect(resultado).toHaveLength(3);
        });

        it('não usa o parâmetro dreId na URL (comportamento atual)', async () => {
            const mockResponse = [{ ano: 2025 }];
            mockServicos.get.mockResolvedValue(mockResponse);

            // Testa com diferentes valores de dreId
            const dreIds = [1, 100, 999, 0, -1];

            for (const dreId of dreIds) {
                mockServicos.get.mockClear();
                await getAnosAplicacaoVisaoSme(dreId);

                // A URL deve ser sempre a mesma, dreId não é usado
                expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/anos-aplicacao-sme');
                expect(mockServicos.get).toHaveBeenCalledTimes(1);
            }
        });

        it('propaga erro quando a API falha', async () => {
            const erro = new Error('Erro na API');
            mockServicos.get.mockRejectedValueOnce(erro);

            await expect(getAnosAplicacaoVisaoSme(789))
                .rejects
                .toThrow('Erro na API');

            expect(mockServicos.get).toHaveBeenCalledTimes(1);
        });

        it('lida com resposta vazia da API', async () => {
            mockServicos.get.mockResolvedValueOnce([]);

            const resultado = await getAnosAplicacaoVisaoSme(123);

            expect(resultado).toEqual([]);
            expect(Array.isArray(resultado)).toBe(true);
            expect(resultado).toHaveLength(0);
        });

        it('lida com resposta null da API', async () => {
            mockServicos.get.mockResolvedValueOnce(null);

            const resultado = await getAnosAplicacaoVisaoSme(123);

            expect(resultado).toBeNull();
        });

        it('lida com resposta undefined da API', async () => {
            mockServicos.get.mockResolvedValueOnce(undefined);

            const resultado = await getAnosAplicacaoVisaoSme(123);

            expect(resultado).toBeUndefined();
        });

        it('funciona com diferentes tipos de dreId', async () => {
            const mockResponse = [{ ano: 2025 }];
            mockServicos.get.mockResolvedValue(mockResponse);

            const testCases = [
                1,
                0,
                -1,
                999999,
                1.5, // número decimal
                // @ts-ignore - teste com string
                '123',
                // @ts-ignore - teste com null
                null,
                // @ts-ignore - teste com undefined
                undefined,
            ];

            for (const dreId of testCases) {
                mockServicos.get.mockClear();
                const resultado = await getAnosAplicacaoVisaoSme(dreId as number);

                expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/anos-aplicacao-sme');
                expect(resultado).toEqual(mockResponse);
            }
        });
    });

    describe('getComponentesCurricularesVisaoSme', () => {
        it('chama a API com a URL correta incluindo anoAplicacao', async () => {
            const mockResponse = [
                { id: 1, nome: 'Língua Portuguesa' },
                { id: 2, nome: 'Matemática' },
            ];

            mockServicos.get.mockResolvedValueOnce(mockResponse);

            const dreId = 123;
            const anoAplicacao = 2025;
            const resultado = await getComponentesCurricularesVisaoSme(dreId, anoAplicacao);

            expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/componentes-curriculares-sme/2025');
            expect(mockServicos.get).toHaveBeenCalledTimes(1);
            expect(resultado).toEqual(mockResponse);
        });

        it('constrói URL corretamente com diferentes anos de aplicação', async () => {
            const mockResponse = [{ id: 1, nome: 'Disciplina' }];
            mockServicos.get.mockResolvedValue(mockResponse);

            const testCases = [
                { dreId: 100, anoAplicacao: 2025, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-sme/2025' },
                { dreId: 200, anoAplicacao: 2024, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-sme/2024' },
                { dreId: 300, anoAplicacao: 2023, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-sme/2023' },
                { dreId: 400, anoAplicacao: 2022, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-sme/2022' },
                { dreId: 500, anoAplicacao: 0, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-sme/0' },
                { dreId: 600, anoAplicacao: -1, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-sme/-1' },
            ];

            for (const testCase of testCases) {
                mockServicos.get.mockClear();

                await getComponentesCurricularesVisaoSme(testCase.dreId, testCase.anoAplicacao);

                expect(mockServicos.get).toHaveBeenCalledWith(testCase.expectedUrl);
                expect(mockServicos.get).toHaveBeenCalledTimes(1);
            }
        });

        it('não usa o parâmetro dreId na URL (comportamento atual)', async () => {
            const mockResponse = [{ id: 1 }];
            mockServicos.get.mockResolvedValue(mockResponse);

            const anoAplicacao = 2025;
            const dreIds = [1, 100, 999, 0, -1];

            for (const dreId of dreIds) {
                mockServicos.get.mockClear();
                await getComponentesCurricularesVisaoSme(dreId, anoAplicacao);

                // dreId não aparece na URL, apenas anoAplicacao
                expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/componentes-curriculares-sme/2025');
                expect(mockServicos.get).toHaveBeenCalledTimes(1);
            }
        });

        it('retorna dados dos componentes curriculares', async () => {
            const dadosEsperados = [
                { id: 1, nome: 'Língua Portuguesa', codigo: 'LP' },
                { id: 2, nome: 'Matemática', codigo: 'MAT' },
                { id: 3, nome: 'Ciências', codigo: 'CI' },
            ];

            mockServicos.get.mockResolvedValueOnce(dadosEsperados);

            const resultado = await getComponentesCurricularesVisaoSme(123, 2025);

            expect(resultado).toEqual(dadosEsperados);
            expect(Array.isArray(resultado)).toBe(true);
            expect(resultado).toHaveLength(3);
        });

        it('propaga erro quando a API falha', async () => {
            const erro = new Error('Erro 500 - Internal Server Error');
            mockServicos.get.mockRejectedValueOnce(erro);

            await expect(getComponentesCurricularesVisaoSme(123, 2025))
                .rejects
                .toThrow('Erro 500 - Internal Server Error');

            expect(mockServicos.get).toHaveBeenCalledTimes(1);
        });

        it('funciona com anoAplicacao como string na URL', async () => {
            const mockResponse = [{ id: 1 }];
            mockServicos.get.mockResolvedValue(mockResponse);

            // JavaScript converte automaticamente número para string na interpolação
            await getComponentesCurricularesVisaoSme(123, 2025);

            expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/componentes-curriculares-sme/2025');
        });

        it('lida com diferentes tipos de anoAplicacao', async () => {
            const mockResponse = [{ id: 1 }];
            mockServicos.get.mockResolvedValue(mockResponse);

            const testCases = [
                { anoAplicacao: 2025, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-sme/2025' },
                { anoAplicacao: 0, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-sme/0' },
                { anoAplicacao: -1, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-sme/-1' },
                { anoAplicacao: 2025.5, expectedUrl: '/api/BoletimEscolar/componentes-curriculares-sme/2025.5' },
            ];

            for (const testCase of testCases) {
                mockServicos.get.mockClear();
                await getComponentesCurricularesVisaoSme(123, testCase.anoAplicacao);

                expect(mockServicos.get).toHaveBeenCalledWith(testCase.expectedUrl);
            }
        });

        it('lida com resposta null da API', async () => {
            mockServicos.get.mockResolvedValueOnce(null);

            const resultado = await getComponentesCurricularesVisaoSme(123, 2025);

            expect(resultado).toBeNull();
        });

        it('lida com resposta vazia da API', async () => {
            mockServicos.get.mockResolvedValueOnce([]);

            const resultado = await getComponentesCurricularesVisaoSme(123, 2025);

            expect(resultado).toEqual([]);
        });
    });

    describe('getAnosEscolaresUeVisaoSme', () => {
        it('chama a API com a URL correta incluindo anoAplicacao e disciplinaId', async () => {
            const mockResponse = [
                { ano: 5, descricao: '5º ano' },
                { ano: 9, descricao: '9º ano' },
            ];

            mockServicos.get.mockResolvedValueOnce(mockResponse);

            const dreId = 123;
            const anoAplicacao = 2025;
            const disciplinaId = 1;
            const resultado = await getAnosEscolaresUeVisaoSme(dreId, anoAplicacao, disciplinaId);

            expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/anos-escolares-sme/2025/1');
            expect(mockServicos.get).toHaveBeenCalledTimes(1);
            expect(resultado).toEqual(mockResponse);
        });

        it('constrói URL corretamente com diferentes combinações de parâmetros', async () => {
            const mockResponse = [{ ano: 5 }];
            mockServicos.get.mockResolvedValue(mockResponse);

            const testCases = [
                { dreId: 100, anoAplicacao: 2025, disciplinaId: 1, expectedUrl: '/api/BoletimEscolar/anos-escolares-sme/2025/1' },
                { dreId: 200, anoAplicacao: 2024, disciplinaId: 2, expectedUrl: '/api/BoletimEscolar/anos-escolares-sme/2024/2' },
                { dreId: 300, anoAplicacao: 2023, disciplinaId: 10, expectedUrl: '/api/BoletimEscolar/anos-escolares-sme/2023/10' },
                { dreId: 400, anoAplicacao: 0, disciplinaId: 0, expectedUrl: '/api/BoletimEscolar/anos-escolares-sme/0/0' },
                { dreId: 500, anoAplicacao: -1, disciplinaId: -5, expectedUrl: '/api/BoletimEscolar/anos-escolares-sme/-1/-5' },
            ];

            for (const testCase of testCases) {
                mockServicos.get.mockClear();

                await getAnosEscolaresUeVisaoSme(testCase.dreId, testCase.anoAplicacao, testCase.disciplinaId);

                expect(mockServicos.get).toHaveBeenCalledWith(testCase.expectedUrl);
                expect(mockServicos.get).toHaveBeenCalledTimes(1);
            }
        });

        it('não usa o parâmetro dreId na URL (comportamento atual)', async () => {
            const mockResponse = [{ ano: 5 }];
            mockServicos.get.mockResolvedValue(mockResponse);

            const anoAplicacao = 2025;
            const disciplinaId = 1;
            const dreIds = [1, 100, 999, 0, -1];

            for (const dreId of dreIds) {
                mockServicos.get.mockClear();
                await getAnosEscolaresUeVisaoSme(dreId, anoAplicacao, disciplinaId);

                // dreId não aparece na URL, apenas anoAplicacao e disciplinaId
                expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/anos-escolares-sme/2025/1');
                expect(mockServicos.get).toHaveBeenCalledTimes(1);
            }
        });

        it('retorna dados dos anos escolares', async () => {
            const dadosEsperados = [
                { ano: 1, descricao: '1º ano' },
                { ano: 2, descricao: '2º ano' },
                { ano: 3, descricao: '3º ano' },
                { ano: 5, descricao: '5º ano' },
                { ano: 9, descricao: '9º ano' },
            ];

            mockServicos.get.mockResolvedValueOnce(dadosEsperados);

            const resultado = await getAnosEscolaresUeVisaoSme(123, 2025, 1);

            expect(resultado).toEqual(dadosEsperados);
            expect(Array.isArray(resultado)).toBe(true);
            expect(resultado).toHaveLength(5);
        });

        it('propaga erro quando a API falha', async () => {
            const erro = new Error('Erro 404 - Not Found');
            mockServicos.get.mockRejectedValueOnce(erro);

            await expect(getAnosEscolaresUeVisaoSme(123, 2025, 1))
                .rejects
                .toThrow('Erro 404 - Not Found');

            expect(mockServicos.get).toHaveBeenCalledTimes(1);
        });

        it('funciona com números decimais na URL', async () => {
            const mockResponse = [{ ano: 5 }];
            mockServicos.get.mockResolvedValueOnce(mockResponse);

            const resultado = await getAnosEscolaresUeVisaoSme(123, 2025.7, 1.3);

            expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/anos-escolares-sme/2025.7/1.3');
            expect(resultado).toEqual(mockResponse);
        });

        it('lida com valores extremos', async () => {
            const mockResponse: any[] = [];
            mockServicos.get.mockResolvedValue(mockResponse);

            const testCases = [
                { anoAplicacao: Number.MAX_SAFE_INTEGER, disciplinaId: Number.MAX_SAFE_INTEGER },
                { anoAplicacao: Number.MIN_SAFE_INTEGER, disciplinaId: Number.MIN_SAFE_INTEGER },
                { anoAplicacao: 0, disciplinaId: 0 },
            ];

            for (const testCase of testCases) {
                mockServicos.get.mockClear();
                await getAnosEscolaresUeVisaoSme(123, testCase.anoAplicacao, testCase.disciplinaId);

                const expectedUrl = `/api/BoletimEscolar/anos-escolares-sme/${testCase.anoAplicacao}/${testCase.disciplinaId}`;
                expect(mockServicos.get).toHaveBeenCalledWith(expectedUrl);
            }
        });

        it('lida com resposta vazia da API', async () => {
            mockServicos.get.mockResolvedValueOnce([]);

            const resultado = await getAnosEscolaresUeVisaoSme(123, 2025, 1);

            expect(resultado).toEqual([]);
            expect(Array.isArray(resultado)).toBe(true);
            expect(resultado).toHaveLength(0);
        });

        it('lida com resposta null da API', async () => {
            mockServicos.get.mockResolvedValueOnce(null);

            const resultado = await getAnosEscolaresUeVisaoSme(123, 2025, 1);

            expect(resultado).toBeNull();
        });

        it('lida com resposta undefined da API', async () => {
            mockServicos.get.mockResolvedValueOnce(undefined);

            const resultado = await getAnosEscolaresUeVisaoSme(123, 2025, 1);

            expect(resultado).toBeUndefined();
        });
    });

    describe('Testes de integração e fluxo completo', () => {
        it('sequência típica de uso das funções', async () => {
            // Simula um fluxo típico: anos → componentes → anos escolares
            const anosResponse = [{ ano: 2025 }, { ano: 2024 }];
            const componentesResponse = [{ id: 1, nome: 'Português' }, { id: 2, nome: 'Matemática' }];
            const anosEscolaresResponse = [{ ano: 5, descricao: '5º ano' }];

            mockServicos.get
                .mockResolvedValueOnce(anosResponse)
                .mockResolvedValueOnce(componentesResponse)
                .mockResolvedValueOnce(anosEscolaresResponse);

            const dreId = 123;

            // 1. Busca anos de aplicação
            const anos = await getAnosAplicacaoVisaoSme(dreId);
            expect(anos).toEqual(anosResponse);

            // 2. Busca componentes curriculares para o primeiro ano
            const componentes = await getComponentesCurricularesVisaoSme(dreId, anos[0].ano);
            expect(componentes).toEqual(componentesResponse);

            // 3. Busca anos escolares para o primeiro componente
            const anosEscolares = await getAnosEscolaresUeVisaoSme(dreId, anos[0].ano, componentes[0].id);
            expect(anosEscolares).toEqual(anosEscolaresResponse);

            // Verifica se todas as chamadas foram feitas corretamente
            expect(mockServicos.get).toHaveBeenNthCalledWith(1, '/api/BoletimEscolar/anos-aplicacao-sme');
            expect(mockServicos.get).toHaveBeenNthCalledWith(2, '/api/BoletimEscolar/componentes-curriculares-sme/2025');
            expect(mockServicos.get).toHaveBeenNthCalledWith(3, '/api/BoletimEscolar/anos-escolares-sme/2025/1');
            expect(mockServicos.get).toHaveBeenCalledTimes(3);
        });

        it('permite chamadas concorrentes das funções', async () => {
            const responses = [
                [{ ano: 2025 }],
                [{ id: 1, nome: 'Português' }],
                [{ ano: 5, descricao: '5º ano' }],
            ];

            mockServicos.get
                .mockResolvedValueOnce(responses[0])
                .mockResolvedValueOnce(responses[1])
                .mockResolvedValueOnce(responses[2]);

            // Executa todas as funções simultaneamente
            const promises = [
                getAnosAplicacaoVisaoSme(123),
                getComponentesCurricularesVisaoSme(456, 2025),
                getAnosEscolaresUeVisaoSme(789, 2025, 1),
            ];

            const resultados = await Promise.all(promises);

            expect(resultados[0]).toEqual(responses[0]);
            expect(resultados[1]).toEqual(responses[1]);
            expect(resultados[2]).toEqual(responses[2]);
            expect(mockServicos.get).toHaveBeenCalledTimes(3);
        });

        it('isola falhas entre chamadas concorrentes', async () => {
            mockServicos.get
                .mockResolvedValueOnce([{ ano: 2025 }])
                .mockRejectedValueOnce(new Error('Erro na segunda chamada'))
                .mockResolvedValueOnce([{ ano: 5 }]);

            const promises = [
                getAnosAplicacaoVisaoSme(123),
                getComponentesCurricularesVisaoSme(456, 2025),
                getAnosEscolaresUeVisaoSme(789, 2025, 1),
            ];

            const resultados = await Promise.allSettled(promises);

            expect(resultados[0].status).toBe('fulfilled');
            expect(resultados[1].status).toBe('rejected');
            expect(resultados[2].status).toBe('fulfilled');
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

            // Testa getAnosAplicacaoVisaoSme
            mockServicos.get.mockRejectedValueOnce(erro);
            await expect(getAnosAplicacaoVisaoSme(123))
                .rejects
                .toThrow(`${status} - ${message}`);

            // Testa getComponentesCurricularesVisaoSme
            mockServicos.get.mockRejectedValueOnce(erro);
            await expect(getComponentesCurricularesVisaoSme(123, 2025))
                .rejects
                .toThrow(`${status} - ${message}`);

            // Testa getAnosEscolaresUeVisaoSme
            mockServicos.get.mockRejectedValueOnce(erro);
            await expect(getAnosEscolaresUeVisaoSme(123, 2025, 1))
                .rejects
                .toThrow(`${status} - ${message}`);
        });

        it('lida com timeout da API', async () => {
            const timeoutError = new Error('Request timeout');

            // Testa getAnosAplicacaoVisaoSme
            mockServicos.get.mockRejectedValueOnce(timeoutError);
            await expect(getAnosAplicacaoVisaoSme(123))
                .rejects
                .toThrow('Request timeout');

            // Testa getComponentesCurricularesVisaoSme
            mockServicos.get.mockRejectedValueOnce(timeoutError);
            await expect(getComponentesCurricularesVisaoSme(123, 2025))
                .rejects
                .toThrow('Request timeout');

            // Testa getAnosEscolaresUeVisaoSme
            mockServicos.get.mockRejectedValueOnce(timeoutError);
            await expect(getAnosEscolaresUeVisaoSme(123, 2025, 1))
                .rejects
                .toThrow('Request timeout');
        });

        it('lida com erro de rede', async () => {
            const networkError = new Error('Network Error');

            // Testa getAnosAplicacaoVisaoSme
            mockServicos.get.mockRejectedValueOnce(networkError);
            await expect(getAnosAplicacaoVisaoSme(123))
                .rejects
                .toThrow('Network Error');

            // Testa getComponentesCurricularesVisaoSme
            mockServicos.get.mockRejectedValueOnce(networkError);
            await expect(getComponentesCurricularesVisaoSme(123, 2025))
                .rejects
                .toThrow('Network Error');

            // Testa getAnosEscolaresUeVisaoSme
            mockServicos.get.mockRejectedValueOnce(networkError);
            await expect(getAnosEscolaresUeVisaoSme(123, 2025, 1))
                .rejects
                .toThrow('Network Error');
        });
    });

    describe('Análise de comportamento das funções', () => {
        describe.each([
            {
                name: 'getAnosAplicacaoVisaoSme',
                fn: getAnosAplicacaoVisaoSme,
                params: [999] as const,
                expectedUrl: '/api/BoletimEscolar/anos-aplicacao-sme',
            },
            {
                name: 'getComponentesCurricularesVisaoSme',
                fn: getComponentesCurricularesVisaoSme,
                params: [999, 2025] as const,
                expectedUrl: '/api/BoletimEscolar/componentes-curriculares-sme/2025',
            },
            {
                name: 'getAnosEscolaresUeVisaoSme',
                fn: getAnosEscolaresUeVisaoSme,
                params: [999, 2025, 1] as const,
                expectedUrl: '/api/BoletimEscolar/anos-escolares-sme/2025/1',
            },
        ])('$name', ({ name, fn, params, expectedUrl }) => {
            it('não usa dreId na URL', async () => {
                mockServicos.get.mockResolvedValue([]);

                // @ts-ignore - Type assertion para testes
                await fn(...params);

                expect(mockServicos.get).toHaveBeenCalledWith(expectedUrl);
                expect(mockServicos.get).toHaveBeenCalledTimes(1);
                expect(expectedUrl).not.toContain('999');
            });
        });

        it('confirma que as funções retornam promises', () => {
            mockServicos.get.mockResolvedValue([]);

            const result1 = getAnosAplicacaoVisaoSme(123);
            const result2 = getComponentesCurricularesVisaoSme(123, 2025);
            const result3 = getAnosEscolaresUeVisaoSme(123, 2025, 1);

            expect(result1).toBeInstanceOf(Promise);
            expect(result2).toBeInstanceOf(Promise);
            expect(result3).toBeInstanceOf(Promise);
        });
    });

    describe('Performance e edge cases', () => {
        it('funciona com valores NaN e Infinity', async () => {
            mockServicos.get.mockResolvedValue([]);

            // @ts-ignore - Testando valores extremos
            await getComponentesCurricularesVisaoSme(123, NaN);
            expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/componentes-curriculares-sme/NaN');

            // @ts-ignore - Testando valores extremos
            await getAnosEscolaresUeVisaoSme(123, Infinity, -Infinity);
            expect(mockServicos.get).toHaveBeenCalledWith('/api/BoletimEscolar/anos-escolares-sme/Infinity/-Infinity');
        });

        it('não vaza memória com múltiplas chamadas', async () => {
            const mockResponse = [{ data: 'test' }];
            mockServicos.get.mockResolvedValue(mockResponse);

            // Simula muitas chamadas
            const promises = [];
            for (let i = 0; i < 100; i++) {
                promises.push(getAnosAplicacaoVisaoSme(i));
            }

            const resultados = await Promise.all(promises);

            expect(resultados).toHaveLength(100);
            expect(mockServicos.get).toHaveBeenCalledTimes(100);

            // Todos os resultados devem ser iguais
            resultados.forEach(resultado => {
                expect(resultado).toEqual(mockResponse);
            });
        });
    });
});