import { useState } from "react";

type UseDisclosureOptions = {
  defaultOpen?: boolean;
};

export function useDisclosure(options: UseDisclosureOptions = {}) {
  const { defaultOpen = false } = options;
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((current) => !current);

  return {
    isOpen,
    setIsOpen,
    open,
    close,
    toggle,
  };
}
