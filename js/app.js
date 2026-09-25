import { renderHeader } from "./components/Header.js";
import { createImageBox } from "./components/ImageBox.js";
import { createToggleStatus } from "./components/ToggleStatus.js";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Renderizar Header
  renderHeader("app-header");

  // 2. Inicializar Sincronizadores de Preview
  initTripulacionPreview();
  initEvidenciasPreview();
  initChecklist();
});

/**
 * Controla la visualización dinámica de la Tripulación en el Preview
 */
function initTripulacionPreview() {
  const inputJt = document.getElementById("name_jt");
  const inputConductor = document.getElementById("nameConductor");
  const cardTripulacionPv = document.getElementById("pvCardTripulacion");
  const pvNameJt = document.getElementById("pvName_jt");
  const pvNameConductor = document.getElementById("pvNameConductor");

  if (!cardTripulacionPv) return;

  // Estado inicial
  cardTripulacionPv.style.display = "none";

  const actualizar = () => {
    const valJt = inputJt ? inputJt.value.trim() : "";
    const valConductor = inputConductor ? inputConductor.value.trim() : "";

    if (valJt !== "" || valConductor !== "") {
      cardTripulacionPv.style.display = "block";
      pvNameJt.innerText = valJt || "—";
      pvNameConductor.innerText = valConductor || "—";
    } else {
      cardTripulacionPv.style.display = "none";
    }
  };

  if (inputJt) inputJt.addEventListener("input", actualizar);
  if (inputConductor) inputConductor.addEventListener("input", actualizar);
}

/**
 * Controla la carga e inyección de los componentes de imagen (Ubicación y CCTV)
 */
function initEvidenciasPreview() {
  const gridContainer = document.getElementById("gridEvidencias");
  const cardCctvPreview = document.getElementById("pvCardCctv");
  const pvImgUbicacion = document.getElementById("pvImgUbicacion");
  const pvImgCctv = document.getElementById("pvImgCctv");

  if (!gridContainer) return;

  // Ocultar CCTV en preview inicialmente
  if (cardCctvPreview) cardCctvPreview.style.display = "none";

  const svgGps = `<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
  const svgCctv = `<svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`;

  // Instancia Ubicación
  const imgUbicacion = createImageBox({
    id: "boxUbicacion",
    label: "📍 Foto de ubicación",
    placeholderText: "Haz clic aquí y pega la imagen con Ctrl+V",
    svgIcon: svgGps,
    onChange: (src) => {
      if (!pvImgUbicacion) return;
      pvImgUbicacion.innerHTML = src
        ? `<img src="${src}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">`
        : `<span class="rpt-img-empty">Sin imagen</span>`;
    }
  });

  // Instancia CCTV
  const imgCctv = createImageBox({
    id: "boxCctv",
    label: "📷 Captura CCTV",
    placeholderText: "Haz clic aquí y pega la imagen con Ctrl+V",
    svgIcon: svgCctv,
    onChange: (src) => {
      if (!pvImgCctv || !cardCctvPreview) return;
      if (src) {
        cardCctvPreview.style.display = "block";
        pvImgCctv.innerHTML = `<img src="${src}" style="width:100%; height:100%; object-fit:cover; border-radius:6px;">`;
      } else {
        cardCctvPreview.style.display = "none";
        pvImgCctv.innerHTML = `<span class="rpt-img-empty">Sin conexión a video</span>`;
      }
    }
  });

  gridContainer.appendChild(imgUbicacion.element);
  gridContainer.appendChild(imgCctv.element);
}

function initChecklist() {
  const container = document.getElementById("checklistContainer");
  if (!container) return;

  const configToggles = [
    {
      id: "chkGps",
      label: "GPS",
      iconSvg: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>`,
      config: { on: "On Line", off: "Off Line" },
      pvId: "pvChkGps"
    },
    {
      id: "chkCctv",
      label: "CCTV",
      iconSvg: `<svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>`,
      config: { on: "On Line", off: "Off Line" },
      pvId: "pvChkCctv"
    },
    {
      id: "chkCerradura",
      label: "Cerradura",
      iconSvg: `<svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      config: { on: "Cerrada", off: "Abierta" },
      pvId: "pvChkCerradura"
    },
    {
      id: "chkExpuestos",
      label: "Expuestos (valores)",
      iconSvg: `<svg viewBox="0 0 24 24"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/></svg>`,
      config: { on: "Si", off: "No" },
      pvId: "pvChkExpuestos"
    },
    {
      id: "chkTripulacion",
      label: "Tripulación",
      iconSvg: `<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>`,
      config: { on: "Sin Novedad", off: "Con Novedad" },
      pvId: "pvChkTripulacion"
    }
  ];

  configToggles.forEach(item => {
    const toggle = createToggleStatus({
      id: item.id,
      label: item.label,
      iconSvg: item.iconSvg,
      config: item.config,
      onChange: (_, textEstado) => {
        // Actualiza automáticamente la etiqueta en el preview
        const pvEl = document.getElementById(item.pvId);
        if (pvEl) pvEl.innerText = textEstado;
      }
    });
    container.appendChild(toggle.element);
  });
}