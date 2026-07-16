import { Button, Tooltip } from "antd";
import { Count } from "../components/count";
import { SelectChangeColor } from "../components/selectColors";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { SelectPayment } from "../components/selectPayment";
import SelectInsurance from "../components/selectInsurance";
import { IDevices } from "@/interfaces/devices";
import { IOrderResponse } from "@/interfaces/order";

export const ItensListSmallScreen = ({
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
  removeItem?: (params: any) => void;
  selectedColor: { id: number; color: string }[];
  updateItemColor: (id: number, newColor: string) => void;
  selectedQtd: { id: number; quantity: number }[];
  updateItemQuantity: (id: number, newQtd: number) => void;
  purchaseById: IOrderResponse | undefined | null;
  products: IDevices[];
  saveSelectedSeguro: any;
  removeInsurance: any;
  updatePossivelProspectSeguro: any;
  updateParcelamentoValues: any;
}) => (

  <div className="block md:hidden">
    <div className="flex bg-white rounded-lg shadow p-4 flex-col mt-4 gap-4 justify-start mb-2">
      <div className="flex gap-2 justify-between">
        <p className="text-center text-[#666666] flex items-center cursor-pointer gap-1 justify-center">
          Parcelamento:{" "}
          <div className="cursor-poiter">
            <Tooltip
              title="Este parcelamento se aplica a todos os produtos adicionados no seu carrinho."
              placement="top"
              styles={{ body: { fontSize: "12px" } }}
            >
              <ExclamationCircleOutlined />
            </Tooltip>
          </div>
        </p>
        <SelectPayment
          updateParcelamentoValues={updateParcelamentoValues}
          purchaseById={purchaseById}
        />
      </div>
      <div className="flex gap-2 justify-between">
        <p className="text-center text-[#666666] flex items-center ">
          Total da parcela:
        </p>
        <p>
          R${" "}
          {purchaseById?.order?.price_summary?.installment_total.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>

    {purchaseById?.order?.items
      ?.slice()
      .sort((a, b) => b.device_id - a.device_id)
      .map((product: any) => {
        const selectedProductQtd = selectedQtd.find(
          (p: any) => p.id === product.item_id
        );
        const qtdForProduct =
          selectedProductQtd?.quantity ?? product.quantity ?? 1;

        const selectedProductColor =
          selectedColor?.find((p: any) => p.id === product.item_id)
            ?.color ??
          (Array.isArray(product.available_colors) && product.selected_color);

        // Cria as opções de cores a partir do array de cores do produto
        const colorsOptions = Array.isArray(product.available_colors)
          ? product.available_colors
            .filter(
              (cor: string) => typeof cor === "string" && cor.trim() !== ""
            )
            .map((cor: string) => ({ label: cor, value: cor }))
          : [];
        return (
          <div
            key={product.item_id}
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
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Modelo:</span>
              <span className="text-end">{product.model || "-"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold flex items-center gap-1 text-[#666]">
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
                :
              </span>
              <SelectChangeColor
                value={selectedProductColor || ""}
                onChange={(newColor) =>
                  updateItemColor(product.item_id, newColor)
                }
                colorsOptions={colorsOptions}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#666]">Quantidade:</span>
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

            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#666]">Seguro:</span>
              {products.find((p) => p.id === product.device_id)
                &&
                (products.find((p) => p.id === product.device_id)?.insurance_theft ||
                  products.find((p) => p.id === product.device_id)?.insurance_theft_damages) ?
                (
                  <SelectInsurance
                    product={products.find((p) => p.id === product.device_id)}
                    itemId={product.device_id}
                    saveSelectedSeguro={saveSelectedSeguro}
                    item={product}
                    removeInsurance={removeInsurance}
                    purchaseById={purchaseById}
                    updatePossivelProspectSeguro={updatePossivelProspectSeguro}
                  />)
                : ("-")}


            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-[#666]">Parcela (R$) :</span>
              <span>
                R${" "}
                {(
                  Number(product?.unit_price) /
                  Number(purchaseById?.order?.price_summary?.number_of_installments || 24)
                )?.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Tooltip
                title="Remover item"
                placement="top"
                styles={{ body: { fontSize: "11px" } }}
              >
                <Button
                  color="purple"
                  variant="link"
                  className="w-14"
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
            </div>
          </div>
        );
      })}
  </div>
);
