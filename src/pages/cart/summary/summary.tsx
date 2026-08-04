import NotApprovedCreditModal from "./modals/notApprovedCredit";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import { ItensListLargeScreen } from "@/pages/orderSummary/screen/itensListLarge";
import { ItensListSmallScreen } from "@/pages/orderSummary/screen/itensListSmall";
import { buildPartnerPath } from "@/configs/partnerRuntime";
import { usePartner } from "@/context/PartnerContext";
import { IOrderResponse } from "@/interfaces/order";
function Summary({
  purchaseById,
  updatePossivelProspect,
  changePurchaseChartStatus,
  savePurchasePaymentWhenNotAproved,
}: {
  purchaseById: IOrderResponse | undefined | null;
  isModalOpen: boolean;
  updatePossivelProspect: (value: number) => void;
  showModal: () => void;
  closeModal: () => void;
  changePurchaseChartStatus: (payload: { id: string | undefined; data: { status: string } }, options?: { onSuccess?: () => void; onError?: (error: unknown) => void }) => void;
  savePurchasePaymentWhenNotAproved: () => void;
}) {
  const navigate = useNavigate();
  const partnerRuntime = usePartner();
  const [modalReason, setModalReason] = useState<
    null | "receita" | "quantity" | "credito"
  >(null);
  const purchase = purchaseById?.order;
  const resolvedPurchaseId =
    purchase?.id ??
    (purchaseById as any)?.id ??
    sessionStorage.getItem("carrinhoId") ??
    undefined;
  let typeOfPayment;
  if (purchase?.payment_method
    === "fatura vivo+cartao credito") {
    typeOfPayment = "Fatura Vivo + Cartão de Crédito";
  } else if (purchase?.payment_method
    === "cartao credito") {
    typeOfPayment = "Cartão de Crédito";
  } else if (purchase?.payment_method
    === "fatura vivo") {
    typeOfPayment = "Fatura Vivo";
  }
  const totalCredit = Number(purchase?.client_credit?.available_credit);
  const totalPurchase = Number(purchase?.price_summary?.total);

  const isCreditEnough = totalCredit >= totalPurchase;

  const isRFBStatusActive =
    purchase?.company_rfb_information?.situacao_cadastral === "ATIVA";
  const quantityOfItemsAllowedToBuy =
    purchase?.client_credit?.telefones.reduce(
      (total: number, phone: any) => {
        return total + (phone.eligible ? 1 : 0);
      },
      0
    );

  const quantityOfItemsAtChart = purchase?.items?.reduce(
    (total: number, item: any) => total + Number(item.quantity),
    0
  );
  const isQuantityApproved =
    (quantityOfItemsAtChart ?? 0) <= (quantityOfItemsAllowedToBuy ?? 0);
  const handleCloseModal = () => setModalReason(null);

  const info = (
    <>
      <div className="flex flex-col gap-3 min-h-[400px] max-h-[1000px] bg-white text-[14px] rounded-[4px] mb-[29px] overflow-y-auto  scrollbar scrollbar-thin">
        <div className="flex flex-col bg-white rounded-[4px] p-4 w-full py-2 mb-4  overflow-y-auto  scrollbar scrollbar-thin min-h-[80px] max-h-[400px]">
          <ItensListLargeScreen purchaseById={purchase} />
          <ItensListSmallScreen purchaseById={purchase} />
        </div>

        <div className="flex m-1 mt-4 flex-col gap-2 ">
          {purchase?.items?.some(
            (item: any) =>
              item.insurance_type !== null &&
              item.insurance_price !== null &&
              item.insurance_price !== 0
          ) && (
              <>
                <div className="px-2 mb-2">
                  <p className="text-[15px]">Serviços</p>
                </div>
              </>
            )}

          {purchase?.items
            .filter(
              (item: any) =>
                item.insurance_type !== null && item.insurance_price !== 0
            )
            .reverse()
            .map((item: any, idx: number) => (
              <div key={idx} className="w-full">
                <div className="flex w-full items-center justify-between px-2">
                  <div className="flex items-center justify-center ">
                    {" "}
                    <p className="text-[14px] text-[#666666]">
                      Seguro de{" "}
                      {item.insurance_type === "roubo_furto_simples_qualificado"
                        ? "Roubo, Furto Simples/Qualificado"
                        : "Roubo, Furto Simples/Qualificado e Danos"}{" "}
                    </p>
                    <p className="text-[14px] text-[#868686]">
                      {" "}
                      - {item.model}
                    </p>
                  </div>

                  <p className="text-end">
                    R${" "}
                    {Number(
                      item?.quantity * item?.insurance_price
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /mês
                  </p>
                </div>

                <hr className="border-t border-neutral-300 mb-2 mt-2 w-full" />
              </div>
            ))}

          <div className="px-2">
            <p className="text-[15px] ">Produtos</p>
          </div>
          <div className="flex w-full justify-between px-2">
            <p className="text-[14px] text-[#666666]">Quantidade de itens</p>
            <p>
              {purchase?.items?.reduce(
                (total: number, item: any) =>
                  total + Number(item.quantity),
                0
              )}
            </p>
          </div>
          <hr className="border-t border-neutral-300 mb-2  w-full" />

          <div className="flex w-full justify-between px-2">
            <p className="text-[14px] text-[#666666]">Frete</p>
            <p className="text-[14px] text-[#32a04b]">Grátis</p>
          </div>

          <hr className="border-t border-neutral-300 mb-2  w-full" />

          <div className="flex w-full justify-between px-2">
            <p className="text-[14px] text-[#666666]">Forma de Pagamento</p>
            <p className="text-[14px]">{typeOfPayment}</p>
          </div>
          <hr className="border-t border-neutral-300 mb-2  w-full" />

          <div className="flex w-full justify-between px-2">
            <p className="text-[14px] text-[#666666]">Parcelamento</p>
            <p className="text-[14px]">
              {purchase?.price_summary?.number_of_installments === 1
                ? "à vista"
                : `${purchase?.price_summary?.number_of_installments}x`}
            </p>
          </div>

          <hr className="border-t border-neutral-300 w-full" />
        </div>
        <div className="flex flex-col items-start m-3 gap-2 ">
          <div className="flex w-full justify-between  text-[14px] font-bold">
            <p className="text-[#666666]">Valor da parcela mensal (Produtos)</p>
            <p className="text-end">
              R${" "}
              {purchase?.price_summary?.installment_total.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
          <hr className="border-t border-neutral-300 w-full" />
          {/* Exibe apenas se houver algum item com seguro_tipo !== null e seguro_valor válido */}
          {purchase?.items?.some(
            (item: any) =>
              item.insurance_type !== null &&
              item.insurance_price !== null &&
              item.insurance_price !== 0
          ) && (
              <div className="flex w-full justify-between mb-4  text-[14px] font-bold">
                <p className="text-[#666666]">
                  Valor da parcela mensal (Serviços)
                </p>
                <p className="text-end">
                  R${" "}
                  {purchase?.items

                    .reduce(
                      (total: number, item: any) =>
                        total + Number(item.quantity * item.insurance_price),
                      0
                    )
                    .toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                </p>
              </div>
            )}

          <NotApprovedCreditModal
            purchaseId={purchase}
            isModalOpen={!!modalReason}
            closeModal={handleCloseModal}
            changePurchaseChartStatus={changePurchaseChartStatus}
            savePurchasePayment={savePurchasePaymentWhenNotAproved}
            isCreditEnough={isCreditEnough}
            isRFBStatusActive={isRFBStatusActive}
            isQuantityApproved={isQuantityApproved}
            updatePossivelProspect={updatePossivelProspect}
            motivo={modalReason}
            onReceitaOk={() => {
              if (!isQuantityApproved) {
                setModalReason("quantity");
              } else if (!isCreditEnough) {
                setModalReason("credito");
              } else {
                if (!resolvedPurchaseId) {
                  return;
                }

                // Finaliza pedido
                changePurchaseChartStatus({
                  id: String(resolvedPurchaseId),
                  data: { status: "FECHADO" },
                });
                navigate(
                  buildPartnerPath(partnerRuntime, "order", String(resolvedPurchaseId)),
                );
                window.scrollTo(0, 0);
                sessionStorage.setItem("statusCarrinho", "FECHADO");
              }
            }}
            onQuantidadeOk={() => {
              if (!isCreditEnough) {
                setModalReason("credito");
              } else {
                if (!resolvedPurchaseId) {
                  return;
                }

                // Finaliza pedido
                changePurchaseChartStatus({
                  id: String(resolvedPurchaseId),
                  data: { status: "FECHADO" },
                });
                navigate(
                  buildPartnerPath(partnerRuntime, "order", String(resolvedPurchaseId)),
                );
                window.scrollTo(0, 0);
                sessionStorage.setItem("statusCarrinho", "FECHADO");
              }
            }}
          />
        </div>
      </div>
    </>
  );
  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <p className="text-[15px]">Resumo do Pedido</p>,
      children: info,
    },
  ];
  return (
    <>
      <Collapse ghost items={items} bordered={false} defaultActiveKey={["1"]} />
    </>
  );
}

export default Summary;
