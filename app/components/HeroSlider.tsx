"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Slider from "react-slick";

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

export default function HeroSlider() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch('/api/banners');
        if (res.ok) setBanners(await res.json());
      } catch (error) {
        console.error("Failed to fetch banners");
      } finally {
        setLoading(false);
      }
    }
    fetchBanners();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    appendDots: (dots: any) => (
      <div style={{ bottom: "30px" }}>
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
  };

  if (loading) {
    return <div className="w-full h-[400px] bg-gray-100 animate-pulse flex items-center justify-center text-gray-400">Loading Banners...</div>;
  }

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full overflow-hidden bg-secondary">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner._id} className="relative w-full h-[400px] md:h-[550px] outline-none">
            {banner.image && (
              <Image 
                src={banner.image} 
                alt={banner.title} 
                fill 
                className="object-cover" 
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="absolute inset-0 container mx-auto px-4 flex flex-col justify-center items-center text-center z-10">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg">{banner.title}</h2>
              <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-2xl drop-shadow-md">{banner.subtitle}</p>
              <Link href={banner.link || "/shop"}>
                <button className="bg-[#006a55] text-white px-8 py-3 rounded-full font-bold hover:bg-[#005544] transition-all flex items-center gap-2 shadow-lg">
                  Shop Now <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}