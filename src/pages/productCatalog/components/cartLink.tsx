import { CartBadge } from "@/components/CartBadge";
import { useNavigate } from "react-router-dom";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { buildPartnerPath } from "@/configs/partnerRuntime";
import { usePartner } from "@/context/PartnerContext";
export function CartLink() {
    const navigate = useNavigate();
    const runtime = usePartner();

    return (
        <a
            className="bg-neutral-100 hover:bg-neutral-50 cursor-pointer"
            style={{
                position: "fixed",
                bottom: "80px",
                right: "22px",
                background: "",
                padding: "12px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 9999,
            }}

        >
            <button
                style={{ position: "relative", display: "inline-block" }}
                className="text-[14px] cursor-pointer flex items-center gap-2 bg-neutral-300 text-neutral-300 hover:text-neutral-100 "
                onClick={() => {
                    const statusFechado = sessionStorage.getItem("statusCarrinho");
                    if (statusFechado === "FECHADO") {
                        navigate(buildPartnerPath(runtime, "order", sessionStorage.getItem("carrinhoId") || ""));
                    } else {
                        navigate(buildPartnerPath(runtime, "cart", sessionStorage.getItem("carrinhoId") || ""));
                        window.scrollTo(0, 0);
                    }
                }}
            >
                <span>
                    <ShoppingCartOutlined
                        style={{ fontSize: "1.8rem", fontWeight: "bold" }}
                    />

                    <span
                        style={{
                            position: "absolute",
                            top: "-20px",
                            right: "-20px",
                            background: "red",
                            color: "#fff",
                            borderRadius: "50%",
                            minWidth: "26px",
                            height: "26px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.90rem",
                            fontWeight: "normal",
                            boxShadow: "0 0 0 1px #fff",
                        }}
                    >
                        {/* CartBadge mostra o total de itens do carrinho */}
                        <CartBadge
                            id={(sessionStorage.getItem("carrinhoId") ?? undefined) || ""}
                        />
                    </span>
                </span>
            </button>
        </a>
    );
}
