import { Carousel, ConfigProvider } from "antd";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import type { CarouselRef } from "antd/es/carousel";
import { defaultBanner } from "@/configs/partnerRuntime";

function Banner() {
  const imagesMobile = defaultBanner.mobile;
  const imagesWeb = defaultBanner.desktop;

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const carouselRef = useRef<CarouselRef>(null);

  const arrowClass =
    "absolute top-1/2 transform -translate-y-1/2 text-white cursor-pointer bg-[#660099] hover:bg-[#660099c5] bg-opacity-40 rounded-full p-2 z-10";

  return (
    <ConfigProvider
      theme={{
        components: {
          Carousel: {
            arrowSize: 30,
            arrowOffset: 25,
          },
        },
      }}
    >
      <div className="relative">
        {/* Custom Left Arrow */}
        <button
          className={`${arrowClass} left-2`}
          onClick={() => carouselRef.current?.prev()}
        >
          <ChevronLeft size={22} className="text-white" />
        </button>

        {/* Custom Right Arrow */}
        <button
          className={`${arrowClass} right-2`}
          onClick={() => carouselRef.current?.next()}
        >
          <ChevronRight size={22} className="text-white" />
        </button>

        {/* Carousel with hidden default arrows */}
        <Carousel
          autoplay
          draggable
          ref={carouselRef}
          className="custom-carousel"
        >
          {imagesWeb.map((webSrc, index) => {
            const src = isMobile ? imagesMobile[index] : webSrc;
            return (
              <div
                key={index}
                className="w-full flex items-center justify-center bg-gray-200 relative"
                style={{ aspectRatio: "3/1", minHeight: 180 }}
              >
                <img
                  src={src}
                  alt={`banner-${index}`}
                  className="w-full object-contain"
                  style={
                    isMobile
                      ? { width: "100%", height: "100%", objectFit: "contain" }
                      : {
                        width: "100%",
                        height: "auto",
                        maxHeight: "clamp(180px, 30vw, 480px)",
                        aspectRatio: "3 / 1",
                        objectFit: "cover",
                      }
                  }
                />

              </div>
            );
          })}
        </Carousel>
      </div>
    </ConfigProvider>
  );
}

export default Banner;
