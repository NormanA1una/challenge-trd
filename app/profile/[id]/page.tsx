"use client";

import { supabase } from "@/lib/utils/supabase";
import Image from "next/image";
import { useEffect, useState } from "react";
import { use } from "react";
import useEmblaCarousel from "embla-carousel-react";
import InfoCard from "@/components/card/info-card";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { FlagImage } from "react-international-phone";

interface WeatherData {
  temperature: number;
  weathercode: number;
}

interface UserData {
  id: string;
  name: string;
  last_name: string;
  document_type: string;
  doc_number: string;
  email: string;
  phone_number: string;
  photos: string[];
  use_same_billing_data: boolean;
}

const getWeatherIcon = (code: number): string => {
  if (code === 0) return "☀️";
  if (code <= 3) return "🌤️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌧️";
  if (code <= 65) return "🌧️";
  if (code <= 75) return "🌨️";
  if (code === 95) return "⛈️";
  return "🌥️";
};

const ProfilePage = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log(userData);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.on("select", () => {
        setCurrentIndex(emblaApi.selectedScrollSnap());
      });
    }
  }, [emblaApi]);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data, error } = await supabase
        .from("user")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setUserData(data);
      }
      setLoading(false);
    };

    const getWeatherData = async (latitude: number, longitude: number) => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode`
        );
        const data = await response.json();
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weathercode: data.current.weathercode,
        });
      } catch (error) {
        console.error("Error al obtener el clima:", error);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
        }
      );
    }

    fetchUserData();
  }, [resolvedParams.id]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>Usuario no encontrado</div>;

  return (
    <div className="min-h-screen w-full bg-[#0F1115] text-white">
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <h1 className="text-xl sm:text-2xl font-bold mb-8 sm:mb-12 md:mb-16 text-center">
          TRD
        </h1>

        <div className="flex flex-col gap-4 sm:gap-6">
          {/* Header con nombre y clima */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                Hola, {userData.name} {userData.last_name}
              </h2>
            </div>
            {weather && (
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl">
                  {weather.temperature}°
                </span>
                <span className="text-3xl sm:text-4xl">
                  {getWeatherIcon(weather.weathercode)}
                </span>
              </div>
            )}
          </div>

          {/* Contenido */}
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Carrusel de fotos */}
            <div>
              <div className="relative">
                <div className="overflow-hidden rounded-lg" ref={emblaRef}>
                  <div className="flex">
                    {userData.photos.map((photo: string) => (
                      <div key={photo} className="flex-[0_0_100%] min-w-0">
                        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] mx-auto">
                          <Image
                            src={photo}
                            alt="Foto de perfil"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Navegación y controles */}
                <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6">
                  <button
                    onClick={scrollPrev}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#2A2D35] hover:bg-[#3A3D45] rounded-full transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M15 18L9 12L15 6"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {/* Indicadores */}
                  <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-1.5 sm:py-2 bg-[#2A2D35] rounded-full">
                    {userData.photos.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                          index === currentIndex ? "bg-white" : "bg-white/30"
                        }`}
                        onClick={() => emblaApi?.scrollTo(index)}
                      />
                    ))}
                  </div>

                  <button
                    onClick={scrollNext}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#2A2D35] hover:bg-[#3A3D45] rounded-full transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 6L15 12L9 18"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Datos del usuario y facturación */}
            <div className="flex flex-col gap-4 sm:gap-6">
              <div className="bg-[#181A1F] rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-normal text-[#9396A5] mb-4 sm:mb-6">
                  Información personal
                </h3>

                <div className="flex flex-col gap-6">
                  <InfoCard label="Nombre" value={userData.name} />
                  <InfoCard label="Apellido" value={userData.last_name} />
                  <InfoCard
                    label="Tipo de Documento"
                    value={userData.document_type}
                  />
                  <InfoCard
                    label="Número de Documento"
                    value={userData.doc_number}
                  />
                  <InfoCard label="Correo electrónico" value={userData.email} />

                  <div className="flex items-stretch gap-2">
                    <div className="bg-[#272A33] border border-[#272A33] rounded-xl flex items-center justify-center px-2 max-w-[74px] w-full">
                      <FlagImage
                        iso2={
                          parsePhoneNumberFromString(
                            userData.phone_number
                          )?.country?.toLowerCase() || ""
                        }
                        size="40px"
                      />
                    </div>
                    <InfoCard label="Teléfono" value={userData.phone_number} />
                  </div>
                </div>
              </div>

              <div className="bg-[#181A1F] rounded-xl p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-normal text-[#9396A5] mb-4 sm:mb-6">
                  Datos de facturación
                </h3>

                <div className="flex flex-col gap-6">
                  {userData.use_same_billing_data ? (
                    <>
                      <InfoCard label="Nombre" value={userData.name} />
                      <InfoCard label="Apellido" value={userData.last_name} />
                      <InfoCard
                        label="Tipo de Documento"
                        value={userData.document_type}
                      />
                      <InfoCard
                        label="Número de Documento"
                        value={userData.doc_number}
                      />
                      <InfoCard
                        label="Correo electrónico"
                        value={userData.email}
                      />
                      <div className="flex items-stretch gap-2">
                        <div className="bg-[#272A33] border border-[#272A33] rounded-xl flex items-center justify-center px-2 max-w-[74px] w-full">
                          <FlagImage
                            iso2={
                              parsePhoneNumberFromString(
                                userData.phone_number
                              )?.country?.toLowerCase() || ""
                            }
                            size="40px"
                          />
                        </div>
                        <InfoCard
                          label="Teléfono"
                          value={userData.phone_number}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <InfoCard label="Nombre" value={"Sin especificar"} />
                      <InfoCard label="Apellido" value={"Sin especificar"} />
                      <InfoCard
                        label="Tipo de Documento"
                        value={"Sin especificar"}
                      />
                      <InfoCard
                        label="Número de Documento"
                        value={"Sin especificar"}
                      />
                      <InfoCard
                        label="Correo electrónico"
                        value={"Sin especificar"}
                      />
                      <div className="flex items-stretch gap-2">
                        <div className="bg-[#272A33] border border-[#272A33] rounded-xl flex items-center justify-center px-2 max-w-[74px] w-full">
                          <span className="text-[#9396A5]">--</span>
                        </div>
                        <InfoCard label="Teléfono" value={"Sin especificar"} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
