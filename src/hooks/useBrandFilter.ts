import { useMemo, useState } from "react";
import type { MenuProps } from "antd";

type UseBrandFilterOptions<TItem> = {
  allBrandsLabel?: string;
  getBrand?: (item: TItem) => string | null | undefined;
  isOnline?: (item: TItem) => boolean;
};

const defaultGetBrand = <TItem>(item: TItem) => {
  const record = item as { brand?: string | null };
  return record.brand;
};

const defaultIsOnline = <TItem>(item: TItem) => {
  const record = item as { online?: boolean | null };
  return record.online === true;
};

export function useBrandFilter<TItem>(
  products: TItem[] | undefined,
  options: UseBrandFilterOptions<TItem> = {},
) {
  const {
    allBrandsLabel = "Filtro por marca",
    getBrand = defaultGetBrand,
    isOnline = defaultIsOnline,
  } = options;

  const [selectedBrand, setSelectedBrand] = useState<string>(allBrandsLabel);

  const safeProducts = products ?? [];

  const productFiltered = useMemo(() => {
    if (safeProducts.length === 0) return [];

    if (selectedBrand !== allBrandsLabel) {
      return safeProducts.filter(
        (product) =>
          getBrand(product) === selectedBrand && isOnline(product) === true,
      );
    }

    return safeProducts;
  }, [allBrandsLabel, getBrand, isOnline, safeProducts, selectedBrand]);

  const uniqueBrands = useMemo(
    () =>
      Array.from(
        new Set(
          safeProducts
            .filter((product) => isOnline(product) === true)
            .map((product) => getBrand(product))
            .filter(
              (brand): brand is string =>
                typeof brand === "string" && brand.trim().length > 0,
            ),
        ),
      ),
    [getBrand, isOnline, safeProducts],
  );

  const items: MenuProps["items"] = useMemo(
    () =>
      uniqueBrands.map((brand) => ({
        key: brand,
        label: brand,
        onClick: () => setSelectedBrand(brand),
      })),
    [uniqueBrands],
  );

  const resetSelectedBrand = () => setSelectedBrand(allBrandsLabel);

  return {
    selectedBrand,
    setSelectedBrand,
    resetSelectedBrand,
    uniqueBrands,
    items,
    productFiltered,
  };
}
