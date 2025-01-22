import * as yup from "yup";
import { DocumentType, DOC_TYPE } from "../constants/documents";

const registerFormSchema = yup.object().shape({
  name: yup.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .required("El nombre es requerido"),
  last_name: yup.string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .required("El apellido es requerido"),
  document_type: yup.string<DocumentType>()
    .oneOf(DOC_TYPE, "Tipo de documento inválido")
    .required("El tipo de documento es requerido"),
  doc_number: yup.string()
    .min(8, "El número de documento debe tener al menos 8 caracteres")
    .required("El número de documento es requerido"),
  email: yup.string()
    .email("Correo electrónico inválido")
    .required("El correo electrónico es requerido"),
  phone_number: yup.string()
    .matches(
      /^\+[\d\s-]{8,}$/,
      "El número de teléfono debe comenzar con + y tener al menos 8 dígitos"
    )
    .required("El número de teléfono es requerido"),
  photos: yup.mixed()
    .test("fileCount", "Puedes subir hasta 4 imágenes", function(value) {
      if (!value) return true;
      const files = Array.from(value as FileList);
      return files.length <= 4;
    })
    .test("fileType", "Solo se permiten imágenes", function(value) {
      if (!value) return true;
      const files = Array.from(value as FileList);
      return files.every(file => file.type.startsWith('image/'));
    })
    .test("fileSize", "Cada imagen debe ser menor a 2MB", function(value) {
      if (!value) return true;
      const files = Array.from(value as FileList);
      return files.every(file => file.size <= 2 * 1024 * 1024);
    }),
  use_same_billing_data: yup.boolean().default(false),
});

export type RegisterFormData = yup.InferType<typeof registerFormSchema>;

export default registerFormSchema;
