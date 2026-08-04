import SendInfoModalBase from "@/components/SendInfoModal";
import { Fingerprint } from "@/utils/getFingerprintInfo";

// Modal que da inicio a compra
function SendInfoModal({
  showModal,
  updateData,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: (visible: boolean) => void;
  updateData: (values: {
    cnpj: string;
    full_name: string;
    phone: string;
    client_ip: string;
    fingerprint: Fingerprint;
    url: string;
    lp_url: string;
  }) => Promise<boolean> | boolean;
}) {
  const closeModal = () => setShowModal(false);

  return (
    <SendInfoModalBase
      open={showModal}
      onClose={closeModal}
      onSubmit={(values) => updateData(values)}
      showProductCard={false}
      closeOnSuccess
      modalWidth={500}
    />
  );
}

export default SendInfoModal;
