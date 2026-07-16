
import { formatCNPJ } from "@/utils/formatCNPJ";
import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import type { CollapseProps } from "antd";
import {
  Button,
  Collapse,
  ConfigProvider,
  Form,
  Input,
  Modal,
  Tooltip,
} from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import ConfirmDataModal from "./modalConfirmData";
import { PatternFormat, PatternFormatProps } from "react-number-format";
import { IOrderResponse } from "@/interfaces/order";

const PhoneInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="(##) #####-####"
    customInput={Input}
    placeholder="Telefone"
    size="middle"
  />
);

function BuyerInfo({
  purchaseById,
  updateData,
}: {
  updateData: (payload: Record<string, unknown>) => Promise<unknown>;
  purchaseById: IOrderResponse | undefined | null;
}) {

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const closeModal = () => setShowConfirmModal(false);
  const purchase = purchaseById?.order;
  useEffect(() => {
    if (purchase) {
      form.setFieldsValue({
        additional_email: purchase.additional_email,
        additional_phone: purchase.additional_phone,
        full_name: purchase.full_name,
        phone: purchase.phone,
      });
    }
  }, [purchase, form]);

  const handleEmailSubmit = async () => {
    const value = await form.validateFields(["additional_email"]);
    const success = await updateData({
      additional_email: value.additional_email,
    });
    if (success) {
      setShowConfirmModal(true);
      Modal.success({
        title: "Informação enviada",
        content:
          "Um consultor irá confirmar essas informações com você nos próximos dias.",
      });
      setIsEditing(false);
    }
  };

  const handlePhoneSubmit = async () => {
    const value = await form.validateFields(["additional_phone"]);
    const telefoneSemMascara = value.additional_phone.replace(/\D/g, "");
    const success = await updateData({
      additional_phone: telefoneSemMascara,
    });
    if (success) {
      setShowConfirmModal(true);
      Modal.success({
        title: "Informação enviada",
        content:
          "Um consultor irá confirmar essas informações com você nos próximos dias.",
      });
      setIsEditing(false);
    }
  };

  const handleBuyerNameSubmit = async () => {
    const value = await form.validateFields(["full_name"]);
    const success = await updateData({
      full_name: value.full_name,
    });
    if (success) {
      setShowConfirmModal(true);
      Modal.success({
        title: "Informação enviada",
        content:
          "Um consultor irá confirmar essas informações com você nos próximos dias.",
      });
      setIsEditing(false);
    }
  };

  const handleBuyerPhoneSubmit = async () => {
    const value = await form.validateFields(["phone"]);
    const telefoneSemMascara = value.phone.replace(/\D/g, "");
    const success = await updateData({
      phone: telefoneSemMascara,
    });
    if (success) {
      setShowConfirmModal(true);
      Modal.success({
        title: "Informação enviada",
        content:
          "Um consultor irá confirmar essas informações com você nos próximos dias.",
      });
      setIsEditing(false);
    }
  };

  let equalName = false;
  let equalPhone = false;
  if (
    purchase?.manager?.name &&
    purchase?.full_name &&
    purchase?.manager?.name.split(" ")[0].toLowerCase() ===
    purchase?.full_name.split(" ")[0].toLowerCase()
  ) {
    equalName = true;
  }
  if (
    purchase?.manager?.phone &&
    purchase?.phone &&
    purchase?.manager?.phone.replace(/\D/g, "") ===
    purchase?.phone.replace(/\D/g, "")
  ) {
    equalPhone = true;
  }
  const info = (
    <>
      <div className="flex flex-col w-full text-neutral-800 gap-2 rounded-lg min-h-[120px] p-4">
        <div className="  gap-4 text-[14px] w-full text-neutral-700">
          <p className=" ">
            <strong>Razão Social:</strong> {purchase?.company_legal_name || "-"}
          </p>
        </div>
        {/* CNPJ e Gestor da conta */}
        <div className="hidden md:grid grid-cols-2  gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>CNPJ:</strong> {formatCNPJ(purchase?.cnpj ?? "") || "-"}
          </p>
          <p>
            <strong>Gestor da conta:</strong> {purchase?.manager?.name || "-"}
          </p>
        </div>
        {/* Mobile: CNPJ e Gestor da conta */}
        <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>CNPJ:</strong> {formatCNPJ(purchase?.cnpj ?? "") || "-"}
          </p>
          <p>
            <strong>Gestor da conta:</strong> {purchase?.manager?.name || "-"}
          </p>
        </div>
        {/* Telefone e Email */}
        <div className="hidden md:grid grid-cols-2 gap-4 text-[14px]  w-full text-neutral-700">
          <p>
            <strong>Email :</strong> {purchase?.manager?.email || "-"}
          </p>
          <p>
            <strong>Telefone :</strong>{" "}
            {formatPhoneNumber(purchase?.manager?.phone ?? "") || "-"}
          </p>
        </div>
        {!isEditing ? (
          <>
            <div className="hidden md:grid grid-cols-2 gap-4 text-[14px] w-full   text-neutral-700">
              {purchase?.additional_email !== null && (
                <p>
                  <strong>Novo Email:</strong>{" "}
                  {purchase?.additional_email || "-"}
                </p>
              )}
              {purchase?.additional_phone !== null && (
                <p>
                  <strong>Novo Telefone:</strong>{" "}
                  {formatPhoneNumber(purchase?.additional_phone ?? "") || "-"}
                </p>
              )}
            </div>
            {/* )} */}
          </>
        ) : (
          <>
            <div className=" flex flex-col text-[14px] w-full   text-neutral-600">
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
                {isEditing && (
                  <Form
                    form={form}
                    layout="vertical"
                    className="md:grid grid-cols-2 gap-4  max-h-[100px]"
                  >
                    <div className="flex gap-4 text-[14px]   w-full text-neutral-700">
                      <p className="">
                        <strong>Novo Email:</strong>
                      </p>
                      <div className="flex gap-2">
                        <Form.Item
                          className="flex text-[16px]  font-light text-[#353535]"
                          name="additional_email"
                          rules={[
                            {
                              pattern:
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                              message: "Email inválido",
                            },
                          ]}
                        >
                          <Input
                            maxLength={40}
                            className="p-2 text-[16px] min-w-[300px] font-light text-[#353535] "
                            placeholder="Email"
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
                          onClick={handleEmailSubmit}
                        >
                          Salvar
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-4 text-[14px] w-full text-neutral-700">
                      <p>
                        <strong>Novo Telefone: </strong>
                      </p>
                      <div className="flex gap-2">
                        <Form.Item
                          className="flex  text-[16px] font-light text-[#353535]"
                          name="additional_phone"
                        >
                          <PhoneInput format="(XX) XXXXX-XXXX" />
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
                          onClick={handlePhoneSubmit}
                        >
                          Salvar
                        </Button>
                      </div>
                    </div>
                  </Form>
                )}
              </ConfigProvider>
            </div>
          </>
        )}{" "}
        <div className="hidden md:grid grid-cols-2 gap-2 text-[14px] w-full text-neutral-700">
          <p className="flex gap-2 h-10">
            <strong className="w-[140px]">Nome (Comprador) :</strong>
            {isEditing ? (
              <Form
                form={form}
                layout="vertical"
                className="md:grid grid-cols-2 gap-4  max-h-[100px]"
              >
                <div className="flex gap-2 ml-3">
                  <Form.Item
                    className="flex text-[16px]  font-light text-[#353535]"
                    name="full_name"
                  >
                    <Input
                      maxLength={40}
                      className="p-2 text-[16px] min-w-[300px] font-light text-[#353535] "
                      placeholder="Nome"
                    />
                  </Form.Item>
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
                      onClick={handleBuyerNameSubmit}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>{" "}
              </Form>
            ) : (
              <span className="flex  gap-2 items-start">
                {purchase?.full_name || "-"}
                {equalName && (
                  <Tooltip
                    title="Nome do comprador igual ao do gestor cadastrado na Vivo"
                    placement="top"
                    styles={{ body: { fontSize: "11px" } }}
                  >
                    <span className="text-green-800 cursor-pointer">
                      <CheckCircleOutlined />
                    </span>
                  </Tooltip>
                )}
              </span>
            )}
          </p>

          <p className="flex gap-2 h-10">
            <strong className="w-[160px]">Telefone (Comprador) :</strong>{" "}
            {isEditing ? (
              <Form
                form={form}
                layout="vertical"
                className="md:grid grid-cols-2 gap-4  max-h-[100px]"
              >
                <div className="flex gap-2  ml-3">
                  <Form.Item
                    className="flex text-[16px]  font-light text-[#353535]"
                    name="phone"
                  >
                    <PhoneInput format="(XX) XXXXX-XXXX" />
                  </Form.Item>
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
                      onClick={handleBuyerPhoneSubmit}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>{" "}
              </Form>
            ) : (
              <span className="flex  gap-2 items-start">
                {formatPhoneNumber(purchase?.phone ?? "") ||
                  "-"}
                {equalPhone && (
                  <Tooltip
                    title="Telefone do comprador igual ao do gestor cadastrado na Vivo"
                    placement="top"
                    styles={{ body: { fontSize: "11px" } }}
                  >
                    <span className="text-green-800 cursor-pointer">
                      <CheckCircleOutlined />
                    </span>
                  </Tooltip>
                )}
              </span>
            )}
          </p>
        </div>
        {/* Mobile: Telefone e Email em coluna */}
        <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>Telefone :</strong>{" "}
            {formatPhoneNumber(purchase?.phone ?? "") || "-"}
          </p>
          <p>
            <strong>Email :</strong> {purchase?.manager?.email || "-"}
          </p>
        </div>
        {/* Mobile: Telefone e Email em coluna */}
        <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
          <p className="flex gap-2 h-10">
            <strong className="w-[140px]">Nome (Comprador) :</strong>
            {isEditing ? (
              <Form
                form={form}
                layout="vertical"
                className="md:grid grid-cols-2 gap-4  max-h-[100px]"
              >
                <div className="flex gap-2 ml-3">
                  <Form.Item
                    className="flex text-[16px]  font-light text-[#353535]"
                    name="full_name"
                  >
                    <Input
                      maxLength={40}
                      className="p-2 text-[16px] min-w-[300px] font-light text-[#353535] "
                      placeholder="Nome"
                    />
                  </Form.Item>
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
                      onClick={handleBuyerNameSubmit}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>{" "}
              </Form>
            ) : (
              <span className="flex  gap-2 items-start">
                {purchase?.full_name || "-"}
                {equalName && (
                  <Tooltip
                    title="Nome do comprador igual ao do gestor cadastrado na Vivo"
                    placement="top"
                    styles={{ body: { fontSize: "11px" } }}
                  >
                    <span className="text-green-800 cursor-pointer">
                      <CheckCircleOutlined />
                    </span>
                  </Tooltip>
                )}
              </span>
            )}
          </p>

          <p className="flex gap-2 h-10">
            <strong className="w-[160px]">Telefone (Comprador) :</strong>{" "}
            {isEditing ? (
              <Form
                form={form}
                layout="vertical"
                className="md:grid grid-cols-2 gap-4  max-h-[100px]"
              >
                <div className="flex gap-2  ml-3">
                  <Form.Item
                    className="flex text-[16px]  font-light text-[#353535]"
                    name="phone"
                  >
                    <PhoneInput format="(XX) XXXXX-XXXX" />
                  </Form.Item>
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
                      onClick={handleBuyerPhoneSubmit}
                    >
                      Salvar
                    </Button>
                  </div>
                </div>{" "}
              </Form>
            ) : (
              <span className="flex  gap-2 items-start">
                {formatPhoneNumber(purchase?.phone ?? "") ||
                  "-"}
                {equalPhone && (
                  <Tooltip
                    title="Telefone do comprador igual ao do gestor cadastrado na Vivo"
                    placement="top"
                    styles={{ body: { fontSize: "11px" } }}
                  >
                    <span className="text-green-800 cursor-pointer">
                      <CheckCircleOutlined />
                    </span>
                  </Tooltip>
                )}
              </span>
            )}
          </p>
        </div>
        <div className="cursor-poiter">
          <ExclamationCircleOutlined /> Estes são os dados de contato
          cadastrados na Vivo. Caso você caso queira editar informações do
          comprador
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
              clique aqui
            </Button>
          </ConfigProvider>
          e atualize as suas informações.{" "}
        </div>
        {showConfirmModal === true && (
          <ConfirmDataModal
            closeModal={closeModal}
            showConfirmModal={showConfirmModal}
          />
        )}
      </div>
    </>
  );

  const items: CollapseProps["items"] = [
    {
      key: "1",
      label: <p className="text-[15px]">Informações do comprador</p>,
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

export default BuyerInfo;
