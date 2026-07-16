import { IPartnerResponse, PartnerService } from "@/services/partner";

export const DEFAULT_PARTNER_CODE = "vivo";
export const DEFAULT_VERSION = "0";
export const DEFAULT_PRODUCT_TYPE = "aparelhos" as const;

export type ProductType = "aparelhos" | "equipamentos";

export type ProductTypeConfig = {
  key: ProductType;
  label: string;
  otherType: ProductType;
  routePrefix: ProductType;
  catalogTitle: string;
  otherSectionTitle: string;
  otherSectionDescription: string;
  otherSectionCta: string;
};

export type PartnerBannerSet = {
  mobile: string[];
  desktop: string[];
};

export type PartnerInfoBannerSet = {
  shippingText: string;
  installmentText: string;
  paymentText: string;
  paymentLogos: string[];
};

export type PartnerConfig = {
  code: string;
  partner_id: string | number;
  company_id: string | number;
  partner_name: string;
  logo_url: string;
  headerRightHref: string;
  // footerDescription: string;
};

export type PartnerRuntime = {
  type: ProductType;
  typeConfig: ProductTypeConfig;
  tenantCode: string;
  version: string;
  partner_id: number | string;
  partner: PartnerConfig;
  isDefaultPartner: boolean;
};

const RESERVED_ROUTE_SEGMENTS = ["carrinho", "pedido", "iphone-17"] as const;

const SESSION_KEYS = {
  runtime: "partner-runtime",
} as const;

function normalizePartnerRuntime(
  raw: Partial<PartnerRuntime> | null | undefined,
): PartnerRuntime {
  const type: ProductType =
    raw?.type && isProductType(raw.type) ? raw.type : DEFAULT_PRODUCT_TYPE;

  const typeConfig = productTypeRegistry[type];

  const partner: PartnerConfig = raw?.partner
    ? {
        code: raw.partner.code || DEFAULT_PARTNER_CODE,
        partner_id: raw.partner.partner_id ?? vivoPartnerConfig.partner_id,
        company_id: raw.partner.company_id ?? vivoPartnerConfig.company_id,
        partner_name: raw.partner.partner_name || "",
        logo_url: raw.partner.logo_url || "",
        headerRightHref: raw.partner.headerRightHref || "",
      }
    : vivoPartnerConfig;

  const tenantCode = String(
    raw?.tenantCode || partner.code || DEFAULT_PARTNER_CODE,
  );
  const version = String(raw?.version || DEFAULT_VERSION);
  const partner_id = raw?.partner_id ?? partner.partner_id;

  return {
    type,
    typeConfig,
    tenantCode,
    version,
    partner_id,
    partner,
    isDefaultPartner: isDefaultPartnerCode(tenantCode),
  };
}

export function persistPartnerRuntime(runtime: PartnerRuntime) {
  sessionStorage.setItem(
    SESSION_KEYS.runtime,
    JSON.stringify(normalizePartnerRuntime(runtime)),
  );
}

const DEFAULT_OTHER_SECTION_DESCRIPTION =
  "Ofertas exclusivas para nossos clientes.";

function mapPartner(partner: IPartnerResponse["partner"]): PartnerConfig {
  return {
    code: partner.partner_hash,
    partner_id: partner.partner_id,
    company_id: partner.company_id,
    partner_name: partner.partner_name,
    logo_url: partner.logo_url,
    headerRightHref: "",
  };
}

export const productTypeRegistry: Record<ProductType, ProductTypeConfig> = {
  aparelhos: {
    key: "aparelhos",
    label: "Aparelhos",
    otherType: "equipamentos",
    routePrefix: "aparelhos",
    catalogTitle: "Ofertas de aparelhos",
    otherSectionTitle: "Conheça nossos equipamentos",
    otherSectionDescription: DEFAULT_OTHER_SECTION_DESCRIPTION,
    otherSectionCta: "Ver equipamentos",
  },
  equipamentos: {
    key: "equipamentos",
    label: "Equipamentos",
    otherType: "aparelhos",
    routePrefix: "equipamentos",
    catalogTitle: "Ofertas de equipamentos",
    otherSectionTitle: "Conheça nossos aparelhos",
    otherSectionDescription: DEFAULT_OTHER_SECTION_DESCRIPTION,
    otherSectionCta: "Ver aparelhos",
  },
};

export const defaultBanner: PartnerBannerSet = {
  mobile: [
    "/assets/banner2026/banner vivo empresas-iphone16e-mobile.jpeg",
    "/assets/banner vivo empresas - zurich mobile.jpg",
  ],
  desktop: [
    "/assets/banner2026/banner vivo empresas-iphone16e-desk.jpeg",
    "/assets/banner vivo empresas - zurich.jpg",
  ],
};

export const vivoPartnerConfig: PartnerConfig = {
  code: DEFAULT_PARTNER_CODE,
  partner_id: "9",
  company_id: "9",
  partner_name: "",
  logo_url: "",
  headerRightHref: "",
  // footerDescription: "",
};

// export const mockPartnerRegistry: Record<string, PartnerConfig> = {
//   hu8o: {
//     code: "Hu8O",
//     partner_id: "partner-hu8o-001",
//     partner_name: "Gold",
//     logo_url: "/assets/logo-site.png",
//     headerRightHref: "https://www.goldempresas.com.br/",
//     // footerDescription:
//     //   "Atendemos mais de 40 mil empresas em todo o país, de diferentes portes e segmentos, oferecendo soluções personalizadas para cada necessidade. Contamos com uma equipe de mais de 100 colaboradores, comprometidos em ajudar empresas e pessoas a potencializarem seus resultados por meio da tecnologia.",
//   },

