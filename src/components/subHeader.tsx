import { useNavigate } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { CartBadge } from "./CartBadge";
import { usePedidoStore } from "@/store/usePedidoStore";
import { buildPartnerPath } from "@/configs/partnerRuntime";
import { usePartner } from "@/context/PartnerContext";

export default function SubHeader() {
  const navigate = useNavigate();
  const id = sessionStorage.getItem("carrinhoId");
  const pedidoId = usePedidoStore((state) => state.pedidoId);
  const runtime = usePartner();

  return (
    <div className="relative z-2">
      <div className="">
        <div className="flex flex-col md:flex-row justify-between  md:items-center p-2 bg-[#660099] px-6 md:px-16 lg:px-20">
          <div className="flex flex-row md:flex-row lg:flex-row items-center justify-center lg:justify-between gap-4">
            <div className="flex gap-4">
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate(buildPartnerPath(runtime, "catalog"), { state: { scrollTo: "destaques" } });
                  document
                    .getElementById("destaques")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                href="#destaques"
                className="text-[14px] text-neutral-300 hover:text-neutral-100 hover:underline"
              >
                Destaques
              </a>
              <a
                onClick={(e) => {
                  e.preventDefault();
                  navigate(buildPartnerPath(runtime, "catalog"), { state: { scrollTo: "super-ofertas" } });

                  document
                    .getElementById("super-ofertas")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                href="#super-ofertas"
                className="text-[14px] text-neutral-300 hover:text-neutral-100 hover:underline"
              >
                Ofertas
              </a>
            </div>
            <div className="flex gap-4">
              <div className="items-center justify-center text-center flex">
                {window.innerWidth < 500 ? (
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(buildPartnerPath(runtime, "catalog"), { state: { scrollTo: "acessorios" } });
                      document
                        .getElementById("acessorios")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    href="#acessorios"
                    className="text-[14px] text-neutral-300 hover:text-neutral-100 hover:underline"
                  >
                    Mais Produtos
                  </a>
                ) : (
                  <a
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(buildPartnerPath(runtime, "catalog"), { state: { scrollTo: "acessorios" } });

                      document
                        .getElementById("acessorios")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }}
                    href="#acessorios"
                    className="text-[14px] text-neutral-300 hover:text-neutral-100 hover:underline"
                  >
                    Tablets, Smartwatches e Acessórios
                  </a>
                )}
              </div>
              {/* {(version === "0" || version === "3") && (
                <div className="items-center justify-center text-center flex">
                  {window.innerWidth < 500 ? (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/iphone-17`);
                      }}
                      href="/iphone-17"
                      className="text-[14px] text-neutral-300 hover:text-neutral-100"
                    >
                      Iphone 17
                    </a>
                  ) : (
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/iphone-17`);
                      }}
                      href="/iphone-17"
                      className="text-[14px] text-neutral-300 hover:text-neutral-100"
                    >
                      Lançamento iPhone 17
                    </a>
                  )}
                </div>
              )} */}
            </div>
          </div>

          {/* <div className="text-neutral-300 relative flex mt-4 md:mt-0 justify-end hover:text-neutral-100 ">
            {sessionStorage.getItem("carrinhoId") !== null ? (
              <button
                className="text-[14px] cursor-pointer flex items-center gap-2 text-neutral-300 hover:text-neutral-100 "
                onClick={() => {
                  const statusFechado = sessionStorage.getItem("statusCarrinho");
                  if (statusFechado === "fechado") {
                    navigate(buildPartnerPath(runtime, "order", id || ""));
                  } else {
                    navigate(buildPartnerPath(runtime, "cart", id || ""));
                  }
                }}
              >
                <p className="text-[14px]">
                  {" "}
                  Olá,{" "}
                  {capitalizeWords(onlyLetters(sessionStorage.getItem("nomeEmpresa") || ""))}
                </p>

                <span style={{ position: "relative", display: "inline-block" }}>
                  <ShoppingCartOutlined
                    style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: "-7px",
                      right: "-10px",
                      background: "#660099",
                      color: "#fff",
                      borderRadius: "50%",
                      minWidth: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.80rem",
                      fontWeight: "normal",
                      boxShadow: "0 0 0 1px #fff",
                    }}
                  >
                 
                    <CartBadge id={id || ""} />
                  </span>
                </span>
              </button>
            ) : (
              ""
            )}
          </div> */}

          {sessionStorage.getItem("carrinhoId") !== null || pedidoId ? (
            <div className="text-neutral-600 relative flex self-center mt-4 bg-neutral-300 p-2 md:mt-0 justify-end max-w-[280px] shadow-34xl rounded-xl hover:text-neutral-800  ">
              <button
                style={{ position: "relative" }}
                className="text-[14px] cursor-pointer flex items-center gap-3 text-neutral-300 hover:text-neutral-100 "
                onClick={() => {
                  const statusFechado = sessionStorage.getItem("statusCarrinho");
                  if (statusFechado === "FECHADO") {
                    navigate(buildPartnerPath(runtime, "order", id || ""));
                  } else {
                    navigate(buildPartnerPath(runtime, "cart", id || ""));
                  }
                }}
              >
                {/* <UserOutlined /> */}
                {/* <p className="text-[13px] wrap-break-word text-start">
                  {" "}
                  Olá,{" "}
                  {onlyLetters(
                    capitalizeWords(
                      sessionStorage.getItem("nomeEmpresa") || pedidoId || ""
                    )
                  ) || pedidoId}
                </p> */}


                <span>
                  <ShoppingCartOutlined
                    style={{ fontSize: "1.2rem", fontWeight: "bold" }}
                  />

                  <span
                    style={{
                      position: "absolute",
                      top: "-14px",
                      right: "-16px",
                      background: "red",
                      color: "#fff",
                      borderRadius: "50%",
                      minWidth: "20px",
                      height: "20px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontWeight: "normal",
                      boxShadow: "0 0 0 1px #fff",
                    }}
                  >
                    {/* CartBadge mostra o total de itens do carrinho */}
                    <CartBadge id={id || ""} />
                  </span>
                </span>
              </button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </div>
  );
}
