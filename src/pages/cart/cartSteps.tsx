import CartItem from "./cartItens/itensList";
import BuyerInfo from "./buyerInfo/buyerInfo";
import Payment from "./payment/payment";
import Summary from "./summary/summary";
import NotApprovedCreditModal from "./summary/modals/notApprovedCredit";
import { useNavigate } from "react-router-dom";
import { Button, ConfigProvider } from "antd";
import { ArrowLeft } from "lucide-react";
import AddressInfo from "./addressInfo/addressInfo";

import React, { useState } from "react";
import { Steps, theme } from "antd";
import { toast } from "sonner";
import { buildPartnerPath } from "@/configs/partnerRuntime";
import { usePartner } from "@/context/PartnerContext";

const steps = [
  {
    title: "Carrinho",
    content: "First-content",
  },
  {
    title: "Identificação",
    content: "Second-content",
  },
  {
    title: "Pedido",
    content: "Last-content",
  },
];

interface AppProps {
  updatePossivelProspect: any;
  isModalOpen: any;
  showModal: any;
  closeModal: any;
  changePurchaseChartStatus: any;
  savePurchasePaymentWhenNotAproved: any;
  updateData: any;
  formaPagamento: any;
  changeFormaPagamento: any;
  isPaymentUpdateLoading: any;
  selectedColor: any;
  updateItemColor: any;
  selectedQtd: any;
  updateItemQuantity: any;
  purchaseData: any;
  removeItem: any;
  handleAddItemInChart: any;
  products: any;
  updateParcelamentoValues: any;
  isAllDataLoading: any;
  isItensLoading: any;
  saveSelectedSeguro: any;
  removeInsurance: any;
  isRemoveInsuranceLoading: any;
  updatePossivelProspectSeguro: any;
  returnToCatalog: any;
}

