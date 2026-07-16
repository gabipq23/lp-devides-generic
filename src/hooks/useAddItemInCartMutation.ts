import {
  useMutation,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

type AddItemMutationVariables<TPayload> = {
  id: string;
  data: TPayload;
};

type UseAddItemInCartMutationOptions<TPayload> = {
  addProductInChart: (id: string, data: TPayload) => Promise<unknown>;
  cancelQueryKey?: QueryKey;
  invalidateQueryKey?: QueryKey;
  successMessage?: string;
  errorMessage?: string;
};

export function useAddItemInCartMutation<TPayload>({
  addProductInChart,
  cancelQueryKey = ["purchaseById"],
  invalidateQueryKey = ["purchaseById"],
  successMessage = "Carrinho alterado com sucesso!",
  errorMessage = "Houve um erro ao alterar o carrinho. Tente novamente",
}: UseAddItemInCartMutationOptions<TPayload>) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: AddItemMutationVariables<TPayload>) =>
      addProductInChart(id, data),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: cancelQueryKey });
    },
    onSuccess: () => {
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: invalidateQueryKey });
    },
    onError: (error) => {
      toast.error(errorMessage);
      console.error(error);
    },
  });

  return {
    ...mutation,
    addItemInCart: mutation.mutate,
    addItemInCartAsync: mutation.mutateAsync,
    isAddItemInChartLoading: mutation.isPending,
  };
}
