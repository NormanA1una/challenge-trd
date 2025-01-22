export const DOC_TYPE = [
  "RUC",
  "DNI",
  "Pasaporte",
  "Cedula de Identidad",
  "Licencia de Conducir"
] as const;

export type DocumentType = typeof DOC_TYPE[number]; 