import { showToast } from "../components/Toast.js";

export const ReportExporter = {
  async descargarPNG(elementId, fileName) {
    const element = document.getElementById(elementId);
    if (!element) return showToast("No se encontró la vista previa");

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
      });
      const link = document.createElement("a");
      link.download = fileName;
      link.href = canvas.toDataURL("image/png");
      link.click();
      showToast("Reporte descargado correctamente");
    } catch (err) {
      showToast("Error al generar PNG");
    }
  },

  async copiarAlPortapapeles(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return showToast("No se encontró la vista previa");

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      canvas.toBlob((blob) => {
        if (!blob) return showToast("Error al procesar la imagen");
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]).then(() => {
          showToast("Imagen copiada al portapapeles");
        });
      });
    } catch (err) {
      showToast("No se pudo copiar la imagen");
    }
  },
};
