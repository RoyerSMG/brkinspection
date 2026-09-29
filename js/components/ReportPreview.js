import {
  CHECKLIST,
  ESTADOS_RUTA,
  ESTADO_TRAYECTO,
  TIPO_MONEDA_BOR,
  TRIPULACION_LABELS,
} from "../config/BlindadoData.js";
import { ICONS, withStroke } from "../config/icons.js";
import { reportHeaderHtml, reportFooterHtml } from "./ReportParts.js";
import { timestampGenerado } from "../utils/formatters.js";

const chipId = (key) => `pvChk${key.charAt(0).toUpperCase()}${key.slice(1)}`;

const filasChecklistHtml = () =>
  CHECKLIST.map(
    (item) => `
      <div class="rpt-check-row">
        <span class="rpt-check-name">
          ${withStroke(ICONS[item.icon], item.previewStroke)}
          ${item.previewLabel ?? item.label}
        </span>
        <span class="rpt-chip" id="${chipId(item.key)}">${item.config.off}</span>
      </div>`,
  ).join("");

const template = () => `
  <div class="rpt">
    ${reportHeaderHtml({ tipoId: "pvTipoRuta" })}

    <div class="rpt-body">
      <div class="rpt-col">
        <div class="rpt-card" id="pvCardTripulacion">
          <div class="rpt-card-title">Datos de tripulación</div>
          <div class="rpt-fields" style="margin-top:8px">
            <div class="rpt-field"><label id="pvLblNameJt"></label><span id="pvName_jt">—</span></div>
            <div class="rpt-field"><label id="pvLblNameConductor"></label><span id="pvNameConductor">—</span></div>
          </div>
        </div>

        <div class="rpt-card">
          <div class="rpt-card-title">Datos del vehículo</div>
          <div class="rpt-fields">
            <div class="rpt-field"><label>Placa</label><span id="pvPlaca">—</span></div>
            <div class="rpt-field"><label>Ciudad Origen</label><span id="pvCiudad">—</span></div>
          </div>
          <div class="rpt-fields full" style="margin-top:8px">
            <div class="rpt-field"><label>Coordenadas GPS</label><span id="pvCoords">—</span></div>
          </div>
        </div>

        <div class="rpt-card" id="pvCardChecklist">
          <div class="rpt-card-title">Control inspeccionado</div>
          ${filasChecklistHtml()}
          <div class="rpt-check-row">
            <span class="rpt-check-name">${ICONS.status} Estado</span>
            <span class="rpt-chip" id="pvEstado"></span>
          </div>
        </div>

        <div class="rpt-card" id="pvCardTrayectos">
          <div class="rpt-card-title">Trayectos</div>
          <div id="pvTrayectos"></div>
        </div>

        <div class="rpt-card" id="pvCardObservacion">
          <div class="rpt-card-title">Observación</div>
          <div class="rpt-fields full">
            <div class="rpt-field"><span id="pvObservacion" style="font-size:11px;"></span></div>
          </div>
        </div>
      </div>

      <div class="rpt-col" id="colImages">
        <div class="rpt-card">
          <div class="rpt-card-title">📍 Foto de ubicación</div>
          <div class="rpt-img-box" id="pvImgUbicacion"></div>
        </div>
        <div class="rpt-card" id="pvCardCctv">
          <div class="rpt-card-title" id="pvLblCctvTitle">📷 Evidencia adicional</div>
          <div class="rpt-img-box" id="pvImgCctv"></div>
        </div>
      </div>
    </div>

    ${reportFooterHtml("pvGenerado")}
  </div>
`;

/**
 * Vista previa del reporte. Es PURA: solo pinta lo que recibe en `state`.
 * Retorna { render(state), tick() }
 */
