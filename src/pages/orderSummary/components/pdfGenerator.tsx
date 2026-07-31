
import pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { readPartnerRuntimeFromSession } from "@/configs/partnerRuntime";
import { IOrder } from "@/interfaces/order";

type OrderItem = IOrder["items"][number];

const pdfMakeWithVfs = pdfMake as typeof pdfMake & {
  vfs: Record<string, string>;
};

pdfMakeWithVfs.vfs = pdfFonts.vfs;

const getBase64FromImageUrl = (url: string): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Erro ao criar contexto do canvas");

      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
};

export const generatePDF = async (purchase: IOrder | undefined) => {
  const runtime = readPartnerRuntimeFromSession();
  const logoVivo = await getBase64FromImageUrl("/assets/logovivopdf.png");
  const logoGold = runtime.partner.logo_url
    ? await getBase64FromImageUrl(runtime.partner.logo_url)
    : null;
  let typeOfPayment = "-";
  if (purchase?.payment_method === "fatura vivo+cartao credito") {
    typeOfPayment = "Fatura Vivo + Cartão de Crédito";
  } else if (purchase?.payment_method === "cartao credito") {
    typeOfPayment = "Cartão de Crédito";
  } else if (purchase?.payment_method === "fatura vivo") {
    typeOfPayment = "Fatura Vivo";
  }

  const docDefinition = {
    pageMargins: [20, 40, 20, 40],
    content: [
      // Cabeçalho com logos
      {
        columns: [
          {
            image: logoVivo ?? undefined,
            width: 100,
            alignment: "left",
            margin: [0, 10, 0, 0], // Ajuste aqui a altura para alinhar pela base
          },
          { text: "", width: "*" },
          logoGold
            ? {
              image: logoGold,
              width: 100,
              alignment: "right",
              margin: [0, 25, 0, 0], // Ajuste individual para alinhar com a outra imagem
            }
            : {
              text: runtime.partner.partner_name,
              width: 100,
              alignment: "right",
              margin: [0, 32, 0, 0],
              fontSize: 11,
              bold: true,
              color: "#660099",
            },
        ],
        margin: [0, 5, 0, 10] as [number, number, number, number],
      },
      // Título do pedido
      {
        stack: [
          { text: `Orçamento Nº ${purchase?.id}`, style: "title" },

        ],
        margin: [0, 0, 0, 2],
      },

      // Produtos em formato de tabela
      { text: `Detalhes - ${runtime.typeConfig.label}`, style: "sectionHeader" },
      {
        table: {
          headerRows: 1,
          widths: [65, 45, 40, 80, 30, 25, 50, 50, 40],
          body: [
            [
              { text: "Código", style: "tableHeader" },
              { text: "Tipo", style: "tableHeader" },
              { text: "Marca", style: "tableHeader" },
              { text: "Modelo", style: "tableHeader" },
              { text: "Cor", style: "tableHeader" },
              { text: "Quant.", style: "tableHeader" },
              { text: "Parcela (R$)", style: "tableHeader" },
              { text: "Parcelamento", style: "tableHeader" },
              { text: "Seguro", style: "tableHeader" },
            ],
            ...(purchase?.items ?? []).map((item: OrderItem) => [
              { text: item.sap_code, style: "tableBody" },
              { text: item.type, style: "tableBody" },
              { text: item.brand, style: "tableBody" },
              { text: item.model, style: ["tableBody"] },
              { text: item.selected_color, style: "tableBody" },
              { text: item.quantity, style: "tableBody" },
              {
                text:
                  item.installment_amount !== undefined &&
                    item.installment_amount !== null
                    ? `${(
                      Number(item.installment_amount)
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`
                    : "-",
                style: "tableBody",
              },
              {
                text: `${purchase?.price_summary?.number_of_installments === 1
                  ? "à vista"
                  : `${purchase?.price_summary?.number_of_installments}x`
                  }`,
                style: "tableBody",
              },
              {
                text:
                  String(item.insurance_price) === "0.00" ||
                    Number(item.insurance_price) === 0
                    ? "-"
                    : item.insurance_price !== undefined &&
                      item.insurance_price !== null
                      ? `${Number(
                        item.quantity * item.insurance_price
                      ).toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}/mês`
                      : "-",
                style: "tableBody",
              },
            ]),
          ],
        },
        layout: "lightHorizontalLines",
        style: "productTable",
      },

      // Informações do comprador
      { text: "Informações do comprador", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Gestor da conta (SFA): ${purchase?.manager?.name || "-"}`,
          `CNPJ: ${purchase?.cnpj || "-"}`,
          `Razão Social: ${purchase?.company_legal_name || "-"}`,
          `Telefone: ${purchase?.manager?.phone || "-"}`,
          `Email: ${purchase?.manager?.email || "-"}`,
          `Novo Telefone: ${purchase?.additional_phone || "-"}`,
          `Novo Email: ${purchase?.additional_email || "-"}`,
          `Telefone (Comprador): ${purchase?.phone || "-"}`,
          `Nome (Comprador): ${purchase?.full_name || "-"}`,
        ],
        style: "content",
      },

      // Endereço
      { text: "Informações de entrega", style: "sectionHeader" },
      {
        type: "circle",
        ul: [
          `Endereço: ${purchase?.address || "-"}`,
          `Bairro: ${purchase?.district || "-"}`,
          `Número: ${purchase?.address_number || "-"}`,
          `Cidade: ${purchase?.city || "-"}`,
          `UF: ${purchase?.state || "-"}`,
          `CEP: ${purchase?.zip_code || "-"}`,
          `Complemento: ${purchase?.address_complement?.home_complement || "-"}`,
          `Observações: ${purchase?.address_note || "-"}`,
        ],
        style: "content",
      },
      // Pagamento
      { text: `Resumo do pedido - ${runtime.typeConfig.label}`, style: "sectionHeader" },
      { text: "Serviços:", style: "content", margin: [0, 4, 0, 2] },

      { text: "", margin: [0, 4, 0, 0] },

      ...(purchase && purchase.items
        ? purchase.items
          .filter((item: OrderItem) => item.insurance_type !== null)
          .reverse()
          .map((item: OrderItem, idx, arr) => [
            {
              columns: [
                {
                  text: [
                    "Seguro de ",
                    item.insurance_type === "insurance_theft"
                      ? "Roubo, Furto Simples/Qualificado"
                      : "Roubo, Furto Simples/Qualificado e Danos",
                    " - ",
                    { text: item.model, fontSize: 8 },
                  ],
                  style: "content",
                },
                {
                  text:
                    "R$ " +
                    Number(
                      Number(item.quantity) * Number(item.insurance_price ?? 0)
                    ).toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }),
                  style: "content",
                  alignment: "right",
                },
              ],
              margin: [0, 0, 0, 0],
            },

            ...(idx < arr.length - 1
              ? [
                {
                  canvas: [
                    {
                      type: "line",
                      x1: 0,
                      y1: 0,
                      x2: 555,
                      y2: 0,
                      lineWidth: 0.5,
                      lineColor: "#e5e5e5",
                    },
                  ],
                  margin: [0, 4, 0, 4],
                },
              ]
              : []),
          ])
          .flat()
        : []),
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      // Espaço visual entre Serviços e o restante
      { text: "", margin: [0, 8, 0, 0] },
      { text: "Produtos:", style: "content", margin: [0, 4, 0, 2] },

      { text: "", margin: [0, 4, 0, 0] },

      {
        columns: [
          { text: "Quantidade de itens", style: "content" },
          {
            text: `${purchase?.items.reduce(
              (total: number, item: OrderItem) =>
                total + Number(item.quantity),
              0
            )}`,
            style: "content",
            alignment: "right",
          },
        ],
      },
      { text: "", margin: [0, 10, 0, 0] },
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      { text: "", margin: [0, 2, 0, 0] },
      {
        columns: [
          { text: "Frete", style: "content" },
          { text: "Grátis", style: "content", alignment: "right" },
        ],
      },
      { text: "", margin: [0, 2, 0, 0] },
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      { text: "", margin: [0, 2, 0, 0] },
      {
        columns: [
          { text: "Forma de pagamento", style: "content" },
          { text: typeOfPayment, style: "content", alignment: "right" },
        ],
      },
      { text: "", margin: [0, 2, 0, 0] },
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      { text: "", margin: [0, 2, 0, 0] },

      {
        columns: [
          { text: "Parcelamento", style: "content" },
          {
            text: `${purchase?.price_summary?.number_of_installments === 1
              ? "à vista"
              : `${purchase?.price_summary?.number_of_installments}x`
              }`,
            style: "content",
            alignment: "right",
          },
        ],
      },
      { text: "", margin: [0, 2, 0, 0] },
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      { text: "", margin: [0, 8, 0, 0] },
      {
        columns: [
          { text: "Valor da parcela mensal (Produtos)", style: "content" },
          {
            text: `R$ ${Number(purchase?.price_summary?.installment_total).toLocaleString(
              "pt-BR",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }
            )}`,
            style: "content",
            alignment: "right",
          },
        ],
      },
      { text: "", margin: [0, 2, 0, 0] },
      [
        {
          canvas: [
            {
              type: "line",
              x1: 0,
              y1: 0,
              x2: 555,
              y2: 0,
              lineWidth: 0.5,
              lineColor: "#e5e5e5",
            },
          ],
          margin: [0, 4, 0, 4],
        },
      ],
      { text: "", margin: [0, 2, 0, 0] },
      {
        columns: [
          { text: "Valor da parcela mensal (Serviços)", style: "content" },
          {
            text: `R$ ${Number(
              purchase?.items
                .filter((item) => item.insurance_price)
                .reduce(
                  (total: number, item: OrderItem) =>
                    total + Number(item.quantity) * Number(item.insurance_price ?? 0),
                  0
                )
            ).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            style: "content",
            alignment: "right",
          },
        ],
      },
      { text: "", margin: [0, 2, 0, 0] },

      // Rodapé
      {
        text: runtime.partner.partner_name,
        style: "footer",
        margin: [0, 30, 0, 0] as [number, number, number, number],
      },
    ],
    styles: {
      tableHeader: {
        bold: true,
        fontSize: 8,
        color: "#222",
        fillColor: "#f3f3f3",
        margin: [0, 2, 0, 2],
      },
      tableBody: {
        fontSize: 8,
        color: "#444",
      },
      modeloCell: {
        fontSize: 10,
      },
      productTable: {
        margin: [0, 5, 0, 15],
      },
      title: { fontSize: 16, bold: true, color: "#333", marginBottom: 8 },
      subtitle: { fontSize: 10, color: "#666", marginBottom: 6 },
      sectionHeader: {
        fontSize: 14,
        bold: true,
        color: "#444",
        margin: [0, 10, 0, 4] as [number, number, number, number],
      },
      content: { fontSize: 11, color: "#555", marginBottom: 2 },
      productRow: {
        margin: [0, 5, 0, 10] as [number, number, number, number],
        borderColor: "#ccc",
        paddingTop: 5,
      },
      footer: {
        alignment: "center" as const,
        italics: true,
        fontSize: 12,
        color: "#333",
      },
    },
  };

  pdfMakeWithVfs
    .createPdf(docDefinition as unknown as TDocumentDefinitions)
    .download(`pedido-${purchase?.id}.pdf`);
};
