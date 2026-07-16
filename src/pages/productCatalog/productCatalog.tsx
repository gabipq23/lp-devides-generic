import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InfoBanner from "./infoBanner/infoBanner";
import PhoneOffers from "./phoneOffers/phoneOffers";
import PhoneHighlights from "./phoneHighlights/phoneHighlights";
import AccessoriesOffers from "./accessoriesOffers/accessoriesOffers";
import { ArrowBigUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "antd";
import LayoutDefault from "./defaultLayout/layoutDefault";
import { useLocation } from "react-router-dom";
import Banner from "./banner/banner";
import { CartLink } from "./components/cartLink";
import { isCatalogPath } from "@/configs/partnerRuntime";
import { OtherTypeSection } from "./components/otherTypeSection";
import { usePartner } from "@/context/PartnerContext";

function ProductCatalog() {
  const [queryClient] = useState(() => new QueryClient());
  const [showScroll, setShowScroll] = useState(false);
  const location = useLocation();
  const { type } = usePartner();

  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        document
          .getElementById(location.state.scrollTo)
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location.state]);
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  const isCatalogRoute = isCatalogPath(location.pathname);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div>
          <LayoutDefault>
            <Banner />
            {type === "aparelhos" && <PhoneHighlights />}

            {typeof window !== "undefined" && showScroll && (
              <Button
                onClick={scrollToTop}
                style={{
                  position: "fixed",
                  bottom: 40,
                  zIndex: 1000,
                  background: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.6)",
                  width: "50px",
                  marginLeft: "8px",
                  backgroundColor: "#660099",
                  color: "white",
                }}
                variant="solid"
                color="purple"
                id="scrollToTopBtn"
              >
                <ArrowBigUp size={18} className="fill-white" />
              </Button>
            )}

            <InfoBanner />
            {type === "aparelhos" && <PhoneOffers />}
            {type === "aparelhos" && <AccessoriesOffers />}
            <OtherTypeSection />
          </LayoutDefault>
          {typeof window !== "undefined" &&
            showScroll &&
            (sessionStorage.getItem("carrinhoId") !== null
              ? isCatalogRoute && <CartLink />
              : null)}
        </div>
      </QueryClientProvider>
    </>
  );
}

export default ProductCatalog;
