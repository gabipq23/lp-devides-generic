import React from "react";
import { Button, ConfigProvider, Select, Tooltip } from "antd";
import { PlusOutlined, CloseOutlined } from "@ant-design/icons";
import { useAddNewDeviceController } from "./controller";
import { IDevices } from "@/interfaces/devices";

type AllSelectsToAddProductsProps = {
  addItemInChart: (params: any) => void;
  products: IDevices[];
};

export const AllSelectsToAddProducts: React.FC<
  AllSelectsToAddProductsProps
> = ({ addItemInChart, products }) => {

  const {
    setShowClearButton,
    selectedTipo,
    setSelectedTipo,
    selectedMarca,
    setSelectedMarca,
    selectedModelo,
    setSelectedModelo,
    selectedCor,
    setSelectedCor,
    filteredProducts,
    tipos,
    marcas,
    modelos,
    cores,
    clearFilter,
  } = useAddNewDeviceController({ products });

  return (
    <div className="flex  flex-wrap flex-col md:flex-row lg:flex-row ">
      <ConfigProvider
        theme={{
          components: {
            Select: {
              hoverBorderColor: "#8E8E8E",
              activeBorderColor: "#8E8E8E",
              activeOutlineColor: "none",
              colorBorder: "#a2a2a2",
              colorTextPlaceholder: "#a2a2a2",
            },
            Button: {
              colorBorder: "#660099",
              colorText: "#660099",
              colorPrimaryHover: "#cb1ef5",
              colorPrimaryBorderHover: "#cb1ef5",
            },
          },
        }}
      >
        <div className="flex w-full flex-wrap justify-between   items-center gap-2">
          <div className="flex flex-1 flex-wrap gap-2">
            {/* Tipo */}
            <Select
              className="flex-1 min-w-[110px] max-w-[118px] sm:min-w-[110px] sm:max-w-[118px] md:min-w-[110px] md:max-w-[118px] lg:min-w-[110px] lg:max-w-[118px]"
              showSearch
              placeholder="Tipo"
              value={selectedTipo}
              onChange={(value) => {
                setSelectedTipo(value);
                setSelectedMarca(undefined);
                setSelectedModelo(undefined);
                setShowClearButton(true);
              }}
              filterOption={(input, option) => {
                if (!option || typeof option.label !== "string") return false;
                return option.label.toLowerCase().includes(input.toLowerCase());
              }}
              options={tipos.filter(
                (tipo) =>
                  typeof tipo.label === "string" && tipo.label.trim() !== ""
              )}
            />
            {/* Marca */}
            <Select
              className="flex-1 min-w-[80px] max-w-[100px] sm:min-w-[80px] sm:max-w-[100px] md:min-w-[80px] md:max-w-[100px] lg:min-w-[80px] lg:max-w-[100px]"
              showSearch
              placeholder="Marca"
              value={selectedMarca}
              onChange={(value) => {
                setSelectedMarca(value);
                setSelectedModelo(undefined);
                setShowClearButton(true);
              }}
              filterOption={(input, option) => {
                if (!option || typeof option.label !== "string") return false;
                return option.label.toLowerCase().includes(input.toLowerCase());
              }}
              options={marcas}
            />
            {/* Modelo */}
            {/* Select para tela sm */}
            <div className="block md:hidden w-full">
              <Select
                style={{ height: selectedModelo ? 130 : undefined }}
                className="flex-1 min-w-[270px] max-w-[250px]"
                showSearch
                placeholder="Modelo"
                value={selectedModelo}
                onChange={(value) => {
                  setSelectedModelo(value);
                  setShowClearButton(true);
                }}
                filterOption={(input, option) => {
                  if (!option || typeof option.label !== "string") return false;
                  return (option.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase());
                }}
                options={modelos.map((modelo) => ({
                  ...modelo,
                  label: (
                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col">
                        <span className="whitespace-normal">
                          {modelo.label}
                        </span>
                      </div>
                      <span className="ml-2 text-[#888]">
                        24x de R$
                        {modelo.preco?.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ),
                }))}
              />
            </div>
            {/* Select para tela md/lg */}
            <div className="hidden md:block ">
              {/* Modelo */}
              <Select
                className="flex-1 min-w-[270px] max-w-[250px] sm:min-w-[500px] sm:max-w-[520px] md:min-w-[460px] md:max-w-[500px] lg:min-w-[560px] lg:max-w-[580px]"
                showSearch
                placeholder="Modelo"
                value={selectedModelo}
                onChange={(value) => {
                  setSelectedModelo(value);
                  setShowClearButton(true);
                }}
                filterOption={(input, option) => {
                  if (!option || typeof option.label !== "string") return false;
                  return (option.label as string)
                    .toLowerCase()
                    .includes(input.toLowerCase());
                }}
                options={modelos.map((modelo) => ({
                  ...modelo,
                  label: (
                    <div className="flex justify-between items-center w-full">
                      <div className="flex flex-col">
                        <span className="whitespace-normal">
                          {modelo.label}
                        </span>
                      </div>
                      <span className="ml-2 text-[#888]">
                        24x de R$
                        {modelo.preco?.toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  ),
                }))}
              />
            </div>
            {/* Cor */}
            <Select
              className="flex-1 min-w-[120px] max-w-[140px] sm:min-w-[120px] sm:max-w-[140px] md:min-w-[120px] md:max-w-[140px] lg:min-w-[80px] lg:max-w-[118px]"
              showSearch
              placeholder="Cor"
              value={selectedCor}
              onChange={(value) => setSelectedCor(value)}
              filterOption={(input, option) => {
                if (!option || typeof option.label !== "string") return false;
                return option.label.toLowerCase().includes(input.toLowerCase());
              }}
              options={cores}
            />
            <div className="flex w-auto self-end md:self-start lg:self-start gap-2">
              <Button
                style={{ width: "18px", height: "32px" }}
                type="default"
                variant="solid"
                onClick={() => {
                  addItemInChart({
                    device_id: filteredProducts[0]?.id,
                    quantity: 1,
                    selected_color: selectedCor || filteredProducts[0]?.available_colors[0],
                  });
                  clearFilter();
                }}
              >
                <Tooltip
                  title="Adicionar produto"
                  placement="top"
                  styles={{ body: { fontSize: "11px" } }}
                >
                  <PlusOutlined />
                </Tooltip>
              </Button>
              <Button
                type="default"
                variant="solid"
                style={{ width: "18px", height: "32px" }}
                onClick={() => {
                  clearFilter();
                }}
              >
                <Tooltip
                  title="Limpar escolha"
                  placement="top"
                  styles={{ body: { fontSize: "11px" } }}
                >
                  <CloseOutlined />
                </Tooltip>
              </Button>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </div>
  );
};
