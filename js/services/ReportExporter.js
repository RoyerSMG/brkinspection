import { showToast } from "../components/Toast.js";
import { TIPO_RUTA_ID } from "../config/BlindadoData.js";
import { stampArchivo } from "../utils/formatters.js";

// html2canvas se carga como script global en el HTML
const capturar = (element, opts = {}) => html2canvas(element, { scale: 2, ...opts });

export const ReportExporter = {
  /** placa + ddmmyyyyhhmm + idTipoRuta + .png  (antes enterrado en generarReporte) */
  buildFileName({ placa, tipoRuta }) {
    const id = TIPO_RUTA_ID[tipoRuta] || 0;
    return `${placa || "SINPLACA"}${stampArchivo()}${id}.png`;
  },

  /** abonado + dispositivo + ddmmyyyyhhmm + .png  (espacios → _) */
  buildSedeFileName({ abonado, dispositivo }) {
    const limpio = (v, def) => (v || "").trim().replace(/\s+/g, "_") || def;
    return `${limpio(abonado, "abonado")}${limpio(dispositivo, "dispositivo")}${stampArchivo()}.png`;
  },

  async descargarPNG(elementId, fileName) {
    const element = document.getElementById(elementId);
    if (!element) return showToast("No se encontró la vista previa");

    try {
      const canvas = await capturar(element, { useCORS: true, backgroundColor: null });
      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("Reporte generado correctamente");
    } catch (err) {
      console.error(err);
      showToast("Error al generar PNG");
    }
  },

  async copiarAlPortapapeles(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return showToast("No se encontró la vista previa");
    if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
      return showToast("Tu navegador no permite copiar imágenes");
    }

    try {
      // Sin backgroundColor:null a propósito: el portapapeles necesita fondo opaco
      const canvas = await capturar(element);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) return showToast("Error al procesar la imagen");

      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      showToast("Imagen copiada al portapapeles");
    } catch (err) {
      console.error(err);
      showToast("No se pudo copiar la imagen");
    }
  },
};