//   gw2t: {
//     code: "Gw2T",
//     partner_id: "partner-gw2t-001",
//     partner_name: "MS Connect",
//     logo_url: "/assets/logo-ms-connect.png",
//     headerRightHref: "https://msconnect.com.br/",
//     // footerDescription: "",
//   },
// };

function isDefaultPartnerCode(code: string) {
  return code.toLowerCase() === DEFAULT_PARTNER_CODE;
}

function isReservedRouteSegment(segment: string) {
  return (RESERVED_ROUTE_SEGMENTS as readonly string[]).includes(segment);
}

function isProductType(segment: string): segment is ProductType {
  return segment === "aparelhos" || segment === "equipamentos";
}

function isVersionSegment(segment: string) {
  return /^\d+$/.test(segment);
}

const partnerService = new PartnerService();

async function resolvePartnerByHash(hash: string): Promise<{
  partner: PartnerConfig;
  partner_id: number | string;
} | null> {
  try {
    const response = await partnerService.getPartnerByHash(hash);

    if (!response.success) {
      return null;
    }

    const partner = mapPartner(response.partner);

    return {
      partner,
      partner_id: partner.partner_id,
    };
  } catch {
    return null;
  }
}

export function createDefaultPartnerRuntime(): PartnerRuntime {
  return {
    type: DEFAULT_PRODUCT_TYPE,
    typeConfig: productTypeRegistry[DEFAULT_PRODUCT_TYPE],
    tenantCode: DEFAULT_PARTNER_CODE,
    version: DEFAULT_VERSION,
    partner_id: vivoPartnerConfig.partner_id,
    partner: vivoPartnerConfig,
    isDefaultPartner: true,
  };
}

export function readPartnerRuntimeFromSession(): PartnerRuntime {
  const stored = sessionStorage.getItem(SESSION_KEYS.runtime);

  if (!stored) {
    return createDefaultPartnerRuntime();
  }

  try {
    const parsed = JSON.parse(stored) as Partial<PartnerRuntime>;
    return normalizePartnerRuntime(parsed);
  } catch {
    return createDefaultPartnerRuntime();
  }
}

export async function resolvePartnerRuntimeFromPath(
  pathname: string,
): Promise<PartnerRuntime> {
  const normalizedSegments = pathname.split("/").filter(Boolean);
  const firstSegment = normalizedSegments[0] ?? "";
  const normalizedFirst = firstSegment.toLowerCase();

  let type: ProductType = DEFAULT_PRODUCT_TYPE;
  let partner = vivoPartnerConfig;
  let partner_id = vivoPartnerConfig.partner_id;
  let version = DEFAULT_VERSION;
  let cursor = 0;

  if (isProductType(normalizedFirst)) {
    type = normalizedFirst;
    cursor = 1;
  }

  const typeConfig = productTypeRegistry[type];
  const currentSegment = normalizedSegments[cursor] ?? "";
  const nextSegment = normalizedSegments[cursor + 1] ?? "";

  const resolved = await resolvePartnerByHash(currentSegment);

  if (resolved) {
    partner = resolved.partner;
    partner_id = resolved.partner_id;
    cursor++;
  }

  const versionCandidate = normalizedSegments[cursor] ?? "";
  if (isVersionSegment(versionCandidate)) {
    version = versionCandidate;
  } else if (
    isProductType(normalizedFirst) &&
    !isReservedRouteSegment(versionCandidate) &&
    isVersionSegment(normalizedSegments[cursor + 2] ?? "")
  ) {
    const resolved = await resolvePartnerByHash(nextSegment);
    if (resolved) {
      partner = resolved.partner;
      partner_id = resolved.partner_id;
    }
    version = normalizedSegments[cursor + 2];
  }
  return {
    type,
    typeConfig,
    tenantCode: partner.code || DEFAULT_PARTNER_CODE,
    version,
    partner_id,
    partner,
    isDefaultPartner: isDefaultPartnerCode(partner.code),
  };
}

export function buildPartnerPath(
  runtime: Pick<PartnerRuntime, "type" | "tenantCode" | "version">,
  target: "catalog" | "cart" | "order" | "launch" = "catalog",
  id?: string,
) {
  const typeSegment = runtime.type || DEFAULT_PRODUCT_TYPE;
  const versionSegment = runtime.version || DEFAULT_VERSION;
  const basePath = isDefaultPartnerCode(runtime.tenantCode)
    ? `/${typeSegment}/${versionSegment}`
    : `/${typeSegment}/${runtime.tenantCode}/${versionSegment}`;

  if (target === "cart") {
    return `${basePath}/carrinho/${id ?? ""}`;
  }

  if (target === "order") {
    return `${basePath}/pedido/${id ?? ""}`;
  }

  if (target === "launch") {
    return `${basePath}/iphone-17`;
  }

  return basePath;
}

export function buildOtherTypePath(
  runtime: Pick<PartnerRuntime, "type" | "tenantCode" | "version">,
) {
  const otherType = productTypeRegistry[runtime.type].otherType;
  return buildPartnerPath(
    {
      ...runtime,
      type: otherType,
    },
    "catalog",
  );
}

export function isCatalogPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  return !segments.some((segment) => isReservedRouteSegment(segment));
}
