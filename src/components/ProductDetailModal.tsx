import { Button, ConfigProvider, Modal } from "antd";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IDevices } from "@/interfaces/devices";
import InsuranceDiv from "@/pages/productCatalog/components/insuranceDiv";

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
    const showFallbackImage = !showCarousel && productDetail?.technical_sheet === null && !!fallbackImage;
    const normalizedInstallments = [1, 10, 12, 24].includes(Number(parcelamentoQtd))
        ? Number(parcelamentoQtd)
        : 24;

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
