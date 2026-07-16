import { Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { buildPartnerPath } from "@/configs/partnerRuntime";
import { usePartner } from "@/context/PartnerContext";

function NotApprovedCreditModal({
  isModalOpen,
  closeModal,
  purchaseId,
  changePurchaseChartStatus,
  isCreditEnough,
  updatePossivelProspect,
  motivo,
  onQuantidadeOk,
  onReceitaOk,
}: {
  purchaseId: any;
  isModalOpen: boolean;
  closeModal: () => void;
  changePurchaseChartStatus: any;
  savePurchasePayment: any;
  isCreditEnough: boolean;
  isRFBStatusActive: boolean;
  isQuantityApproved: boolean;
  updatePossivelProspect: any;
  motivo?: "quantity" | "credito" | "receita" | null;
  onQuantidadeOk?: () => void;
  onReceitaOk?: () => void;
}) {
  const navigate = useNavigate();
  const partnerRuntime = usePartner();
  let content = null;
  const quantityOfItemsAllowedToBuy =
    purchaseId?.client_credit?.eligible_credit?.reduce(
      (total: number, telefone: any) => {
        return total + (telefone.eligible ? 1 : 0);
      },
      0
    );

  if (motivo === "receita") {
    content = (
      <>
        <div className="flex flex-col gap-2">
          <hr className="border-t border-neutral-300 mt-2 mb-2" />
          <p>
            Notamos que esse CNPJ apresenta uma inconsistência cadastral junto à
            Receita Federal.
          </p>
          <p>Em breve, entraremos em contato.</p>
          <hr className="border-t border-neutral-300  mb-2 mt-3" />
        </div>
        <div className="flex lg:flex-row gap-4 lg:gap-6 mt-4 items-center justify-center">
          <Button
            color="purple"
            style={{
              backgroundColor: "#660099",
              color: "white",
            }}
            variant="solid"
            onClick={() => {
              if (onReceitaOk) {
                onReceitaOk();
              } else {
                changePurchaseChartStatus({
                  id: purchaseId?.id,
                  data: { status: "FECHADO" },
                });
                navigate(
                  buildPartnerPath(partnerRuntime, "order", purchaseId?.id),
                );
                window.scrollTo(0, 0);
                sessionStorage.setItem("statusCarrinho", "FECHADO");
              }
            }}
          >
            OK
          </Button>
        </div>
      </>
    );
  } else if (motivo === "quantity") {
    if (!quantityOfItemsAllowedToBuy) {
      content = (
        <>
          <div className="flex flex-col gap-2">
            <hr className="border-t border-neutral-300 mt-2 mb-2" />
            <p>
              No momento a sua empresa não possui linhas ativas ou linhas que
              possuam crédito pré-aprovado. Para conseguir comprar um novo
              aparelho, você precisa adquirir ou transferir para o seu plano uma
              nova linha.
            </p>
            <p>
              Caso você tenha interesse, clique abaixo em "OK" e em breve um de
              nossos consultores entrará em contato com você para apresentar os
              planos e pacotes disponíveis.
            </p>
            <p>
              Caso não tenha interesse em adquirir novas linhas neste momento,
              clique em "Cancelar".
            </p>
            <hr className="border-t border-neutral-300  mb-2 mt-3" />
          </div>
          <div className="flex lg:flex-row gap-4 lg:gap-6 mt-4 items-center justify-center">
            <Button
              color="purple"
              style={{
                backgroundColor: "#660099",
                color: "white",
              }}
              variant="solid"
              onClick={closeModal}
            >
              Cancelar
            </Button>
            <Button
              color="purple"
              style={{
                backgroundColor: "#660099",
                color: "white",
              }}
              variant="solid"
              onClick={() => {
                updatePossivelProspect(true);
                if (onQuantidadeOk) {
                  onQuantidadeOk();
                }
              }}
            >
              OK
            </Button>
          </div>
        </>
      );
    } else {
      content = (
        <>
          <div className="flex flex-col gap-2">
            <hr className="border-t border-neutral-300 mt-2 mb-2" />
            <p>
              O crédito pré-aprovado para sua empresa pode ser utilizado na
              compra de até {quantityOfItemsAllowedToBuy} aparelho(s). Para
              comprar mais aparelhos do que o limite permitido, você precisa
              adquirir ou transferir para o seu plano uma nova linha para cada
              aparelho adicional.
            </p>
            <p>
              Caso você tenha interesse, clique abaixo em "ok" e em breve um de
              nossos consultores entrará em contato com você para apresentar os
              planos e pacotes disponíveis.
            </p>
            <p>
              Caso prefira alterar o seu pedido para que o número de aparelhos
              se encaixe nos limites pré-aprovados, clique em "cancelar", edite
              e finalize o seu pedido novamente.
            </p>
            <hr className="border-t border-neutral-300  mb-2 mt-3" />
          </div>
          <div className="flex lg:flex-row gap-4 lg:gap-6 mt-4 items-center justify-center">
            <Button
              color="purple"
              style={{
                backgroundColor: "#660099",
                color: "white",
              }}
              variant="solid"
              onClick={closeModal}
            >
              Cancelar
            </Button>
            <Button
              color="purple"
              style={{
                backgroundColor: "#660099",
                color: "white",
              }}
              variant="solid"
              onClick={() => {
                updatePossivelProspect(true);
                if (isCreditEnough) {
                  changePurchaseChartStatus({
                    id: purchaseId?.id,
                    data: { status: "FECHADO" },
                  });
                  navigate(
                    buildPartnerPath(partnerRuntime, "order", purchaseId?.id),
                  );
                  window.scrollTo(0, 0);
                  sessionStorage.setItem("statusCarrinho", "FECHADO");
                } else if (onQuantidadeOk) {
                  onQuantidadeOk();
                }
              }}
            >
              OK
            </Button>
          </div>
        </>
      );
    }
  } else if (motivo === "credito") {
    content = (
      <>
        <div className="flex flex-col gap-2">
          <hr className="border-t border-neutral-300 mt-2 mb-2" />
          <p>
            O valor total do seu pedido supera o crédito pré-aprovado
            disponibilizado pela Vivo.
          </p>
          <p>
            Crédito disponível: R${" "}
            {Number(purchaseId?.client_credit?.available_credit)?.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>
            Valor do carrinho: R${" "}
            {Number(purchaseId?.price_summary?.total)?.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
          <p>
            Caso você tenha interesse em pedir um aumento do crédito
            pré-aprovado, clique abaixo em "ok" que em breve um de nossos
            consultores entrará em contato com a sua empresa para formalizar o
            pedido de análise.
          </p>
          <p>
            Caso prefira alterar o seu pedido para que o valor total se encaixe
            nos limites pré-aprovados pela Vivo, clique em "cancelar", edite e
            finalize o seu pedido novamente.
          </p>
          <hr className="border-t border-neutral-300  mb-2 mt-3" />
        </div>
        <div className="flex lg:flex-row gap-4 lg:gap-6 mt-4 items-center justify-center">
          <Button
            color="purple"
            style={{
              backgroundColor: "#660099",
              color: "white",
            }}
            variant="solid"
            onClick={closeModal}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => {
              changePurchaseChartStatus({
                id: purchaseId?.id,
                data: { status: "FECHADO" },
              });
              navigate(
                buildPartnerPath(partnerRuntime, "order", purchaseId?.id),
              );
              window.scrollTo(0, 0);
              sessionStorage.setItem("statusCarrinho", "FECHADO");
            }}
            color="purple"
            style={{
              backgroundColor: "#660099",
              color: "white",
            }}
            className=""
            variant="solid"
          >
            OK
          </Button>
        </div>
      </>
    );
  }

  return (
    <Modal
      centered
      title={
        <span style={{ color: "#252525" }}>
          {motivo === "receita"
            ? "Status cadastral"
            : motivo === "quantity"
              ? "Quantidade de aparelhos"
              : motivo === "credito"
                ? "Crédito pré aprovado"
                : ""}
        </span>
      }
      open={isModalOpen}
      onCancel={closeModal}
      footer={null}
      width={760}
    >
      <div>{content}</div>
    </Modal>
  );
}

export default NotApprovedCreditModal;
