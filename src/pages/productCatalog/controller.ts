import { useCreateOrResumeCart } from "@/hooks/useCreateOrResumeCart";
import { Fingerprint } from "@/utils/getFingerprintInfo";

type SendInfoValues = {
  cnpj: string;
  full_name: string;
  phone: string;
  client_ip: string;
  fingerprint: Fingerprint;
  url: string;
  lp_url: string;
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
