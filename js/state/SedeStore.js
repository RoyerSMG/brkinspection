import { ESTRUCTURA_DEFAULT, FOTOS_ESTRUCTURA_3 } from "../config/SedeData.js";

export { createStore } from "./CreateStore.js";

/**
 * Foto: { id, nombre, nombreBase, full, src }
 *  - nombre: lo que escribe el usuario · nombreBase: fallback si lo deja vacío
 */
export const nuevaFotoVertical = (n, nombre) => ({
  id: `fotoV${n}`,
  nombre,
  nombreBase: nombre,
  full: true,
  src: null,
});

export const createInitialState = () => ({
  estructura: ESTRUCTURA_DEFAULT,
  nombreSede: "",
  tipoInspeccion: "",
  abonado: "",
  dispositivo: "",
  observacion: "",
  // Cada estructura conserva sus fotos al cambiar de una a otra
  fotos3: FOTOS_ESTRUCTURA_3.map((f) => ({ ...f, nombreBase: f.nombre, src: null })),
  fotosVerticales: [nuevaFotoVertical(1, "CCTV")],
  verticalSeq: 1,
});

export const fotosKey = (s) => (s.estructura === "3fotos" ? "fotos3" : "fotosVerticales");
export const fotosActivas = (s) => s[fotosKey(s)];