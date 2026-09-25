const Inspecciones = (() => {
  /* ============================================================
   * 1. CONFIGURACIÓN Y CONSTANTES
   * ============================================================= */
  const FORM_FIELDS = [
    "placa",
    "ciudad",
    "coordenadas",
    "fecha",
    "observacion",
    "name_jt",
    "nameConductor",
  ];

  const CIUDADES = [
    "Aguachica",
    "Barrancabermeja",
    "Barranquilla",
    "Bogotá",
    "Bucaramanga",
    "Cali",
    "Cartagena",
    "Caucasia",
    "Cúcuta",
    "Duitama",
    "Girardot",
    "Honda",
    "Ibagué",
    "Ipiales",
    "Manizales",
    "Medellín",
    "Montería",
    "Neiva",
    "Pasto",
    "Pereira",
    "Popayán",
    "Quibdó",
    "Riohacha",
    "Rionegro",
    "San Gil",
    "Santa Marta",
    "Sincelejo",
    "Tuluá",
    "Tumaco",
    "Valledupar",
    "Villavicencio",
    "Yopal",
    "Armenia",
    "Florencia",
    "Tunja",
    "Buenaventura",
  ];

  const TIPO_RUTA_ID = {
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

  const TOGGLE_CONFIG = {
    chkGps: { on: "On Line", off: "Off Line" },
    chkCctv: { on: "On Line", off: "Off Line" },
    chkCerradura: { on: "Cerrada", off: "Abierta" },
    chkExpuestos: { on: "No", off: "Si" },
    chkTripulacion: { on: "Sin Novedad", off: "Con Novedad" },
  };

  const ESTADOS_RUTA = [
    { id: 1, nombre: "Cargando" },
    { id: 2, nombre: "En Ruta" },
    { id: 3, nombre: "Detenida" },
    { id: 4, nombre: "Varada" },
    { id: 5, nombre: "Siniestro" },
    { id: 6, nombre: "Pernocta" },
    { id: 7, nombre: "A tiempo" },
    { id: 8, nombre: "Con retraso" },
    { id: 9, nombre: "Cancelada" },
    { id: 10, nombre: "Realizada" },
  ];

  const ESTADO_TRAYECTO_COLOR = {
    realizado: "on", // verde
    pendiente: "warning", // amarillo
    cancelado: "off", // rojo
  };

  const CHECKLIST_MAP = {
    pvChkGps: ["chkGps", "lblGps"],
    pvChkCctv: ["chkCctv", "lblCctv"],
    pvChkCerradura: ["chkCerradura", "lblCerradura"],
    pvChkExpuestos: ["chkExpuestos", "lblExpuestos"],
    pvChkTripulacion: ["chkTripulacion", "lblTripulacion"],
  };

  // ============================================================
  // UTILIDADES GENERALES
  // ============================================================

  /**
   * Obtiene un elemento del DOM por su ID.
   * @param {string} id - ID del elemento.
   * @returns {HTMLElement|null}
   */
  const getEl = (id) => document.getElementById(id);

  const setText = (id, value) => {
    const el = getEl(id);
    if (el) el.innerText = value;
  };

  const formatearFecha = (rawDate) => {
    if (!rawDate) return "—";
    return new Date(rawDate).toLocaleString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const timestampGenerado = () =>
    "Generado: " + new Date().toLocaleString("es-CO");

  const crearSelectCiudad = (clase, valorActual = "") => {
    const select = document.createElement("select");
    select.className = clase;

    const optDefault = document.createElement("option");
    optDefault.value = "";
    optDefault.textContent = "Seleccione ciudad";
    optDefault.disabled = true;
    optDefault.selected = !valorActual;
    select.appendChild(optDefault);

    CIUDADES.forEach((ciudad) => {
      const opt = document.createElement("option");
      opt.value = ciudad;
      opt.textContent = ciudad;
      if (ciudad === valorActual) opt.selected = true;
      select.appendChild(opt);
    });

    return select;
  };

  /** Poblador dinámico del select principal de ciudad */
  const poblarSelectCiudadPrincipal = () => {
    const select = getEl("ciudad");
    if (!select) return;
    select.innerHTML =
      '<option value="" disabled selected>Seleccione ciudad</option>';
    CIUDADES.forEach((ciudad) => {
      const opt = document.createElement("option");
      opt.value = ciudad;
      opt.textContent = ciudad;
      select.appendChild(opt);
    });
  };

  // ============================================================
  // 3. ACTUALIZACIÓN VISUAL Y FORMULARIO
  // ============================================================

  const actualizarVisibilidadTripulacion = (name_jt, nameConductor) => {
    const card = getEl("pvCardTripulacion");
    if (!card) return;
    const hayDatos = name_jt !== "—" || nameConductor !== "—";
    card.style.display = hayDatos ? "" : "none";
  };

  const actualizarLabelsTripulacion = (tipoRuta) => {
    const esMonedaBor = tipoRuta === "Moneda BOR";
    setText(
      "lblNameJt",
      esMonedaBor ? "Nombre Emisario" : "Nombre Jefe de Tripulación",
    );
    setText("lblNameConductor", esMonedaBor ? "Teléfono" : "Nombre Conductor");
    setText("pvLblNameJt", esMonedaBor ? "Emisario" : "Jefe tripulación");
    setText("pvLblNameConductor", esMonedaBor ? "Teléfono" : "Conductor");
  };

  const actualizarCardsPorTipo = (tipoRuta) => {
    const esMonedaBor = tipoRuta === "Moneda BOR";

    // Vista principal
    const checklist = getEl("cardChecklist");
    const trayecto = getEl("cardTrayecto");
    if (checklist) checklist.style.display = esMonedaBor ? "none" : "";
    if (trayecto) trayecto.style.display = esMonedaBor ? "block" : "none";

    // Preview
    const pvChecklist = getEl("pvCardChecklist");
    const pvTrayectos = getEl("pvCardTrayectos");
    if (pvChecklist) pvChecklist.style.display = esMonedaBor ? "none" : "";
    if (pvTrayectos) pvTrayectos.style.display = esMonedaBor ? "block" : "none";

    // Manejo de trayectos para Moneda BOR
    if (esMonedaBor) {
      const container = getEl("trayectosContainer");
      if (container && container.children.length === 0) {
        agregarTrayecto();
      }

      document.querySelectorAll(".trayecto-row").forEach((row) => {
        ["origen", "destino"].forEach((clase) => {
          const actual = row.querySelector(`.${clase}`);
          if (actual && actual.tagName === "INPUT") {
            const nuevo = crearSelectCiudad(clase, actual.value);
            actual.replaceWith(nuevo);
          }
        });
      });
    }
  };

  const agregarTrayecto = () => {
    const container = getEl("trayectosContainer");
    if (!container) return;

    const tipoRuta = document.querySelector(".tipo-chip.selected")?.dataset
      .value;
    const esMonedaBor = tipoRuta === "Moneda BOR";

    const row = document.createElement("div");
    row.className = "trayecto-row field-row";

    row.innerHTML = `
      <div class="trayecto-row-inner">
        <div class="field"><label>Origen</label></div>
        <div class="field"><label>Destino</label></div>
        <div class="field">
          <label>Estado</label>
          <select class="estado">
            <option value="realizado" selected>Realizado</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
        <button type="button" class="btn-remove-trayecto" title="Eliminar trayecto">✕</button>
      </div>
    `;

    const fields = row.querySelectorAll(".field");
    const origenField = esMonedaBor
      ? crearSelectCiudad("origen")
      : Object.assign(document.createElement("input"), {
          type: "text",
          className: "origen",
        });
    const destinoField = esMonedaBor
      ? crearSelectCiudad("destino")
      : Object.assign(document.createElement("input"), {
          type: "text",
          className: "destino",
        });

    fields[0].appendChild(origenField);
    fields[1].appendChild(destinoField);

    row.querySelector(".btn-remove-trayecto").addEventListener("click", () => {
      row.remove();
      actualizarTrayectosPreview();
    });

    container.appendChild(row);
    actualizarTrayectosPreview();
  };

  const actualizarTrayectosPreview = () => {
    const contenedor = getEl("trayectosContainer");
    const pvContenedor = getEl("pvTrayectos");

    if (!contenedor || !pvContenedor) return;

    const trayectos = contenedor.querySelectorAll(".trayecto-row");
    if (trayectos.length === 0) {
      pvContenedor.innerHTML = `<span class="rpt-img-empty">Sin trayectos</span>`;
      return;
    }

    pvContenedor.innerHTML = "";

    trayectos.forEach((row, index) => {
      const origen = row.querySelector(".origen")?.value || "—";
      const destino = row.querySelector(".destino")?.value || "—";
      const estado = row.querySelector(".estado")?.value || "realizado";
      const colorClass = ESTADO_TRAYECTO_COLOR[estado] || "on";

      const div = document.createElement("div");
      div.className = "rpt-check-row";
      div.innerHTML = `
        <span class="rpt-check-name">Tramo ${index + 1}:</span>
        <span class="rpt-chip rpt-chip-text ${colorClass}">
          ${origen} ─── 🚍 ────▶ ${destino}
        </span>
      `;
      pvContenedor.appendChild(div);
    });
  };

  const actualizarCctvPorTipo = () => {
    const lblForm = getEl("lblCctvTitle");
    const lblPreview = getEl("pvLblCctvTitle");
    const cardPv = getEl("pvCardCctv");

    if (!lblForm || !lblPreview || !cardPv) return;

    const hayImagen = !!document.querySelector("#boxCctv img");
    lblForm.innerText = "📷 Evidencia adicional (opcional)";
    lblPreview.innerText = "📷 Evidencia adicional";
    cardPv.style.display = hayImagen ? "" : "none";
  };

  const ajustarAlturaImagenesPreview = () => {
    const col = getEl("colImages");
    if (!col) return;

    const visibles = Array.from(col.querySelectorAll(".rpt-card")).filter(
      (card) => card.style.display !== "none",
    );

    col.classList.toggle("single-image", visibles.length === 1);
  };

  const actualizarEstadoRuta = () => {
    const estado = getEl("selEstado");
    if (!estado) return;

    const texto = estado.options[estado.selectedIndex].text;
    setText("pvEstado", texto);

    const chip = getEl("pvEstado");
    if (!chip) return;

    chip.className = "rpt-chip";

    switch (texto) {
      case "Cargando":
      case "En Ruta":
      case "Detenida":
        chip.classList.add("warning");
        break;
      case "Varada":
      case "Siniestro":
      case "Con retraso":
      case "Cancelada":
        chip.classList.add("off");
        break;
      case "A tiempo":
      case "Realizada":
        chip.classList.add("on");
        break;
      case "Pernocta":
        chip.classList.add("info");
        break;
      default:
        chip.classList.add("warning");
    }
  };

  // ============================================================
  // 4. PREVIEW EN TIEMPO REAL
  // ============================================================

  const actualizarPreview = () => {
    const name_jt = getEl("name_jt")?.value.trim() || "—";
    const nameConductor = getEl("nameConductor")?.value.trim() || "—";
    const placa = getEl("placa")?.value.trim() || "—";
    const ciudad = getEl("ciudad")?.value.trim() || "—";
    const coords = getEl("coordenadas")?.value.trim() || "—";
    const observacion =
      getEl("observacion")?.value.trim() || "Sin observaciones.";
    const tipoRuta =
      document.querySelector(".tipo-chip.selected")?.dataset.value || "—";
    const fechaStr = formatearFecha(getEl("fecha")?.value);

    setText("pvName_jt", name_jt);
    setText("pvNameConductor", nameConductor);
    setText("pvPlaca", placa);
    setText("pvCiudad", ciudad);
    setText("pvCoords", coords);
    setText("pvObservacion", observacion);
    setText("pvFecha", fechaStr);
    setText("pvTipoRuta", "RUTA " + tipoRuta.toUpperCase());
    setText("pvGenerado", timestampGenerado());

    actualizarVisibilidadTripulacion(name_jt, nameConductor);
    actualizarLabelsTripulacion(tipoRuta);
    actualizarChecklistPreview();
    actualizarEstadoRuta();
    actualizarImgPreview("boxUbicacion", "pvImgUbicacion");
    actualizarImgPreview("boxCctv", "pvImgCctv", "CCTV Offline");
    actualizarCardsPorTipo(tipoRuta);
    actualizarTrayectosPreview();
    actualizarCctvPorTipo();
    ajustarAlturaImagenesPreview();
  };

  const actualizarChecklistPreview = () => {
    Object.entries(CHECKLIST_MAP).forEach(([pvId, [chkId, lblId]]) => {
      const chip = getEl(pvId);
      if (!chip) return;

      const checked = getEl(chkId)?.checked;
      const label = getEl(lblId)?.innerText || "";

      chip.innerText = label;
      chip.className = "rpt-chip " + (checked ? "on" : "off");
    });
  };

  const actualizarImgPreview = (boxId, pvId, textoDefault = "GPS Ofline") => {
    const src = document.querySelector(`#${boxId} img`)?.src;
    const box = getEl(pvId);
    if (!box) return;

    box.innerHTML = src
      ? `<img src="${src}" style="width:100%;height:100%;object-fit:cover;">`
      : `<span class="rpt-img-empty">${textoDefault}</span>`;
  };

  // ============================================================
  // 5. GENERACIÓN Y COPIA DE REPORTE PNG
  // ============================================================

  const generarReporte = () => {
    const preview = getEl("previewHtml");
    if (!preview) return mostrarToast("No se encontró el preview");

    html2canvas(preview, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    }).then((canvas) => {
      const placa = getEl("placa")?.value || "SINPLACA";
      const ahora = new Date();
      const fechaHora =
        String(ahora.getDate()).padStart(2, "0") +
        String(ahora.getMonth() + 1).padStart(2, "0") +
        ahora.getFullYear() +
        String(ahora.getHours()).padStart(2, "0") +
        String(ahora.getMinutes()).padStart(2, "0");

      const tipoRuta =
        document.querySelector(".tipo-chip.selected")?.dataset.value || "";
      const idTipoRuta = TIPO_RUTA_ID[tipoRuta] || 0;
      const nombreArchivo = `${placa}${fechaHora}${idTipoRuta}.png`;

      const link = document.createElement("a");
      link.download = nombreArchivo;
      link.href = canvas.toDataURL("image/png");
      link.click();

      mostrarToast("Reporte generado correctamente");
    });
  };

  const copiarPreview = () => {
    const preview = getEl("previewHtml");
    if (!preview) return mostrarToast("No se encontró el preview");

    html2canvas(preview, { scale: 2 }).then((canvas) =>
      canvas.toBlob((blob) => {
        if (!blob) return mostrarToast("Error al copiar");
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard
          .write([item])
          .then(() => mostrarToast("Imagen copiada"))
          .catch(() => mostrarToast("No se pudo copiar"));
      }),
    );
  };

  const mostrarToast = (msg) => {
    const toast = getEl("toast");
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2000);
  };
  // ============================================================
  // 6. CONTROLADORES DE EVENTOS E INTERFAZ
  // ============================================================

  const updateToggle = (el) => {
    const config = TOGGLE_CONFIG[el.id];
    const label = el.closest(".toggle-wrap")?.querySelector(".toggle-estado");

    if (!config || !label) return;

    label.innerText = el.checked ? config.on : config.off;
    label.className = `toggle-estado ${el.checked ? "on" : "off"}`;

    actualizarPreview();
  };

  const focoImagen = (id) => getEl(id)?.focus();

  const pegarImagen = (e, id) => {
    e.preventDefault();
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith("image"));

    if (!imageItem) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const box = getEl(id);
      if (!box) return;

      box.querySelector("img")?.remove();
      const ph = box.querySelector(".img-placeholder");
      if (ph) ph.style.display = "none";

      const img = Object.assign(document.createElement("img"), {
        src: event.target.result,
      });
      img.style.cssText = "width:100%;height:100%;object-fit:cover;";
      box.appendChild(img);

      actualizarPreview();
    };

    reader.readAsDataURL(imageItem.getAsFile());
  };

  const limpiarImagen = (id) => {
    const box = getEl(id);
    if (!box) return;

    box.querySelector("img")?.remove();
    const ph = box.querySelector(".img-placeholder");
    if (ph) ph.style.display = "flex";

    actualizarPreview();
  };

  const seleccionarTipo = (el) => {
    document
      .querySelectorAll(".tipo-chip")
      .forEach((chip) => chip.classList.remove("selected"));
    el.classList.add("selected");
    actualizarPreview();
  };

  const limpiarFormulario = () => {
    FORM_FIELDS.forEach((id) => {
      const el = getEl(id);
      if (el) el.value = "";
    });

    inicializarFecha();

    Object.keys(TOGGLE_CONFIG).forEach((id) => {
      const checkbox = getEl(id);
      if (checkbox) {
        checkbox.checked = false;
        updateToggle(checkbox);
      }
    });

    const primerChip = document.querySelector(".tipo-chip");
    if (primerChip) seleccionarTipo(primerChip);

    limpiarImagen("boxUbicacion");
    limpiarImagen("boxCctv");

    const estado = getEl("selEstado");
    if (estado) estado.value = "2";

    const trayectosContainer = getEl("trayectosContainer");
    if (trayectosContainer) trayectosContainer.innerHTML = "";

    actualizarPreview();
  };

  const inicializarFecha = () => {
    const ahora = new Date();
    const local = new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);

    const campoFecha = getEl("fecha");
    if (campoFecha) campoFecha.value = local;
  };

  const registrarEventListeners = () => {
    FORM_FIELDS.forEach((id) => {
      getEl(id)?.addEventListener("input", actualizarPreview);
    });
    getEl("selEstado")?.addEventListener("change", actualizarPreview);

    // Delegación de eventos para actualizar el preview cuando cambien inputs dinámicos de trayectos
    getEl("trayectosContainer")?.addEventListener(
      "input",
      actualizarTrayectosPreview,
    );
    getEl("trayectosContainer")?.addEventListener(
      "change",
      actualizarTrayectosPreview,
    );
  };

  const iniciarReloj = () => {
    setInterval(() => {
      setText("pvGenerado", timestampGenerado());
    }, 1000);
  };

  const init = () => {
    poblarSelectCiudadPrincipal();
    inicializarFecha();
    registrarEventListeners();
    actualizarPreview();
    iniciarReloj();
  };

  document.addEventListener("DOMContentLoaded", init);

  /// ============================================================
  // API PÚBLICA
  // ============================================================

  return {
    actualizarPreview,
    updateToggle,
    focoImagen,
    pegarImagen,
    limpiarImagen,
    seleccionarTipo,
    generarReporte,
    copiarPreview,
    limpiarFormulario,
    agregarTrayecto,
  };
})();
