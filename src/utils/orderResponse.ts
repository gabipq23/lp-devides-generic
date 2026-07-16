export const getCreatedOrderId = (response: any) =>
  response?.order?.id ??
  response?.order_id ??
  response?.id_formatado ??
  response?.id ??
  response?.order_id;

const ORDER_TOKENS_STORAGE_KEY = "order-tokens-by-id";

export const getCreatedOrderToken = (response: any) =>
  response?.order_token ??
  response?.token ??
  response?.order?.order_token ??
  null;

export const getCreatedOrderTokenExpiresAt = (response: any) =>
  response?.expires_at ?? response?.order_token_expires_at ?? null;

function readOrderTokensMap(): Record<
  string,
  { token: string; expiresAt?: string | null }
> {
  const raw = sessionStorage.getItem(ORDER_TOKENS_STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<
      string,
      { token: string; expiresAt?: string | null }
    >;
  } catch {
    return {};
  }
}

function writeOrderTokensMap(
  map: Record<string, { token: string; expiresAt?: string | null }>,
) {
  sessionStorage.setItem(ORDER_TOKENS_STORAGE_KEY, JSON.stringify(map));
}

export function persistOrderTokenByOrderId(
  orderId: string | number,
  token: string,
  expiresAt?: string | null,
) {
  if (!orderId || !token) {
    return;
  }

  const map = readOrderTokensMap();
  map[String(orderId)] = {
    token,
    expiresAt: expiresAt ?? null,
  };
  writeOrderTokensMap(map);
}

export function persistOrderTokenFromCreateResponse(
  orderId: string | number,
  response: any,
) {
  const token = getCreatedOrderToken(response);
  const expiresAt = getCreatedOrderTokenExpiresAt(response);

  if (!token) {
    return;
  }

  persistOrderTokenByOrderId(orderId, token, expiresAt);
}

export function getOrderTokenByOrderId(orderId: string | number) {
  if (!orderId) {
    return null;
  }

  const map = readOrderTokensMap();
  return map[String(orderId)]?.token ?? null;
}

export const getCreatedOrderSessionData = (response: any) => ({
  cnpj: response?.order?.cnpj ?? response?.cnpj ?? "",
  companyName:
    response?.order?.company_legal_name ?? response?.order?.full_name ?? "",
  customerName: response?.order?.full_name ?? "",
  phone: response?.order?.phone ?? "",
});
