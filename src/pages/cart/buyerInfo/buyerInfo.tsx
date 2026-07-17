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

type BuyerInfoFormValues = {
  additional_email?: string;
  additional_phone?: string;
  full_name?: string;
  phone?: string;
};

const PhoneInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="## (##) #####-####"
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

  const normalizePhone = (value?: string | null) =>
    (value ?? "").replace(/\D/g, "");

  const handleEditSubmit = async () => {
    const values = await form.validateFields();
    const typedValues = values as BuyerInfoFormValues;
    const payload: Record<string, unknown> = {};

    if ((typedValues.additional_email ?? "") !== (purchase?.additional_email ?? "")) {
      payload.additional_email = typedValues.additional_email ?? "";
    }

    if (normalizePhone(typedValues.additional_phone) !== normalizePhone(purchase?.additional_phone)) {
      payload.additional_phone = normalizePhone(typedValues.additional_phone);
    }

    if ((typedValues.full_name ?? "") !== (purchase?.full_name ?? "")) {
      payload.full_name = typedValues.full_name ?? "";
    }

    if (normalizePhone(typedValues.phone) !== normalizePhone(purchase?.phone)) {
      payload.phone = normalizePhone(typedValues.phone);
    }

    if (Object.keys(payload).length === 0) {
      setIsEditing(false);
      return;
    }

    const success = await updateData(payload);

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

  const handleCancelEdit = () => {
    form.setFieldsValue({
      additional_email: purchase?.additional_email,
      additional_phone: purchase?.additional_phone,
      full_name: purchase?.full_name,
      phone: purchase?.phone,
    });
    setIsEditing(false);
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
        <div className="gap-4 text-[14px] w-full text-neutral-700">
          <p className=" ">
            <strong>Razão Social:</strong> {purchase?.company_legal_name || "-"}
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden md:grid grid-cols-2 gap-4 text-[14px] w-full text-neutral-700">
          <p>
            <strong>CNPJ:</strong> {formatCNPJ(purchase?.cnpj ?? "") || "-"}
          </p>
          <p>
            <strong>Gestor da conta:</strong> {purchase?.manager?.name || "-"}
          </p>
          <p>
            <strong>Email:</strong> {purchase?.manager?.email || "-"}
          </p>
          <p>
            <strong>Telefone:</strong>{" "}
            {formatPhoneNumber(purchase?.manager?.phone ?? "") || "-"}
          </p>

          {!isEditing ? (
            <>
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
              {purchase?.full_name !== null && (
                <p>
                  <strong>Nome (Comprador):</strong>{" "}
                  {purchase?.full_name || "-"}
                </p>
              )}
              {purchase?.additional_phone !== null && (
                <p>
                  <strong>Telefone (Comprador):</strong>{" "}
                  {formatPhoneNumber(purchase?.phone ?? "") ||
                    "-"}  {equalPhone && (
                      <Tooltip
                        title="Telefone do comprador igual ao do gestor cadastrado na Vivo"
                        placement="top"
                        styles={{ body: { fontSize: "11px" } }}
                      >
                        <span className="text-green-800 cursor-pointer">
                          <CheckCircleOutlined />
                        </span>
                      </Tooltip>
                    )}</p>
              )}
            </>
          ) : null}
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
          <p>
            <strong>CNPJ:</strong> {formatCNPJ(purchase?.cnpj ?? "") || "-"}
          </p>
          <p>
            <strong>Gestor da conta:</strong> {purchase?.manager?.name || "-"}
          </p>
          <p>
            <strong>Telefone:</strong>{" "}
            {formatPhoneNumber(purchase?.manager?.phone ?? "") || "-"}
          </p>
          <p>
            <strong>Email:</strong> {purchase?.manager?.email || "-"}
          </p>

        </div>

        {isEditing ? (
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
              onFinish={handleEditSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 text-[14px] w-full text-neutral-700">
                <div className="flex gap-1">
                  <p className="mb-2">
                    <strong>Novo Email:</strong>
                  </p>
                  <Form.Item
                    className="mb-0 text-[16px] w-50 font-light text-[#353535]"
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
                      className="p-2 text-[16px] w-full font-light text-[#353535]"
                      placeholder="Email"
                    />
                  </Form.Item>
                </div>

                <div className="flex gap-1 md:ml-2">
                  <p className="mb-2">
                    <strong>Novo Telefone:</strong>
                  </p>
                  <Form.Item
                    className="mb-0 text-[16px] w-50  font-light text-[#353535]"
                    name="additional_phone"
                  >
                    <PhoneInput format="(XX) XXXXX-XXXX" className="w-full" />
                  </Form.Item>
                </div>

                <div className="flex gap-1">
                  <p className="mb-2">
                    <strong>Nome (Comprador):</strong>
                  </p>
                  <Form.Item
                    className="mb-0 text-[16px] w-50 font-light text-[#353535]"
                    name="full_name"
                  >
                    <Input
                      maxLength={40}
                      className="p-2 text-[16px] w-full font-light text-[#353535]"
                      placeholder="Nome"
                    />
                  </Form.Item>
                </div>

                <div className="flex gap-1 md:ml-2">
                  <p className="mb-2">
                    <strong>Telefone (Comprador):</strong>
                  </p>
                  <Form.Item
                    className="mb-0 text-[16px] w-50 font-light text-[#353535]"
                    name="phone"
                  >
                    <PhoneInput format="(XX) XXXXX-XXXX" className="w-full" />
                  </Form.Item>
                </div>
              </div>
              <div className="flex flex-wrap w-full justify-end md:pr-24 gap-3">
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
                  Salvar alterações
                </Button>
                <Button
                  size="small"
                  type="default"
                  style={{
                    fontSize: "12px",
                    height: "30px",
                  }}
                  onClick={handleCancelEdit}
                >
                  Cancelar
                </Button>
              </div>
            </Form>
          </ConfigProvider>
        ) : (
          <div className="flex flex-col gap-2 md:hidden text-[14px] w-full text-neutral-700">
            <p className="flex gap-2 h-10">
              <strong>Novo Email:</strong>
              {purchase?.additional_email || "-"}
            </p>
            <p className="flex gap-2 h-10">
              <strong>Novo Telefone:</strong>{" "}
              {formatPhoneNumber(purchase?.additional_phone ?? "") ||
                "-"}
            </p>

            <p className="flex gap-2 h-10">
              <strong>Nome (Comprador):</strong>
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
            </p>

            <p className="flex gap-2 h-10">
              <strong>Telefone (Comprador):</strong>{" "}
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
            </p>
          </div>
        )}


        <div className=" flex flex-col gap-2 mt-2 text-[14px] w-full text-neutral-600">
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
