import { servicos } from "../../servicos"

export const getComparativoAlunoUe = async (ueId: number, disciplinaId:number, anoEscolar:number, turma:string, loteId:string) =>
   await servicos.get(`/api/BoletimEscolar/comparativo-aluno-ue/${ueId}/${disciplinaId}/${anoEscolar}/${turma}/${loteId}`);

export const getAnosAplicacaoDre = async (dreId: number) =>
   await servicos.get(`/api/BoletimEscolar/anos-aplicacao-dre/${dreId}`);

export const getComponentesCurricularesDre = async (dreId: number, anoAplicacao:number) =>
   await servicos.get(`/api/BoletimEscolar/componentes-curriculares-dre/${dreId}/${anoAplicacao}`);

export const getAnosEscolaresUe = async (dreId: number,anoAplicacao: number,disciplinaId: number) =>
   await servicos.get(`/api/BoletimEscolar/anos-escolares-dre/${dreId}/${anoAplicacao}/${disciplinaId}`);
