import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import { AllSelectsToAddProducts } from "./components/addNewDevice/addNewDevice";
import { ItensListLargeScreen } from "./screen/itensListLarge";
import { ItensListSmallScreen } from "./screen/itensListSmall";

import { IDevices, } from "@/interfaces/devices";
import { IOrderResponse } from "@/interfaces/order";

function CartItem({
  removeItem,
  selectedColor,
  updateItemColor,
  selectedQtd,
  updateItemQuantity,
  purchaseById,
  addItemInChart,
  products,
  updateParcelamentoValues,
  isItensLoading,
  isAllDataLoading,
  saveSelectedSeguro,
  removeInsurance,
  isRemoveInsuranceLoading,
  updatePossivelProspectSeguro,
}: {
  removeItem?: (params: any) => void;
  selectedColor: { id: number; color: string }[];
  updateItemColor: (id: number, newColor: string) => void;
  selectedQtd: { id: number; quantity: number }[];
  updateItemQuantity: (id: number, newQtd: number) => void;
  purchaseById: IOrderResponse | undefined | null;
  addItemInChart: (params: any) => void;
  products: IDevices[];
  updateParcelamentoValues: (installments: number) => void;
  isItensLoading?: boolean;
  isAllDataLoading?: boolean;
  saveSelectedSeguro: any;
  removeInsurance: any;
  isRemoveInsuranceLoading: any;
  updatePossivelProspectSeguro: any;
}) {

  const info = (
    <>
      <div className=" ">
        {/* Campo para adição de novos produtos */}
        <div className=" bg-white shadow mb-3 rounded-[4px] mt-2 pt-3 pb-3 px-3">
          <div className="flex flex-col gap-2  ">
            <p className="text-[12px] text-neutral-600 ">Editor de pedido</p>
            <AllSelectsToAddProducts
              addItemInChart={addItemInChart}
              products={products}
            // updateParcelamentoValues={updateParcelamentoValues}
            />
          </div>
        </div>

        {/* TABELA - VISÍVEL EM TELAS GRANDES */}
        <div className="relative">
          <div className={isAllDataLoading ? "pointer-events-none" : ""}>
            <ItensListLargeScreen
              selectedColor={selectedColor}
              updateItemColor={updateItemColor}
              selectedQtd={selectedQtd}
              updateItemQuantity={updateItemQuantity}
              purchaseById={purchaseById}
              removeItem={removeItem}
              products={products}
              saveSelectedSeguro={saveSelectedSeguro}
              removeInsurance={removeInsurance}
              updatePossivelProspectSeguro={updatePossivelProspectSeguro}
              updateParcelamentoValues={updateParcelamentoValues}
            />

            {/* CARDS - VISÍVEL EM TELAS PEQUENAS */}
            <ItensListSmallScreen
              selectedColor={selectedColor}
              updateItemColor={updateItemColor}
              selectedQtd={selectedQtd}
              updateItemQuantity={updateItemQuantity}
              purchaseById={purchaseById}
              removeItem={removeItem}
              products={products}
              saveSelectedSeguro={saveSelectedSeguro}
              removeInsurance={removeInsurance}
              updateParcelamentoValues={updateParcelamentoValues}
              updatePossivelProspectSeguro={updatePossivelProspectSeguro}
            />
          </div>

          {/* OVERLAY DE LOADING */}
          {isItensLoading && (
            <div className="absolute inset-0 backdrop-blur-[.5px] flex items-center justify-center z-10">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {isRemoveInsuranceLoading && (
            <div className="absolute inset-0 backdrop-blur-[.5px] flex items-center justify-center z-10">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </div>
    </>
  );

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <p className="text-[15px]">Pedido</p>,
      children: info,
    },
  ];

  return (
    <>
      <Collapse ghost items={items} bordered={false} defaultActiveKey={["1"]} />
    </>
  );
}

export default CartItem;
