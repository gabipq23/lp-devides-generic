import React from "react";
import { BarcodeOutlined } from "@ant-design/icons";
import type { RadioChangeEvent } from "antd";
import { Flex, Radio } from "antd";

export const RadioBtn: React.FC<{
  onChange: (value: string) => void;
  value: string;
}> = ({ onChange, value }) => {
  return (
    <Radio.Group
      onChange={(e: RadioChangeEvent) => onChange(e.target.value)}
      value={value}
      options={[
        {
          value: "fatura vivo",
          label: (
            <Flex gap="small" justify="center" align="center" vertical>
              <BarcodeOutlined />
              Fatura Vivo
            </Flex>
          ),
        },
        // {
        //   value: "cartao credito",
        //   disabled: true,
        //   label: (
        //     <Flex gap="small" justify="center" align="center" vertical>
        //       <CreditCardOutlined />
        //       Cartão de Crédito
        //     </Flex>
        //   ),
        // },
        // {
        //   value: "fatura vivo+cartao credito",
        //   disabled: true,
        //   label: (
        //     <Flex gap="small" justify="center" align="center" vertical>
        //       <div className="flex gap-2">
        //         <CreditCardOutlined /> <BarcodeOutlined />
        //       </div>
        //       Cartão de Crédito + Fatura Vivo
        //     </Flex>
        //   ),
        // },
      ]}
    />
  );
};
