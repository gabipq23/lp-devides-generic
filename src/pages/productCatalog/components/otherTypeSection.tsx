import { ArrowRight } from "lucide-react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { buildOtherTypePath } from "@/configs/partnerRuntime";
import { usePartner } from "@/context/PartnerContext";
import { usePhoneOffersController } from "../phoneOffers/controller";

export function OtherTypeSection() {
    const navigate = useNavigate();
    const { runtime } = usePartner();
    const { typeConfig } = runtime;
    const {
        productFiltered: products,

    } = usePhoneOffersController();
    const productImages = products?.map(
        (item) => item.technical_sheet?.tabela?.Imagens);
    return (
        <section className="mx-6 md:mx-15 lg:mx-20 my-12  bg-white rounded-[4px] border-1 border-neutral-20 overflow-hidden shadow-sm">
            <div className="grid gap-6 lg:grid-cols-[0.6fr_1.4fr] items-stretch">
                <div className="p-8 md:p-10 flex flex-col justify-center gap-4 bg-gradient-to-br from-neutral-50 via-white to-neutral-100">
                    {/* <span className="inline-flex w-fit items-center rounded-full bg-[#660099] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                        {typeConfig.otherSectionTitle}
                    </span> */}
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
                            onClick={() => navigate(buildOtherTypePath(runtime))}
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

                <div className="p-4 md:p-4 bg-[#660099] text-white flex flex-col justify-between gap-6">
                    {/* <div className="space-y-3">
                      
                        <h3 className="text-2xl font-light">{typeConfig.otherType}</h3>
                        <p className="text-sm leading-6 text-neutral-300">
                            Redirecione com preservação de parceiro e versão para a outra LP.
                        </p>
                    </div> */}

                    {/* <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"> */}
                    <div className="flex gap-3">
                        {products
                            ?.filter((product: any) => product.online)
                            .slice(0, 3)

                            .map((product: any, index: number) => (
                                <div
                                    key={product.id}
                                    className="flex flex-col w-full h-60 items-center gap-4 rounded-[4px] border border-white/5 bg-white/5 p-3"
                                >
                                    {/* Imagem */}
                                    <div className="w-32 h-32 flex items-center justify-center rounded-lg bg-white">
                                        <img
                                            src={productImages?.[index]?.[0]}
                                            alt={product.name}
                                            className="max-w-full max-h-full object-contain"
                                        />
                                    </div>

                                    {/* Informações */}
                                    <div className="flex-1 flex flex-col gap-1">


                                        <h3 className="text-sm font-semibold text-white line-clamp-2">
                                            {product.model}
                                        </h3>



                                        <span className="text-xs text-neutral-300 mt-1">
                                            24x de{" "}
                                            <strong className="text-white">
                                                R$ {product.price_24x?.toFixed(2).replace(".", ",")}
                                            </strong>
                                        </span>
                                    </div>

                                    {/* Botão */}
                                    {/* <Button
                                        type="primary"
                                        className="bg-purple-600 hover:bg-purple-700"
                                        onClick={() => {
                                            const params = new URLSearchParams(location.search);
                                            params.set("produto", String(product.cod_sap));
                                            navigate({ search: params.toString() });
                                        }}
                                    >
                                        Eu quero
                                    </Button> */}
                                </div>
                            ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
