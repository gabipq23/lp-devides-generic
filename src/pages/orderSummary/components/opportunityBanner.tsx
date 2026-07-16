function OpportunityBanner() {
  return (
    <>
      <div className="flex mx-6 md:mx-15 lg:mx-20 pt-4 ">
        <div
          className=" bg-white p-2 lg:p-4 flex flex-wrap lg:flex-nowrap justify-around h-[360px] md:h-[320px] lg:h-[150px] text-[15px]
         text-neutral-800  rounded-[4px] border-1 w-full gap-4"
        >
          <div className="flex flex-col gap-2 items-center justify-center lg:w-1/5">
            <p className="text-[14px] text-neutral-800 ">
              Identificamos que há outras <strong>oportunidades </strong> de
              benefícios <strong>disponíveis</strong> para a empresa XXXXTTTT.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center  justify-evenly  lg:w-4/5">
            <div className="relative bg-neutral-100 border-1 text-neutral-800 flex flex-col justify-evenly items-center h-[120px] rounded-[4px] shadow-lg p-2 text-center">
              <div className="absolute -top-2 -left-2 bg-[#67119c] text-white text-[10px] px-3 py-1 rounded-[4px]">
                por tempo limitado
              </div>
              <p>Plano de celular 5G</p>
              <p className="text-[13px]">o mais rápido do mundo</p>
            </div>

            <div className="relative bg-neutral-100 border-1 text-neutral-800 flex flex-col justify-evenly items-center  h-[120px] rounded-[4px] shadow-lg p-2 text-center">
              <div className="absolute -top-2 -left-2 bg-[#67119c] text-white text-[10px] px-3 py-1 rounded-[4px]">
                melhor oferta
              </div>
              <p>Vivo Fibra </p>
              <p className="text-[13px]">instalação e wi-fi grátis</p>
            </div>

            <div className="relative bg-neutral-100 border-1 text-neutral-800 flex flex-col justify-evenly items-center  h-[120px] rounded-[4px] shadow-lg p-2 text-center">
              <div className="absolute -top-2 -left-2 bg-[#67119c] text-white text-[10px] px-3 py-1 rounded-[4px]">
                mais escolhido
              </div>
              <p>Plano de celular 5G</p>
              <p className="text-[13px]">o mais rápido do mundo</p>
            </div>

            <div className="relative bg-neutral-100 border-1 text-neutral-800 flex flex-col justify-evenly items-center  h-[120px] rounded-[4px] shadow-lg p-2 text-center">
              <div className="absolute -top-2 -left-2 bg-[#67119c] text-white text-[10px] px-3 py-1 rounded-[4px]">
                por tempo limitado
              </div>
              <p>Plano de celular 5G</p>
              <p className="text-[13px]">o mais rápido do mundo</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OpportunityBanner;
