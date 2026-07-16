import { create } from "zustand";

type PedidoState = {
  pedidoId: string | null;
  setPedidoId: (id: string) => void;
  nomeDaEmpresa?: string | null;
  setNomeDaEmpresa?: (nome: string) => void;
};

export const usePedidoStore = create<PedidoState>((set) => ({
  pedidoId: null,
  setPedidoId: (id) => {
    sessionStorage.setItem("carrinhoId", id);
    set({ pedidoId: id });
  },
}));
