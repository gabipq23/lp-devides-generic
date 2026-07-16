import "./global.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import ProductCatalog from "./pages/productCatalog/productCatalog";
import Cart from "./pages/cart/cart";
import OrderSummary from "./pages/orderSummary/orderSummary";
import { useEffect, useState } from "react";
// import { Bubble } from "@typebot.io/react";
import SendInfoModal from "./pages/productCatalog/sendInfo";
import { useAppController } from "./pages/productCatalog/controller";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createDefaultPartnerRuntime,
  persistPartnerRuntime,
  readPartnerRuntimeFromSession,
  resolvePartnerRuntimeFromPath,
} from "./configs/partnerRuntime";
import type { PartnerRuntime } from "./configs/partnerRuntime";
import { PartnerContext } from "./context/PartnerContext";

// Tipagem do botao do typeBote usado no botão 'Eu quero'
declare global {
  interface Window {
    Typebot?: {
      open: () => void;
    };
  }
}
// removido temporariamente
// function WhatsAppLink() {
//   const [cnpj, setCnpj] = useState("");
//   const [nome, setNome] = useState("");
//   const [tel, setTel] = useState("");

//   useEffect(() => {
//     const updateFields = () => {
//       setCnpj(sessionStorage.getItem("cnpjEmpresa") || "");
//       setNome(sessionStorage.getItem("nomeComprador") || "");
//       setTel(sessionStorage.getItem("telefoneComprador") || "");
//     };
//     updateFields();
//     window.addEventListener("storage", updateFields);
//     const interval = setInterval(updateFields, 500);
//     return () => {
//       window.removeEventListener("storage", updateFields);
//       clearInterval(interval);
//     };
//   }, []);

//   const msg = encodeURIComponent(
//     `Olá, poderia me ajudar? Meu CNPJ é:\n ${cnpj}\n e fiz contato com o nome: ${nome}\n e telefone: ${tel}`
//   );
//   const href = `https://wa.me/554340043123?text=${msg}`;

//   return (
//     <a
//       href={href}
//       target="_blank"
//       rel="noopener noreferrer"
//       style={{
//         position: "fixed",
//         bottom: "20px",
//         right: "22px",
//         background: "#25D366",
//         padding: "10px",
//         borderRadius: "16px",
//         boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
//         zIndex: 9999,
//       }}
//       aria-label="WhatsApp"
//     >
//       <svg
//         width="32"
//         height="32"
//         viewBox="0 0 32 32"
//         fill="white"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <path d="M16 3C9.373 3 4 8.373 4 15c0 2.65.87 5.1 2.36 7.13L4 29l7.13-2.36C12.9 27.13 14.45 27.5 16 27.5c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.37 0-2.72-.27-3.98-.8l-.28-.12-4.23 1.4 1.4-4.23-.12-.28C6.27 17.72 6 16.37 6 15c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.66 1.13 2.85.14.18 1.95 2.98 4.73 4.06.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z" />
//       </svg>
//     </a>
//   );
// }

