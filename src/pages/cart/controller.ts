import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PurchaseService } from "@/services/purchase";
import { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { setPrefilledVariables } from "@typebot.io/react";
import { buildPartnerPath } from "@/configs/partnerRuntime";
import { usePartner } from "@/context/PartnerContext";
import { IDevicesResponse } from "@/interfaces/devices";
import { useDisclosure } from "@/hooks/useDisclosure";
import { usePurchaseFieldPatcher } from "@/hooks/usePurchaseFieldPatcher";
import { usePurchaseItemsBatchPatcher } from "@/hooks/usePurchaseItemsBatchPatcher";

function getMutationErrorMessage(error: unknown, fallback: string) {
  const typedError = error as {
    response?: { data?: { erro?: string; message?: string } };
    message?: string;
  };

  return typedError?.response?.data?.message || typedError?.message || fallback;
}

export function usePurchaseController({ id }: { id: string | undefined }) {
  const purchaseService = new PurchaseService();
  const queryClient = useQueryClient();
  const partnerRuntime = usePartner();

  const { data: purchaseByIdQuery, isFetching: isPurchaseDataLoading } =
    useQuery<any | null>({
      refetchOnWindowFocus: false,
      queryKey: ["purchaseById", id],
      queryFn: async (): Promise<any | null> => {
        if (!id) return null;
        const response = await purchaseService.getPurchaseById(id);

        sessionAlgumaCoisa(response);
        return response ?? null;
      },
    });

  const productsQuery = useQuery<IDevicesResponse>({
    refetchOnWindowFocus: false,
    queryKey: ["products"],
    queryFn: async (): Promise<IDevicesResponse> => {
      const response = await purchaseService.allProducts();
      return response;
    },
  });

  const purchaseRecord = purchaseByIdQuery?.order ?? purchaseByIdQuery;

  const { mutate: updatePurchase, isPending: isItensUpdateLoading } =
    useMutation({
      mutationFn: async (data: Record<string, unknown>) => {
        const resolvedOrderId = id || purchaseRecord?.id;

        if (!resolvedOrderId) {
          throw new Error("ID do pedido nao encontrado para atualizar.");
        }

        return purchaseService.updatePurchase(resolvedOrderId, data);
      },
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["purchaseById"] }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["purchaseById", id] });
      },
      onError: (error) => {
        toast.error(
          getMutationErrorMessage(
            error,
            "Houve um erro ao alterar o carrinho. Tente novamente",
          ),
        );
        console.error(error.message);
      },
    });

  const { patchFields, patchBooleanField } = usePurchaseFieldPatcher({
    orderId: id,
    hasPurchaseData: !!purchaseByIdQuery,
    updatePurchase,
  });

  const { mutate: updateCartItemsBatch, isPending: isItemBatchUpdateLoading } =
    useMutation({
      mutationFn: async ({
        orderId,
        patches,
      }: {
        orderId: string | number;
        patches: Array<{
          item_id: number;
          quantity?: number;
          selected_color?: string;
        }>;
      }) => {
        return purchaseService.updateCartItemsBatch(orderId, patches);
      },
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["purchaseById"] }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["purchaseById", id] });
      },
      onError: (error) => {
        toast.error(
          getMutationErrorMessage(
            error,
            "Houve um erro ao alterar os itens do carrinho. Tente novamente",
          ),
        );
        console.error(error.message);
      },
    });

  const { patchCartItems } = usePurchaseItemsBatchPatcher({
    orderId: id,
    hasPurchaseData: !!purchaseByIdQuery,
    updateCartItemsBatch,
  });

  const { mutate: updatePayment, isPending: isPaymentUpdateLoading } =
    useMutation({
      mutationFn: async (data: Record<string, unknown>) => {
        const resolvedOrderId = id || purchaseRecord?.id;

        if (!resolvedOrderId) {
          throw new Error(
            "ID do pedido nao encontrado para atualizar o pagamento.",
          );
        }

        return purchaseService.updatePurchase(resolvedOrderId, data);
      },
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["purchaseById"] }),
      onSuccess: () => {
        toast.success("Pagamento alterado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["purchaseById", id] });
      },
      onError: (error) => {
        toast.error(
          getMutationErrorMessage(
            error,
            "Houve um erro ao alterar o pagamento. Tente novamente",
          ),
        );
        console.error(error.message);
      },
    });

  const { mutate: removeItem, isPending: isRemoveItemLoading } = useMutation({
    mutationFn: async ({ id, device_id }: { id: number; device_id: number }) =>
      purchaseService.removeItemFromOrder(id, device_id),
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["purchaseById"] }),
    onError: (error) => {
      toast.error("Houve um erro ao remover o item. Tente novamente");
      console.error(error.message);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["purchaseById", id] });
      toast.success("Item removido com sucesso!");
    },
  });

  const { mutate: removeInsurance, isPending: isRemoveInsuranceLoading } =
    useMutation({
      mutationFn: async ({ id, itemId }: { id: number; itemId: number }) =>
        purchaseService.removeInsuranceFromProduct(id, itemId),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["orderById"] }),
      onError: (error) => {
        toast.error("Houve um erro ao remover o seguro. Tente novamente");
        console.error(error.message);
      },
      onSuccess: () => {
        toast.success("Seguro removido com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["purchaseById", id] });
      },
    });

  const { mutate: addItemInChart, isPending: isAddItemInChartLoading } =
    useMutation({
      mutationFn: async ({ id, data }: { id: string; data: any }) =>
        purchaseService.addProductInChart(id, data),
      onMutate: async () =>
        await queryClient.cancelQueries({ queryKey: ["purchaseById"] }),
      onSuccess: () => {
        toast.success("Carrinho alterado com sucesso!");
        queryClient.invalidateQueries({ queryKey: ["purchaseById", id] });
      },
      onError: (error) => {
        toast.error("Houve um erro ao alterar o carrinho. Tente novamente");
        console.error(error.message);
      },
    });

  const handleAddItemInChart = (produto: any) => {
    if (id) {
      addItemInChart({ id, data: produto });
    } else {
      console.log("ID do carrinho não encontrado!");
    }
  };

  const { mutate: changePurchaseChartStatus } = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { status: string };
    }) => {
      const resolvedId =
        id || purchaseRecord?.id || sessionStorage.getItem("carrinhoId") || "";

      if (!resolvedId) {
        throw new Error("ID do pedido nao encontrado para finalizar.");
      }

      return purchaseService.changePurchaseStatus(String(resolvedId), data);
    },
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["clients"] }),
    onSuccess: () => {
      toast.success("Pedido finalizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["purchaseById", id] });
    },
    onError: (error) => {
      toast.error(
        getMutationErrorMessage(error, "Houve um erro ao finalizar o pedido."),
      );
      console.error(error.message);
    },
  });

  // Estados e funções para alterar cor, quantidade e forma de pagamento
  const [selectedColor, setSelectedColors] = useState<
    { id: number; color: string }[]
  >([]);
  const changeSelectedColor = (id: number, newColor: string) => {
    setSelectedColors((prev) => {
      const exists = prev.find((p) => p.id === id);
      if (exists) {
        return prev.map((p) => (p.id === id ? { ...p, color: newColor } : p));
      }
      return [...prev, { id, color: newColor }];
    });
  };

  const [selectedQtd, setSelectedQtd] = useState<
    { id: number; quantity: number }[]
  >([]);
  const changeSelectedQtd = (id: number, newQtd: number) => {
    setSelectedQtd((prev) => {
      const exists = prev.find((p) => p.id === id);
      if (exists) {
        return prev.map((p) => (p.id === id ? { ...p, quantity: newQtd } : p));
      }
      return [...prev, { id, quantity: newQtd }];
    });
  };

  const [formaPagamento, setFormaPagamento] = useState<string | undefined>(
    undefined,
  );
  const changeFormaPagamento = (newFormaPagamento: string) => {
    setFormaPagamento(newFormaPagamento);
  };

  function sessionAlgumaCoisa(purchase: any | null) {
    const currentPurchase = purchase?.order ?? purchase;

    if (id) {
      setPrefilledVariables({
        CarrinhoId: id || "",
        CnpjUser: currentPurchase?.cnpj || "",
        NomeEmpresa: currentPurchase?.company_legal_name || "",
        NomeUser: currentPurchase?.full_name || "",
        TelefoneUser: currentPurchase?.phone || "",
      });
    }
    if (currentPurchase?.payment_method) {
      changeFormaPagamento(currentPurchase.payment_method);
    }
    if (currentPurchase?.items?.length) {
      const qtdInicial = currentPurchase.items.map((item: any) => ({
        id: item.item_id,
        quantity: item.quantity,
      }));
      setSelectedQtd(qtdInicial);
    }
  }

  const updateItemQuantity = (itemId: number, newQtd: number) => {
    changeSelectedQtd(itemId, newQtd);
    patchCartItems([
      {
        item_id: itemId,
        quantity: newQtd,
      },
    ]);
  };

  const updateItemColor = (itemId: number, newColor: string) => {
    changeSelectedColor(itemId, newColor);
    patchCartItems([
      {
        item_id: itemId,
        selected_color: newColor,
      },
    ]);
  };

  const updatePossivelProspect = (possivel_prospect_nova_linha: number) => {
    patchBooleanField(
      "possivel_prospect_nova_linha",
      possivel_prospect_nova_linha,
    );
  };

  const updatePossivelProspectSeguro = (possivel_prospect_seguro: number) => {
    patchBooleanField("possivel_prospect_seguro", possivel_prospect_seguro);
  };

  const saveSelectedSeguro = (
    item_id: number,
    insurance_type: string,
    insurance_price: number,
  ) => {
    patchCartItems([
      {
        item_id: item_id,
        insurance_type: insurance_type || null,
        insurance_price: insurance_type ? insurance_price : null,
      },
    ]);
  };

  // Função para atualizar fatura especificamente
  const savePurchasePaymentWhenNotAproved = () => {
    if (!purchaseRecord || !id) return;

    const newPaymentMethod = "fatura vivo+cartao credito";
    changeFormaPagamento(newPaymentMethod);
    updatePayment({ payment_method: newPaymentMethod });
  };

  const updateParcelamentoValues = (installments: number) => {
    patchFields({
      price_summary: {
        ...(purchaseRecord?.price_summary ?? {}),
        number_of_installments: installments,
      },
    });
  };

  // Modal
  const modal = useDisclosure();
  const showModal = modal.open;
  const closeModal = modal.close;

  //Navigate
  const navigate = useNavigate();
  const returnToCatalog = () => {
    navigate(buildPartnerPath(partnerRuntime, "catalog"));
  };

  const updateData = (formValues: Record<string, unknown>) => {
    return new Promise((resolve) => {
      // console.log("Payload enviado para updatePurchase:", formValues);
      updatePurchase(formValues, {
        onSuccess: () => {
          toast.success("Carrinho alterado com sucesso!");
          resolve(true);
        },
        onError: () => {
          resolve(false);
        },
      });
    });
  };

  return {
    updatePossivelProspect,
    updatePossivelProspectSeguro,
    purchaseData: purchaseByIdQuery,
    productFiltered: productsQuery.data,
    updatePurchase,
    removeItem,
    updateData,
    selectedColor,
    changeSelectedColor,
    updateItemColor,
    selectedQtd,
    changeSelectedQtd,
    updateItemQuantity,
    formaPagamento,
    changeFormaPagamento,
    addItemInChart,
    isModalOpen: modal.isOpen,
    showModal,
    closeModal,
    returnToCatalog,
    updateParcelamentoValues,
    handleAddItemInChart,
    changePurchaseChartStatus,
    savePurchasePaymentWhenNotAproved,
    saveSelectedSeguro,
    removeInsurance,
    isRemoveInsuranceLoading,
    isPaymentUpdateLoading,
    isItemBatchUpdateLoading,

    isItensLoading:
      isItensUpdateLoading ||
      isItemBatchUpdateLoading ||
      isRemoveItemLoading ||
      isAddItemInChartLoading,
    isAllDataLoading:
      isItensUpdateLoading ||
      isItemBatchUpdateLoading ||
      isPaymentUpdateLoading ||
      isPurchaseDataLoading ||
      isRemoveItemLoading ||
      isAddItemInChartLoading,
  };
}
