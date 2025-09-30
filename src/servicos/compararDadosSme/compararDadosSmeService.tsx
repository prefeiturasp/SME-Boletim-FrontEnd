import { servicos } from "../../servicos"

export const getAnosAplicacaoVisaoSme = async (dreId: number) =>
   await servicos.get(`/api/BoletimEscolar/anos-aplicacao-sme`);

export const getComponentesCurricularesVisaoSme = async (dreId: number, anoAplicacao:number) =>
   await servicos.get(`/api/BoletimEscolar/componentes-curriculares-sme/${anoAplicacao}`);

export const getAnosEscolaresUeVisaoSme = async (dreId: number,anoAplicacao: number,disciplinaId: number) =>
   await servicos.get(`/api/BoletimEscolar/anos-escolares-sme/${anoAplicacao}/${disciplinaId}`);