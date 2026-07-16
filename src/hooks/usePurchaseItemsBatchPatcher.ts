type CartItemPatch = {
  item_id: number;
  quantity?: number;
  selected_color?: string;
  insurance_type?: string | null;
  insurance_price?: number | null;
};

type UpdateCartItemsBatchFn = (variables: {
  orderId: string | number;
  patches: CartItemPatch[];
}) => void;

type UsePurchaseItemsBatchPatcherArgs = {
  orderId: string | undefined;
  hasPurchaseData: boolean;
  updateCartItemsBatch: UpdateCartItemsBatchFn;
};

export function usePurchaseItemsBatchPatcher({
  orderId,
  hasPurchaseData,
  updateCartItemsBatch,
}: UsePurchaseItemsBatchPatcherArgs) {
  const patchCartItems = (patches: CartItemPatch[]) => {
    if (!hasPurchaseData || !orderId || patches.length === 0) return false;

    updateCartItemsBatch({
      orderId,
      patches,
    });

    return true;
  };

  return {
    patchCartItems,
  };
}
