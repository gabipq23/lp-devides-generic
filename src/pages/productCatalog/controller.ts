import { useCreateOrResumeCart } from "@/hooks/useCreateOrResumeCart";

type SendInfoValues = {
  cnpj: string;
  full_name: string;
  phone: string;
};

export function useAppController() {
  const { createOrResumeCart, isCreatingChartLoading } = useCreateOrResumeCart({
    createChartCancelQueryKey: ["purchaseById"],
    createChartInvalidateQueryKey: ["purchaseById"],
  });

  const updateData = async (formValues: SendInfoValues) => {
    const result = await createOrResumeCart({
      formValues,
      productDetail: null,
      landingPage: "aparelhos",
      category: "aparelhos",
    });

    return result.success;
  };

  return {
    updateData,
    isCreatingChartLoading,
  };
}
