import { useQuery } from "@tanstack/react-query";
import { PurchaseService } from "@/services/purchase";

// Componente que exibe a quantidade de itens no carrinho de compras com base no ID da compra.
// botão flutuante no canto inferior direito da tela
// também usado no subheader

export function CartBadge({ id }: { id: string }) {
  const purchaseService = new PurchaseService();
  const { data, isFetching } = useQuery({
    queryKey: ["purchaseById", id],
    queryFn: async () => {
      if (!id) return null;
      return await purchaseService.getPurchaseById(id);
    },
    refetchOnWindowFocus: false,
  });

  const itemCount =
    data?.order?.items?.reduce((sum: any, item: any) => sum + (item.quantity || 0), 0) || 0;

  return <span>{isFetching ? "..." : itemCount}</span>;
}
