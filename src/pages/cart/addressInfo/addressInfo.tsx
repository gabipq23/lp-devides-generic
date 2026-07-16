import { formatCEP } from "@/utils/formatCEP";
import type { CollapseProps } from "antd";
import { Button, Collapse, ConfigProvider, Form, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { IOrderResponse } from "@/interfaces/order";
function AddressInfo({
  purchaseById,
  updateData,
}: {
  purchaseById: IOrderResponse | undefined | null;
  updateData: (payload: Record<string, unknown>) => Promise<unknown>;
}) {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const purchase = purchaseById?.order;

  useEffect(() => {
    if (purchase) {
      form.setFieldsValue({
        address_complement: purchase.address_complement,
        address_note: purchase.address_note,
      });
    }
  }, [purchase, form]);

  const OnSubmit = async () => {
    const values = await form.validateFields();

    const payload: Record<string, unknown> = {};

    // if (values.address_complement !== purchase?.address_complement) {
    //   payload.address_complement = values.address_complement;
    // }
    if (values.address_note !== purchase?.address_note) {
      payload.address_note = values.address_note;
    }

    await updateData(payload);
    setIsEditing(false);
  };

  const info = (
    <>
      <div className="flex flex-col  w-full text-neutral-800  rounded-lg min-h-[120px] p-4">
        {/* Endereço e Bairro  */}
        <div className="hidden md:grid grid-cols-2 mb-2  gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>Endereço:</strong> {purchase?.address || "-"}
          </p>
          <p className="w-[400px] ">
            <strong>Bairro:</strong>{" "}
            {purchase?.district || "-"}
          </p>
        </div>

        {/* Mobile: Endereço e Bairro */}
        <div className="flex flex-col gap-2 mb-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>Endereço:</strong> {purchase?.address || "-"}
          </p>
          <p>
            <strong>Bairro:</strong>{" "}
            {purchase?.district || "-"}
          </p>
        </div>

        {/* Número e Cidade */}

        <div className="hidden md:grid grid-cols-2 mb-2  gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>Número:</strong>{" "}
            {purchase?.address_number || "-"}
          </p>
          <p className="w-[400px] ">
            <strong>Cidade:</strong> {purchase?.city || "-"}
          </p>
        </div>

        {/* Mobile: Número e Cidade */}
        <div className="flex flex-col gap-2 mb-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>Número:</strong>{" "}
            {purchase?.address_number || "-"}
          </p>
          <p>
            <strong>Cidade:</strong> {purchase?.city || "-"}
          </p>
        </div>

        {/* UF e CEP */}
        <div className="hidden md:grid grid-cols-2 mb-2 gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>UF:</strong> {purchase?.state || "-"}
          </p>
          <p>
            <strong>CEP:</strong>{" "}
            {formatCEP(
              purchase?.zip_code ?? ""
            ) || "-"}
          </p>
        </div>
        {/* Mobile: UF e CEP */}
        <div className="flex flex-col gap-2 mb-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>UF:</strong> {purchase?.state || "-"}
          </p>
          <p>
            <strong>CEP:</strong>{" "}
            {formatCEP(
              purchase?.zip_code ?? ""
            ) || "-"}
          </p>
        </div>
        {/* Complemento e Observações */}
        {!isEditing ? (
          <>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-4 text-[14px] w-full   text-neutral-700">
              {purchase?.address_complement !== null && (
                <p>
                  <strong>Complemento:</strong>{" "}
                  {purchase?.address_complement || "-"}
                </p>
              )}
              {purchase?.address_note !== null && (
                <p>
                  <strong>Observações:</strong>{" "}
                  {purchase?.address_note || "-"}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {isEditing && (
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
                      colorBorder: "#660099",
                      colorText: "#660099",

                      colorPrimary: "#660099",

                      colorPrimaryHover: "#883fa2",
                    },
                  },
                }}
              >
                <Form
                  form={form}
                  layout="vertical"
                  className="md:grid grid-cols-2 gap-4"
                  onFinish={OnSubmit}
                >
                  <div className="flex gap-4 h-22  text-[14px] w-full text-neutral-700">
                    <p>
                      <strong>Complemento:</strong>
                    </p>
                    <div className="flex-1  min-w-[140px]  max-w-[300px]">
                      <Form.Item
                        className="w-full text-[16px] font-light text-[#353535]"
                        name="address_complement"
                      >
                        <Input.TextArea
                          maxLength={58}
                          autoSize={{ minRows: 3, maxRows: 3 }}
                          value={purchase?.address_complement}
                          className="p-2 text-[16px] w-full font-light text-[#353535]"
                          placeholder="Complemento de endereço"
                        />
                      </Form.Item>
                    </div>
                    <div className="mt-0.5">
                      <Button
                        size="small"
                        type="primary"
                        variant="solid"
                        style={{
                          fontSize: "12px",
                          height: "30px",
                        }}
                        htmlType="submit"
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>

                  <div className="flex h-16   gap-4 text-[14px] w-full text-neutral-700">
                    <p>
                      <strong>Observações: </strong>
                    </p>
                    <div className="flex-1 min-w-[140px]  max-w-[600px]">
                      {" "}
                      <Form.Item className="w-full" name="address_note">
                        <Input.TextArea
                          autoSize={{ minRows: 3, maxRows: 4 }}
                          value={purchase?.address_note}
                          className="p-2 text-[16px] font-light text-[#353535] w-full"
                          placeholder="Observações ou ponto de referência"
                        />
                      </Form.Item>
                    </div>
                    <div className="mt-0.5">
                      <Button
                        size="small"
                        type="primary"
                        variant="solid"
                        style={{
                          fontSize: "12px",
                          height: "30px",
                        }}
                        htmlType="submit"
                      >
                        Salvar
                      </Button>
                    </div>
                  </div>
                </Form>
              </ConfigProvider>
            )}
          </>
        )}

        <div className=" flex flex-col gap-2 text-[14px] w-full text-neutral-600">
          <div className="cursor-poiter mt-4">
            <ExclamationCircleOutlined />{" "}
            <ConfigProvider
              theme={{
                components: {
                  Button: {
                    colorBorder: "#660099",
                    colorText: "#660099",
                    colorPrimaryHover: "#cb1ef5",
                    colorPrimaryBorderHover: "#cb1ef5",
                    colorLink: "#660099",
                    colorLinkHover: "#cb1ef5",
                  },
                },
              }}
            >
              O endereço de entrega será o mesmo endereço que consta no cadastro
              da empresa na Receita Federal. Para adicionar informações de
              "Complemento" e "Observações"
              <Button
                onClick={() => setIsEditing(!isEditing)}
                size="small"
                type="link"
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  textDecoration: "underline",
                }}
              >
                clique aqui.
              </Button>
            </ConfigProvider>
          </div>
          <div className="cursor-poiter ">
            <ExclamationCircleOutlined /> Caso o endereço de entrega esteja
            desatualizado ou incorreto, escreva o endereço correto no campo
            "observações"
          </div>
        </div>
      </div>
    </>
  );

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <p className="text-[15px]">Informações de entrega</p>,
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

export default AddressInfo;
