import { Button, Modal } from "antd";
import { Checkbox } from "antd";

function AddInsuranceModal({
  showInsuranceModal,
  closeModal,
  products,
  selectedId,
}: {
  showInsuranceModal: boolean;
  closeModal: () => void;
  products?: any;
  selectedId: any;
}) {
  let seguro1;
  let seguro2;
  const matchedProduct = products?.find((p: any) => p.id === selectedId);

  if (matchedProduct) {
    seguro1 =
      matchedProduct?.insurance_theft ??
      "Seguro 1 não disponível";
    seguro2 =
      matchedProduct?.insurance_theft_damages ??
      "Seguro 2 não disponível";
  }

  return (
    <Modal
      centered
      title={
        <span style={{ color: "#252525" }}>
          Deseja escolher um seguro para esse produto?
        </span>
      }
      open={showInsuranceModal}
      onCancel={closeModal}
      footer={null}
      width={720}
    >
      <div>
        <hr className="border-t border-neutral-300 mt-2 mb-6" />
        <div className="mb-2">
          <Checkbox>
            Roubo, Furto, Simples e Qualificado: R$
            {typeof seguro1 === "number"
              ? seguro1.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
              : seguro1}
            /mês
          </Checkbox>
        </div>
        <div>
          <Checkbox>
            Roubo, Furto, Simples e Qualificado: R$
            {typeof seguro2 === "number"
              ? seguro2.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
              : seguro2}
            /mês
          </Checkbox>
        </div>
        <hr className="border-t border-neutral-300  mb-2 mt-6" />
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <Button
          onClick={closeModal}
          color="purple"
          variant="outlined"
          style={{
            color: "#660099",
            fontSize: "14px",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={closeModal}
          color="purple"
          variant="outlined"
          style={{
            color: "#660099",
            fontSize: "14px",
          }}
        >
          Adicionar
        </Button>
      </div>
    </Modal>
  );
}

export default AddInsuranceModal;
