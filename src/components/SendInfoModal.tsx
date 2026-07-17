import { Button, ConfigProvider, Form, Input, Modal } from "antd";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { IDevices } from "@/interfaces/devices";

const PhoneInput = (props: PatternFormatProps) => (
    <PatternFormat
        {...props}
        format="(##) #####-####"
        customInput={Input}
        placeholder="Telefone"
        size="middle"
    />
);

const CNPJInput = (props: PatternFormatProps) => (
    <PatternFormat
        {...props}
        format="##.###.###/####-##"
        customInput={Input}
        placeholder="CNPJ"
        size="middle"
    />
);

type SendInfoFormValues = {
    cnpj: string;
    full_name: string;
    phone: string;
};

type Props = {
    open: boolean;
    onClose: () => void;
    onSubmit: (
        values: SendInfoFormValues,
        productDetail?: IDevices | null
    ) => void | boolean | Promise<void | boolean>;
    productDetail?: IDevices | null;
    isSubmitting?: boolean;
    showProductCard?: boolean;
    closeOnSuccess?: boolean;
    modalWidth?: number;
};

function getProductImage(productDetail?: IDevices | null, images: string[] = []) {
    if (!productDetail) return images[0];

    if (productDetail.model === "Roteador Askey Wifi 5G") return "assets/RoteadorAskey.jpeg";
    if (productDetail.model === "Vivo Box Internet 4G BCMG718") return "assets/VivoBox.png";
    if (productDetail.model === "Relógio Samsung Watch7 (Galaxy Watch 7 Classic LTE 44mm) – 4G") {
        return "assets/RelógioSamsungWatch7.png";
    }
    if (productDetail.model === "Tablet Samsung X616 (Galaxy Tab S9 FE+ 5G)") {
        return "assets/TabletSamsungX616.png";
    }

    return images[0];
}

