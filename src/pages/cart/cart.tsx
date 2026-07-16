import { usePurchaseController } from "./controller";

import { useNavigate, useParams } from "react-router-dom";
import { Button, ConfigProvider } from "antd";
import CartSteps from "./cartSteps";
import { usePedidoStore } from "@/store/usePedidoStore";
import { useEffect } from "react";
import { buildPartnerPath } from "@/configs/partnerRuntime";
import { usePartner } from "@/context/PartnerContext";

function Cart() {
  const { id } = useParams();
  const partnerRuntime = usePartner();
  const {
    productFiltered: products,
    purchaseData,
    removeItem,
    selectedColor,
    selectedQtd,
    formaPagamento,
    changeFormaPagamento,
    isModalOpen,
    showModal,
    closeModal,
    returnToCatalog,
    handleAddItemInChart,
    updateParcelamentoValues,
    changePurchaseChartStatus,
    savePurchasePaymentWhenNotAproved,
    isAllDataLoading,
    isPaymentUpdateLoading,
    isItensLoading,
    updateData,
    updatePossivelProspect,
    updatePossivelProspectSeguro,
    saveSelectedSeguro,
    removeInsurance,
    isRemoveInsuranceLoading,
    updateItemColor,
    updateItemQuantity,
  } = usePurchaseController({ id });
  const navigate = useNavigate();
  const setPedidoId = usePedidoStore((state) => state.setPedidoId);

  useEffect(() => {
    if (id) setPedidoId(id);
  }, [id, setPedidoId]);
  return (purchaseData || isAllDataLoading) &&
    purchaseData?.status !== "FECHADO" &&
    purchaseData?.status !== "CANCELADO" ? (
    <div className="min-h-[calc(100vh-112px)]">
      <div className=" ">
        <CartSteps
          selectedColor={selectedColor}
          updateItemColor={updateItemColor}
          selectedQtd={selectedQtd}
          updateItemQuantity={updateItemQuantity}
          purchaseData={purchaseData}
          removeItem={removeItem}
          handleAddItemInChart={handleAddItemInChart}
          products={products}
          updateParcelamentoValues={updateParcelamentoValues}
          isAllDataLoading={isAllDataLoading}
          isItensLoading={isItensLoading}
          saveSelectedSeguro={saveSelectedSeguro}
          removeInsurance={removeInsurance}
          isRemoveInsuranceLoading={isRemoveInsuranceLoading}
          updatePossivelProspectSeguro={updatePossivelProspectSeguro}
          updateData={updateData}
          formaPagamento={formaPagamento}
          changeFormaPagamento={changeFormaPagamento}
          isPaymentUpdateLoading={isPaymentUpdateLoading}
          updatePossivelProspect={updatePossivelProspect}
          isModalOpen={isModalOpen}
          showModal={showModal}
          closeModal={closeModal}
          changePurchaseChartStatus={changePurchaseChartStatus}
          savePurchasePaymentWhenNotAproved={savePurchasePaymentWhenNotAproved}
          returnToCatalog={returnToCatalog}
        />
      </div>
    </div>
  ) : (
    <>
      <div className="min-h-[816px] ">
        <div className="mx-6 md:mx-15 lg:mx-20 ">
          <div className=" flex justify-between mt-6 mb-2">
            <h1 className="text-[22px] self-end  pl-16">Meu carrinho</h1>
          </div>

          {purchaseData?.status === "FECHADO" && (
            <div className="flex flex-col gap-2 w-full min-h-[calc(100vh-177px)] items-center justify-center">
              <span>Seu pedido já foi finalizado!</span>

              <div>
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        colorPrimary: "#660099",
                        colorPrimaryHover: "#883fa2",
                      },
                    },
                  }}
                >
                  <Button
                    type="primary"
                    variant="solid"
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                    }}
                    onClick={() => {
                      navigate(
                        buildPartnerPath(partnerRuntime, "order", purchaseData?.id),
                      );
                    }}
                  >
                    Resumo do pedido
                  </Button>{" "}
                </ConfigProvider>
              </div>
            </div>
          )}
          {purchaseData?.status === "CANCELADO" && (
            <div className="flex w-full min-h-[calc(100vh-177px)] items-center justify-center">
              <span>
                Esse carrinho expirou, por favor retorne ao catálogo e faça um
                novo pedido!
              </span>
              <div>
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        colorPrimary: "#660099",
                        colorPrimaryHover: "#883fa2",
                      },
                    },
                  }}
                >
                  <Button
                    type="primary"
                    variant="solid"
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                    }}
                  >
                    <a href={buildPartnerPath(partnerRuntime, "catalog")}>Catálogo de produtos</a>
                  </Button>{" "}
                </ConfigProvider>
              </div>
            </div>
          )}
          {!purchaseData && (
            <div className="flex flex-col gap-2 w-full min-h-[calc(100vh-177px)] items-center justify-center">
              <span>
                Esse pedido não existe, por favor retorne ao catálogo e faça um
                novo pedido!
              </span>
              <div>
                <ConfigProvider
                  theme={{
                    components: {
                      Button: {
                        colorPrimary: "#660099",
                        colorPrimaryHover: "#883fa2",
                      },
                    },
                  }}
                >
                  <Button
                    type="primary"
                    variant="solid"
                    style={{
                      color: "#ffffff",
                      fontSize: "14px",
                    }}
                  >
                    <a href={buildPartnerPath(partnerRuntime, "catalog")}>Catálogo de produtos</a>
                  </Button>{" "}
                </ConfigProvider>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Cart;
