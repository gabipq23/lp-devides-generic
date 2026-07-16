import { translate } from "@/translate/translation";

export default function InsuranceDiv({
  productDetail,
}: {
  productDetail: any;
}) {
  const technicalTable =
    productDetail?.technical_sheet?.tabela ?? productDetail?.fichaTecnica?.tabela ?? {};

  const productCode = productDetail?.sap_code ?? productDetail?.cod_sap ?? "-";
  const productModel = productDetail?.model ?? productDetail?.name ?? "-";
  const price10x = productDetail?.price_10x ?? productDetail?.preco10x;
  const price24x = productDetail?.price_24x ?? productDetail?.preco24x;

  return (
    <>
      <div className="text-[#666666] w-7/7 md:w-5/7 lg:w-5/7 overflow-auto overflow-y-auto max-h-[200px] md:max-h-full lg:max-h-full  scrollbar scrollbar-thin">
        {productDetail?.valor_roubo_furto_simples_qualificado !== null &&
          productDetail?.valor_roubo_furto_simples_qualificado_danos !==
          null && (
            <div className="border-1 border-[#eeeeee] p-1 mx-1 flex flex-col gap-2 shadow-sm">
              <div className="flex items-center justify-center">
                <img width={120} src="/assets/seguro-z.png"></img>
              </div>
              <div>
                {productDetail?.valor_roubo_furto_simples_qualificado && (
                  <p>
                    Roubo, Furto, Simples e Qualificado: R${" "}
                    {productDetail?.valor_roubo_furto_simples_qualificado
                      ?.toFixed(2)
                      .replace(".", ",")}
                    /mês
                  </p>
                )}
                {productDetail?.valor_roubo_furto_simples_qualificado_danos && (
                  <p>
                    Roubo, Furto, Simples, Qualificado e Danos: R${" "}
                    {productDetail?.valor_roubo_furto_simples_qualificado_danos
                      ?.toFixed(2)
                      .replace(".", ",")}
                    /mês
                  </p>
                )}
              </div>
            </div>
          )}
        <div className="flex flex-col gap-1 p-1">
          <div className="flex pl-2 py-2 bg-[#eeeeee]">
            <h3 className=" text-[14px] ">Informações básicas</h3>
          </div>
          <div className="flex 2-full border-1 border-[#eeeeee]">
            <span className="bg-[#eeeeee] text-[14px]  p-2  w-2/5">
              Código do produto
            </span>
            <span className=" p-2 w-3/5 text-[16px]  font-light text-[#353535]">
              {productCode}
            </span>
          </div>
          <div className="flex 2-full border-1 border-[#eeeeee]">
            <span className="bg-[#eeeeee] text-[14px] p-2 w-2/5">Modelo</span>
            <span className=" p-2 w-3/5 text-[16px] font-light text-[#353535]">
              {productModel}
            </span>
          </div>

          <div className="flex 2-full border-1 border-[#eeeeee]">
            <span className="bg-[#eeeeee] text-[14px]  p-2  w-2/5">
              Valor da parcela em 10x
            </span>
            <span className=" p-2 w-3/5 text-[16px]  font-light text-[#353535]">
              {typeof price10x === "number"
                ? `R$ ${price10x.toFixed(2).replace(".", ",")}`
                : "-"}
            </span>
          </div>
          <div className="flex 2-full border-1 border-[#eeeeee]">
            <span className="bg-[#eeeeee] text-[14px]  p-2 w-2/5">
              Valor da parcela em 24x
            </span>
            <span className=" p-2 w-3/5 text-[16px]  font-light text-[#353535]">
              {typeof price24x === "number"
                ? `R$ ${price24x.toFixed(2).replace(".", ",")}`
                : "-"}
            </span>
          </div>

          {Object.entries(technicalTable).map(
            ([sectionKey, sectionValue]) => {
              if (Array.isArray(sectionValue)) {
                return null;
              }

              if (typeof sectionValue !== "object" || sectionValue === null) {
                return null;
              }

              return (
                <div key={sectionKey} className="flex flex-col 2-full gap-1">
                  <div className="flex pl-2 py-2 bg-[#eeeeee]">
                    <h3 className=" text-[14px] ">{sectionKey}</h3>
                  </div>
                  {Object.entries(sectionValue as Record<string, unknown>).map(
                    ([fieldKey, rawValue]) => {
                      let formattedValue = "";

                      if (typeof rawValue === "boolean") {
                        formattedValue = translate(rawValue ? "true" : "false");
                      } else if (Array.isArray(rawValue)) {
                        formattedValue = rawValue.join(", ");
                      } else if (
                        typeof rawValue === "string" ||
                        typeof rawValue === "number"
                      ) {
                        formattedValue = rawValue.toString();
                      } else if (
                        typeof rawValue === "object" &&
                        rawValue !== null
                      ) {
                        formattedValue = Object.entries(rawValue)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ");
                      } else {
                        formattedValue = "-";
                      }

                      return (
                        <div
                          key={fieldKey}
                          className="flex 2-full border-1 border-[#eeeeee]"
                        >
                          <div className="bg-[#eeeeee] text-[14px]  p-2 w-2/5">
                            {fieldKey}
                          </div>
                          <div className=" p-2 w-3/5 text-[16px]  font-light text-[#353535]">
                            {formattedValue}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </>
  );
}
