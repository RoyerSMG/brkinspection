/* ============================================================
 * MASTER DATA — única fuente de verdad de catálogos y configuración
 * ============================================================ */

export const TIPO_MONEDA_BOR = "Moneda BOR";

export const NAV_LINKS = [
  { label: "Rutas", href: "inspBlindadoV3.html" },
  { label: "Sedes", href: "inspSedeV1.html" },
  { label: "Seguimiento", href: "index.html" },
];

// Unión de las dos listas que existían (sin duplicados, ordenada)
export const CIUDADES = [
  ...new Set([
    "Aguachica", "Barrancabermeja", "Barranquilla", "Bogotá", "Bucaramanga",
    "Buenaventura", "Cali", "Cartagena", "Caucasia", "Cúcuta", "Duitama",
    "Florencia", "Girardot", "Honda", "Ibagué", "Ipiales", "Manizales",
    "Medellín", "Montería", "Neiva", "Pasto", "Pereira", "Popayán", "Quibdó",
    "Riohacha", "Rionegro", "San Gil", "Santa Marta", "Sincelejo", "Tuluá",
    "Tumaco", "Tunja", "Valledupar", "Villavicencio", "Yopal", "Armenia",
  ]),
].sort((a, b) => a.localeCompare(b, "es"));

// Chips visibles en el formulario (orden original del HTML)
export const TIPOS_RUTA = [
  "Interurbana", "Urbana", "Aerea", "TAI", "Punto a punto",
  "Varada", "Cisterna", "Nocturna", TIPO_MONEDA_BOR,
];

// Ojo: Urbana, Aerea, Punto a punto y Varada no tienen id → el archivo sale con 0
export const TIPO_RUTA_ID = {
  Cisterna: 1,
  Interurbana: 2,
  Minerales: 3,
  "Moneda BOR": 4,
  Postobon: 5,
  Domesa: 6,
  "Alto Riesgo": 7,
  TAI: 8,
  Nocturna: 9,
};

// `tono` reemplaza el switch por texto de actualizarEstadoRuta()
export const ESTADO_DEFAULT_ID = 2;
export const ESTADOS_RUTA = [
  { id: 1, nombre: "Cargando", tono: "warning" },
  { id: 2, nombre: "En Ruta", tono: "warning" },
  { id: 3, nombre: "Detenida", tono: "warning" },
  { id: 4, nombre: "Varada", tono: "off" },
  { id: 5, nombre: "Siniestro", tono: "off" },
  { id: 6, nombre: "Pernocta", tono: "info" },
  { id: 7, nombre: "A tiempo", tono: "on" },
  { id: 8, nombre: "Con retraso", tono: "off" },
  { id: 9, nombre: "Cancelada", tono: "off" },
  { id: 10, nombre: "Realizada", tono: "on" },
];

export const ESTADO_TRAYECTO = [
  { value: "realizado", label: "Realizado", tono: "on" },
  { value: "pendiente", label: "Pendiente", tono: "warning" },
  { value: "cancelado", label: "Cancelado", tono: "off" },
];

/**
 * Checklist: alimenta el formulario (ToggleStatus) Y el preview.
 * Reemplaza TOGGLE_CONFIG, CHECKLIST_MAP y las filas escritas a mano.
 * OJO "expuestos": marcado = "No" (verde), sin marcar = "Si" (rojo).
 */
export const CHECKLIST = [
  { key: "gps", label: "GPS", icon: "gps", iconClass: "icon-gps",
    previewStroke: "#a5b4fc", config: { on: "On Line", off: "Off Line" } },
  { key: "cctv", label: "CCTV", icon: "cctv", iconClass: "icon-cctv",
    previewStroke: "#fdba74", config: { on: "On Line", off: "Off Line" } },
  { key: "cerradura", label: "Cerradura", icon: "lock", iconClass: "icon-lock",
    previewStroke: "#fca5a5", config: { on: "Cerrada", off: "Abierta" } },
  { key: "expuestos", label: "Expuestos (valores)", previewLabel: "Expuestos",
    icon: "money", iconClass: "icon-money", previewStroke: "#6ee7b7",
    config: { on: "No", off: "Si" } },
  { key: "tripulacion", label: "Tripulación", icon: "people", iconClass: "icon-people",
    previewStroke: "#c4b5fd", config: { on: "Sin Novedad", off: "Con Novedad" } },
];

export const TRIPULACION_LABELS = {
  default: {
    formJt: "Nombre Jefe de Tripulación",
    formConductor: "Nombre Conductor",
    pvJt: "Jefe tripulación",
    pvConductor: "Conductor",
  },
  monedaBor: {
    formJt: "Nombre Emisario",
    formConductor: "Teléfono",
    pvJt: "Emisario",
    pvConductor: "Teléfono",
  },
};