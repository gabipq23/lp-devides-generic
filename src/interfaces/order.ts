export interface IOrderResponse {
  success: boolean;
  order: IOrder;
}

export interface IOrder {
  // ================= ENVELOPE =================
  business_partner: string;
  id: number;
  category: string;
  client_ip: string;
  client_type: "PF" | "PJ";
  company: string;
  company_id: number;
  fingerprint: Fingerprint;
  ip_access_type: string;
  is_consultation: boolean;
  is_order: boolean;
  landing_page: string;
  lp_url: string | null;
  order_id: string;
  order_number: string;
  partner_id: number;
  url: string;

  // ================= EMPRESA / PJ =================
  is_partner_customer: boolean;
  cnpj: string;
  company_legal_name: string;
  company_rfb_information: CompanyRfbInformation;

  // ================= COMPRADOR / GESTOR =================
  additional_email: string;
  additional_operator: string | null;
  additional_phone: string | null;
  additional_phone_valid: boolean | null;
  additional_portability: boolean | null;
  additional_portability_date: string | null;
  full_name: string | null;
  is_additional_email_valid: boolean | null;
  operator: string | null;
  phone: string | null;
  phone_valid: boolean | null;
  portability: boolean | null;
  portability_date: string | null;

  manager: Manager;

  // ================= ENDEREÇO =================
  address: string | null;
  address_complement: string;
  address_note: string;
  address_number: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  zip_code: string | null;

  // ================= CARRINHO =================
  items: Item[];
  total_number_of_devices: number | null;

  // ================= CRÉDITO =================
  client_credit: ClientCredit;

  // ================= PREÇO / PAGAMENTO =================
  payment_method: string | null;
  price_summary: PriceSummary;

  // ================= MARKETING =================
  prospects: Prospects;

  // ================= RESERVA =================
  reserve: Reserve;

  // ================= BACKEND / CRM =================
  after_sales_status: string | null;
  responsible_consultant: string | null;
  closed_at: string | null;
  consultant_notes: string | null;
  consultant_observation: string | null;
  corporate_id: string | null;
  created_at: string;
  crm_id: string | null;
  geolocation: Geolocation | null;
  input_crm: string | null;
  updated_at: string | null;
  team: string | null;
  status: string;

  // ================= EDIÇÃO =================
  second_call_data: Record<string, unknown> | null;
  second_call_token: string | null;
  second_call_token_expires_at: string | null;
}

export interface Fingerprint {
  os: {
    name: string;
    version: string;
  };
  device: string;
  browser: {
    name: string;
    version: string;
  };
  timezone: string;
  resolution: {
    dpr: number;
    width: number;
    height: number;
  };
  timezone_offset: number;
  language: string;
}

export interface CompanyRfbInformation {
  opcao_pelo_mei: boolean | null;
  porte: string | null;
  situacao_cadastral: string | null;
}

export interface Manager {
  email: string | null;
  name: string | null;
  phone: string | null;
}

export interface Item {
  available_colors: string[];
  brand: string;
  device_id: number;
  installment_amount: number;
  insurance_price: number | null;
  insurance_type: string | null;
  model: string;
  quantity: number;
  sap_code: string;
  selected_color: string;
  total_installment_amount: number;
  type: string;
  unit_price: number;
  item_id: number;
}

export interface ClientCredit {
  available_credit: number;
  available_equipment_credit: number | null;
  eligible_line: EligibleLine[];
}

export interface EligibleLine {
  vivo_m_classification: number;
  eligible: boolean;
  phone: string;
}

export interface PriceSummary {
  credit_used: number;
  installment_total: number;
  number_of_installments: number;
  total: number;
}

export interface Prospects {
  fixed_ip: boolean;
  insurance: boolean;
  iphone_17: boolean;
  new_line: boolean;
  portability: boolean;
}

export interface Reserve {
  email: string | null;
  model: string | null;
  quantity: number | null;
}

export interface Geolocation {
  cep_mais_proximo: string;
  consultado_em: string;
  distancia_km_ponto_mais_proximo: number;
  endereco_formatado: string;
  latitude: string;
  longitude: string;
  link_maps: string;
  link_street_view: string;
  precisao: string;
  sucesso: boolean;
}

export type IOrderCreatePayload = Partial<IOrder> & {
  items?: Item[];
};
