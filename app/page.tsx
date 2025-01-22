"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import registerFormSchema, {
  RegisterFormData,
} from "@/lib/schemas/registerForm";
import { DOC_TYPE } from "@/lib/constants/documents";
import { CountrySelector } from "react-international-phone";
import { supabase } from "@/lib/utils/supabase";

import "react-international-phone/style.css";

import Select from "@/components/forms/select";
import Input from "@/components/forms/input";
import FileInput from "@/components/forms/file-input";
import Checkbox from "@/components/forms/checkbox";

import loadingColors from "../public/images/loading-colors.png";
import Image from "next/image";

const HomePage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("ec");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerFormSchema),
    defaultValues: {
      document_type: DOC_TYPE[0],
      doc_number: "",
      email: "",
      phone_number: "",
      name: "",
      last_name: "",
      photos: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    const imageUrls: string[] = [];
    console.log("Fotos a subir:", data.photos);
    try {
      const formPhotos = data.photos as unknown as FileList;
      if (formPhotos?.length > 0) {
        for (const file of Array.from(formPhotos)) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2)}.${fileExt}`;
          const filePath = `public/${fileName}`;

          const { data: uploadData, error: uploadError } =
            await supabase.storage.from("trd_images").upload(filePath, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw uploadError;
          }

          if (uploadData) {
            const {
              data: { publicUrl },
            } = supabase.storage
              .from("trd_images")
              .getPublicUrl(uploadData.path);

            imageUrls.push(publicUrl);
          }
        }
      }

      console.log("Fotos a subir:", formPhotos);

      const payload = {
        ...data,
        photos: imageUrls,
      };

      console.log("Payload con imágenes:", payload);

      const res = await fetch("/api/save-user", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      const responseData = await res.json();
      setTimeout(() => router.push(`/profile/${responseData.id}`), 3000);
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center">
        <Image
          src={loadingColors}
          alt="Loading Colors"
          className="absolute inset-0 w-full h-full object-contain object-top pointer-events-none"
        />
        <div className="flex flex-col items-center gap-10 max-w-[300px] mx-auto">
          <span className="loader"></span>
          <p className="text-[27px] text-[#FFFFFF] text-center">
            Estamos validando tus datos
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center py-14">
      <div className="max-w-[695px] w-full mx-auto h-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-16">TRD</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 rounded-2xl w-full"
        >
          <div className="flex flex-col gap-4 bg-[#181A1F] py-6 px-4 w-full rounded-2xl">
            <div>
              <Input
                label="Nombre"
                register={register("name")}
                error={errors.name?.message}
                placeholder="Nombre"
              />
            </div>

            <div>
              <Input
                label="Apellido"
                register={register("last_name")}
                error={errors.last_name?.message}
                placeholder="Apellido"
              />
            </div>

            <div>
              <Select
                label="Tipo de Documento"
                register={register("document_type")}
                error={errors.document_type?.message}
                options={DOC_TYPE.map((type) => ({ value: type, label: type }))}
              />
            </div>

            <div>
              <Input
                label="Número de Documento"
                register={register("doc_number")}
                error={errors.doc_number?.message}
                placeholder="Número de Documento"
              />
            </div>

            <div>
              <Input
                label="Correo Electrónico"
                type="email"
                register={register("email")}
                error={errors.email?.message}
                placeholder="Correo Electrónico"
              />
            </div>

            <div className="flex gap-2 w-full">
              <div className="w-[70px]">
                <CountrySelector
                  selectedCountry={selectedCountryCode}
                  onSelect={(country) => {
                    setSelectedCountryCode(country.iso2);
                    setValue("phone_number", `+${country.dialCode}`);
                  }}
                />
              </div>
              <div className="flex-1">
                <Input
                  label="Número de Teléfono"
                  type="tel"
                  register={register("phone_number")}
                  error={errors.phone_number?.message}
                  placeholder="Número de Teléfono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-sm text-[#9396A5]">
                Carga hasta 4 imágenes para tu perfil
              </p>
              <FileInput
                register={register("photos")}
                error={errors.photos?.message}
                multiple
                accept="image/*"
                max={4}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 bg-[#181A1F] py-6 px-4 w-full rounded-2xl">
            <p className="text-sm text-[#9396A5]">Datos de facturación</p>

            <Checkbox
              label="Usar los mismos datos para la facturación"
              register={register("use_same_billing_data")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FCB115] text-black font-bold p-2 rounded hover:bg-[#FCB115]/80 disabled:bg-[#FCB115]/80"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