export function createReportPreview({ container }) {
  container.innerHTML = template();
  const $ = (id) => container.querySelector(`#${id}`);

  const lastImg = new Map(); // evita re-crear <img> si el src no cambió

  const pintarImagen = (box, src, textoVacio) => {
    if (lastImg.get(box) === src) return;
    lastImg.set(box, src);

    if (!src) {
      const vacio = document.createElement("span");
      vacio.className = "rpt-img-empty";
      vacio.textContent = textoVacio;
      box.replaceChildren(vacio);
      return;
    }
    const img = document.createElement("img");
    img.src = src;
    img.style.cssText =
      "width:100%;height:100%;object-fit:cover;border-radius:6px;";
    box.replaceChildren(img);
  };

  const pintarTrayectos = (trayectos) => {
    const cont = $("pvTrayectos");
    if (trayectos.length === 0) {
      const vacio = document.createElement("span");
      vacio.className = "rpt-img-empty";
      vacio.textContent = "Sin trayectos";
      cont.replaceChildren(vacio);
      return;
    }

    cont.replaceChildren(
      ...trayectos.map((t, i) => {
        const tono =
          ESTADO_TRAYECTO.find((e) => e.value === t.estado)?.tono ?? "on";

        const row = document.createElement("div");
        row.className = "rpt-check-row";

        const name = document.createElement("span");
        name.className = "rpt-check-name";
        name.textContent = `Tramo ${i + 1}:`;

        const chip = document.createElement("span");
        chip.className = `rpt-chip rpt-chip-text ${tono}`;
        chip.textContent = `${t.origen || "—"} ─── 🚍 ────▶ ${t.destino || "—"}`;

        row.append(name, chip);
        return row;
      }),
    );
  };

  const render = (s) => {
    const esBor = s.tipoRuta === TIPO_MONEDA_BOR;
    const labels = esBor ? TRIPULACION_LABELS.monedaBor : TRIPULACION_LABELS.default;
    const jt = s.nameJt.trim();
    const conductor = s.nameConductor.trim();

    // Encabezado y datos
    $("pvTipoRuta").textContent = "RUTA " + s.tipoRuta.toUpperCase();
    $("pvPlaca").textContent = s.placa.trim() || "—";
    $("pvCiudad").textContent = s.ciudad.trim() || "—";
    $("pvCoords").textContent = s.coordenadas.trim() || "—";
    $("pvObservacion").textContent = s.observacion.trim() || "Sin observaciones.";

    // Tripulación
    $("pvCardTripulacion").style.display = jt || conductor ? "" : "none";
    $("pvLblNameJt").textContent = labels.pvJt;
    $("pvLblNameConductor").textContent = labels.pvConductor;
    $("pvName_jt").textContent = jt || "—";
    $("pvNameConductor").textContent = conductor || "—";

    // Checklist (todo desde CHECKLIST) + estado
    CHECKLIST.forEach((item) => {
      const checked = !!s.checks[item.key];
      const chip = $(chipId(item.key));
      chip.textContent = checked ? item.config.on : item.config.off;
      chip.className = `rpt-chip ${checked ? "on" : "off"}`;
    });

    const estado = ESTADOS_RUTA.find((e) => e.id === s.estadoId);
    const chipEstado = $("pvEstado");
    chipEstado.textContent = estado?.nombre ?? "—";
    chipEstado.className = `rpt-chip ${estado?.tono ?? "warning"}`;

    // Visibilidad según tipo de ruta
    $("pvCardChecklist").style.display = esBor ? "none" : "";
    $("pvCardTrayectos").style.display = esBor ? "" : "none";
    pintarTrayectos(s.trayectos);

    // Imágenes
    pintarImagen($("pvImgUbicacion"), s.imgUbicacion, "Sin imagen");
    pintarImagen($("pvImgCctv"), s.imgCctv, "Sin imagen");
    $("pvCardCctv").style.display = s.imgCctv ? "" : "none";
    $("colImages").classList.toggle("single-image", !s.imgCctv);

    $("pvGenerado").textContent = timestampGenerado();
  };

  const tick = () => ($("pvGenerado").textContent = timestampGenerado());

  return { render, tick };
}