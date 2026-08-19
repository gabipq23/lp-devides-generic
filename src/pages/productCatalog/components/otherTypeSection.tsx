import { ArrowRight } from "lucide-react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { buildOtherTypePath } from "@/configs/partnerRuntime";
import { usePartner } from "@/context/PartnerContext";
import { useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/services/products";
import { IDevices } from "@/interfaces/devices";

const productsService = new ProductsService();

export function OtherTypeSection() {
    const navigate = useNavigate();
    const { runtime } = usePartner();
    const { typeConfig } = runtime;

    const otherType = typeConfig.otherType;

    const productsQuery = useQuery({
        queryKey: ["products", otherType],
        queryFn: () => productsService.allProducts(otherType),
    });

    const otherTypeProducts = (productsQuery.data?.devices ?? []).filter(
        (product: IDevices) => product.online
    );

    const getProductImage = (product: IDevices) => {
        if (product.category === "equipamentos") {
            return product.technical_sheet?.tabela?.Imagens?.[0]
                || product.image?.[0];
        }

        return product.technical_sheet?.Imagens?.[0]
            || product.image?.[0];
    };


    const getInstallmentOption = (product: IDevices) => {
        const options = [
            { installments: 48, value: product.price_48x },
            { installments: 36, value: product.price_36x },
            { installments: 24, value: product.price_24x },
            { installments: 12, value: product.price_12x },
        ];

        return options.find(
            (option) =>
                typeof option.value === "number" &&
                option.value > 0
        );
    };

    return (
        <section className="mx-6 md:mx-15 lg:mx-20 my-12 bg-white rounded-[4px] border-1 border-neutral-20 overflow-hidden shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[0.6fr_1.4fr] items-stretch">

                <div className="p-8 md:p-10 flex flex-col justify-center gap-4 bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
                    <h2 className="text-2xl font-light text-neutral-900 leading-tight">
                        {typeConfig.otherSectionTitle}
                    </h2>

                    <p className="max-w-2xl text-[14px] leading-7 text-neutral-600">
                        Ofertas exclusivas para nossos clientes.
                    </p>

                    <div>
                        <Button
                            type="primary"
                            size="middle"
                            onClick={() =>
                                navigate(buildOtherTypePath(runtime))
                            }
                            style={{
                                backgroundColor: "#660099",
                                color: "white",
                                height: 44,
                                borderRadius: 12,
                            }}
                        >
                            <span className="inline-flex items-center gap-2">
                                {typeConfig.otherSectionCta}
                                <ArrowRight size={18} />
                            </span>
                        </Button>
                    </div>
                </div>

                <div className="p-4 bg-[#660099] text-white flex flex-col justify-between gap-6">
                    <div className="flex gap-3">
                        {otherTypeProducts
                            .slice(0, 3)
                            .map((product) => {
                                const productImage =
                                    getProductImage(product);

                                const installment =
                                    getInstallmentOption(product);

                                return (
                                    <div
                                        key={product.id}
                                        className="flex flex-col w-full h-60 items-center gap-4 rounded-[4px] border border-white/5 bg-white/5 p-3"
                                    >
                                        <div className="w-32 h-32 flex items-center justify-center rounded-lg bg-white">
                                            {productImage ? (
                                                <img
                                                    src={productImage}
                                                    alt={product.name}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400">
                                                    Sem imagem
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex-1 flex flex-col gap-1">
                                            <h3 className="text-sm font-semibold text-white line-clamp-2">
                                                {product.model}
                                            </h3>

                                            {installment?.value != null && (
                                                <span className="text-xs text-neutral-300 mt-1">
                                                    {installment.installments}x de{" "}
                                                    <strong className="text-white">
                                                        R${" "}
                                                        {installment.value
                                                            .toFixed(2)
                                                            .replace(".", ",")}
                                                    </strong>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        </section>
    );
}
