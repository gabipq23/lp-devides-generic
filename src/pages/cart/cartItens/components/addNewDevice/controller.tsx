
import { IDevices } from "@/interfaces/devices";
import React, { useState } from "react";

const normalizeAvailableColors = (colors: string[] | undefined) =>
  (colors ?? []).flatMap((color) =>
    color
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean),
  );

export function useAddNewDeviceController({
  products,
}: {
  products: IDevices[];
}) {
  const [showClearButton, setShowClearButton] = React.useState(false);
  const [selectedTipo, setSelectedTipo] = useState<string | undefined>();
  const [selectedMarca, setSelectedMarca] = useState<string | undefined>();
  const [selectedModelo, setSelectedModelo] = useState<string | undefined>();
  const [selectedCor, setSelectedCor] = useState<string | undefined>();

  // produtos filtrados com base nas seleções
  const filteredProducts = products?.filter((p: IDevices) => {
    const matchesTipo = selectedTipo ? p.type === selectedTipo : true;
    const matchesMarca = selectedMarca ? p.brand === selectedMarca : true;
    const matchesModelo = selectedModelo
      ? `${p.model ?? ""}` === selectedModelo
      : true;
    const matchesCor = selectedCor
      ? normalizeAvailableColors(p.available_colors).includes(selectedCor)
      : true;
    return matchesTipo && matchesMarca && matchesModelo && matchesCor;
  });

  // Tipo únicos com base no filtro atual
  const tipos = Array.from(
    new Set(
      filteredProducts?.filter((p) => p.online === true).map((p) => p.type)
    )
  ).map((tipo) => ({ label: tipo, value: tipo }));

  // marcas únicas com base no filtro atual
  const marcas = Array.from(
    new Set(
      filteredProducts?.filter((p) => p.online === true).map((p) => p.brand)
    )
  ).map((marca) => ({ label: marca, value: marca }));

  // modelos únicos com base no filtro atual
  const modelosSet = new Map<
    string,
    { label: string; value: string; preco?: number }
  >();
  filteredProducts?.forEach((p) => {
    if (p.online === true) {
      const modelo = `${p.model}`;
      if (!modelosSet.has(modelo)) {
        modelosSet.set(modelo, {
          label: modelo,
          value: modelo,
          preco: p.price_24x,
        });
      }
    }
  });
  const modelos = Array.from(modelosSet.values());

  // cores únicas com base no filtro atual
  const allCores = filteredProducts
    ?.flatMap((p) => normalizeAvailableColors(p?.available_colors))
    .filter((cor) => typeof cor === "string" && cor.trim() !== "");
  const coresUnicas = Array.from(new Set(allCores));
  const cores = coresUnicas.map((cor) => ({ label: cor, value: cor }));

  const clearFilter = () => {
    setSelectedMarca(undefined);
    setSelectedModelo(undefined);
    setSelectedTipo(undefined);
    setSelectedCor(undefined);
    setShowClearButton(false);
  };

  return {
    showClearButton,
    setShowClearButton,
    selectedTipo,
    setSelectedTipo,
    selectedMarca,
    setSelectedMarca,
    selectedModelo,
    setSelectedModelo,
    selectedCor,
    setSelectedCor,
    filteredProducts,
    tipos,
    marcas,
    modelos,
    cores,
    clearFilter,
  };
}
