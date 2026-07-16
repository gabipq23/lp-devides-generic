import SubHeader from "@/components/subHeader";
import FooterBanner from "../footerBanner/footerBanner";

export default function LayoutDefault({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SubHeader />

      {children}
      <FooterBanner />
    </>
  );
}
