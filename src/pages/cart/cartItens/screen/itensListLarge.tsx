import React from "react";
import { Button, Tooltip } from "antd";
import { Count } from "../components/count";
import { SelectChangeColor } from "../components/selectColors";

import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { SelectPayment } from "../components/selectPayment";
import SelectInsurance from "../components/selectInsurance";
import { IDevices } from "@/interfaces/devices";
import { IOrderResponse, Item } from "@/interfaces/order";

type SelectedItemColor = { id: number; color: string };
type SelectedItemQtd = { id: number; quantity: number };

const normalizeAvailableColors = (colors: string[] | undefined) =>
  (colors ?? []).flatMap((color) =>
    color
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );

export const ItensListLargeScreen = ({
  removeItem,
  selectedColor,
  updateItemColor,
  selectedQtd,
  updateItemQuantity,
  purchaseById,
  products,
  saveSelectedSeguro,
  removeInsurance,
  updatePossivelProspectSeguro,
  updateParcelamentoValues,
}: {
  removeItem?: (params: { id: number; device_id: number }) => void;
  selectedColor: SelectedItemColor[];
  updateItemColor: (id: number, newColor: string) => void;
  selectedQtd: SelectedItemQtd[];
  updateItemQuantity: (id: number, newQtd: number) => void;
  purchaseById: IOrderResponse | undefined | null;
  products: IDevices[];
  saveSelectedSeguro: (deviceId: number, insuranceType: string) => void;
  removeInsurance: (params: { id: number; itemId: number }) => void;
  updatePossivelProspectSeguro: (value: number) => void;
  updateParcelamentoValues: (installments: number) => void;
}) => {
  return (
    <div className="hidden md:block">
      {/* Header das informações */}
      <div className="flex items-center justify-between font-semibold text-[#666666] text-[15px]">
        <p className="w-30 text-center  ">Código</p>
        <p className="w-24 text-center  ">Tipo</p>
        <p className="w-28 text-center ">Marca</p>
        <p className="w-58 text-center ">Modelo</p>
        <p className="w-34  text-center  flex items-center cursor-pointer gap-1 justify-center">
          Preferência de Cor{" "}
          {/* <div className="cursor-poiter">
            <Tooltip
              title="A escolha de cor é uma indicação de preferência. Mas a consolidação do pedido na cor escolhida depende da disponibilidade no estoque no momento do fechamento efetivo do pedido."
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <ExclamationCircleOutlined />
            </Tooltip>
          </div> */}
        </p>
        <p className="w-28  text-center ">Quantidade</p>

        <p className="w-36 text-center flex items-center cursor-pointer gap-1 justify-center ">
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
        <p className="w-32 text-center  ">Parcela (R$) </p>
        <p className="w-12 text-center  "> </p>
      </div>
      <hr className="border-t border-neutral-300 mx-2" />

      {/* Renderização dinâmica dos produtos em ordem decrescente */}
      {[...(purchaseById?.order?.items ?? [])]
        .slice()
        .reverse()
        .map((product: Item) => {
          const selectedProductColor =
            selectedColor?.find(
              (p) => p.id === product.item_id
            )?.color ??
            product.selected_color;

          // Cria as opções de cores a partir do array de cores do produto
          const colorsOptions = normalizeAvailableColors(product.available_colors).map((cor: string) => ({
            label: cor,
            value: cor,
          }));

          const selectedProductQtd = selectedQtd.find(
            (p) => p.id === product.item_id
          );
          const qtdForProduct =
            selectedProductQtd?.quantity ?? product.quantity ?? 1;

          return (
            <React.Fragment key={product.item_id}>
              <div className="flex items-center justify-between py-4 text-[14px]">
                <p className="text-[14px]  font-semibold w-30 text-center">
                  {product.sap_code}
                </p>
                <p className="text-[14px]  font-semibold w-24 text-center">
                  {product.type}
                </p>
                <p className="text-[14px]  font-semibold w-28 text-center">
                  {product.brand}
                </p>
                <p className="text-[14px]   font-semibold w-58 text-center">
                  {product.model || "-"}
                </p>
                <div className="text-[14px]   font-semibold w-34 flex justify-center items-center text-center">
                  <SelectChangeColor
                    value={selectedProductColor || ""}
                    colorsOptions={colorsOptions}
                    onChange={(newColor) =>
                      updateItemColor(product.item_id, newColor)
                    }
                  />
                </div>
                <div className="w-28   flex justify-center items-center  text-center">
                  <Count
                    onRemove={() =>
                      removeItem?.({
                        id: Number(purchaseById?.order?.id),
                        device_id: product?.item_id,
                      })
                    }
                    count={qtdForProduct}
                    onChange={(newQtd) => updateItemQuantity(product.item_id, newQtd)}
                  />
                </div>
                <span className="w-36 text-center ">
                  {products.find((p) => p.id === product.device_id)
                    &&
                    (products.find((p) => p.id === product.device_id)?.insurance_theft ||
                      products.find((p) => p.id === product.device_id)?.insurance_theft_damages) ?
                    (
                      <SelectInsurance
                        product={products.find((p) => p.id === product.device_id)}
                        itemId={product.item_id}
                        saveSelectedSeguro={saveSelectedSeguro}
                        item={product}
                        removeInsurance={removeInsurance}
                        purchaseById={purchaseById}
                        updatePossivelProspectSeguro={updatePossivelProspectSeguro}
                      />
                    )
                    : ("-")}


                </span>
                <p className="text-[16px]  text-neutral-700 font-semibold w-32 text-center">
                  R${" "}
                  {(
                    Number(product?.installment_amount)
                  ).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

                <span className="">
                  <Tooltip
                    className=""
                    title="Remover item"
                    placement="top"
                    styles={{ body: { fontSize: "11px" } }}
                  >
                    <Button
                      color="purple"
                      variant="link"
                      className="w-12"
                      style={{ color: "#660099" }}
                      onClick={() =>
                        removeItem?.({
                          id: Number(purchaseById?.order?.id),
                          device_id: product?.item_id,
                        })
                      }
                    >
                      <DeleteOutlined size={20} />
                    </Button>
                  </Tooltip>
                </span>
              </div>
              <hr className="border-t border-neutral-300 mx-2" />
            </React.Fragment>
          );
        })}
      <div className="flex items-center bg-white shadow rounded-[4px] mt-2 py-4 px-2 pr-4 gap-4 justify-end mb-2">
        <div className="flex gap-2">
          <p className="text-center text-[#666666] flex items-center cursor-pointer gap-1 justify-center">
            Parcelamento:{" "}
          </p>
          <SelectPayment
            updateParcelamentoValues={updateParcelamentoValues}
            purchaseById={purchaseById}
          />
        </div>
        <div className="flex gap-2 ">
          <p className="text-center text-[#666666] flex items-center ">
            Total da parcela:
          </p>
          <p className="text-neutral-700">
            R${" "}
            {purchaseById?.order?.price_summary?.installment_total.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
