import { servicos } from "../../servicos"

export const getAnosAplicacaoVisaoSme = async () =>
   await servicos.get(`/api/BoletimEscolar/anos-aplicacao-sme`);

export const getComponentesCurricularesVisaoSme = async (anoAplicacao:number) =>
   await servicos.get(`/api/BoletimEscolar/componentes-curriculares-sme/${anoAplicacao}`);

export const getAnosEscolaresUeVisaoSme = async (anoAplicacao: number,disciplinaId: number) =>
   await servicos.get(`/api/BoletimEscolar/anos-escolares-sme/${anoAplicacao}/${disciplinaId}`);