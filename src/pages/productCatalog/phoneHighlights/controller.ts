import { ProductsService } from "@/services/products";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IDevices, IDevicesResponse } from "@/interfaces/devices";
import { useAddItemInCartMutation } from "@/hooks/useAddItemInCartMutation";
import { useBrandFilter } from "@/hooks/useBrandFilter";
import { useCreateOrResumeCart } from "@/hooks/useCreateOrResumeCart";
import { useDisclosure } from "@/hooks/useDisclosure";
// import { useSendProductIdMutation } from "@/hooks/useSendProductIdMutation";

export function usePhoneHighlightsController() {
  const [selectedProductDetail, setSelectedProductDetail] =
    useState<IDevices | null>(null);
  const modal = useDisclosure();
  const modalBot = useDisclosure();
  const parcelamentoQtd = sessionStorage.getItem("parcelamentoQTD");
  const id = sessionStorage.getItem("carrinhoId");
  const queryClient = useQueryClient();
  const productsService = new ProductsService();

  const productsQuery = useQuery<IDevicesResponse>({
    refetchOnWindowFocus: false,
    queryKey: ["products"],
    queryFn: async (): Promise<IDevicesResponse> => {
      const response = await productsService.allProducts();
      return response;
    },
  });

  const products = productsQuery.data?.devices;

  const { selectedBrand, resetSelectedBrand, items, productFiltered } =
    useBrandFilter(products);

  const { addItemInCart, addItemInCartAsync, isAddItemInChartLoading } =
    useAddItemInCartMutation<any>({
      addProductInChart: (cartId, data) =>
        productsService.addProductInChart(cartId, data),
    });

  const { createOrResumeCart, isCreatingChartLoading } =
    useCreateOrResumeCart<IDevices | null>({
      addItemToExistingCart: async ({ id: cartId, data }) => {
        await addItemInCartAsync({ id: cartId, data });
        await queryClient.invalidateQueries({ queryKey: ["clients"] });
      },
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
    formValues: { cnpj: string; full_name: string; phone: string },
    productDetail: IDevices | null,
  ) => {
    await createOrResumeCart({
      formValues,
      productDetail,
      requireProduct: true,
      landingPage: "aparelhos",
    });
  };

  return {
    products,
    productFiltered,
    selectedBrand,
    resetSelectedBrand,
    items,
    isModalOpen: modal.isOpen,
    showModal,
    closeModal,
    isModalBotOpen: modalBot.isOpen,
    showModalBot,
    closeModalBot,
    selectedProductDetail,
    changeSelectedProductDetail,
    addItemInChart,
    parcelamentoQtd,
    id,
    // sendProductId,
    isAddItemInChartLoading,
    updateData,
    isCreatingChartLoading,
  };
}
