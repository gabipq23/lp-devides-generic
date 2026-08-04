import { api } from "@/configs/api";
import { IDevicesResponse } from "@/interfaces/devices";

export class ProductsService {
  //OK
  async allProducts(): Promise<IDevicesResponse> {
    const res = await api.get(`/telecom/devices`, {
      params: { is_online: true },
    });
    return res.data;
  }

  async addProductInChart(id: string, data: any) {
    await api.post(`/telecom/orders/${id}/cart/items`, data);
  }
}
