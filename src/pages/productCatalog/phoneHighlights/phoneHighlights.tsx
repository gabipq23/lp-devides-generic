import { Button, ConfigProvider, Dropdown, Tooltip } from "antd";
import { usePhoneHighlightsController } from "./controller";
import ProductDetailModal from "@/components/ProductDetailModal";
import SendInfoModalBase from "@/components/SendInfoModal";
import { useMemo, useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { IDevices } from "@/interfaces/devices";
import { usePartner } from "@/context/PartnerContext";

export default function PhoneHighlights() {
    const { version } = usePartner();
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
    } = usePhoneHighlightsController();

    const [loadingProductId, setLoadingProductId] = useState<number | null>(null);

    const isProductVivoBoxIMG = "assets/VivoBox.png";
    const isProductRoteadorAskeyIMG = "assets/RoteadorAskey.jpeg";
    const isProductRelógioSamsungWatch7IMG = "assets/RelógioSamsungWatch7.png";
    const isProductTabletSamsungX616 = "assets/TabletSamsungX616.png";

    const normalizeAvailableColors = (colors: string[] | undefined) =>
        (colors ?? []).flatMap((color) =>
            color
                .split(",")
                .map((value) => value.trim())
                .filter(Boolean),
        );

    const productVersion = useMemo(() => {
        if (!productFiltered) return [];
        const shuffle = (arr: IDevices[]) => arr.slice().sort(() => Math.random() - 0.5);
        const isOnlineProduct = (product: IDevices) => product.online;
        const allOnline = productFiltered.filter(isOnlineProduct);

        let filtered: IDevices[] = [];
        if (!version || version === "0") {
            filtered = allOnline;
        } else if (version === "1") {
            filtered = allOnline.filter((p) => Number(p.price_10x) * 10 <= 1300);
        } else if (version === "2") {
            filtered = allOnline.filter((p) => Number(p.price_10x) * 10 > 1300 && Number(p.price_10x) * 10 <= 6000);
        } else if (version === "3") {
            filtered = allOnline.filter((p) => Number(p.price_10x) * 10 > 6000);
        } else {
            filtered = allOnline;
        }

        return shuffle(filtered).slice(0, 8);
    }, [productFiltered, version]);

    const getTooltipMessage = (product: IDevices) => {
        const { insurance_theft, insurance_theft_damages } = product;
        const validValues = [insurance_theft, insurance_theft_damages].filter(
            (value) => typeof value === "number" && value > 0,
        );

        if (validValues.length === 0) {
            return "Esse aparelho não possui seguro disponível.";
        }

        const lowerInsuranceValue = Math.min(...validValues);
        return `Seguro para este aparelho: a partir de R$ ${lowerInsuranceValue.toFixed(2).replace(".", ",")}`;
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("zerar") === "1") {
            sessionStorage.clear();
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const normalizedInstallments = [1, 10, 12, 24].includes(Number(parcelamentoQtd))
        ? Number(parcelamentoQtd)
        : 24;

    return (
        <>
            <div className="flex items-center justify-center self-center w-full my-10 mt-4 flex-wrap">
                <div id="destaques" className="flex items-center self-center justify-center w-full my-10 mt-4 flex-wrap">
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
                                Destaques
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
                            className="grid gap-4 w-full justify-items-center"
                            style={{
                                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                            }}
                        >
                            {productVersion?.map((product: IDevices, index: number) => {
                                if (!product.online) return null;

                                const availableColors = normalizeAvailableColors(product.available_colors);

                                return (
                                    <div
                                        key={index}
                                        className={`flex items-center ${isAddItemInChartLoading ? "pointer-events-none" : ""} relative 0 max-w-[280px] min-w-[100px] justify-start flex-wrap gap-4 p-3 bg-white rounded-[4px] border-1 border-neutral-200 shadow-sm`}
                                    >
                                        <div className="flex flex-col items-center w-full">
                                            <Tooltip title="Código do produto" placement="top" styles={{ body: { fontSize: "11px" } }}>
                                                <span
                                                    className="text-[12px] self-start text-gray-800 flex bg-neutral-100 py-1 mb-2 px-2 rounded-[2px]"
                                                    style={{ width: "fit-content" }}
                                                >
                                                    cód: {product?.sap_code}
                                                </span>
                                            </Tooltip>
                                            <div className="w-36 h-36 flex items-center justify-center rounded">
                                                <img
                                                    src={
                                                        product.model === "Roteador Askey Wifi 5G"
                                                            ? isProductRoteadorAskeyIMG
                                                            : product.model === "Vivo Box Internet 4G BCMG718"
                                                                ? isProductVivoBoxIMG
                                                                : product.model === "Relógio Samsung Watch7 (Galaxy Watch 7 Classic LTE 44mm) – 4G"
                                                                    ? isProductRelógioSamsungWatch7IMG
                                                                    : product.model === "Tablet Samsung X616 (Galaxy Tab S9 FE+ 5G)"
                                                                        ? isProductTabletSamsungX616
                                                                        : product?.technical_sheet?.tabela?.Imagens?.[0]
                                                    }
                                                    alt={product.name}
                                                    className="max-w-full max-h-full object-contain"
                                                    style={{ width: "100%", height: "100%" }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-[7px]">
                                            <span className="text-[15px] flex items-center h-[65px] text-gray-800">
                                                {product.model}
                                            </span>

                                            <span className="text-[12px] text-gray-800 flex items-center gap-2">
                                                <p>
                                                    Cores{" "}
                                                    <Tooltip
                                                        title="A escolha de cor é uma indicação de preferência. Mas a consolidação do pedido na cor escolhida depende da disponibilidade no estoque no momento do fechamento efetivo do pedido."
                                                        placement="top"
                                                        styles={{ body: { fontSize: "11px" } }}
                                                    >
                                                        <span className="cursor-pointer">*</span>
                                                    </Tooltip>{" "}
                                                </p>
                                                <div className="flex gap-2">
                                                    {availableColors.includes("Preto") && (
                                                        <Tooltip title="Preto" placement="top" styles={{ body: { fontSize: "11px" } }}>
                                                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "black" }}></span>
                                                        </Tooltip>
                                                    )}
                                                    {availableColors.includes("Titânio") && (
                                                        <Tooltip title="Titânio" placement="top" styles={{ body: { fontSize: "11px" } }}>
                                                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "black" }}></span>
                                                        </Tooltip>
                                                    )}
                                                    {availableColors.includes("Branco") && (
                                                        <Tooltip title="Branco" placement="top" styles={{ body: { fontSize: "11px" } }}>
                                                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "white", border: "1px solid black" }}></span>
                                                        </Tooltip>
                                                    )}
                                                    {availableColors.includes("Vermelho") && (
                                                        <Tooltip title="Vermelho" placement="top" styles={{ body: { fontSize: "11px" } }}>
                                                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "darkred" }}></span>
                                                        </Tooltip>
                                                    )}
                                                    {availableColors.includes("Azul") && (
                                                        <Tooltip title="Azul" placement="top" styles={{ body: { fontSize: "11px" } }}>
                                                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "darkblue" }}></span>
                                                        </Tooltip>
                                                    )}
                                                    {["Cinza", "Prata", "Grafite"].some((cor) => availableColors.includes(cor)) && (
                                                        <Tooltip title="Cinza" placement="top" styles={{ body: { fontSize: "11px" } }}>
                                                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "gray" }}></span>
                                                        </Tooltip>
                                                    )}
                                                    {availableColors.includes("Verde") && (
                                                        <Tooltip title="Verde" placement="top" styles={{ body: { fontSize: "11px" } }}>
                                                            <span className="w-4 h-4 rounded-full" style={{ backgroundColor: "green" }}></span>
                                                        </Tooltip>
                                                    )}
                                                </div>
                                            </span>

                                            <hr className="border-t border-gray-300 my-2 w-full" />

                                            <span className="text-gray-500 text-[14px]">
                                                24x de{" "}
                                                <span className="text-gray-800 font-bold text-[20px]">
                                                    R$ {product?.price_24x?.toFixed(2).replace(".", ",")}
                                                </span>
                                            </span>
                                            <span className="text-gray-500 text-[14px]">
                                                ou em até 10x de R${" "}
                                                {product?.price_10x?.toFixed(2).replace(".", ",")} sem juros direto na sua fatura Vivo
                                            </span>

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
                                                    {(product?.insurance_theft_damages || product?.insurance_theft) && (
                                                        <Tooltip title={getTooltipMessage(product)} placement="top" styles={{ body: { fontSize: "11px" } }}>
                                                            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                                                                <Button
                                                                    type="link"
                                                                    style={{
                                                                        padding: 3,
                                                                        color: "#660099",
                                                                        textDecoration: "underline",
                                                                        textUnderlineOffset: "3px",
                                                                    }}
                                                                    onClick={() => {
                                                                        showModal();
                                                                        changeSelectedProductDetail(product);
                                                                    }}
                                                                >
                                                                    <img
                                                                        width={16}
                                                                        src="/assets/seguro-favicon.png"
                                                                        style={{ display: "block", marginLeft: "auto" }}
                                                                    />{" "}
                                                                    Seguro Celular
                                                                </Button>
                                                            </div>
                                                        </Tooltip>
                                                    )}
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
                                                                            selected_color: availableColors[0],
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
