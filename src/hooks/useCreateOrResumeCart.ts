import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { buildPartnerPath } from "@/configs/partnerRuntime";
import { usePartner } from "@/context/PartnerContext";
import type { IDevices } from "@/interfaces/devices";
import { PurchaseService } from "@/services/purchase";
import { buildCreateOrderPayload } from "@/utils/orderBuilder";
import {
  getCreatedOrderId,
  getCreatedOrderSessionData,
  persistOrderTokenByOrderId,
  persistOrderTokenFromCreateResponse,
} from "@/utils/orderResponse";
import { Fingerprint } from "@/utils/getFingerprintInfo";

type SendInfoValues = {
  cnpj: string;
  full_name: string;
  phone: string;
  client_ip: string;
  fingerprint: Fingerprint;
};

type ProductLike = (Partial<IDevices> & { id: number }) | null;

type CreateOrResumeCartArgs<TProduct extends ProductLike> = {
  formValues: SendInfoValues;
  productDetail: TProduct;
  requireProduct?: boolean;
  landingPage?: string;
  category?: string;
  existingCartInfoMessage?: string;
};

type UseCreateOrResumeCartOptions<TProduct extends ProductLike> = {
  createChartCancelQueryKey?: QueryKey;
  createChartInvalidateQueryKey?: QueryKey;
  addItemToExistingCart?: (payload: {
    id: string;
    data: any;
  }) => Promise<unknown>;
  getExistingCartItemData?: (product: NonNullable<TProduct>) => any;
  createCartErrorMessage?: string;
};

type CreateOrResumeCartResult = {
  success: boolean;
  cartId?: string;
  reusedExistingCart?: boolean;
};

function parseApiError(error: unknown) {
  const typedError = error as {
    response?: { data?: { erro?: string } };
    erro?: string;
    message?: string;
  };

  return (
    typedError?.response?.data?.erro ||
    typedError?.erro ||
    typedError?.message ||
    "Erro ao criar o carrinho."
  );
}

function persistSessionFromExistingCart(carrinho: {
  id: string | number;
  company_legal_name?: string;
  cnpj: string;
  order_token?: string;
  expires_at?: string;
}) {
  sessionStorage.setItem("carrinhoId", String(carrinho.id));
  sessionStorage.setItem("nomeEmpresa", carrinho?.company_legal_name || "");
  sessionStorage.setItem("cnpjEmpresa", carrinho.cnpj);

  if (carrinho.order_token) {
    persistOrderTokenByOrderId(
      carrinho.id,
      carrinho.order_token,
      carrinho.expires_at,
    );
  }
}

function persistSessionFromCreatedCart(
  createdOrderId: string | number,
  response: unknown,
) {
  const createdOrderSessionData = getCreatedOrderSessionData(response);

  sessionStorage.setItem("carrinhoId", String(createdOrderId));
  sessionStorage.setItem("cnpjEmpresa", createdOrderSessionData.cnpj);
  sessionStorage.setItem("nomeEmpresa", createdOrderSessionData.companyName);
  sessionStorage.setItem("nomeComprador", createdOrderSessionData.customerName);
  sessionStorage.setItem("telefoneComprador", createdOrderSessionData.phone);
}

export function useCreateOrResumeCart<TProduct extends ProductLike>(
  options: UseCreateOrResumeCartOptions<TProduct> = {},
) {
  const {
    createChartCancelQueryKey = ["chart"],
    createChartInvalidateQueryKey = ["chart"],
    addItemToExistingCart,
    getExistingCartItemData,
    createCartErrorMessage = "Houve um erro ao criar o carrinho. Tente novamente",
  } = options;

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const partnerRuntime = usePartner();
  const purchaseService = new PurchaseService();

  const { mutateAsync: createChart, isPending: isCreatingChartLoading } =
    useMutation({
      mutationFn: async ({
        data,
      }: {
        data: Parameters<typeof purchaseService.createChart>[0];
      }) => purchaseService.createChart(data),
      onMutate: async () => {
        await queryClient.cancelQueries({
          queryKey: createChartCancelQueryKey,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: createChartInvalidateQueryKey,
        });
      },
      onError: (error) => {
        console.error(error);
      },
    });

  const createOrResumeCart = async (
    args: CreateOrResumeCartArgs<TProduct>,
  ): Promise<CreateOrResumeCartResult> => {
    const {
      formValues,
      productDetail,
      requireProduct = false,
      landingPage = "aparelhos",
      category = "aparelhos",
      existingCartInfoMessage = "Você já possui um carrinho aberto. Redirecionando...",
    } = args;

    if (requireProduct && !productDetail) {
      toast.error("Produto não encontrado.");
      return { success: false };
    }

    try {
      const openCartResponse = await purchaseService.checkForOpenCart(
        formValues.cnpj,
      );

      const openCarts =
        openCartResponse?.relacao_carrinhos?.filter(
          (cart: any) => cart.status === "ABERTO",
        ) ?? [];

      if (openCarts.length > 0) {
        const latestCart = openCarts[0];

        persistSessionFromExistingCart({
          id: latestCart.id,
          cnpj: openCartResponse.cnpj,
          company_legal_name: openCartResponse.razao_social,
          order_token: latestCart.order_token,
          expires_at: latestCart.expires_at,
        });

        if (productDetail && addItemToExistingCart && getExistingCartItemData) {
          await addItemToExistingCart({
            id: String(latestCart.id),
            data: getExistingCartItemData(
              productDetail as NonNullable<TProduct>,
            ),
          });
        }

        navigate(
          buildPartnerPath(partnerRuntime, "cart", String(latestCart.id)),
        );

        window.scrollTo(0, 0);

        toast.info(existingCartInfoMessage);

        return {
          success: true,
          reusedExistingCart: true,
          cartId: String(latestCart.id),
        };
      }

      const payload = buildCreateOrderPayload(
        formValues,
        productDetail,
        partnerRuntime.partner_id,
        partnerRuntime.partner?.company_id,
        {
          landingPage,
          category,
        },
      );

      const response = await createChart({
        data: payload,
      });

      toast.success("Carrinho criado com sucesso!");

      const createdOrderId = getCreatedOrderId(response);

      if (!createdOrderId) {
        toast.error("Não foi possível redirecionar: id do pedido ausente.");
        return { success: false };
      }

      persistSessionFromCreatedCart(createdOrderId, response);
      persistOrderTokenFromCreateResponse(createdOrderId, response);

      navigate(
        buildPartnerPath(partnerRuntime, "cart", String(createdOrderId)),
      );

      window.scrollTo(0, 0);

      return {
        success: true,
        reusedExistingCart: false,
        cartId: String(createdOrderId),
      };
    } catch (error) {
      const errorMessage = parseApiError(error);

      console.error("[createOrResumeCart] Erro:", error);
      console.error("[createOrResumeCart] Mensagem:", errorMessage);

      toast.error(errorMessage || createCartErrorMessage);

      return {
        success: false,
      };
    }
  };
  return {
    createOrResumeCart,
    createChart,
    isCreatingChartLoading,
  };
}
