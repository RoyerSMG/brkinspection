const pad = (n) => String(n).padStart(2, "0");

export const timestampGenerado = () =>
  "Generado: " + new Date().toLocaleString("es-CO");

/** ddmmyyyyhhmm (para el nombre del PNG) */
export const stampArchivo = (d = new Date()) =>
  pad(d.getDate()) + pad(d.getMonth() + 1) + d.getFullYear() +
  pad(d.getHours()) + pad(d.getMinutes());