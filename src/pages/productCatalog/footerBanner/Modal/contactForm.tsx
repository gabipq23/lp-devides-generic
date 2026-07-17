import {
  Button,
  Form,
  Input,
  FormInstance,
  ConfigProvider,
  Select,
} from "antd";
import { ICreateContact } from "@/interfaces/contact";
import { usePartner } from "@/context/PartnerContext";

import { PatternFormat, PatternFormatProps } from "react-number-format";

const PhoneInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="## (##) #####-####"
    customInput={Input}
    size="middle"
  />
);

const CNPJInput = (props: PatternFormatProps) => (
  <PatternFormat
    {...props}
    format="##.###.###/####-##"
    customInput={Input}
    size="middle"
  />
);

const formItemLayout = {
  labelCol: {
    xs: { span: 40 },
    sm: { span: 28 },
  },
  wrapperCol: {
    xs: { span: 40 },
    sm: { span: 28 },
  },
};

interface ContactProps {
  closeModal: () => void;
  createContact: (data: ICreateContact) => void;
  form: FormInstance;
}

export const Contact: React.FC<ContactProps> = ({
  closeModal,
  createContact,
  form,
}) => {
  const { partner, type } = usePartner();
  const variant = Form.useWatch("variant", form);

  const handleSaveContact = (data: ICreateContact) => {
    createContact(data);
    closeModal();
  };
  const lp_url = window.location.href;
  const product_type = window.location.pathname.split("/")[1] || type;
  return (
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
            colorPrimary: "#660099",
            colorPrimaryHover: "#883fa2",
          },
          Select: {
            colorPrimary: "#660099",
            colorPrimaryHover: "#883fa2",
            colorText: "#410d4e",
            colorTextPlaceholder: "#666666",
          },
        },
      }}
    >
      <Form
        {...formItemLayout}
        form={form}
        variant={variant || "outlined"}
        initialValues={{ variant: "outlined" }}
        style={{ maxWidth: 540 }}
        onFinish={async (values) => {
          const telefoneWithOutMask = values.phone.replace(/\D/g, "");
          const cnpjWithOutMask = values.cnpj.replace(/\D/g, "");
          handleSaveContact({
            ...values,
            phone: telefoneWithOutMask,
            cnpj: cnpjWithOutMask,
            landing_page: "aparelhos",
            company: "VIVO",
            company_id: Number(partner?.company_id ?? 9),
            business_partner: partner?.partner_name || "",
            partner_id: Number(partner?.partner_id ?? 9),
            category: product_type,
            url_lp: lp_url,

          });
        }}
        requiredMark
      >
        <Form.Item
          label="Nome"
          name="name"
          style={{ paddingTop: "10px" }}
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="CNPJ"
          name="cnpj"
          rules={[
            { required: true, message: "Campo obrigatório" },
            {
              pattern: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
              message: "CNPJ inválido",
            },
          ]}
        >
          <CNPJInput format="XX.XXX.XXX/XXXX-XX" />
        </Form.Item>
        <Form.Item
          label="Telefone"
          name="phone"
          rules={[{ required: true, message: "Campo obrigatório" }, { pattern: /^\(\d{2}\) \d{5}-\d{4}$/, message: "Telefone inválido" }]}
        >
          <PhoneInput format="(XX) XXXXX-XXXX" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Campo obrigatório" },
            {
              pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Email inválido",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Assunto"
          name="subject"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Select
            placeholder="Selecione o assunto"
            options={[
              { value: "Quero ser cliente", label: "Quero ser cliente" },
              {
                value: "Informações sobre seus créditos",
                label: "Informações sobre seus créditos",
              },
              {
                value: "Atualização cadastral",
                label: "Atualização cadastral",
              },
              { value: "Status do pedido", label: "Status do pedido" },
              { value: "Erro no pedido", label: "Erro no pedido" },
              { value: "Devolução", label: "Devolução" },
              { value: "Outros assuntos", label: "Outros assuntos" },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Mensagem"
          name="message"
          rules={[{ required: true, message: "Campo obrigatório" }]}
        >
          <Input.TextArea autoSize={{ minRows: 5, maxRows: 5 }} />
        </Form.Item>

        <Form.Item wrapperCol={{ span: 24 }} style={{ textAlign: "center" }}>
          <Button
            type="primary"
            variant="solid"
            style={{
              color: "#ffffff",
              fontSize: "14px",
            }}
            htmlType="submit"
          >
            Enviar
          </Button>{" "}
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
};

export default Contact;
