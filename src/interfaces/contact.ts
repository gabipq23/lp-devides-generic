export interface ICreateContact {
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;

  cnpj: string;
  company: string;
  company_id: number;
  business_partner: string;
  partner_id: number;
  landing_page: string;
  category: string;
  url_lp: string;
}

export interface ICreateContactResponse {
  mensagem: string;
  contato: {
    id: number;
    name: string;
    phone: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
    status: string;

    cnpj: string;
    company: string;
    company_id: number;
    business_partner: string;
    partner_id: number;
    landing_page: string;
    category: string;
    url_lp: string;
  };
}
