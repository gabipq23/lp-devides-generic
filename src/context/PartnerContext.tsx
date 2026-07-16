import { createContext, useContext } from "react";
import {
  createDefaultPartnerRuntime,
  PartnerRuntime,
} from "@/configs/partnerRuntime";

type PartnerContextData = {
  runtime: PartnerRuntime;
  setRuntime: React.Dispatch<React.SetStateAction<PartnerRuntime>>;
};

type UsePartnerReturn = PartnerRuntime & {
  runtime: PartnerRuntime;
  setRuntime: React.Dispatch<React.SetStateAction<PartnerRuntime>>;
};

export const PartnerContext = createContext<PartnerContextData>({
  runtime: createDefaultPartnerRuntime(),
  setRuntime: () => { },
});

export function usePartner() {
  const context = useContext(PartnerContext);

  return {
    ...context.runtime,
    runtime: context.runtime,
    setRuntime: context.setRuntime,
  } as UsePartnerReturn;
}