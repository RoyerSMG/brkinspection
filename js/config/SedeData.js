/* Catálogos de la página de Sedes */

// Orden alfabético (igual que el <select> original). El id NO se usa hoy en el nombre del PNG.
export const TIPOS_INSPECCION = [
  { value: "Estandar Seg. Electronica", id: 5 },
  { value: "Norma CRS", id: 2 },
  { value: "Retencion CCTV", id: 4 },
  { value: "Riesgo Critico", id: 3 },
  { value: "Seguimiento Visitante", id: 6 },
  { value: "Verifica Alerta", id: 1 },
];

export const TIPO_INSPECCION_ID = Object.fromEntries(
  TIPOS_INSPECCION.map((t) => [t.value, t.id]),
);

export const ESTRUCTURAS_FOTOS = [
  { value: "3fotos", label: "2 arriba + 1 abajo" },
  { value: "vertical", label: "Fotos verticales" },
];
export const ESTRUCTURA_DEFAULT = "3fotos";

// 2 fotos en fila + 1 abajo a todo el ancho
export const FOTOS_ESTRUCTURA_3 = [
  { id: "foto1", nombre: "Evidencia 1", full: false },
  { id: "foto2", nombre: "Evidencia 2", full: false },
  { id: "foto3", nombre: "Evidencia 3", full: true },
];