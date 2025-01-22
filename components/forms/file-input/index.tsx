"use client";

import { UseFormRegisterReturn } from "react-hook-form";
import Image from "next/image";
import { useState } from "react";

import uploadIcon from "../../../public/images/direct-inbox.svg";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  register?: UseFormRegisterReturn;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  previewUrls?: string[];
}

const FileInput = ({
  error,
  register,
  containerClassName = "flex flex-col",
  errorClassName = "text-red-300 text-sm",
  className,
  ...props
}: FileInputProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Asegurarnos de que el evento original se propague al register
    if (register?.onChange) {
      register.onChange(e);
    }

    console.log("Archivos seleccionados:", files);
    setIsLoading(true);
    setUploadComplete(false);

    // Crear URLs de previsualización
    const newPreviews = Array.from(files).map((file) =>
      URL.createObjectURL(file)
    );
    setPreviews(newPreviews);

    // Simulamos el progreso
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsLoading(false);
        setUploadComplete(true);
      }
    }, 100);
  };

  return (
    <div className={containerClassName}>
      <div className="relative">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          {...register}
          {...props}
          onChange={handleFileChange}
        />
        <div
          className={`bg-[#272A33] w-full border border-[#272A33] rounded-xl p-4 cursor-pointer hover:border-blue-500 transition-colors relative overflow-hidden ${
            className || ""
          }`}
          onClick={() =>
            (
              document.querySelector('input[type="file"]') as HTMLInputElement
            )?.click()
          }
        >
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-[#272A33] via-[#323642] to-[#272A33] animate-gradient" />
          )}

          <div className="relative z-10">
            {isLoading ? (
              <div className="flex items-center justify-start gap-2">
                <p className="text-sm text-[#FFFFFF]">
                  Cargando... {progress}%
                </p>
              </div>
            ) : uploadComplete ? (
              <div className="flex items-center justify-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-[#FFFFFF]">Carga completada</p>
              </div>
            ) : (
              <div className="flex items-center justify-start gap-2">
                <Image src={uploadIcon} alt="Upload" width={32} height={32} />
                <div>
                  <p className="text-sm text-[#FFFFFF]">
                    Haz clic o arrastra los archivos a esta área para cargarlo
                  </p>
                  <p className="text-xs text-[#9396A5]">
                    JPG, PNG, Tiff, hasta 2 mb
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Previsualización de imágenes */}
      {previews.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover rounded-lg"
              />
              <button
                className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                onClick={() => {
                  setPreviews((prev) => prev.filter((_, i) => i !== index));
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className={errorClassName}>{error}</p>}
    </div>
  );
};

export default FileInput;
