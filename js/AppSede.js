import { renderHeader } from "./components/Header.js";
import { renderFooter } from "./components/Footer.js";
import { fillSelect } from "./components/Select.js";
import { createTipoRutaChips } from "./components/TipoRutaChips.js";
import { createFotosEditor } from "./components/FotosEditor.js";
import { createSedePreview } from "./components/SedePreview.js";
import { ReportExporter } from "./services/ReportExporter.js";
import { bindFields } from "./utils/FormBinding.js";
import {
  createStore,
  createInitialState,
  fotosActivas,
  fotosKey,
  nuevaFotoVertical,
} from "./state/SedeStore.js";
import { TIPOS_INSPECCION, ESTRUCTURAS_FOTOS } from "./config/SedeData.js";

// id del input en el HTML → clave en el store
const FIELD_MAP = [
  ["nombreSede", "nombreSede"],
  ["tipoInspeccion", "tipoInspeccion"],
  ["abonado", "abonado"],
  ["dispositivo", "dispositivo"],
  ["observacionSede", "observacion"],
];

const $ = (id) => document.getElementById(id);

function init() {
  renderHeader("app-header");
  renderFooter("app-footer");
  const store = createStore(createInitialState);

  /* ---------- Campos ---------- */
  fillSelect($("tipoInspeccion"), {
    placeholder: "Seleccione tipo de inspección",
    options: TIPOS_INSPECCION.map((t) => ({ value: t.value, label: t.value })),
  });
  const form = bindFields({ map: FIELD_MAP, store });

  /* ---------- Acciones sobre las fotos (todas escriben en el store) ---------- */
  const updateFoto = (id, patch) => {
    const s = store.get();
    const key = fotosKey(s);
    store.set({ [key]: s[key].map((f) => (f.id === id ? { ...f, ...patch } : f)) });
  };

  const removeFoto = (id) => {
    const s = store.get();
    if (s.fotosVerticales.length <= 1) return;
    store.set({ fotosVerticales: s.fotosVerticales.filter((f) => f.id !== id) });
  };

  const agregarFotoVertical = () => {
    const s = store.get();
    const seq = s.verticalSeq + 1;
    const nombre = `CCTV ${s.fotosVerticales.length + 1}`;
    store.set({
      verticalSeq: seq,
      fotosVerticales: [...s.fotosVerticales, nuevaFotoVertical(seq, nombre)],
    });
  };

  const editor = createFotosEditor({
    container: $("fotosFormContainer"),
    onChange: updateFoto,
    onRemove: removeFoto,
  });
  $("btnAgregarFoto").addEventListener("click", agregarFotoVertical);

  /* ---------- Estructura de fotos ---------- */
  const chips = createTipoRutaChips({
    container: $("estructuraOpciones"),
    tipos: ESTRUCTURAS_FOTOS,
    value: store.get().estructura,
    onChange: (estructura) => store.set({ estructura }),
  });

  /* ---------- Preview + render del editor ---------- */
  const preview = createSedePreview({ container: $("previewHtmlSede") });

  // El editor solo se reconstruye cuando cambia la "forma" (estructura + ids de fotos)
  let lastShape = null;
  store.subscribe((s) => {
    const fotos = fotosActivas(s);
    const shape = `${s.estructura}|${fotos.map((f) => f.id).join(",")}`;

    if (shape !== lastShape) {
      lastShape = shape;
      const vertical = s.estructura === "vertical";
      editor.render({
        fotos,
        gridClass: vertical ? "fotos-form-grid-vertical" : "fotos-form-grid-3",
        removable: vertical && fotos.length > 1,
      });
    }

    $("btnAgregarFoto").style.display = s.estructura === "vertical" ? "" : "none";
    preview.render(s);
  });
  setInterval(preview.tick, 1000);

  /* ---------- Acciones ---------- */
  $("btnLimpiar").addEventListener("click", () => {
    lastShape = null; // fuerza a reconstruir el editor (borra imágenes y nombres)
    store.reset();
    form.sync(store.get());
    chips.setValue(store.get().estructura);
  });

  $("btnDescargar").addEventListener("click", () =>
    ReportExporter.descargarPNG(
      "previewHtmlSede",
      ReportExporter.buildSedeFileName(store.get()),
    ),
  );

  $("btnCopiar").addEventListener("click", () =>
    ReportExporter.copiarAlPortapapeles("previewHtmlSede"),
  );
}

init();