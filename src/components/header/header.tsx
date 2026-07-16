import { usePartner } from "@/context/PartnerContext";

function Header() {
  const { partner } = usePartner();

  return (
    <div className="relative z-2">
      <header
        className="flex justify-between gap-4 items-center"
        style={{ backgroundColor: "#5d0090" }}
      >
        <div className="p-3 px-6 md:px-16 lg:px-20">
          <img src="\assets\Group 9.png" className="h-9" alt="Home" />
        </div>
        {(partner?.logo_url) && (
          <span className="flex flex-col items-center justify-center gap-1 p-3 py-2 px-6 md:px-16 lg:px-20">
            <a
              href={partner.headerRightHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-end"
            >
              <img src={partner.logo_url} className="h-8 hover:cursor-pointer" />
            </a>
            <p
              style={{
                border: "1px solid #d4d4d4",
                color: "#d4d4d4",
                padding: "0 5px",
                fontSize: "0.6rem",
                borderRadius: "3rem",
                fontWeight: "500",
                textAlign: "center",
              }}
            >
              Parceiro Autorizado
            </p>
          </span>
        )}

      </header>
    </div>
  );
}

export default Header;
