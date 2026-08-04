import { IDevices } from "@/interfaces/devices";
import { Fingerprint, IOrderCreatePayload, Item } from "@/interfaces/order";
import { vivoPartnerConfig } from "@/configs/partnerRuntime";

type OrderFormValues = {
  cnpj: string;
  full_name: string;
  phone: string;
  client_ip: string;
  fingerprint: Fingerprint;
  url: string;
  lp_url: string;
};

type OrderProductLike = Partial<IDevices> & { id: number };

type BuildOrderPayloadOptions = {
  landingPage?: string;
  category?: string;
  company?: string;
  clientType?: "PF" | "PJ";
  ipAccessType?: string;
  isOrder?: boolean;
  isConsultation?: boolean;
};

function getOrderProductName(product: OrderProductLike) {
  return product.model ?? product.model ?? product.name ?? "";
}

function getOrderProductBrand(product: OrderProductLike) {
  return product.brand ?? product.brand ?? "";
}

function getOrderProductType(product: OrderProductLike) {
  return product.type ?? product.type ?? "";
}

function getOrderProductColors(product: OrderProductLike) {
  return (product.available_colors ?? []).flatMap((color) =>
    color
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

function getRandomOrderProductColor(colors: string[]) {
  if (colors.length === 0) {
    return "";
  }

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex] ?? "";
}

function buildOrderItem(product: OrderProductLike): Item {
  const unitPrice = Number(product.price_24x ?? product.price_24x ?? 0) * 24;
  const installmentAmount = Number(product.price_24x ?? product.price_24x ?? 0);
  const colors = getOrderProductColors(product);
  const selectedColor = getRandomOrderProductColor(colors);

  return {
    available_colors: colors,
    brand: getOrderProductBrand(product),
    device_id: product.id,
    item_id: 0,
    installment_amount: installmentAmount,
    insurance_price: null,
    insurance_type: null,
    model: getOrderProductName(product),
    quantity: 1,
    sap_code: product.sap_code ?? product.sap_code ?? "",
    selected_color: selectedColor,
    total_installment_amount: unitPrice,
    type: getOrderProductType(product),
    unit_price: unitPrice,
  };
}

function toValidId(
  value: string | number | null | undefined,
  fallback: string | number,
) {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return Number(fallback);
}

export function buildCreateOrderPayload(
  formValues: OrderFormValues,
  productDetail: OrderProductLike | null,
  partner_id: string | number | null | undefined,
  company_id: string | number | null | undefined,
  options: BuildOrderPayloadOptions = {},
): IOrderCreatePayload {
  const item = productDetail ? buildOrderItem(productDetail) : null;
  const items = item ? [item] : [];
  const installmentTotal = items.reduce(
    (sum, currentItem) => sum + Number(currentItem.installment_amount ?? 0),
    0,
  );
  const total = items.reduce(
    (sum, currentItem) =>
      sum + Number(currentItem.total_installment_amount ?? 0),
    0,
  );

  const resolvedPartnerId = toValidId(partner_id, vivoPartnerConfig.partner_id);
  const resolvedCompanyId = toValidId(company_id, vivoPartnerConfig.company_id);

  return {
    business_partner: undefined,
    category: options.category ?? "aparelhos",
    client_ip: formValues.client_ip ?? "",
    client_type: options.clientType ?? "PJ",
    company: options.company ?? "VIVO",
    company_id: resolvedCompanyId,
    fingerprint: formValues.fingerprint,
    ip_access_type: options.ipAccessType ?? "movel",
    is_consultation: options.isConsultation ?? false,
    is_order: options.isOrder ?? true,
    landing_page: options.landingPage ?? "aparelhos",
    lp_url: formValues.lp_url,
    order_id: undefined,
    order_number: undefined,
    partner_id: resolvedPartnerId,
    url: formValues.url,
    cnpj: formValues.cnpj,
    additional_email: undefined,
    additional_operator: undefined,
    additional_phone_valid: undefined,
    additional_portability: undefined,
    additional_portability_date: undefined,
    full_name: formValues.full_name,
    is_additional_email_valid: undefined,
    operator: undefined,
    phone: formValues.phone,
    phone_valid: undefined,
    portability: undefined,
    portability_date: undefined,
    address: undefined,
    address_complement: undefined,
    address_note: undefined,
    address_number: undefined,
    city: undefined,
    district: undefined,
    state: undefined,
    zip_code: undefined,
    items,
    total_number_of_devices: items.length,
    payment_method: "fatura vivo",
    price_summary: {
      credit_used: 0,
      installment_total: installmentTotal,
      number_of_installments: 24,
      total,
    },
    prospects: {
      fixed_ip: false,
      insurance: false,
      iphone_17: false,
      new_line: false,
      portability: false,
    },
    reserve: {
      email: null,
      model: null,
      quantity: null,
    },
    after_sales_status: undefined,
    responsible_consultant: undefined,
    closed_at: undefined,
    consultant_notes: undefined,
    consultant_observation: undefined,
    corporate_id: undefined,
    created_at: undefined,
    crm_id: undefined,
    geolocation: undefined,
    input_crm: undefined,
    updated_at: undefined,
    team: undefined,
    status: undefined,
    second_call_data: undefined,
    second_call_token: undefined,
    second_call_token_expires_at: undefined,
  };
}
