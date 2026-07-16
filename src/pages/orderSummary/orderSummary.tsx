import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import InfoPaymentChartPage from "./components/infoPaymentChartPage";
import { usePurchaseController } from "../cart/controller";

import { useParams } from "react-router-dom";
import { useState } from "react";

function OrderSummary() {
  const [queryClient] = useState(() => new QueryClient());
  const { id } = useParams();
  const { purchaseData } = usePurchaseController({ id });
  console.log("purchaseData", purchaseData);
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-[calc(100vh-112px)] flex flex-col">

          <InfoPaymentChartPage purchaseById={purchaseData?.order} />
        </div>
      </QueryClientProvider>
    </>
  );
}

export default OrderSummary;
