import { api } from "@/configs/api";
export type IPartnerResponse = {
  success: boolean;
  partner: {
    partner_id: number;
    partner_name: string;
    logo_url: string;
    partner_hash: string;
    company_id: number;
    cnpj: string;
    email: string;
    manager_name: string;
    telephone: string;
    uf: string[];
    client_type: string[];
    category: string[];
    company_legal_name: string;
  };
};
export class PartnerService {
  async getPartnerByHash(hash: string): Promise<IPartnerResponse> {
    const res = await api.get(`/partner-resolver/by-hash/${hash}`);
    return res.data;
  }
}
