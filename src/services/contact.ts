import { api } from "@/configs/api";
import { ICreateContact, ICreateContactResponse } from "@/interfaces/contact";

// OK
export class ContactService {
  async create(contact: ICreateContact): Promise<ICreateContactResponse> {
    const res = await api.post("/telecom/vivo/messages", contact);
    return res.data;
  }
}
