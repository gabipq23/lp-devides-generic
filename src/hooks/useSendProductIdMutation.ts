import { useMutation } from "@tanstack/react-query";

type UseSendProductIdMutationOptions = {
  sendProductIdFn: (productId: number) => Promise<unknown>;
  successMessage?: string;
  errorMessage?: string;
};

export function useSendProductIdMutation({
  sendProductIdFn,
  successMessage = "Id enviado com sucesso!",
  errorMessage = "Houve um erro ao enviar o id. Tente novamente",
}: UseSendProductIdMutationOptions) {
  const mutation = useMutation({
    mutationFn: async (productId: number) => sendProductIdFn(productId),
    onSuccess: () => {
      console.log(successMessage);
    },
    onError: (error) => {
      console.log(errorMessage);
      console.error(error);
    },
  });

  return {
    ...mutation,
    sendProductId: mutation.mutate,
    sendProductIdAsync: mutation.mutateAsync,
    isSendingProductId: mutation.isPending,
  };
}
