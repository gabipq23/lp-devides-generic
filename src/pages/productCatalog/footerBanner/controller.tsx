import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactService } from "@/services/contact";
import { toast } from "sonner";
import { useDisclosure } from "@/hooks/useDisclosure";

export function useContactFormController() {
  const queryClient = useQueryClient();

  const contactService = new ContactService();
  const { mutate: createContact } = useMutation({
    mutationFn: contactService.create,
    onMutate: async () =>
      await queryClient.cancelQueries({ queryKey: ["contact"] }),
    onSuccess: () => {
      toast.success("Mensagem enviada com sucesso!");

      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
    onError: () => {
      toast.error("Houve um erro ao enviar a mensagem. Tente novamente");
    },
  });

  const modal = useDisclosure();

  const showModal = modal.open;
  const closeModal = modal.close;

  return {
    createContact,
    isModalOpen: modal.isOpen,
    showModal,
    closeModal,
  };
}
