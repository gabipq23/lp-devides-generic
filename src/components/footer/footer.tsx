import { usePartner } from "@/context/PartnerContext";

function Footer() {
  const { partner } = usePartner();

  return (
    <footer
      className="flex items-center justify-between text-sm h-14 p-3 px-6 md:px-16 lg:px-20 lg:h-10"
      style={{ backgroundColor: "#5d0090" }}
    >
      <p className="text-center text-neutral-300 text-[12px] m-0">
        © {new Date().getFullYear()} – Todos os direitos reservados
      </p>
      {(partner?.logo_url) && (
        <p className="text-neutral-300 text-center text-[13px] ">
          <img src={partner.logo_url} alt="Footer Logo" className="h-6" />
        </p>
      )}

    </footer>
  );
}

export default Footer;
