import { Dropdown, Button, Tooltip, ConfigProvider } from "antd";
import { usePhoneOffersController } from "./controller";
import { CloseOutlined } from "@ant-design/icons";
import ProductDetailModal from "@/components/ProductDetailModal";
import SendInfoModalBase from "@/components/SendInfoModal";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { IDevices } from "@/interfaces/devices";

// Ofertas
function PhoneOffers() {
  const {
    productFiltered: products,
    selectedBrand,
    resetSelectedBrand,
    items,
    isModalOpen,
    showModal,
    closeModal,
    selectedProductDetail,
    changeSelectedProductDetail,
    addItemInChart,
    parcelamentoQtd,
    id,
    isAddItemInChartLoading,
    isModalBotOpen,
    showModalBot,
    closeModalBot,
    updateData,
    isCreatingChartLoading,
  } = usePhoneOffersController();

  const productImages = products?.map(
    (item) => item.technical_sheet?.tabela?.Imagens
  );
  const [loadingProductId, setLoadingProductId] = useState<number | null>(null);
  const productsListSize = products?.length || 0;
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const getTooltipMessage = (product: IDevices) => {
    const {
      insurance_theft,
      insurance_theft_damages,
    } = product;

    const validValues = [
      insurance_theft,
      insurance_theft_damages,
    ].filter((v) => typeof v === "number" && v > 0);

    if (validValues.length === 0) {
      return "Esse aparelho não possui seguro disponível.";
    }

    const lowerInsuranceValue = Math.min(...validValues);
    return `Seguro para este aparelho: a partir de R$ ${lowerInsuranceValue
      ?.toFixed(2)
      .replace(".", ",")}`;
  };
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("zerar") === "1") {
      sessionStorage.clear();

      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  // Abrir modal automaticamente se houver ?produto=...
  useEffect(() => {
    const codProduto = searchParams.get("produto");
    if (codProduto && products) {
      const prod = products.find(
        (p) => String(p.sap_code) === String(codProduto)
      );
      // Só abre se não estiver aberto para o mesmo produto
      if (
        prod &&
        (!isModalBotOpen || selectedProductDetail?.sap_code !== prod.sap_code)
      ) {
        changeSelectedProductDetail(prod);
        setTimeout(() => showModalBot(), 0);
      }
    } else if (!codProduto && isModalBotOpen) {
      // Só fecha se o modal está aberto e o parâmetro sumiu
      closeModalBot();
    }
    // eslint-disable-next-line
  }, [searchParams, products]);
  const normalizedInstallments = [1, 10, 12, 24].includes(Number(parcelamentoQtd))
    ? Number(parcelamentoQtd)
    : 24;

  const normalizeAvailableColors = (colors: string[] | undefined) =>
    (colors ?? []).flatMap((color) =>
      color
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    );
  return (
    <>
      <div
        id="super-ofertas"
        className="flex justify-center items-center w-full my-10 flex-wrap"
      >
        <div className="flex flex-col gap-6  flex-wrap w-full  mx-20">
          {/* FILTRO E TITULO */}
          <div className="flex justify-between flex-wrap w-full items-center ">
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
              Ofertas
            </h1>
            <div className=" flex-shrink-0  md:w-[160px] sm:w-[160px]  lg:w-[200px]">
              <Dropdown menu={{ items }}>
                <div className="relative">
                  <Button
                    className="w-full "
                    variant="outlined"
                    style={{
                      color: "#8E8E8E",
                      border: "1px solid #8E8E8E",
                    }}
                  >
                    <span>{selectedBrand}</span>
                    {selectedBrand !== "Filtro por marca" && (
                      <CloseOutlined
                        color="purple"
                        style={{
                          color: "#666666",
                        }}
                        onClick={() => resetSelectedBrand()}
                        className="border absolute right-0 border-gray-300 rounded p-[9px] text-[#660099] cursor-pointer text-[10px]"
                      />
                    )}
                  </Button>
                </div>
              </Dropdown>
            </div>
          </div>

          {/* LISTA DE PRODUTOS */}
          <div
            className="grid gap-6 w-full"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            }}
          >
            {products?.slice(0, productsListSize).map(
              (product: IDevices, index: number) => {
                const availableColors = normalizeAvailableColors(product.available_colors);

                return (
                  product.online && (
                    <div
                      key={index}
                      className={`flex items-center ${isAddItemInChartLoading ? "pointer-events-none" : ""
                        } relative justify-start flex-wrap gap-7 p-3 pb-4 pt-4 bg-white rounded-[4px] border-1 border-neutral-200 shadow-sm`}
                    >
                      <div className="flex flex-col items-center w-full ">
                        <Tooltip
                          title="Código do produto"
                          placement="top"
                          styles={{ body: { fontSize: "11px" } }}
                        >
                          <span
                            className="text-[12px] self-start text-gray-800 flex bg-neutral-100 py-1 mb-2 px-2 rounded-[2px]"
                            style={{ width: "fit-content" }}
                          >
                            cód: {product?.sap_code}
                          </span>
                        </Tooltip>
                        <div className="w-36 h-36 flex items-center justify-center  rounded">
                          <img
                            src={productImages?.[index]?.[0]}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-[10px]">
                        <span className="text-[15px] flex items-center h-[65px] text-gray-800">
                          {product.model}
                        </span>
                        <span className="text-[12px] text-gray-800 flex items-center gap-2 ">
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

                        <span className="text-gray-500 text-[13px]">
                          24x de{" "}
                          <span className="text-gray-800 font-bold text-[18px]">
                            {" "}
                            R$ {product?.price_24x?.toFixed(2).replace(".", ",")}
                          </span>
                        </span>
                        <span className="text-gray-500 text-[13px]">
                          {" "}
                          ou em até 10x de R${" "}
                          {product?.price_10x?.toFixed(2).replace(".", ",")} sem
                          juros direto na sua fatura Vivo
                        </span>
                        <div className="flex justify-between ">
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
                                fontSize: "12px",
                              }}
                              className="w-18"
                              onClick={() => {
                                showModal();
                                changeSelectedProductDetail(product);
                              }}
                            >
                              + detalhes
                            </Button>{" "}
                            {(product?.insurance_theft_damages ||
                              product?.insurance_theft) && (

                                <Tooltip
                                  title={getTooltipMessage(product)}
                                  placement="top"
                                  styles={{ body: { fontSize: "11px" } }}
                                >
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "flex-end",
                                      width: "100%",
                                    }}
                                  >
                                    <Button
                                      type="link"
                                      style={{
                                        padding: 3,
                                        color: "#660099",
                                        textDecoration: "underline",
                                        textUnderlineOffset: "3px",
                                        fontSize: "12px",
                                      }}
                                      onClick={() => {
                                        showModal();
                                        changeSelectedProductDetail(product);
                                      }}
                                    >
                                      <img
                                        width={14}
                                        src="/assets/seguro-favicon.png"
                                        style={{
                                          display: "block",
                                          marginLeft: "auto",
                                        }}
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
                                className=""
                                onClick={() => {
                                  const statusFechado =
                                    sessionStorage.getItem("statusCarrinho");
                                  if (statusFechado === "FECHADO") {
                                    window.open(
                                      window.location.pathname + "?zerar=1",
                                      "_blank"
                                    );
                                  } else {
                                    if (id) {
                                      setLoadingProductId(product?.id);
                                      addItemInChart({
                                        id: id,
                                        data: {
                                          device_id: product?.id,
                                          quantity: 1,
                                          installments: normalizedInstallments,
                                          selected_color: product?.available_colors[0],
                                        },
                                      });
                                    }
                                    // else {
                                    //   console.log(
                                    //     "ID do carrinho não encontrado!"
                                    //   );
                                    // }
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
                                  style={{
                                    color: "#ffffff",
                                    fontSize: "14px",
                                  }}
                                  className=" click-btn w-28 "
                                  onClick={() => {
                                    const params = new URLSearchParams(
                                      location.search
                                    );
                                    params.set(
                                      "produto",
                                      String(product.sap_code)
                                    );
                                    navigate(
                                      { search: params.toString() },
                                      { replace: false }
                                    );
                                    // Não chama showModalBot nem changeSelectedProductDetail aqui
                                  }}
                                >
                                  Eu quero!
                                </Button>
                              </ConfigProvider>
                            )}
                          </div>
                        </ConfigProvider>
                      </div>
                      {loadingProductId === product.id &&
                        isAddItemInChartLoading && (
                          <div className="absolute inset-0 backdrop-blur-[.5px] flex items-center justify-center z-10">
                            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                    </div>)
                )
              })}
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
        onClose={() => {
          const params = new URLSearchParams(location.search);
          params.delete("produto");
          navigate({ search: params.toString() }, { replace: true });
          closeModalBot();
        }}
        onSubmit={(values) => updateData(values, selectedProductDetail)}
        productDetail={selectedProductDetail}
        isSubmitting={isCreatingChartLoading}
        showProductCard
      />
    </>
  );
}

export default PhoneOffers;
