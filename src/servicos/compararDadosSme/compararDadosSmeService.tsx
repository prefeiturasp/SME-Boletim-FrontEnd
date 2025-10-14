import { servicos } from "../../servicos"

export const getAnosAplicacaoVisaoSme = async () =>
   await servicos.get(`/api/BoletimEscolar/anos-aplicacao-sme`);

export const getComponentesCurricularesVisaoSme = async (anoAplicacao:number) =>
   await servicos.get(`/api/BoletimEscolar/componentes-curriculares-sme/${anoAplicacao}`);

export const getAnosEscolaresUeVisaoSme = async (anoAplicacao: number,disciplinaId: number) =>
   await servicos.get(`/api/BoletimEscolar/anos-escolares-sme/${anoAplicacao}/${disciplinaId}`);

export const getDadosTabelaSME = async (anoAplicacao: number, disciplinaId: number, anoEscolar: number) =>
   await servicos.get(`/api/BoletimEscolar/dados-tabela-comparativa-sme/${anoAplicacao}/${disciplinaId}/${anoEscolar}`);

export const getGraficoSME = async (anoAplicacao: number, disciplinaId: number, anoEscolar: number) =>
   await servicos.get(`/api/BoletimEscolar/comparacao-grafico-sme/${anoAplicacao}/${disciplinaId}/${anoEscolar}`);

export const getListaDres = async (anoAplicacao: number, disciplinaId: number, anoEscolar: number) =>
   await servicos.get(`/api/BoletimEscolar/dres-comparativo-sme/${anoAplicacao}/${disciplinaId}/${anoEscolar}`);

export const getCardsDre = async (dreId: number, anoAplicacao: number, disciplinaId: number, anoEscolar: number,   limite: number) =>
   await servicos.get(`/api/BoletimEscolar/cards-comparativo-sme-por-dre/${anoAplicacao}/${disciplinaId}/${anoEscolar}?pagina=1&itensPorPagina=${limite}${dreId > 0 ? `&dreId=${dreId}` : ''}`);






