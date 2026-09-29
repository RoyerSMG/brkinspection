import { reportHeaderHtml, reportFooterHtml } from "./reportParts.js";
import { fotosActivas } from "../state/SedeStore.js";
import { timestampGenerado } from "../utils/formatters.js";

const template = () => `
  <div class="rpt">
    ${reportHeaderHtml({ tipoId: "pvTipoInspeccion", tipoText: "INSPECCIÓN DE SEDE" })}

    <div class="rpt-body">
      <div class="rpt-col">
        <div class="rpt-card">
          <div class="rpt-card-title">Datos de la sede</div>
          <div class="rpt-fields">
            <div class="rpt-field"><label>Nombre sede</label><span id="pvNombreSede">—</span></div>
            <div class="rpt-field"><label>Abonado</label><span id="pvAbonado">—</span></div>
          </div>
          <div class="rpt-fields full" style="margin-top:8px">
            <div class="rpt-field">
              <label>Dispositivo</label>
              <div class="containerDispositivo"><span id="pvDispositivo">—</span></div>
            </div>
          </div>
        </div>

        <div class="rpt-card">
          <div class="rpt-card-title">Observación</div>
          <div class="rpt-fields full">
            <div class="rpt-field"><span id="pvObservacionSede" style="font-size:11px;">Sin observaciones.</span></div>
          </div>
        </div>
      </div>

      <div class="rpt-col" id="colFotosPreview">
        <div id="pvFotosContainer" class="rpt-fotos-grid-3"></div>
      </div>
    </div>

    ${reportFooterHtml("pvGeneradoSede")}
  </div>
`;

/** Preview de Sedes. PURO: solo pinta el `state` recibido. Retorna { render, tick } */
export function createSedePreview({ container }) {
  container.innerHTML = template();
  const $ = (id) => container.querySelector(`#${id}`);

  // Las fotos solo se reconstruyen si cambió la estructura o el array (misma referencia = sin cambios)
  let lastFotos = null;
  let lastEstructura = null;

  const pintarFotos = (s) => {
    const fotos = fotosActivas(s);
    if (fotos === lastFotos && s.estructura === lastEstructura) return;
    lastFotos = fotos;
    lastEstructura = s.estructura;

    const es3 = s.estructura === "3fotos";
    const cont = $("pvFotosContainer");
    cont.className = es3 ? "rpt-fotos-grid-3" : "rpt-fotos-grid-vertical";

    cont.replaceChildren(
      ...fotos.map((f) => {
        const esFull = !es3 || f.full;

        const card = document.createElement("div");
        card.className = "rpt-card-foto" + (esFull ? " rpt-card-foto-full" : "");

        const title = document.createElement("div");
        title.className = "rpt-card-title";
        title.textContent = f.nombre.trim() || f.nombreBase;

        const box = document.createElement("div");
        box.className = "rpt-img-box";
        if (f.src) {
          const img = document.createElement("img");
          img.src = f.src;
          box.appendChild(img);
        } else {
          const vacio = document.createElement("span");
          vacio.className = "rpt-img-empty";
          vacio.textContent = "Sin imagen";
          box.appendChild(vacio);
        }

        card.append(title, box);
        return card;
      }),
    );
  };

  const render = (s) => {
    const tipo = s.tipoInspeccion.trim();
    $("pvTipoInspeccion").textContent = tipo ? tipo.toUpperCase() : "INSPECCIÓN DE SEDE";
    $("pvNombreSede").textContent = s.nombreSede.trim() || "—";
    $("pvAbonado").textContent = s.abonado.trim() || "—";
    $("pvDispositivo").textContent = s.dispositivo.trim() || "—";
    $("pvObservacionSede").textContent = s.observacion.trim() || "Sin observaciones.";
    $("pvGeneradoSede").textContent = timestampGenerado();
    pintarFotos(s);
  };

  const tick = () => ($("pvGeneradoSede").textContent = timestampGenerado());

  return { render, tick };
}