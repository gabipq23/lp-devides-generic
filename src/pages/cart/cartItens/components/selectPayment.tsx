import { ConfigProvider, Select } from "antd";
import { IOrder, IOrderResponse } from "@/interfaces/order";

type PurchaseLike = IOrderResponse | IOrder | null | undefined;

const hasOrderEnvelope = (value: PurchaseLike): value is IOrderResponse =>
  Boolean(value && "order" in value);

const hasDirectOrder = (value: PurchaseLike): value is IOrder =>
  Boolean(value && "price_summary" in value);

interface SelectPaymentProps {
  updateParcelamentoValues: (installments: number) => void;
  purchaseById: PurchaseLike;
}

export const SelectPayment: React.FC<SelectPaymentProps> = ({
  updateParcelamentoValues,
  purchaseById,
}) => {
  const currentInstallments = hasOrderEnvelope(purchaseById)
    ? purchaseById.order?.price_summary?.number_of_installments
    : hasDirectOrder(purchaseById)
      ? purchaseById.price_summary?.number_of_installments
      : undefined;

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            hoverBorderColor: "#cb1ef5",
            activeBorderColor: "#cb1ef5",
            activeOutlineColor: "none",
            colorBorder: "#660099",
            colorTextPlaceholder: "#660099",
          },
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <Select
          className="min-w-30 w-full max-w-36"
          showSearch
          placeholder="Parcelamento"
          value={currentInstallments}
          onChange={updateParcelamentoValues}
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={[
            { value: 1, label: "Preço à vista" },
            { value: 2, label: "em 2x" },
            { value: 3, label: "em 3x" },
            { value: 4, label: "em 4x" },
            { value: 5, label: "em 5x" },
            { value: 6, label: "em 6x" },
            { value: 7, label: "em 7x" },
            { value: 8, label: "em 8x" },
            { value: 9, label: "em 9x" },
            { value: 10, label: "em 10x" },
            { value: 24, label: "em 24x" },
          ]}
        />
      </div>
    </ConfigProvider>
  );
};
