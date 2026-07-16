import { Button, Modal } from "antd";

function ConfirmDataModal({
  showConfirmModal,
  closeModal,
}: {
  showConfirmModal: boolean;
  closeModal: () => void;
}) {
  return (
    <Modal
      centered
      title={<span style={{ color: "#252525" }}>Alteração de dados</span>}
      open={showConfirmModal}
      onCancel={closeModal}
      footer={null}
      width={720}
    >
      <div>
        <hr className="border-t border-neutral-300 mt-2 mb-6" />
        <p>
          {" "}
          Obrigado! Em breve um de nossos consultores entrará em contato com
          você para confirmar as alterações.
        </p>
        <hr className="border-t border-neutral-300  mb-2 mt-6" />
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          onClick={closeModal}
          color="purple"
          variant="outlined"
          style={{
            color: "#660099",
            fontSize: "14px",
          }}
        >
          Fechar
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDataModal;
