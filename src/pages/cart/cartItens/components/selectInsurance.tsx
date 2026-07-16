import React, { useEffect } from "react";

import { Button, ConfigProvider, Tooltip } from "antd";

import { DownOutlined } from "@ant-design/icons";

import type { MenuProps } from "antd";
import { Dropdown } from "antd";

import { Checkbox } from "antd";
import { IDevices } from "@/interfaces/devices";
import { IOrderResponse, Item } from "@/interfaces/order";

const SelectInsurance: React.FC<{
  product?: IDevices | null;
  itemId: number;
  item: Item;
  removeInsurance: (params: { id: number; itemId: number }) => void;
  purchaseById: IOrderResponse | undefined | null;
  saveSelectedSeguro: (
    itemId: number,
    seguroTipo: string,
    seguroPreco: number,
  ) => void;
  updatePossivelProspectSeguro: (value: number) => void;
}> = ({
  purchaseById,
  removeInsurance,
  product,
  itemId,
  saveSelectedSeguro,
  updatePossivelProspectSeguro,
  item,
}) => {
    const seguro1 = product?.insurance_theft ?? 0;
    const seguro2 = product?.insurance_theft_damages ?? 0;

    const initialSeguro =
      item?.insurance_type === "insurance_theft"
        ? seguro1
        : item?.insurance_type === "insurance_theft_damages"
          ? seguro2
          : null;
    const [selectedSeguro, setSelectedSeguro] = React.useState<number | null>(
      initialSeguro,
    );

    useEffect(() => {
      setSelectedSeguro(initialSeguro);
    }, [initialSeguro]);

    const handleChange = (key: number) => (e: {
      target: { checked: boolean };
    }) => {
      if (e.target.checked) {
        const selectedInsurancePrice = key === 0 ? seguro1 : seguro2;
        setSelectedSeguro(selectedInsurancePrice);
        updatePossivelProspectSeguro(1);
        const seguroTipo =
          key === 0
            ? "insurance_theft"
            : "insurance_theft_damages";
        saveSelectedSeguro(itemId, seguroTipo, selectedInsurancePrice);
      } else {
        setSelectedSeguro(null);
        saveSelectedSeguro(itemId, "", 0);
      }
    };

    const handleRemoveSeguro = () => {
      if (purchaseById?.order?.id && itemId) {
        removeInsurance({
          id: Number(purchaseById?.order?.id),
          itemId: itemId,
        });
      }
    };
    const items: MenuProps["items"] = [
      {
        type: "group",
        label: (
          <div className="px-2 py-1 text-xs text-gray-500">
            Deseja escolher um seguro para esse produto?
          </div>
        ),
        children: [
          {
            label: (
              <span className="flex items-center gap-2">
                <ConfigProvider
                  theme={{
                    components: {
                      Checkbox: {
                        colorPrimary: "#660099",
                        colorPrimaryHover: "#660099",
                        borderRadius: 4,
                        controlInteractiveSize: 18,
                        lineWidth: 2,
                      },
                    },
                  }}
                >
                  <Checkbox
                    onChange={handleChange(0)}
                    checked={
                      item?.insurance_type === "insurance_theft"
                    }
                  ></Checkbox>{" "}
                </ConfigProvider>
                Roubo, Furto, Simples e Qualificado: R$
                {seguro1.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                /mês
              </span>
            ),
            key: "0",
          },
          {
            label: (
              <span className="flex items-center gap-2">
                <ConfigProvider
                  theme={{
                    components: {
                      Checkbox: {
                        colorPrimary: "#660099",
                        colorPrimaryHover: "#660099",
                        borderRadius: 4,
                        controlInteractiveSize: 18,
                        lineWidth: 2,
                      },
                    },
                  }}
                >
                  <Checkbox
                    onChange={handleChange(1)}
                    checked={
                      item?.insurance_type ===
                      "insurance_theft_damages"
                    }
                  ></Checkbox>{" "}
                </ConfigProvider>
                Roubo, Furto, Simples, Qualificado e Danos: R$
                {seguro2.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
                /mês
              </span>
            ),
            key: "1",
          },
          {
            label: (
              <span className="flex items-center gap-2">
                <ConfigProvider
                  theme={{
                    components: { Checkbox: { colorPrimary: "#660099" } },
                  }}
                >
                  <Checkbox
                    checked={!item?.insurance_type}
                    onChange={handleRemoveSeguro}
                  >
                    Sem seguro
                  </Checkbox>
                </ConfigProvider>
              </span>
            ),
            key: "none",
          },
        ],
      },
    ];
    const tooltipMessage =
      selectedSeguro !== null ? "Mudar seguro" : "Adicionar seguro";
    return (
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorBorder: "#8E8E8E",
              colorText: "#660099",
              colorPrimaryHover: "#cb1ef5",
              colorPrimaryBorderHover: "#cb1ef5",
            },
          },
        }}
      >
        {" "}
        <Dropdown menu={{ items }} trigger={["click"]} placement="bottom">
          <a onClick={(e) => e.preventDefault()}>
            <Tooltip
              title={tooltipMessage}
              placement="top"
              styles={{ body: { fontSize: "11px" } }}
            >
              <Button variant="outlined" className="w-38 flex">
                <img
                  width={16}
                  src="/assets/seguro-favicon.png"
                  style={{
                    display: "block",
                    marginLeft: "auto",
                  }}
                />
                {item?.insurance_price !== null &&
                  Number(item?.insurance_price) !== 0 ? (
                  <span className="flex items-center gap-2">
                    R${" "}
                    {(
                      item?.quantity * Number(item?.insurance_price)
                    )?.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /mês{" "}
                    <div className="text-[12px] text-gray-400">
                      <DownOutlined />
                    </div>
                  </span>
                ) : Number(item?.insurance_price) === 0 ? (
                  <p className="flex items-center gap-2">
                    Sem seguro{" "}
                    <div className="text-[12px] text-gray-400">
                      <DownOutlined />
                    </div>
                  </p>
                ) : (
                  <p className="flex items-center gap-2">
                    Selecione{" "}
                    <div className="text-[12px] text-gray-400">
                      <DownOutlined />
                    </div>
                  </p>
                )}
              </Button>
            </Tooltip>
          </a>
        </Dropdown>
      </ConfigProvider>
    );
  };

export default SelectInsurance;
