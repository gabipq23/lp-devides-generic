import { Button, ConfigProvider } from "antd";
import type { CollapseProps } from "antd";
import { Collapse } from "antd";
import { generatePDF } from "./pdfGenerator";
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { formatCEP } from "@/utils/formatCEP";
import { ItensListLargeScreen } from "../screen/itensListLarge";
import { ItensListSmallScreen } from "../screen/itensListSmall";
import { MailOutlined, SignatureOutlined } from "@ant-design/icons";
import { usePartner } from "@/context/PartnerContext";

interface IInfoPaymentChartPage {
  purchaseById?: any | null;
}

const InfoPaymentChartPage = ({ purchaseById }: IInfoPaymentChartPage) => {
  const { typeConfig } = usePartner();
  let typeOfPayment;
  if (purchaseById?.payment_method
    === "fatura vivo+cartao credito") {
    typeOfPayment = "Fatura Vivo + Cartão de Crédito";
  } else if (purchaseById?.payment_method
    === "cartao credito") {
    typeOfPayment = "Cartão de Crédito";
  } else if (purchaseById?.payment_method
    === "fatura vivo") {
    typeOfPayment = "Fatura Vivo";
  }

  // Destaques
  const destaques = (
    <div className="flex flex-col bg-white rounded-[4px] p-4 w-full py-4 mb-4 ">
      <ItensListLargeScreen purchaseById={purchaseById} />
      <ItensListSmallScreen purchaseById={purchaseById} />
    </div>
  );

  // Informações do Comprador
  const infoComprador = (
    <div className="flex flex-col bg-white rounded-[4px] p-4 gap-2  w-full">
      <div className="flex flex-col  text-neutral-800 gap-2 rounded-lg min-h-[120px] p-4">
        <div className="  gap-4 text-[14px] w-full text-neutral-700">
          <p className=" ">
            <strong>Razão Social:</strong> {purchaseById?.company_legal_name || "-"}
          </p>
        </div>
        {/* CNPJ e Razão Social */}
        <div className="hidden md:grid grid-cols-2  gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>CNPJ:</strong> {formatCNPJ(purchaseById?.cnpj ?? "") || "-"}
          </p>
          <p>
            <strong>Gestor da conta:</strong> {purchaseById?.full_name || "-"}
          </p>
        </div>
        {/* Mobile: CNPJ e Razão Social em coluna */}
        <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>CNPJ:</strong> {formatCNPJ(purchaseById?.cnpj ?? "") || "-"}
          </p>
          <p>
            <strong>Gestor da conta:</strong> {purchaseById?.manager?.name || "-"}
          </p>
        </div>
        {/* Telefone e Email */}
        <div className="hidden md:grid grid-cols-2 gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>Email :</strong> {purchaseById?.manager?.email || "-"}
          </p>
          <p>
            <strong>Telefone :</strong>{" "}
            {formatPhoneNumber(purchaseById?.manager?.phone ?? "") || "-"}
          </p>
        </div>
        <div className="hidden md:grid grid-cols-2 gap-4 text-[14px] w-full text-neutral-700">
          {purchaseById?.additional_email !== null && (
            <p>
              <strong>Novo Email:</strong> {purchaseById?.additional_email || "-"}
            </p>
          )}
          {purchaseById?.additional_phone !== null && (
            <p>
              <strong>Novo Telefone:</strong>{" "}
              {formatPhoneNumber(purchaseById?.additional_phone ?? "") || "-"}
            </p>
          )}
        </div>
        <div className="hidden md:grid grid-cols-2 gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>Nome (Comprador) :</strong> {purchaseById?.full_name || "-"}
          </p>
          <p>
            <strong>Telefone (Comprador) :</strong>{" "}
            {formatPhoneNumber(purchaseById?.phone ?? "") || "-"}
          </p>
        </div>
        {/* Mobile: Telefone e Email em coluna */}
        <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>Telefone :</strong>{" "}
            {formatPhoneNumber(purchaseById?.manager?.phone ?? "") || "-"}
          </p>
          <p>
            <strong>Email :</strong> {purchaseById?.manager?.email || "-"}
          </p>
        </div>
        {/* Mobile: Telefone e Email em coluna */}
        <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>Nome (Comprador) :</strong> {purchaseById?.full_name || "-"}
          </p>
          <p>
            <strong>Telefone (Comprador) :</strong>{" "}
            {formatPhoneNumber(purchaseById?.phone ?? "") || "-"}
          </p>
        </div>
      </div>
    </div>
  );

  // Informações do Endereço
  const infoEndereco = (
    <div className="flex flex-col bg-white rounded-[4px]  p-4 gap-2 w-full">
      <div className="flex flex-col  text-neutral-800 gap-2 rounded-lg min-h-[120px] p-4">
        {/* CNPJ e Razão Social */}
        <div className="hidden md:grid grid-cols-2  gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>Endereço:</strong> {purchaseById?.address}
          </p>
          <p className="w-[400px] ">
            <strong>Bairro:</strong>{" "}
            {purchaseById?.bairro || purchaseById?.district || "-"}
          </p>
        </div>
        {/* Mobile: CNPJ e Razão Social em coluna */}
        <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>Endereço:</strong> {purchaseById?.address}
          </p>
          <p>
            <strong>Bairro:</strong>{" "}
            {purchaseById?.bairro || purchaseById?.district || "-"}
          </p>
        </div>
        {/* CNPJ e Razão Social */}
        <div className="hidden md:grid grid-cols-2  gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>Número:</strong>{" "}
            {purchaseById?.address_number || "-"}
          </p>
          <p className="w-[400px] ">
            <strong>Cidade:</strong> {purchaseById?.city || "-"}
          </p>
        </div>
        {/* Mobile: CNPJ e Razão Social em coluna */}
        <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>Número:</strong>{" "}
            {purchaseById?.address_number || "-"}
          </p>
          <p>
            <strong>Cidade:</strong> {purchaseById?.city || "-"}
          </p>
        </div>
        {/* Telefone e Email */}
        <div className="hidden md:grid grid-cols-2 gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>UF:</strong> {purchaseById?.uf || "-"}
          </p>
          <p>
            <strong>CEP:</strong>{" "}
            {formatCEP(
              purchaseById?.zip_code ?? ""
            ) || "-"}
          </p>
        </div>
        {/* Mobile: Telefone e Email em coluna */}
        <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>UF:</strong> {purchaseById?.uf || "-"}
          </p>
          <p>
            <strong>CEP:</strong>{" "}
            {formatCEP(
              purchaseById?.zip_code ?? ""
            ) || "-"}
          </p>
        </div>
        <div className="hidden md:grid grid-cols-2 gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>Complemento:</strong>{" "}
            {purchaseById?.address_complement?.home_complement || "-"}
          </p>
          <p>
            <strong>Observações: </strong>{" "}
            {purchaseById?.address_note || "-"}
          </p>
        </div>
        {/* Mobile: Telefone e Email em coluna */}
        <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>Complemento:</strong>{" "}
            {purchaseById?.address_complement?.home_complement || "-"}
          </p>
          <p>
            <strong>Observações:</strong>{" "}
            {purchaseById?.address_note || "-"}
          </p>
        </div>
      </div>
    </div>
  );

  // Resumo do Pedido
  const resumoPedido = (
    <div className="flex flex-col justify-center mt-4 bg-white min-h-[400px] max-h-[800px] text-[14px] rounded-[4px] mb-[29px] ">
      <div className="flex m-3 flex-col gap-4 ">
        <div className="px-2">
          <p className="text-[15px] ">Serviços</p>
        </div>
        {purchaseById?.items
          ?.filter((item: any) => item.insurance_type !== null)
          .reverse()
          .map((item: any, idx: number, arr: any) => (
            <div key={idx} className="w-full">
              <div className="flex w-full justify-between px-2">
                <div className="flex items-center justify-center ">
                  {" "}
                  <p className="text-[14px] text-[#666666]">
                    Seguro de{" "}
                    {item.insurance_type === "insurance_theft"
                      ? "Roubo, Furto Simples/Qualificado"
                      : "Roubo, Furto Simples/Qualificado e Danos"}{" "}
                  </p>
                  <p className="text-[14px] text-[#868686]"> - {item.model}</p>
                </div>
                <p className="text-end">
                  R${" "}
                  {Number(item?.quantity * item?.insurance_price).toLocaleString(
                    "pt-BR",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                  /mês
                </p>
              </div>
              {idx < arr.length - 1 && (
                <hr className="border-t border-neutral-300 mt-2 w-full" />
              )}
            </div>
          ))}
        <hr className="border-t border-neutral-300 mb-2 w-full" />
        <div className="px-2">
          <p className="text-[15px] ">Produtos</p>
        </div>
        <div className="flex w-full justify-between px-2">
          <p className="text-[14px] text-[#666666]">Quantidade de itens</p>
          <p className="text-end">
            {purchaseById?.items?.reduce(
              (total: number, item: any) =>
                total + Number(item.quantity),
              0
            )}
          </p>
        </div>
        <hr className="border-t border-neutral-300 mb-2 w-full" />
        <div className="flex w-full justify-between px-2">
          <p className="text-[14px] text-[#666666]">Frete</p>
          <p className="text-[14px] text-[#32a04b] text-end">Grátis</p>
        </div>
        <hr className="border-t border-neutral-300 mb-2  w-full" />
        <div className="flex w-full justify-between px-2">
          <p className="text-[14px] text-[#666666]">Forma de Pagamento</p>
          <p className="text-[14px] text-end">{typeOfPayment}</p>
        </div>
        <hr className="border-t border-neutral-300 mb-2  w-full" />
        <div className="flex w-full justify-between px-2">
          <p className="text-[14px] text-[#666666]">Parcelamento</p>
          <p className="text-[14px] text-end">
            {" "}
            {purchaseById?.price_summary?.number_of_installments === 1
              ? "à vista"
              : `${purchaseById?.price_summary?.number_of_installments}x`}
          </p>
        </div>
        <hr className="border-t border-neutral-300 mb-2  w-full" />
      </div>
      <div className="flex flex-col items-start m-3 gap-2 ">
        <div className="flex w-full justify-between mb-2  text-[14px] font-bold">
          <p className="text-[#666666]">Valor da parcela mensal (Produtos)</p>
          <p className="text-end">
            R${" "}
            {purchaseById?.price_summary?.installment_total?.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
        <hr className="border-t border-neutral-300 w-full" />
        <div className="flex w-full justify-between mb-4 text-[14px] font-bold">
          <p className="text-[#666666]">Valor da parcela mensal (Serviços)</p>
          <p className="text-end">
            R${" "}
            {purchaseById?.items
              ?.filter((item: any) => item.insurance_price)
              .reduce(
                (total: number, item: any) =>
                  total + Number(item?.quantity * item?.insurance_price),
                0
              )
              .toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
          </p>
        </div>
      </div>
    </div>
  );

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <p className="text-[15px]">Detalhes</p>,
      children: destaques,
    },
    {
      key: "2",
      label: <p className="text-[15px]">Informações do Comprador</p>,
      children: infoComprador,
    },
    {
      key: "3",
      label: <p className="text-[15px]">Informações de Endereço</p>,
      children: infoEndereco,
    },
    {
      key: "4",
      label: <p className="text-[15px]">Resumo do Pedido</p>,
      children: resumoPedido,
    },
  ];

  return (
    <div className="flex flex-col px-6 pd:mx-15 lg:px-20 py-4 min-h-[617px] ">
      <div className="flex w-full justify-between mt-3 mb-4">
        <h2 className="text-[18px]  md:text-[20px] lg:text-[20px] ">
          Nº {purchaseById?.id}
        </h2>
        <div>
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
            <Button
              onClick={() => purchaseById && generatePDF(purchaseById)}
              type="default"
              variant="solid"
            >
              Gerar PDF
            </Button>
          </ConfigProvider>
        </div>
      </div>
      <div className="mt-2 mb-2">
        <h1 className=" flex items-center justify-center text-[18px]  md:text-[22px] lg:text-[22px] font-semibold ">
          Pedido realizado com sucesso!
        </h1>
        {/* <p className="text-center text-[13px] text-neutral-600 mt-1">
          Segmento: {typeConfig.label}
        </p> */}
      </div>
      <div className="flex flex-col items-center justify-center mt-4 gap-4 ">
        <div className="flex gap-2 items-center justify-center w-full max-w-[900px]">
          <div className="text-[36px] md:text-[64px] lg:text-[64px]  text-[#660099] mr-2">
            <MailOutlined />
          </div>
          <div className="flex flex-col text-[13px] md:text-[16px] lg:text-[16px] ">
            <p>
              <span className="font-bold">1.</span> Em breve você receberá um
              e-mail da Vivo através do remetente{" "}
              <span className="font-bold">noreply@vivo.com.br</span> com um{" "}
              <span className=" font-bold">link para aceite eletrônico</span> do
              seu pedido.
            </p>
            <p>
              <span className="text-red-700 font-bold">Importante:</span> Caso
              não encontre o e-mail em sua caixa de entrada, lembre-se de
              verificar o{" "}
              <span className=" font-bold">spam ou lixo eletrônico</span> .
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full max-w-[900px]">
          <div className="text-[36px] md:text-[64px] lg:text-[64px]  text-[#660099] mr-2">
            <SignatureOutlined />
          </div>
          <div className="text-[13px] md:text-[16px] lg:text-[16px] ">
            <p>
              <span className="font-bold">2.</span> Basta clicar no link e
              <span className="font-bold"> assinar eletronicamente</span> para
              que possamos dar sequência no pedido e envio dos {typeConfig.label.toLowerCase()}.
            </p>
          </div>
        </div>
      </div>

      <Collapse items={items} ghost defaultActiveKey={["1"]} />
    </div>
  );
};

export default InfoPaymentChartPage;
