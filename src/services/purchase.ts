import { api } from "@/configs/api";
import { ICredit } from "@/interfaces/credit";
import { IDevicesResponse } from "@/interfaces/devices";
import { IOrderCreatePayload } from "@/interfaces/order";
import {
  getOrderTokenByOrderId,
  persistOrderTokenByOrderId,
} from "@/utils/orderResponse";

export class PurchaseService {
  private getOrderTokenHeaders(orderId: string | number) {
    const token = getOrderTokenByOrderId(orderId);

    if (!token) {
      throw new Error(
        `Token do pedido ${String(orderId)} nao encontrado. Crie/reabra o pedido para obter um token valido.`,
      );
    }

    return {
      Authorization: `Bearer ${token}`,
    };
  }

  // OK
  async allProducts(): Promise<IDevicesResponse> {
    const res = await api.get(`/telecom/devices`, {
      params: { is_online: true },
    });
    return res.data;
  }

  async createChart(data: IOrderCreatePayload) {
    const response = await api.post(`/telecom/vivo/orders`, data);
    return response?.data;
  }

  async getPurchaseById(id: string): Promise<any | null> {
    if (!id) {
      return null;
    }
    const res = await api.get(`/telecom/vivo/orders/${id}`, {
      headers: this.getOrderTokenHeaders(id),
    });

    const responseData = res.data;
    const responseToken = responseData?.order_token;
    const responseExpiresAt = responseData?.expires_at;

    if (responseToken) {
      persistOrderTokenByOrderId(id, responseToken, responseExpiresAt);
    }

    return res.data;
  }

  async checkForOpenCart(cnpj: string) {
    const response = await api.post(`/telecom/orders/check-cart`, { cnpj });
    return response.data;
  }

  async removeItemFromOrder(id: number, item: number) {
    await api.delete(`/telecom/orders/${id}/cart/items/${item}`);
  }

  async addProductInChart(id: string, data: any) {
    await api.post(`/telecom/orders/${id}/cart/items`, data);
  }

  async removeInsuranceFromProduct(id: number, itemId: number) {
    await api.delete(`/telecom/orders/${id}/cart/items/${itemId}/insurance`);
  }

  // ja esta com a rota porem falta acertar lógica
  async updatePurchase(
    orderId: string | number,
    data: Record<string, unknown>,
  ): Promise<any> {
    if (!orderId) {
      throw new Error(
        "Nao foi possivel atualizar: order_id ausente no contexto.",
      );
    }

    const res = await api.put(`/telecom/vivo/orders/${orderId}`, data, {
      headers: this.getOrderTokenHeaders(orderId),
    });
    return res.data;
  }

  async updateCartItemsBatch(
    orderId: string | number,
    patches: Array<{
      item_id: number;
      quantity?: number;
      selected_color?: string;
    }>,
  ): Promise<any> {
    if (!orderId) {
      throw new Error(
        "Nao foi possivel atualizar: order_id ausente no contexto.",
      );
    }

    const res = await api.put(
      "/telecom/orders/cart/items/batch",
      {
        order_id: Number(orderId),
        patches,
      },
      {
        headers: this.getOrderTokenHeaders(orderId),
      },
    );

    return res.data;
  }

  async changePurchaseStatus(id: string, data: { status: string }) {
    await api.patch(`/telecom/vivo/orders/${id}/status`, data, {
      headers: this.getOrderTokenHeaders(id),
    });
  }

  //falta criar no back

  async getClientCreditByCnpj(cnpj: string): Promise<ICredit> {
    const res = await api.get(`/creditos/${cnpj}`);
    return res.data;
  }
}
