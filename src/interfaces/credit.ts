export interface ICredit {
  status: string;
  data: {
    cnpj: string;
    razao_social: string;
    credito: number;
    credito_equipaments: number;
    aparelho_atual: string;
    endereco: string;
    sfa: string;
    telefone: string;
    email: string;
    data_atualizacao: string;
  };
}