function App() {
  const { updateData } = useAppController();

  const [queryClient] = useState(() => new QueryClient());
  const location = useLocation();
  const [isLargeScreen, setIsLargeScreen] = useState(
    () => window.innerWidth > 600
  );
  const [showModal, setShowModal] = useState(false);
  const [partnerRuntime, setPartnerRuntime] = useState<PartnerRuntime>(
    createDefaultPartnerRuntime(),
  );

  const [carrinhoId, setCarrinhoId] = useState(
    () => sessionStorage.getItem("carrinhoId") || ""
  );

  useEffect(() => {
    const checkCarrinhoId = () => {
      setCarrinhoId(sessionStorage.getItem("carrinhoId") || "");
    };
    window.addEventListener("storage", checkCarrinhoId);

    const interval = setInterval(checkCarrinhoId, 500);
    return () => {
      window.removeEventListener("storage", checkCarrinhoId);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    async function loadPartner() {
      try {
        const runtime = await resolvePartnerRuntimeFromPath(location.pathname);
        persistPartnerRuntime(runtime);
        setPartnerRuntime(runtime);
      } catch {
        setPartnerRuntime(readPartnerRuntimeFromSession());
      }
    }

    loadPartner();
  }, [location.pathname]);

  return (
    <PartnerContext.Provider
      value={{
        runtime: partnerRuntime,
        setRuntime: setPartnerRuntime,
      }}
    >
      <div className="flex flex-col bg-neutral-100 min-h-screen">
        {isLargeScreen ? (
          <>
            {/* {(!carrinhoId || carrinhoId === "") && (
            <div
              style={{
                position: "fixed",
                bottom: "20px",
                right: "22px",
                background: "#25D366",
                padding: "10px",
                borderRadius: "16px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                zIndex: 9999,
                cursor: "pointer",
              }}
              onClick={() => setShowModal(true)}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="white"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M16 3C9.373 3 4 8.373 4 15c0 2.65.87 5.1 2.36 7.13L4 29l7.13-2.36C12.9 27.13 14.45 27.5 16 27.5c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.37 0-2.72-.27-3.98-.8l-.28-.12-4.23 1.4 1.4-4.23-.12-.28C6.27 17.72 6 16.37 6 15c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.66 1.13 2.85.14.18 1.95 2.98 4.73 4.06.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z" />
              </svg>
            </div>
          )} */}

            {/* {carrinhoId && <WhatsAppLink />} */}

            <SendInfoModal
              setShowModal={setShowModal}
              updateData={updateData}
              showModal={showModal}
            />
            {/* {(!carrinhoId || carrinhoId === "") && (
            <div
              style={{
                position: "fixed",
                bottom: 20,
                right: 22,
                width: 50,
                height: 50,
                zIndex: 2147483647,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#128c7e",
                borderRadius: "35%",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              onClick={() => setShowModal(true)}
            >
              <svg
                viewBox="0 0 16 16"
                className="fill-transparent absolute duration-200 transition size-6 scale-100 opacity-100"
              >
                <path
                  d="M8 15C12.418 15 16 11.866 16 8C16 4.134 12.418 1 8 1C3.582 1 0 4.134 0 8C0 9.76 0.743 11.37 1.97 12.6C1.873 13.616 1.553 14.73 1.199 15.566C1.12 15.752 1.273 15.96 1.472 15.928C3.728 15.558 5.069 14.99 5.652 14.694C6.41791 14.8983 7.20732 15.0012 8 15Z"
                  fill="#fff"
                ></path>
              </svg>
            </div>
          )} */}

            {/* {carrinhoId && (
            <Bubble
              typebot="ativo-ee9rcpp"
              apiHost="https://bot-typebot.bigdates.com.br"
              theme={{ button: { backgroundColor: "#128c7e" } }}
              prefilledVariables={{
                CarrinhoId: sessionStorage.getItem("carrinhoId") || "",
                CnpjUser: sessionStorage.getItem("cnpjEmpresa") || "",
                NomeUser: sessionStorage.getItem("nomeComprador") || "",
                TelefoneUser: sessionStorage.getItem("telefoneComprador") || "",
              }}
            />
          )} */}
            {/* <SendInfoModal
            setShowModal={setShowModal}
            updateData={updateData}
            showModal={showModal}
          /> */}
          </>
        ) : (
          <>
            {(!carrinhoId || carrinhoId === "") && (
              <div
                style={{
                  position: "fixed",
                  bottom: "20px",
                  right: "22px",
                  background: "#25D366",
                  padding: "10px",
                  borderRadius: "16px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  zIndex: 9999,
                  cursor: "pointer",
                }}
                onClick={() => setShowModal(true)}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="white"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M16 3C9.373 3 4 8.373 4 15c0 2.65.87 5.1 2.36 7.13L4 29l7.13-2.36C12.9 27.13 14.45 27.5 16 27.5c6.627 0 12-5.373 12-12S22.627 3 16 3zm0 22c-1.37 0-2.72-.27-3.98-.8l-.28-.12-4.23 1.4 1.4-4.23-.12-.28C6.27 17.72 6 16.37 6 15c0-5.52 4.48-10 10-10s10 4.48 10 10-4.48 10-10 10zm5.07-7.75c-.28-.14-1.65-.81-1.9-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.18-.44-2.25-1.4-.83-.74-1.39-1.65-1.55-1.93-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.48.14-.16.18-.28.28-.46.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01-.18 0-.48.07-.73.34-.25.27-.97.95-.97 2.3 0 1.35.99 2.66 1.13 2.85.14.18 1.95 2.98 4.73 4.06.66.28 1.17.45 1.57.58.66.21 1.26.18 1.73.11.53-.08 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.25-.18-.53-.32z" />
                </svg>
              </div>
            )}

            {/* {carrinhoId && <WhatsAppLink />} */}
            <SendInfoModal
              setShowModal={setShowModal}
              updateData={updateData}
              showModal={showModal}
            />
          </>
        )}
        <QueryClientProvider client={queryClient}>
          <Header />

          <Routes>
            {/* Rota principal */}
            <Route path="/:type/:hash?/:version?" element={<ProductCatalog />} />
            <Route path="/:hash?/:version?" element={<ProductCatalog />} />

            {/* Rota para o carrinho */}
            <Route path="/:type?/:hash?/:version?/carrinho/:id" element={<Cart />} />
            {/* Rota para o pedido */}
            <Route path="/:type?/:hash?/:version?/pedido/:id" element={<OrderSummary />} />
          </Routes>
          <Footer />
        </QueryClientProvider>
        {/* componente do Toast. Só aparece quando da import no lugar desejado: "import { toast } from "sonner";" */}
        <div style={{ zIndex: 2147483647, position: "relative" }}>
          <Toaster
            position="bottom-right"
            richColors
            expand={true}
            visibleToasts={6}
            toastOptions={{
              style: {
                pointerEvents: "auto",
              },
            }}
          />
        </div>
      </div>
    </PartnerContext.Provider>
  );
}

export default App;
