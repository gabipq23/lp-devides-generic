import { Tooltip } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IOrder } from "@/interfaces/order";

export const ItensListSmallScreen = ({
  purchaseById,
}: {
  purchaseById: IOrder | undefined;
}) => (
  <div className="block mt-4 md:hidden">
    {purchaseById?.items
      ?.slice()
      .sort((a, b) => b.device_id - a.device_id)
      .map((product: any) => {
        return (
          <div
            key={product.device_id}
            className="bg-white rounded-lg shadow p-4 mb-4 flex flex-col gap-2"
          >
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Código:</span>
              <span>{product.sap_code}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Tipo:</span>
              <span>{product.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Marca:</span>
              <span>{product.brand}</span>
            </div>
            <div className="flex justify-between  ">
              <span className="font-semibold text-[#666]">Modelo:</span>
              <span className="text-end">{product.model || "-"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold flex items-center gap-1 text-[#666]">
                Cor{" "}
                <div className="cursor-poiter">
                  <Tooltip
                    title="A escolha de cor é uma indicação de preferência. Mas a consolidação do pedido na cor escolhida depende da disponibilidade no estoque no momento do fechamento efetivo do pedido."
                    placement="top"
                    styles={{ body: { fontSize: "12px" } }}
                  >
                    <ExclamationCircleOutlined />
                  </Tooltip>
                </div>
                :
              </span>
              {product?.selected_color}
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#666]">Quantidade:</span>
              {product?.quantity}
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Parcela (R$) :</span>
              <span>
                R${" "}
                {(
                  Number(product?.installment_amount)
                )?.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold flex items-center gap-1 text-[#666]">
                Parcelamento :
              </span>
              <span>
                {purchaseById?.price_summary?.number_of_installments === 1
                  ? "à vista"
                  : `${purchaseById?.price_summary?.number_of_installments}x`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#666]">Seguro:</span>
              {product?.insurance_price !== null ? (
                <span>
                  R${" "}
                  {(
                    product?.quantity * product?.insurance_price
                  )?.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  /mês
                </span>
              ) : (
                "-"
              )}{" "}
            </div>
          </div>
        );
      })}
  </div>
);
