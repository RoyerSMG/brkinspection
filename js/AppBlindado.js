import { renderHeader } from "./components/Header.js";
import { renderFooter } from "./components/Footer.js";
import { createImageBox } from "./components/ImageBox.js";
import { createToggleStatus } from "./components/ToggleStatus.js";
import { createEstadoSelect } from "./components/EstadoSelect.js";
import { fillCitySelect } from "./components/CitySelect.js";
import { createTipoRutaChips } from "./components/TipoRutaChips.js";
import { createTrayectoList } from "./components/TrayectoList.js";
import { createReportPreview } from "./components/ReportPreview.js";
import { ReportExporter } from "./services/ReportExporter.js";
import { createStore, createInitialState } from "./state/inspeccionstore.js";
import { bindFields } from "./utils/FormBinding.js";
import { ICONS } from "./config/icons.js";
import {
  CHECKLIST,
  ESTADOS_RUTA,
  TIPOS_RUTA,
  TIPO_MONEDA_BOR,
  TRIPULACION_LABELS,
} from "./config/BlindadoData.js";

// id del input en el HTML → clave en el store
const FIELD_MAP = [
  ["name_jt", "nameJt"],
  ["nameConductor", "nameConductor"],
  ["placa", "placa"],
  ["ciudad", "ciudad"],
  ["coordenadas", "coordenadas"],
  ["observacion", "observacion"],
];

const $ = (id) => document.getElementById(id);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function init() {
  renderHeader("app-header");
  renderFooter("app-footer");
  const store = createStore(createInitialState);

  /* ---------- Campos de texto: DOM → store ---------- */
  fillCitySelect($("ciudad"));

  const form = bindFields({
    map: FIELD_MAP,
    store,
    transforms: { placa: (v) => v.toUpperCase() },
  });

  /* ---------- Trayectos ---------- */
  const trayectos = createTrayectoList({
    container: $("trayectosContainer"),
    onChange: (lista) => store.set({ trayectos: lista }),
  });
  $("btnAddTrayecto")?.addEventListener("click", () => trayectos.add());

  /* ---------- Tipo de ruta ---------- */
  const aplicarTipo = (tipo) => {
    const esBor = tipo === TIPO_MONEDA_BOR;
    trayectos.setUseCities(esBor);
    if (esBor) trayectos.ensureOne();
  };

  const tipoChips = createTipoRutaChips({
    container: $("tipoOpciones"),
    tipos: TIPOS_RUTA,
    value: store.get().tipoRuta,
    onChange: (tipo) => {
      store.set({ tipoRuta: tipo });
      aplicarTipo(tipo);
    },
  });

  /* ---------- Checklist (generado desde CHECKLIST) ---------- */
  const checklist = $("checklistContainer");
  const toggles = new Map();

  CHECKLIST.forEach((item) => {
    const toggle = createToggleStatus({
      id: `chk${cap(item.key)}`,
      label: item.label,
      iconSvg: ICONS[item.icon],
      iconClass: item.iconClass,
      config: item.config,
      checked: store.get().checks[item.key],
      onChange: (checked) =>
        store.set({ checks: { ...store.get().checks, [item.key]: checked } }),
    });
    toggles.set(item.key, toggle);
    checklist.appendChild(toggle.element);
  });

  const estadoSelect = createEstadoSelect({
    estados: ESTADOS_RUTA,
    value: store.get().estadoId,
    onChange: (id) => store.set({ estadoId: id }),
  });
  checklist.appendChild(estadoSelect.element);

  /* ---------- Evidencias ---------- */
  const grid = $("gridEvidencias");
  const placeholderText = "Haz clic aquí y pega la imagen con Ctrl+V";

  const imgUbicacion = createImageBox({
    id: "boxUbicacion",
    label: "📍 Foto de ubicación",
    placeholderText,
    svgIcon: ICONS.pin,
    onChange: (src) => store.set({ imgUbicacion: src }),
  });
  const imgCctv = createImageBox({
    id: "boxCctv",
    label: "📷 Evidencia adicional (opcional)",
    placeholderText,
    svgIcon: ICONS.cctv,
    onChange: (src) => store.set({ imgCctv: src }),
  });
  grid.append(imgUbicacion.element, imgCctv.element);

  /* ---------- Preview + chrome del formulario ---------- */
  const preview = createReportPreview({ container: $("previewHtml") });

  const renderFormChrome = (s) => {
    const esBor = s.tipoRuta === TIPO_MONEDA_BOR;
    const labels = esBor ? TRIPULACION_LABELS.monedaBor : TRIPULACION_LABELS.default;

    $("cardChecklist").style.display = esBor ? "none" : "";
    $("cardTrayecto").style.display = esBor ? "" : "none";
    $("lblNameJt").textContent = labels.formJt;
    $("lblNameConductor").textContent = labels.formConductor;
  };

  store.subscribe((s) => {
    preview.render(s);
    renderFormChrome(s);
  });
  setInterval(preview.tick, 1000);

  /* ---------- Acciones ---------- */
  $("btnLimpiar").addEventListener("click", () => {
    store.reset();
    const s = store.get();

    form.sync(s);
    toggles.forEach((t) => t.set(false));
    estadoSelect.set(s.estadoId);
    tipoChips.setValue(s.tipoRuta);
    imgUbicacion.limpiar();
    imgCctv.limpiar();
    trayectos.setUseCities(false);
    trayectos.clear();
  });

  $("btnDescargar").addEventListener("click", () => {
    const { placa, tipoRuta } = store.get();
    ReportExporter.descargarPNG(
      "previewHtml",
      ReportExporter.buildFileName({ placa, tipoRuta }),
    );
  });

  $("btnCopiar").addEventListener("click", () =>
    ReportExporter.copiarAlPortapapeles("previewHtml"),
  );

  }

init();