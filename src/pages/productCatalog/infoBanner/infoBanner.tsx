import { House, ShoppingCart, Truck } from "lucide-react";

function InfoBanner() {
  return (
    <div className=" my-14">
      <div className="flex flex-wrap items-center text-[16px] justify-center h-auto min-h-24 bg-white mx-20 my-8 p-6 rounded-[4px] border border-neutral-200 lg:flex-row  ">
        <div className="flex items-center justify-center gap-4 w-full min-h-16 mb-4 lg:w-52 lg:mb-0 lg:mr-16 text-[#262626]  flex-wrap">
          <span className="text-gray-300">
            <Truck />
          </span>
          <span className="w-32">
            <span className="font-bold">Frete grátis</span> para todo o Brasil
          </span>
        </div>

        <div className="flex items-center  flex-wrap justify-center gap-4 w-full lg:w-80 h-auto min-h-16 mb-4 lg:mb-0 text-[#262626]  ">
          <span className="text-gray-300">
            <House />
          </span>
          <span className="w-64">
            Parcele em
            <span className="font-bold"> até 10 vezes</span> sem juros direto na
            sua fatura Vivo
          </span>
        </div>

        <div className="flex items-center justify-center  gap-4 w-full lg:w-80  h-auto min-h-16 ml-0 lg:ml-14 text-[#262626] flex-wrap ">
          <span className="text-gray-300">
            <ShoppingCart />
          </span>
          <span className="flex items-center gap-2 w-36">
            Pagamento no cartão de crédito
          </span>
          <span className="flex gap-4">
            <img width={30} src="/assets/master1.png" />
            <img width={50} src="/assets/visa1.png" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default InfoBanner;
