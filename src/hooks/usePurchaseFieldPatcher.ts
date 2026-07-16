type UpdatePurchaseOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

type UpdatePurchaseFn = (
  variables: Record<string, unknown>,
  options?: UpdatePurchaseOptions,
) => void;

type UsePurchaseFieldPatcherArgs = {
  orderId: string | undefined;
  hasPurchaseData: boolean;
  updatePurchase: UpdatePurchaseFn;
};

export function usePurchaseFieldPatcher({
  orderId,
  hasPurchaseData,
  updatePurchase,
}: UsePurchaseFieldPatcherArgs) {
  const patchFields = (
    patch: Record<string, unknown>,
    options?: UpdatePurchaseOptions,
  ) => {
    if (!hasPurchaseData || !orderId) return false;

    updatePurchase({ ...patch }, options);

    return true;
  };

  const patchBooleanField = (
    field: string,
    value: boolean | number,
    options?: UpdatePurchaseOptions,
  ) => {
    return patchFields({ [field]: !!value }, options);
  };

  return {
    patchFields,
    patchBooleanField,
  };
}