const CartSteps: React.FC<AppProps> = (appProps) => {
  const { token } = theme.useToken();
  const [current, setCurrent] = useState(0);
  const [modalReason, setModalReason] = useState<
    null | "receita" | "quantity" | "credito"
  >(null);
  const navigate = useNavigate();
  const partnerRuntime = usePartner();
  const resolvedPurchaseId =
    appProps.purchaseData?.id ??
    appProps.purchaseData?.order?.id ??
    sessionStorage.getItem("carrinhoId") ??
    undefined;

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const onChange = (value: number) => {
    setCurrent(value);
  };

  const items = steps.map((item) => ({ key: item.title, title: item.title }));

  const contentStyle: React.CSSProperties = {
    lineHeight: "40px",
    color: token.colorTextTertiary,
    marginTop: 16,
  };

  return (
    <>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorBorder: "#660099",
              colorText: "#660099",
              colorPrimary: "#660099",
              colorPrimaryHover: "#cb1ef5",
              colorPrimaryBorderHover: "#cb1ef5",
            },
            Steps: {
              colorPrimary: "#660099",
              colorPrimaryBorder: "#660099",
              colorText: "#660099",
              colorBorderBg: "#660099",
              colorBgBase: "#660099",
            },
          },
        }}
      >
        <div
          className="flex flex-col min-h-screen "
          style={{ position: "relative" }}
        >
          <div className="flex mx-6 md:mx-15 lg:mx-20">
            <div className="w-full">
              <div className="flex flex-col md:hidden gap-2 mt-6 mb-2">
                <div className="flex flex-col  justify-between w-full">
                  <h1 className="text-[18px]  w-auto self-start pl-0">
                    Meu carrinho
                  </h1>

                  <div className="flex justify-between mt-2 gap-2">
                    <p className="text-[14px] w-auto">
                      Orçamento Nº: {appProps.purchaseData?.id}
                    </p>
                    <ConfigProvider
                      theme={{
                        components: {
                          Button: {
                            colorBorder: "#660099",
                            colorText: "#660099",
                            colorPrimaryHover: "#cb1ef5",
                            colorPrimaryBorderHover: "#cb1ef5",
                          },
                        },
                      }}
                    >
                      <Button
                        type="primary"
                        variant="solid"
                        className="mr-2"
                        onClick={appProps.returnToCatalog}
                      >
                        <ArrowLeft size={14} />
                      </Button>
                    </ConfigProvider>
                  </div>
                </div>
                <div className="w-full mt-2">
                  <div className="block md:hidden">
                    <Steps
                      current={current}
                      items={items}
                      onChange={onChange}
                      direction="horizontal"
                      size="small"
                    />
                  </div>
                  <div className="hidden md:block">
                    <Steps
                      current={current}
                      items={items}
                      onChange={onChange}
                      direction="horizontal"
                    />
                  </div>
                </div>
              </div>

              <div className="hidden  md:flex w-full gap-8 items-end justify-between mt-6 mb-2">
                <h1 className="text-[16px] md:text-[17px] lg:text-[22px] w-66 self-end pl-16">
                  Meu carrinho
                </h1>
                <Steps
                  current={current}
                  items={items}
                  onChange={onChange}
                  size="small"
                />
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        colorBorder: "#660099",
                        colorText: "#660099",
                        colorPrimaryHover: "#cb1ef5",
                        colorPrimaryBorderHover: "#cb1ef5",
                      },
                    },
                  }}
                >
                  <div className="flex flex-col">
                    <div className="pb-4 self-end">
                      <Button
                        type="primary"
                        variant="solid"
                        className=""
                        onClick={appProps.returnToCatalog}
                      >
                        <ArrowLeft size={14} />
                        <span>Voltar para Catálogo</span>
                      </Button>
                    </div>
                    <p className="text-[14px] md:text-[15px] lg:text-[17px] text-end  self-end w-61">
                      Orçamento Nº: {appProps.purchaseData?.id}
                    </p>
                  </div>
                </ConfigProvider>
              </div>
            </div>
          </div>

          <div
            className="flex-1 mx-6 md:mx-15 lg:mx-20  overflow-y-auto px-2"
            style={contentStyle}
          >
            {current === 0 ? (
              <CartItem
                selectedColor={appProps.selectedColor}
                updateItemColor={appProps.updateItemColor}
                selectedQtd={appProps.selectedQtd}
                updateItemQuantity={appProps.updateItemQuantity}
                purchaseById={appProps.purchaseData}
                removeItem={appProps.removeItem}
                addItemInChart={appProps.handleAddItemInChart}
                products={appProps.products?.devices || []}
                updateParcelamentoValues={appProps.updateParcelamentoValues}
                isAllDataLoading={appProps.isAllDataLoading}
                isItensLoading={appProps.isItensLoading}
                saveSelectedSeguro={appProps.saveSelectedSeguro}
                removeInsurance={appProps.removeInsurance}
                isRemoveInsuranceLoading={appProps.isRemoveInsuranceLoading}
                updatePossivelProspectSeguro={
                  appProps.updatePossivelProspectSeguro
                }
              />
            ) : current === 1 ? (
              <>
                <BuyerInfo
                  purchaseById={appProps.purchaseData}
                  updateData={appProps.updateData}
                />
                <AddressInfo
                  purchaseById={appProps.purchaseData}
                  updateData={appProps.updateData}
                />
                <Payment
                  formaPagamento={appProps.formaPagamento}
                  changeFormaPagamento={appProps.changeFormaPagamento}
                  isAllDataLoading={appProps.isAllDataLoading}
                  isPaymentUpdateLoading={appProps.isPaymentUpdateLoading}
                />
              </>
            ) : current === 2 ? (
              <Summary
                updatePossivelProspect={appProps.updatePossivelProspect}
                isModalOpen={appProps.isModalOpen}
                showModal={appProps.showModal}
                closeModal={appProps.closeModal}
                purchaseById={appProps.purchaseData}
                changePurchaseChartStatus={appProps.changePurchaseChartStatus}
                savePurchasePaymentWhenNotAproved={
                  appProps.savePurchasePaymentWhenNotAproved
                }
              />
            ) : (
              steps[current].content
            )}
            {/* Modal de crédito reprovado controlado localmente */}
            {current === 2 && (
              <NotApprovedCreditModal
                purchaseId={appProps.purchaseData}
                isModalOpen={!!modalReason}
                closeModal={() => setModalReason(null)}
                changePurchaseChartStatus={appProps.changePurchaseChartStatus}
                savePurchasePayment={appProps.savePurchasePaymentWhenNotAproved}
                isCreditEnough={(() => {
                  const totalCredit = Number(
                    appProps.purchaseData?.credito_disponivel
                  );
                  const totalPurchase = Number(appProps.purchaseData?.total);
                  return totalCredit >= totalPurchase;
                })()}
                isRFBStatusActive={
                  appProps.purchaseData?.company_rfb_information?.situacao_cadastral === "ATIVA"
                }
                isQuantityApproved={(() => {
                  const quantityOfItemsAllowedToBuy =
                    appProps.purchaseData?.client_credit?.eligible_line.reduce(
                      (total: number, telefone: any) =>
                        total + (telefone.eligible ? 1 : 0),
                      0
                    );
                  const quantityOfItemsAtChart =
                    appProps.purchaseData?.items?.reduce(
                      (total: number, item: any) =>
                        total + Number(item.quantity),
                      0
                    );
                  return (
                    (quantityOfItemsAtChart ?? 0) <=
                    (quantityOfItemsAllowedToBuy ?? 0)
                  );
                })()}
                updatePossivelProspect={appProps.updatePossivelProspect}
                motivo={modalReason}
                onReceitaOk={() => {
                  // mesma lógica do summary
                  const totalCredit = Number(
                    appProps.purchaseData?.credito_disponivel
                  );
                  const totalPurchase = Number(appProps.purchaseData?.total);
                  const isCreditEnough = totalCredit >= totalPurchase;
                  const quantityOfItemsAllowedToBuy =
                    appProps.purchaseData?.client_credit?.eligible_line.reduce(
                      (total: number, telefone: any) =>
                        total + (telefone.eligible ? 1 : 0),
                      0
                    );
                  const quantityOfItemsAtChart =
                    appProps.purchaseData?.items.reduce(
                      (total: number, item: any) =>
                        total + Number(item.quantity),
                      0
                    );
                  const isQuantityApproved =
                    (quantityOfItemsAtChart ?? 0) <=
                    (quantityOfItemsAllowedToBuy ?? 0);
                  if (!isQuantityApproved) {
                    setModalReason("quantity");
                  } else if (!isCreditEnough) {
                    setModalReason("credito");
                  } else {
                    if (!resolvedPurchaseId) {
                      toast.error("ID do pedido nao encontrado para finalizar.");
                      return;
                    }

                    appProps.changePurchaseChartStatus({
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
                  const totalCredit = Number(
                    appProps.purchaseData?.client_credit?.available_credit
                  );
                  const totalPurchase = Number(appProps.purchaseData?.total);
                  const isCreditEnough = totalCredit >= totalPurchase;
                  if (!isCreditEnough) {
                    setModalReason("credito");
                  } else {
                    if (!resolvedPurchaseId) {
                      toast.error("ID do pedido nao encontrado para finalizar.");
                      return;
                    }

                    appProps.changePurchaseChartStatus({
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
            )}
          </div>

          <div
            className="w-full flex justify-end gap-2 px-2 pr-[80px] md:pr-[100px]"
            style={{
              position: "sticky",
              bottom: 0,
              background: "#fff",
              zIndex: 10,
              borderTop: "1px solid #eee",
              paddingTop: "12px",
              paddingBottom: "12px",
            }}
          >
            {current === 0 ? (
              <>
                {" "}
                <Button
                  type="default"
                  style={{ margin: "0 8px" }}
                  onClick={appProps.returnToCatalog}
                >
                  Comprar mais produtos
                </Button>
                <Button
                  style={{
                    fontSize: "16px",
                    color: "white",
                    backgroundColor: "#32844c",
                  }}
                  type="primary"
                  onClick={() => next()}
                >
                  Continuar
                </Button>
              </>
            ) : (
              <>
                {current > 0 && (
                  <Button
                    type="default"
                    style={{ margin: "0 8px" }}
                    onClick={() => prev()}
                  >
                    Voltar
                  </Button>
                )}
                {current < steps.length - 1 ? (
                  <Button
                    style={{
                      fontSize: "16px",
                      color: "white",
                      backgroundColor: "#32844c",
                    }}
                    type="primary"
                    onClick={() => next()}
                  >
                    Continuar
                  </Button>
                ) : (
                  <Button
                    className="self-center w-[200px] md:w-[240px]"
                    type="primary"
                    variant="solid"
                    style={{
                      fontSize: "16px",
                      color: "white",
                      backgroundColor: "#32844c",
                    }}
                    disabled={appProps.purchaseData?.total === 0}
                    onClick={() => {
                      if (!resolvedPurchaseId) {
                        toast.error("ID do pedido nao encontrado para finalizar.");
                        return;
                      }

                      appProps.changePurchaseChartStatus(
                        { id: String(resolvedPurchaseId), data: { status: "FECHADO" } },
                        {
                          onSuccess: () => {
                            navigate(
                              buildPartnerPath(partnerRuntime, "order", String(resolvedPurchaseId)),
                            );
                            window.scrollTo(0, 0);
                            sessionStorage.setItem("statusCarrinho", "FECHADO");
                          },
                          onError: (error: any) => {
                            const mensagem =
                              error?.response?.data?.erro ||
                              error?.data?.erro ||
                              error?.message ||
                              "Erro ao finalizar pedido";
                            toast.error(mensagem);
                          },
                        }
                      );
                    }}
                  >
                    Finalizar pedido
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </ConfigProvider>
    </>
  );
};

export default CartSteps;
