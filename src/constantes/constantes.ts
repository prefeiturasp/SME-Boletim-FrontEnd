export const VARIACAO_DESCRICAO ="O valor percentual representa a evolução comparando a última PSA do ano selecionado com a PSP do ano anterior.";

/**
 * Tipos de Escola válidos para o Boletim de Provas
 * Baseado no enum TipoEscola do backend
 * 
 * Tipos VÁLIDOS:
 * - 1: EMEF (Escola Municipal de Ensino Fundamental)
 * - 2: EMEI (Escola Municipal de Educação Infantil)
 * - 3: EMEFM (Escola Municipal de Ensino Fundamental e Médio)
 * - 4: EMEBS (Escola Municipal de Ensino Bilíngue para Surdos)
 * - 13: CIEJA (Centro Integrado de Educação de Jovens e Adultos)
 * - 16: CEU EMEF (Centro Unificado de Educação - EMEF)
 * - 17: CEU EMEI (Centro Unificado de Educação - EMEI)
 * - 19: CEU (Centro Unificado de Educação)
 * - 28: CEMEI (Centro Municipal de Educação Infantil)
 * - 30: CECI (Centro de Educação e Cultura Indígena)
 * - 31: CEU CEMEI (Centro Unificado de Educação - CEMEI)
 * - 32: EMEF P FOM (EMEF Privada Fomento)
 * - 33: EMEI P FOM (EMEI Privada Fomento)
 */
export const TIPOS_ESCOLA_VALIDOS = [1, 2, 3, 4, 13, 16, 17, 19, 28, 30, 31, 32, 33];

/**
 * Tipos de Escola que NÃO devem aparecer no Boletim (removidos):
 * - 0: Nenhum (NA)
 * - 10: CEI DIRET
 * - 11: CEI INDIR
 * - 12: CRPCONV (Creche Particular Conveniada)
 * - 14: CCI/CIPS
 * - 15: ESCPART (Escola Particular)
 * - 18: CEU CEI
 * - 22: MOVA (Movimento de Alfabetização)
 * - 23: CMCT
 * - 25: ETEC
 * - 26: ESPCONV
 * - 27: CEU AT COMPL
 * - 29: CCA (Centro para Crianças e Adolescentes)
 */
export const TIPOS_ESCOLA_REMOVIDOS = [0, 10, 11, 12, 14, 15, 18, 22, 23, 25, 26, 27, 29];