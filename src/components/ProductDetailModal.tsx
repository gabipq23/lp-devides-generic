import { Button, ConfigProvider, Modal } from "antd";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IDevices } from "@/interfaces/devices";
import InsuranceDiv from "@/pages/productCatalog/components/insuranceDiv";
type InstallmentOption = {
    installments: number;
    price: number;
    label: string;
};

function getInstallmentOptions(
    product: IDevices | null
): InstallmentOption[] {
    if (!product) return [];

    const options: InstallmentOption[] = [];

    // À vista
    if (product.price != null && product.price > 0) {
        options.push({
            installments: 1,
            price: product.price,
            label: "À vista",
        });
    }

    // 10x
    if (product.price_10x != null && product.price_10x > 0) {
        options.push({
            installments: 10,
            price: product.price_10x,
            label: "10x",
        });
    }

    // 12x
    if (product.price_12x != null && product.price_12x > 0) {
        options.push({
            installments: 12,
            price: product.price_12x,
            label: "12x",
        });
    }

    // 24x
    if (product.price_24x != null && product.price_24x > 0) {
        options.push({
            installments: 24,
            price: product.price_24x,
            label: "24x",
        });
    }

    // 36x
    if (product.price_36x != null && product.price_36x > 0) {
        options.push({
            installments: 36,
            price: product.price_36x,
            label: "36x",
        });
    }

    // 48x
    if (product.price_48x != null && product.price_48x > 0) {
        options.push({
            installments: 48,
            price: product.price_48x,
            label: "48x",
        });
    }

    return options;
}

type AddItemVariables = {
    id: string;
    data: any;
};

type Props = {
    isModalOpen: boolean;
    closeModal: () => void;
    productDetail: IDevices | null;
    parcelamentoQtd: number | string | null;
    addItemInChart: (
        variables: AddItemVariables,
        options?: { onSuccess?: () => void; onError?: (error: unknown) => void }
    ) => void;
};

function getFallbackImage(productDetail: IDevices | null): string {
    if (!productDetail) return "";
    if (productDetail.model === "Roteador Askey Wifi 5G") return "assets/RoteadorAskey.jpeg";
    if (productDetail.model === "Vivo Box Internet 4G BCMG718") return "assets/VivoBox.png";
    return "";
}

export default function ProductDetailModal({
    isModalOpen,
    closeModal,
    productDetail,
    parcelamentoQtd,
    addItemInChart,
}: Props) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images: string[] = useMemo(
        () => [
            ...(Array.isArray(productDetail?.technical_sheet?.tabela?.Imagens)
                ? productDetail.technical_sheet.tabela.Imagens
                : []),
            ...(Array.isArray(productDetail?.technical_sheet?.tabela?.imagens)
                ? productDetail.technical_sheet.tabela.imagens
                : []),
        ],
        [productDetail]
    );

    const previousImage = () => {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const nextImage = () => {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const fallbackImage = getFallbackImage(productDetail);
    const showCarousel = images.length > 0;
    const showFallbackImage = !showCarousel && !!fallbackImage;
    const installmentOptions = useMemo(
        () => getInstallmentOptions(productDetail),
        [productDetail]
    );

    const normalizedInstallments =
        installmentOptions.find(
            (option) => option.installments === Number(parcelamentoQtd)
        )?.installments ??
        installmentOptions[installmentOptions.length - 1]?.installments ??
        1;

    useEffect(() => {
        setCurrentIndex(0);
    }, [productDetail?.id, images.length]);

    return (
        <Modal
            centered
            title={<span style={{ color: "#252525" }}>Ficha Técnica</span>}
            open={isModalOpen}
            onCancel={closeModal}
            footer={null}
            width={1100}
        >
            <div className="flex flex-wrap sm:flex-wrap md:flex-nowrap lg:flex-nowrap gap-2 h-[460px] justify-center">
                <div className="w-full flex items-center justify-center max-w-[140px] md:max-w-[500px] lg:max-w-[600px]">
                    <div className="w-full max-w-[650px]">
                        {showFallbackImage && (
                            <div className="relative flex justify-center items-center h-full">
                                <img
                                    src={fallbackImage}
                                    alt={productDetail?.name}
                                    className="max-w-full max-h-[460px] object-cover"
                                />
                            </div>
                        )}

                        {showCarousel && (
                            <div className="relative flex justify-center items-center h-full">
                                <Button color="purple" shape="circle" variant="solid" onClick={previousImage}>
                                    <ChevronLeft size={22} className="text-white" />
                                </Button>

                                <img
                                    src={images[currentIndex]}
                                    alt={`Imagem ${currentIndex + 1}`}
                                    className="max-w-full max-h-[460px] object-cover"
                                />

                                <Button color="purple" shape="circle" variant="solid" onClick={nextImage}>
                                    <ChevronRight size={22} className="text-white" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <InsuranceDiv productDetail={productDetail} />
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
                {sessionStorage.getItem("carrinhoId") && (
                    <div className="mt-4 flex justify-end">
                        <Button
                            onClick={() => {
                                closeModal();
                                if (productDetail) {
                                    addItemInChart({
                                        id: sessionStorage.getItem("carrinhoId") || "",
                                        data: {
                                            device_id: productDetail.id,
                                            quantity: 1,
                                            installments: normalizedInstallments,
                                            selected_color: productDetail.available_colors[0],
                                        },
                                    });
                                }
                            }}
                            type="primary"
                            variant="solid"
                            style={{
                                fontSize: "16px",
                                color: "white",
                                backgroundColor: "#32844c",
                            }}
                        >
                            Adicionar ao carrinho
                        </Button>
                    </div>
                )}
            </ConfigProvider>
        </Modal>
    );
}
