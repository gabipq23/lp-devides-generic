import React from "react";
import { Tooltip } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { IOrder } from "@/interfaces/order";

export const ItensListLargeScreen = ({
  purchaseById,
}: {
  purchaseById: IOrder | undefined;
}) => (
  <div className="hidden md:block mt-8 text-neutral-700">
    {/* Renderização dinâmica dos produtos em ordem decrescente */}
    <div className="flex items-center font-semibold text-[#666666] text-[15px]">
      <p className="w-36 text-center">Código</p>
      <p className="w-36 text-center">Tipo</p>
      <p className="w-24 text-center">Marca</p>
      <p className="w-100 text-center">Modelo</p>
      <p className="w-40 text-center flex items-center cursor-pointer gap-1 justify-center">
        Cor
        <div className="cursor-pointer">
          <Tooltip
            title="A escolha de cor é uma indicação de preferência. Mas a consolidação do pedido na cor escolhida depende da disponibilidade no estoque no momento do fechamento efetivo do pedido."
            placement="top"
            styles={{ body: { fontSize: "12px" } }}
          >
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
      </p>
      <p className="w-40 text-center">Quantidade</p>
      <p className="w-38 text-center">Parcela (R$)</p>
      <p className="w-36 text-center flex items-center cursor-pointer gap-1 justify-center">
        Parcelamento
      </p>
      <p className="w-26 text-center flex items-center cursor-pointer gap-1 justify-center ">
        Seguro{" "}
        <div className="cursor-poiter">
          <Tooltip
            title="
            Roubo, Furto, Simples e Qualificado ou
Roubo, Furto, Simples, Qualificado e Danos"
            placement="top"
            styles={{ body: { fontSize: "12px" } }}
          >
            <ExclamationCircleOutlined />
          </Tooltip>
        </div>
      </p>
    </div>
    <hr className="border-t border-neutral-300 mx-2" />

    {[...(purchaseById?.items ?? [])]
      .slice()
      .reverse()
      .map((product: any) => {
        return (
          <React.Fragment key={product.device_id}>
            <React.Fragment key={product.device_id}>
              <div className="flex items-center py-4 text-[14px] text-neutral-700">
                <p className="text-[14px]  font-semibold w-36 text-center">
                  {product.sap_code}
                </p>
                <p className="text-[14px] w-36 text-center">{product.type}</p>
                <p className="text-[14px] font-semibold w-24 text-center">
                  {product.brand}
                </p>
                <p className="text-[14px] font-semibold w-100 text-center">
                  {product.model || "-"}
                </p>
                <p className="text-[14px] font-semibold w-40 text-center">
                  {product?.selected_color || "-"}
                </p>
                <p className="text-[14px] font-semibold w-40 text-center">
                  {product?.quantity}
                </p>
                <p className="text-[16px] text-neutral-700 font-semibold w-38 text-center">
                  R${" "}
                  {(
                    Number(product?.installment_amount)
                  ).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
                <p className="text-[16px] text-neutral-700 font-semibold w-36 text-center">
                  {purchaseById?.price_summary?.number_of_installments === 1
                    ? "à vista"
                    : `${purchaseById?.price_summary?.number_of_installments}x`}
                </p>
                <p className="w-26 text-center ">
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
                  )}
                </p>
              </div>
              <hr className="border-t border-neutral-300 mx-2" />
            </React.Fragment>

            <hr className="border-t border-neutral-300 mx-2" />
          </React.Fragment>
        );
      })}
  </div>
);
