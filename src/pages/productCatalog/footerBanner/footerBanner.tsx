import { useContactFormController } from "./controller";
import ContactFormModal from "./Modal/contactFormModal";
import { usePartner } from "@/context/PartnerContext";

function FooterBanner() {
  const { isModalOpen, showModal, closeModal, createContact } =
    useContactFormController();
  const { partner } = usePartner();

  return (
    <div
      className="flex flex-wrap items-center gap-10 p-10 px-14"
      style={{ backgroundColor: "#660099" }}
    >
      <div className="flex flex-col ml-12  gap-8 items-center">
        <img src="/assets/logo-vivo-parceiro-footer.png" className="h-20 " />
        <div className="pb-6">
          <ContactFormModal
            isModalOpen={isModalOpen}
            closeModal={closeModal}
            createContact={createContact}
          />

          <button
            className="cursor-pointer bg-[#450068] hover:bg-[#390055] px-4 py-2 rounded-lg transition duration-300 flex justify-center items-center"
            onClick={() => {
              showModal();
            }}
          >
            <span className="text-white hover:underline w-28">
              Fale Conosco
            </span>
          </button>
        </div>
      </div>
      <div className="flex md:border-l-2 md:border-neutral-300 lg:border-l-2 lg:border-neutral-300 pl-10 flex-col gap-6 text-neutral-300 text-[13px] w-2/3 text-start ">
        <p>
          {partner.partner_name}
        </p>
        <p>
          Parceiro Autorizados Vivo Empresas
        </p>
        <p>

        </p>
      </div>
    </div>
  );
}

export default FooterBanner;
