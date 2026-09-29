import { CIUDADES } from "../config/BlindadoData.js";
import { fillSelect } from "./Select.js";

const opciones = CIUDADES.map((c) => ({ value: c, label: c }));

/** Llena un <select> existente con las ciudades */
export function fillCitySelect(select, value = "") {
  return fillSelect(select, { placeholder: "Seleccione ciudad", options: opciones, value });
}

/** Crea un <select> nuevo de ciudades */
export function createCitySelect({ className = "", id = "", value = "" } = {}) {
  const select = document.createElement("select");
  if (className) select.className = className;
  if (id) select.id = id;
  return fillCitySelect(select, value);
}