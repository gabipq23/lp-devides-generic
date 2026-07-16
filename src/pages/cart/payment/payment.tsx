import { Collapse } from "antd";
import type { CollapseProps } from "antd";
import { RadioBtn } from "./components/radioBtn";
import { ExclamationCircleOutlined } from "@ant-design/icons";
function Payment({
  formaPagamento,
  changeFormaPagamento,
  isPaymentUpdateLoading,
  isAllDataLoading,
}: {
  formaPagamento: string | undefined;
  changeFormaPagamento: (pagamento: string) => void;
  isPaymentUpdateLoading?: boolean;
  isAllDataLoading?: boolean;
}) {
  const renderPaymentFields = () => {
    if (formaPagamento === "cartao credito") {
      return (
        <p className="text-[14px] text-center h-[60px] flex items-center justify-center text-neutral-700">
          O parcelamento será feito no seu cartão de crédito
        </p>
      );
    } else if (formaPagamento === "fatura vivo") {
      return (
        <p className="text-[14px]  h-[60px] flex items-center  text-neutral-700">
          O parcelamento da compra será cobrado em sua fatura Vivo
        </p>
      );
    } else if (formaPagamento === "fatura vivo+cartao credito") {
      return (
        <p className="text-[14px] text-center h-[60px] flex items-center justify-center text-neutral-700">
          O parcelamento será divido entre sua fatura vivo e o seu cartão de
          crédito
        </p>
      );
    }
    return null;
  };
  const info = (
    <>
      <div className="min-h-[180px] p-4 relative">
        <div className={isAllDataLoading ? "pointer-events-none" : ""}>
          <RadioBtn
            onChange={changeFormaPagamento}
            value={formaPagamento ?? "fatura vivo"}
          />
          <div className="flex items-center gap-1 text-neutral-500">
            {" "}
            <ExclamationCircleOutlined /> {renderPaymentFields()}
          </div>
        </div>
        {isPaymentUpdateLoading && (
          <div className="absolute inset-0 backdrop-blur-[.5px] flex items-center justify-center z-10">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </>
  );

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <p className="text-[15px]">Forma de pagamento</p>,
      children: info,
    },
  ];

  return (
    <>
      <div>
        <Collapse
          ghost
          items={items}
          bordered={false}
          defaultActiveKey={["1"]}
        />
      </div>
    </>
  );
}

export default Payment;
