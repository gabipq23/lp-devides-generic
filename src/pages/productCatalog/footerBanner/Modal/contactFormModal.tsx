import { Button, Modal, Form, ConfigProvider } from "antd";
import { ICreateContact } from "@/interfaces/contact";
import { Contact } from "./contactForm";

function ContactFormModal({
  isModalOpen,
  closeModal,
  createContact,
}: {
  isModalOpen: boolean;
  closeModal: () => void;
  createContact: (data: ICreateContact) => void;
}) {
  const [form] = Form.useForm();

  const closeModalAndForm = () => {
    form.resetFields();
    closeModal();
  };

  return (
    <Modal
      centered
      title={
        <span
          style={{
            color: "#410d4e",
          }}
        >
          Fale Conosco
        </span>
      }
      open={isModalOpen}
      onCancel={closeModalAndForm}
      footer={null}
      width={600}
    >
      <div className="w-full">
        <Contact
          closeModal={closeModalAndForm}
          createContact={createContact}
          form={form}
        />
      </div>
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
        <div className="mt-4 flex justify-end">
          <Button
            onClick={closeModalAndForm}
            type="default"
            variant="solid"
            style={{
              fontSize: "14px",
            }}
          >
            Fechar
          </Button>
        </div>{" "}
      </ConfigProvider>
    </Modal>
  );
}

export default ContactFormModal;