export default function SendInfoModalBase({
    open,
    onClose,
    onSubmit,
    productDetail = null,
    isSubmitting = false,
    showProductCard = true,
    closeOnSuccess = false,
    modalWidth,
}: Props) {
    const [form] = Form.useForm();

    const imageList = productDetail?.technical_sheet?.tabela?.Imagens;
    const images: string[] = Array.isArray(imageList) ? imageList : [];

    const width = modalWidth ?? (showProductCard ? 780 : 500);

    return (
        <Modal
            centered
            title={<span style={{ color: "#660099", fontSize: "20px" }}></span>}
            open={open}
            onCancel={onClose}
            footer={null}
            width={width}
        >
            <div className="flex flex-wrap sm:flex-wrap md:flex-nowrap lg:flex-nowrap gap-2 min-h-[220px] justify-center">
                <div
                    className={`text-[#666666] mt-2 overflow-y-auto max-h-full scrollbar scrollbar-thin ${isSubmitting ? "pointer-events-none" : ""
                        }`}
                >
                    <div className="flex flex-col md:flex-row lg:flex-row gap-4">
                        <div className="flex flex-col text-center gap-1 p-1">
                            <span style={{ color: "#660099", fontSize: "20px" }}>Orçamento Vivo Empresas</span>
                            <p style={{ fontWeight: "bold" }} className="text-[15px] text-neutral-700">
                                Preencha os dados da sua empresa para gerar seu orçamento.
                            </p>
                            <p className="text-[12px]">Você poderá ajustar parcelas e produtos no carrinho.</p>

                            <ConfigProvider
                                theme={{
                                    components: {
                                        Input: {
                                            hoverBorderColor: "#660099",
                                            activeBorderColor: "#660099",
                                            activeShadow: "none",
                                            colorBorder: "#bfbfbf",
                                            colorTextPlaceholder: "#666666",
                                        },
                                        Button: {
                                            colorPrimary: "#660099",
                                            colorPrimaryHover: "#883fa2",
                                        },
                                    },
                                }}
                            >
                                <Form
                                    name="trigger"
                                    form={form}
                                    layout="vertical"
                                    className="text-[#666666] gap-2 p-2"
                                    onFinish={async (values: SendInfoFormValues) => {
                                        const payload = {
                                            ...values,
                                            phone: values.phone.replace(/\D/g, ""),
                                            cnpj: values.cnpj.replace(/\D/g, ""),
                                        };

                                        const success = await onSubmit(payload, productDetail);
                                        if (closeOnSuccess && success === true) onClose();
                                    }}
                                >
                                    <div className="flex flex-col md:flex-row lg:flex-row items-center">
                                        <div className="w-full">
                                            <div className="flex mt-2 gap-2 w-full h-12">
                                                <Form.Item
                                                    name="cnpj"
                                                    className="flex-1 h-full w-full items-center"
                                                    rules={[
                                                        { required: true, message: "Adicione um CNPJ" },
                                                        {
                                                            pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
                                                            message: "CNPJ inválido",
                                                        },
                                                    ]}
                                                >
                                                    <CNPJInput format="XX.XXX.XXX/XXXX-XX" />
                                                </Form.Item>
                                            </div>

                                            <div className="flex mt-2 gap-2 w-full h-12">
                                                <Form.Item
                                                    name="full_name"
                                                    className="flex-1 h-full w-full items-center"
                                                    rules={[
                                                        { max: 16, required: true, message: "Adicione um nome" },
                                                        {
                                                            pattern: /^[A-Za-zÀ-ÿ\s]+$/,
                                                            message: "Apenas letras são permitidas",
                                                        },
                                                    ]}
                                                >
                                                    <Input className="gap-1 p-1" placeholder="Nome Completo" />
                                                </Form.Item>
                                            </div>

                                            <div className="flex mt-2 gap-2 w-full h-12">
                                                <Form.Item
                                                    name="phone"
                                                    className="flex-1 h-full w-full items-center"
                                                    rules={[{ required: true, message: "Adicione um telefone" }, { pattern: /^\(\d{2}\) \d{5}-\d{4}$/, message: "Telefone inválido" }]}
                                                >
                                                    <PhoneInput format="(XX) XXXXX-XXXX" />
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2 flex justify-center">
                                        <Button
                                            type="primary"
                                            variant="solid"
                                            style={{
                                                fontSize: "16px",
                                                color: "white",
                                                backgroundColor: "#32844c",
                                            }}
                                            htmlType="submit"
                                        >
                                            Abrir Orçamento
                                        </Button>
                                    </div>
                                </Form>
                            </ConfigProvider>
                        </div>

                        {showProductCard && productDetail && (
                            <div className="flex justify-center">
                                <div className="flex flex-row md:flex-col lg:flex-col items-center gap-4 w-[295px] md:w-6/6 lg:w-6/6 p-2 h-[186px]">
                                    <img
                                        src={getProductImage(productDetail, images)}
                                        alt={productDetail?.model ?? productDetail?.name}
                                        className="w-[140px] h-[140px] md:w-[180px] lg:w-[180px] md:h-[180px] lg:h-[180px] object-contain rounded-lg"
                                    />
                                    <div className="flex flex-col justify-between w-full text-[13px] md:text-[14px] lg:text-[14px]">
                                        <p style={{ fontWeight: "bold", paddingBottom: "4px" }} className="text-[14px] text-neutral-700">
                                            {productDetail?.model}
                                        </p>
                                        <p style={{ fontWeight: "bold" }} className="text-[14px] text-neutral-700">
                                            Parcelas:
                                        </p>
                                        <span>
                                            24x de <span>R$ {productDetail?.price_24x?.toFixed(2).replace(".", ",")}</span>
                                        </span>
                                        <span>
                                            ou em até 10x de R$ {productDetail?.price_10x?.toFixed(2).replace(".", ",")} sem juros direto na sua
                                            Fatura Vivo
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
