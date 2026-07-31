import { useState } from "react";
import { ProductsService } from "@/services/products";
import { useQuery } from "@tanstack/react-query";
import { IDevices, IDevicesResponse } from "@/interfaces/devices";
import { useAddItemInCartMutation } from "@/hooks/useAddItemInCartMutation";
import { useBrandFilter } from "@/hooks/useBrandFilter";
import { useCreateOrResumeCart } from "@/hooks/useCreateOrResumeCart";
import { useDisclosure } from "@/hooks/useDisclosure";
import { Fingerprint } from "@/utils/getFingerprintInfo";
// import { useSendProductIdMutation } from "@/hooks/useSendProductIdMutation";

export function usePhoneOffersController() {
  const [selectedProductDetail, setSelectedProductDetail] =
    useState<IDevices | null>(null);
  const modal = useDisclosure();

  const id = sessionStorage.getItem("carrinhoId");
  const parcelamentoQtd = sessionStorage.getItem("parcelamentoQTD");
  const modalBot = useDisclosure();

  const productsService = new ProductsService();

  const productsQuery = useQuery<IDevicesResponse>({
    refetchOnWindowFocus: false,
    queryKey: ["products"],
    queryFn: async (): Promise<IDevicesResponse> => {
      const response = await productsService.allProducts();
      return response;
    },
  });

  const products = productsQuery.data?.devices.filter(
    (product) => product.type === "Smartphone",
    // || product.tipo === "Tablet"
  );
  const { selectedBrand, resetSelectedBrand, items, productFiltered } =
    useBrandFilter(products);

  const { addItemInCart, addItemInCartAsync, isAddItemInChartLoading } =
    useAddItemInCartMutation<any>({
      addProductInChart: (cartId, data) =>
        productsService.addProductInChart(cartId, data),
    });

  const { createOrResumeCart, isCreatingChartLoading } =
    useCreateOrResumeCart<IDevices | null>({
      addItemToExistingCart: ({ id: cartId, data }) =>
        addItemInCartAsync({ id: cartId, data }),
      getExistingCartItemData: (product) => ({
        device_id: product.id,
        quantity: 1,
        selected_color: product.available_colors[0] || "",
        installments: 24,
      }),
    });

  const addItemInChart = addItemInCart;

  // const { sendProductId } = useSendProductIdMutation({
  //   sendProductIdFn: (productId) => productsService.sendProductId(productId),
  // });

  const showModal = modal.open;
  const closeModal = modal.close;

  const showModalBot = modalBot.open;
  const closeModalBot = modalBot.close;
  const changeSelectedProductDetail = (newSelectedProductDetail: IDevices) => {
    setSelectedProductDetail(newSelectedProductDetail);
  };
  const updateData = async (
    formValues: {
      cnpj: string;
      full_name: string;
      phone: string;
      client_ip: string;
      fingerprint: Fingerprint;
    },
    productDetail: IDevices | null,
  ) => {
    const result = await createOrResumeCart({
      formValues,
      productDetail,
      requireProduct: true,
      landingPage: "aparelhos",
      existingCartInfoMessage:
        "Você já possui um carrinho aberto. Item adicionado e redirecionando...",
    });

    return result.success;
  };

  return {
    productFiltered,
    selectedBrand,
    resetSelectedBrand,
    addItemInChart,
    items,
    isModalOpen: modal.isOpen,
    showModal,
    closeModal,
    selectedProductDetail,
    changeSelectedProductDetail,
    parcelamentoQtd,
    updateData,
    isCreatingChartLoading,
    id,
    // sendProductId,
    isAddItemInChartLoading,
    isModalBotOpen: modalBot.isOpen,
    showModalBot,
    closeModalBot,
  };
}
