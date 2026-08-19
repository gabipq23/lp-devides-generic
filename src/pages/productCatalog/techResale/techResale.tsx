import { Button, ConfigProvider, Dropdown } from "antd";

import ProductDetailModal from "@/components/ProductDetailModal";
import SendInfoModalBase from "@/components/SendInfoModal";
import { useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { IDevices } from "@/interfaces/devices";
import { useTechResaleController } from "./controller";

export default function TechResale() {
    const {
        productFiltered,
        items,
        selectedBrand,
        resetSelectedBrand,
        isModalOpen,
        showModal,
        closeModal,
        isModalBotOpen,
        showModalBot,
        closeModalBot,
        selectedProductDetail,
        changeSelectedProductDetail,
        addItemInChart,
        parcelamentoQtd,
        id,
        isAddItemInChartLoading,
        updateData,
        isCreatingChartLoading,
    } = useTechResaleController();

    const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

    const productVersion = productFiltered?.filter(
        (p) => p.online && p.offer_type === "Revenda"
    ) ?? [];

    const getPriceOptions = (product: IDevices) => {
        const installmentOptions = [
            { installments: 48, value: product.price_48x },
            { installments: 36, value: product.price_36x },
            { installments: 24, value: product.price_24x },
            { installments: 12, value: product.price_12x },
        ];

        const availableInstallment = installmentOptions.find(
            (option) => typeof option.value === "number" && option.value > 0
        );

        const cashPrice =
            typeof product.price === "number" && product.price > 0
                ? product.price
                : null;

        return {
            cashPrice,
            installmentOptions: availableInstallment
                ? [availableInstallment]
                : [],
        };
    };



    const normalizedInstallments = [1, 10, 12, 24].includes(Number(parcelamentoQtd))
        ? Number(parcelamentoQtd)
        : 24;

    return (
        <>
            <div className="flex items-center justify-center self-center w-full my-10 mt-4 flex-wrap">
                <div id="revenda" className="flex items-center self-center justify-center w-full my-10 mt-4 flex-wrap">
                    <div className="flex flex-col gap-6 items-center justify-center self-center flex-wrap w-full mx-20">
                        <div className="flex justify-between flex-wrap w-full items-center">
                            <h1
                                className="text-3xl text-gray-800 text-start flex-grow"
                                style={{
                                    fontFamily: "Roboto, sans-serif",
                                    fontSize: "2rem",
                                    fontStyle: "normal",
                                    fontWeight: 300,
                                    letterSpacing: "-.0625rem",
                                    lineHeight: "2.75rem",
                                    margin: "0 1.5rem 0 0",
                                    textAlign: "left",
                                    wordBreak: "break-word",
                                }}
                            >
                                Revenda
                            </h1>

                            <div className="flex-shrink-0 md:w-[160px] sm:w-[160px] lg:w-[200px]">
                                <Dropdown menu={{ items }}>
                                    <div className="relative">
                                        <Button
                                            className="w-full"
                                            variant="outlined"
                                            style={{
                                                color: "#8E8E8E",
                                                border: "1px solid #8E8E8E",
                                            }}
                                        >
                                            <span>{selectedBrand}</span>
                                            {selectedBrand !== "Filtro por marca" && (
                                                <CloseOutlined
                                                    style={{ color: "#666666" }}
                                                    onClick={() => resetSelectedBrand()}
                                                    className="border absolute right-0 border-gray-300 rounded p-[9px] text-[#660099] cursor-pointer text-[10px]"
                                                />
                                            )}
                                        </Button>
                                    </div>
                                </Dropdown>
                            </div>
                        </div>

                        <div
                            className="grid gap-6 w-full"
                            style={{
                                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                            }}
                        >
                            {productVersion?.map((product: IDevices, index: number) => {
                                if (!product.online) return null;

                                const { installmentOptions } = getPriceOptions(product);
                                const productImage = product.image?.[0];

                                return (
                                    <div
                                        key={index}
                                        className={`flex items-center ${isAddItemInChartLoading ? "pointer-events-none" : ""} relative 0 max-w-[280px] min-w-[100px] justify-start flex-wrap gap-4 p-3 bg-white rounded-[4px] border-1 border-neutral-200 shadow-sm`}
                                    >
                                        <div className="flex flex-col items-center w-full">
                                            {/* {product?.sap_code && (
                                                <Tooltip title="Código do produto" placement="top" styles={{ body: { fontSize: "11px" } }}>
                                                    <span
                                                        className="text-[12px] self-start text-gray-800 flex bg-neutral-100 py-1 mb-2 px-2 rounded-[2px]"
                                                        style={{ width: "fit-content" }}
                                                    >
                                                        cód: {product?.sap_code}
                                                    </span>
                                                </Tooltip>
                                            )} */}


                                            <div className="w-36 h-36 flex items-center justify-center rounded">
                                                {productImage ? (
                                                    <img
                                                        src={productImage}
                                                        alt={product.name}
                                                        className="max-w-full max-h-full object-contain"
                                                        style={{ width: "100%", height: "100%" }}
                                                    />
                                                ) : (
                                                    <span className="text-[12px] text-gray-400 text-center px-2">
                                                        {product.type}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-[7px] w-full h-full">
                                            <span className="text-[15px] flex items-center h-[65px] text-gray-800">
                                                {product.model}
                                            </span>

                                            <span className="text-[12px] flex justify-between text-gray-500">
                                                <p>
                                                    {product.type}
                                                </p>

                                            </span>

                                            <hr className="border-t border-gray-300 my-2 w-full" />

                                            <div className="flex flex-col gap-[2px]">

                                                {installmentOptions.map((option) => (
                                                    <span key={option.installments} className="text-gray-500 text-[14px]">
                                                        {option.installments}x de{" "}
                                                        <span className="text-gray-800 font-bold text-[16px]">
                                                            R$ {option.value!.toFixed(2).replace(".", ",")}
                                                        </span>
                                                    </span>
                                                ))}
                                            </div>

                                            <div className="flex justify-between">
                                                <ConfigProvider
                                                    theme={{
                                                        components: {
                                                            Button: {
                                                                linkHoverBg: "#f2ebf4",
                                                            },
                                                        },
                                                    }}
                                                >
                                                    <Button
                                                        type="link"
                                                        variant="solid"
                                                        style={{
                                                            color: "#660099",
                                                            textDecoration: "underline",
                                                            textUnderlineOffset: "3px",
                                                        }}
                                                        className="w-18"
                                                        onClick={() => {
                                                            showModal();
                                                            changeSelectedProductDetail(product);
                                                        }}
                                                    >
                                                        + detalhes
                                                    </Button>

                                                </ConfigProvider>
                                            </div>

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
                                                <div className="flex flex-col gap-4 pt-2 pb-1 items-center justify-center">
                                                    {sessionStorage.getItem("carrinhoId") !== null ? (
                                                        <Button
                                                            type="default"
                                                            variant="solid"
                                                            onClick={() => {
                                                                const statusFechado = sessionStorage.getItem("statusCarrinho");
                                                                if (statusFechado === "FECHADO") {
                                                                    window.open(window.location.pathname + "?zerar=1", "_blank");
                                                                } else if (id) {
                                                                    setLoadingProductId(product?.id);
                                                                    addItemInChart({
                                                                        id,
                                                                        data: {
                                                                            device_id: product?.id,
                                                                            quantity: 1,
                                                                            installments: normalizedInstallments,
                                                                            selected_color: product.available_colors?.[0],
                                                                        },
                                                                    });
                                                                }
                                                            }}
                                                        >
                                                            Adicionar
                                                        </Button>
                                                    ) : (
                                                        ""
                                                    )}

                                                    {sessionStorage.getItem("carrinhoId") === null && (
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
                                                                style={{ color: "#ffffff", fontSize: "14px" }}
                                                                className="click-btn w-28"
                                                                onClick={() => {
                                                                    showModalBot();
                                                                    changeSelectedProductDetail(product);
                                                                }}
                                                            >
                                                                Eu quero!
                                                            </Button>
                                                        </ConfigProvider>
                                                    )}
                                                </div>
                                            </ConfigProvider>
                                        </div>

                                        {loadingProductId === product.id && isAddItemInChartLoading && (
                                            <div className="absolute inset-0 backdrop-blur-[.5px] flex items-center justify-center z-10">
                                                <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <ProductDetailModal
                parcelamentoQtd={parcelamentoQtd}
                addItemInChart={addItemInChart}
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                productDetail={selectedProductDetail}
            />

            <SendInfoModalBase
                open={isModalBotOpen}
                onClose={closeModalBot}
                onSubmit={(values) => updateData(values, selectedProductDetail)}
                productDetail={selectedProductDetail}
                isSubmitting={isCreatingChartLoading}
                showProductCard
            />
        </>
    );
}
