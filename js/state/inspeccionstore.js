import { CHECKLIST, ESTADO_DEFAULT_ID, TIPOS_RUTA } from "../config/BlindadoData.js";

/** Estado inicial (también se usa para "Limpiar todo") */
export const createInitialState = () => ({
  tipoRuta: TIPOS_RUTA[0],
  nameJt: "",
  nameConductor: "",
  placa: "",
  ciudad: "",
  coordenadas: "",
  observacion: "",
  checks: Object.fromEntries(CHECKLIST.map((i) => [i.key, false])),
  estadoId: ESTADO_DEFAULT_ID,
  trayectos: [], // [{ origen, destino, estado }]
  imgUbicacion: null, // dataURL | null
  imgCctv: null,
});

export { createStore } from "./CreateStore.js";