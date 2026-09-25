const InspeccionesSedes = (() => {
  /* ============================================================
   * 1. CONFIGURACIÓN Y CONSTANTES
   * ============================================================= */
  const FORM_FIELDS = [
    "nombreSede",
    "abonado",
    "dispositivo",
    "observacionSede",
  ];

  const TIPO_INSPECCION_ID = {
    "Verifica Alerta": 1,
    "Norma CRS": 2,
    "Riesgo Critico": 3,
    "Retencion CCTV": 4,
    "Estandar Seg. Electronica": 5,
    "Seguimiento Visitante": 6,
  };

  // Estructura fija: 2 fotos en fila + 1 abajo a todo el ancho
  const FOTOS_ESTRUCTURA_3 = [
    { id: "foto1", nombre: "Alarma Principal", full: false },
    { id: "foto2", nombre: "Alarma Soporte", full: false },
    { id: "foto3", nombre: "CCTV", full: true },
  ];

  // ============================================================
  // ESTADO DEL MÓDULO
  // ============================================================
  let estructuraActual = "3fotos";
  let fotosVerticales = []; // [{ id, nombre }]
  let verticalIndex = 0;

  // ============================================================
  // UTILIDADES GENERALES
  // ============================================================
  const getEl = (id) => document.getElementById(id);

  const setText = (id, value) => {
    const el = getEl(id);
    if (el) el.innerText = value;
  };

  const timestampGenerado = () =>
    "Generado: " + new Date().toLocaleString("es-CO");

  // ============================================================
  // CAJAS DE IMAGEN (crear / pegar / limpiar)
  // ============================================================

  /**
   * Crea el bloque completo de una foto: nombre editable + caja de imagen.
   * @param {{id:string,nombre:string,full:boolean}} foto
   * @param {boolean} removable - si debe mostrar botón de eliminar (estructura vertical)
   */
  const crearCajaFoto = ({ id, nombre, full }, removable) => {
    const wrap = document.createElement("div");
    wrap.className = "foto-item" + (full ? " foto-item-full" : "");
    wrap.dataset.fotoId = id;

    wrap.innerHTML = `
      <div class="foto-item-header">
        <input type="text" class="foto-nombre-input" id="nombre_${id}" value="${nombre}" placeholder="Nombre de la foto">
        ${removable ? `<button type="button" class="btn-remove-foto" title="Eliminar foto">✕</button>` : ""}
      </div>
      <div class="img-box" id="box_${id}" tabindex="0">
        <div class="img-placeholder" id="ph_${id}">
          <svg viewBox="0 0 24 24"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          <span>Haz clic aquí y pega<br>la imagen con <kbd>Ctrl+V</kbd></span>
        </div>
        <button class="img-clear" type="button">✕</button>
      </div>
    `;

    const box = wrap.querySelector(`#box_${id}`);
    box.addEventListener("click", () => box.focus());
    box.addEventListener("paste", (e) => pegarImagenFoto(e, id));
    box.addEventListener("keydown", (e) => {
      if (e.key === "Delete" || e.key === "Backspace") limpiarImagenFoto(id);
    });
    wrap.querySelector(".img-clear").addEventListener("click", (e) => {
      e.stopPropagation();
      limpiarImagenFoto(id);
    });
    wrap
      .querySelector(`#nombre_${id}`)
      .addEventListener("input", actualizarPreview);

    if (removable) {
      wrap.querySelector(".btn-remove-foto").addEventListener("click", () => {
        fotosVerticales = fotosVerticales.filter((f) => f.id !== id);
        renderFotosForm();
      });
    }

    return wrap;
  };

  /**
   * Procesa el evento de pegado (Ctrl+V) sobre una caja de foto dinámica.
   */
  const pegarImagenFoto = (e, id) => {
    e.preventDefault();
    const items = Array.from(e.clipboardData.items);
    const imageItem = items.find((item) => item.type.startsWith("image"));
    if (!imageItem) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const box = getEl(`box_${id}`);
      if (!box) return;

      box.querySelector("img")?.remove();
      const ph = box.querySelector(".img-placeholder");
      if (ph) ph.style.display = "none";

      const img = Object.assign(document.createElement("img"), {
        src: event.target.result,
      });
      img.style.cssText = "width:100%;height:100%;object-fit:cover;";
      box.appendChild(img);
      box.classList.add("has-image");

      actualizarPreview();
    };
    reader.readAsDataURL(imageItem.getAsFile());
  };

  /**
   * Elimina la imagen de una caja de foto y restaura el placeholder.
   */
  const limpiarImagenFoto = (id) => {
    const box = getEl(`box_${id}`);
    if (!box) return;

    box.querySelector("img")?.remove();
    box.classList.remove("has-image");
    const ph = box.querySelector(".img-placeholder");
    if (ph) ph.style.display = "flex";

    actualizarPreview();
  };

  // ============================================================
  // ESTRUCTURA DE FOTOS
  // ============================================================

  /**
   * Renderiza el formulario de fotos según la estructura seleccionada.
   */
  const renderFotosForm = () => {
    const container = getEl("fotosFormContainer");
    const btnAgregar = getEl("btnAgregarFoto");
    if (!container) return;

    container.innerHTML = "";

    if (estructuraActual === "3fotos") {
      container.className = "fotos-form-grid-3";
      if (btnAgregar) btnAgregar.style.display = "none";
      FOTOS_ESTRUCTURA_3.forEach((f) =>
        container.appendChild(crearCajaFoto(f, false)),
      );
    } else {
      container.className = "fotos-form-grid-vertical";
      if (btnAgregar) btnAgregar.style.display = "";

      if (fotosVerticales.length === 0) {
        fotosVerticales.push({ id: `fotoV${++verticalIndex}`, nombre: "CCTV" });
      }

      fotosVerticales.forEach((f) =>
        container.appendChild(
          crearCajaFoto({ ...f, full: true }, fotosVerticales.length > 1),
        ),
      );
    }

    actualizarPreview();
  };

  /**
   * Agrega una nueva foto en la estructura vertical.
   */
  const agregarFotoVertical = () => {
    const numero = fotosVerticales.length + 1;
    fotosVerticales.push({
      id: `fotoV${++verticalIndex}`,
      nombre: `CCTV ${numero}`,
    });
    renderFotosForm();
  };

  /**
   * Cambia la estructura de fotos activa (chips).
   */
  const seleccionarEstructura = (el) => {
    document
      .querySelectorAll(".estructura-wrap .tipo-chip")
      .forEach((chip) => chip.classList.remove("selected"));
    el.classList.add("selected");
    estructuraActual = el.dataset.value;

    if (estructuraActual === "vertical" && fotosVerticales.length === 0) {
      fotosVerticales = [{ id: `fotoV${++verticalIndex}`, nombre: "CCTV" }];
    }

    renderFotosForm();
  };

  // ============================================================
  // PREVIEW EN TIEMPO REAL
  // ============================================================

  /**
   * Renderiza las tarjetas de foto del preview según la estructura activa.
   */
  const renderFotosPreview = () => {
    const container = getEl("pvFotosContainer");
    if (!container) return;

    container.innerHTML = "";
    container.className =
      estructuraActual === "3fotos"
        ? "rpt-fotos-grid-3"
        : "rpt-fotos-grid-vertical";

    const fotos =
      estructuraActual === "3fotos" ? FOTOS_ESTRUCTURA_3 : fotosVerticales;

    fotos.forEach((f) => {
      const nombreInput = getEl(`nombre_${f.id}`);
      const nombre = nombreInput?.value.trim() || f.nombre;
      const src = document.querySelector(`#box_${f.id} img`)?.src;

      const esFull = estructuraActual === "vertical" || f.full;

      const card = document.createElement("div");
      card.className = "rpt-card-foto" + (esFull ? " rpt-card-foto-full" : "");
      card.innerHTML = `
        <div class="rpt-card-title">${nombre}</div>
        <div class="rpt-img-box">
          ${src ? `<img src="${src}">` : `<span class="rpt-img-empty">Sin imagen</span>`}
        </div>
      `;
      container.appendChild(card);
    });
  };

  /**
   * Recopila los valores del formulario y actualiza el panel de preview.
   */
  const actualizarPreview = () => {
    const nombreSede = getEl("nombreSede")?.value.trim() || "—";
    const tipoInsp = getEl("tipoInspeccion")?.value || "—";
    const abonado = getEl("abonado")?.value.trim() || "—";
    const dispositivo = getEl("dispositivo")?.value.trim() || "—";
    const observacion =
      getEl("observacionSede")?.value.trim() || "Sin observaciones.";

    setText("pvNombreSede", nombreSede);
    setText("pvTipoInsp", tipoInsp);
    setText("pvAbonado", abonado);
    setText("pvDispositivo", dispositivo);
    setText("pvObservacionSede", observacion);
    setText(
      "pvTipoInspeccion",
      tipoInsp === "—" ? "INSPECCIÓN DE SEDE" : tipoInsp.toUpperCase(),
    );
    setText("pvGeneradoSede", timestampGenerado());

    renderFotosPreview();
  };

  // ============================================================
  // GENERACIÓN DEL REPORTE PNG
  // ============================================================

  const generarReporte = () => {
    const preview = getEl("previewHtmlSede");
    if (!preview) {
      mostrarToast("No se encontró el preview");
      return;
    }

    html2canvas(preview, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    }).then((canvas) => {
      const abonado =
        (getEl("abonado")?.value || "abonado").trim().replace(/\s+/g, "_") ||
        "abonado";
      const dispositivo =
        (getEl("dispositivo")?.value || "dispositivo")
          .trim()
          .replace(/\s+/g, "_") || "dispositivo";

      const ahora = new Date();
      const fechaHora =
        String(ahora.getDate()).padStart(2, "0") +
        String(ahora.getMonth() + 1).padStart(2, "0") +
        ahora.getFullYear() +
        String(ahora.getHours()).padStart(2, "0") +
        String(ahora.getMinutes()).padStart(2, "0");

      const idTipoInsp =
        TIPO_INSPECCION_ID[getEl("tipoInspeccion")?.value] || 0;
      const nombreArchivo = `${abonado}${dispositivo}${fechaHora}.png`;

      const link = document.createElement("a");
      link.download = nombreArchivo;
      link.href = canvas.toDataURL("image/png");
      link.click();

      mostrarToast("Reporte generado correctamente");
    });
  };

  // ============================================================
  // COPIAR PREVIEW AL PORTAPAPELES
  // ============================================================

  const copiarPreview = () => {
    const preview = getEl("previewHtmlSede");
    if (!preview) {
      mostrarToast("No se encontró el preview");
      return;
    }

    html2canvas(preview, { scale: 2 }).then((canvas) =>
      canvas.toBlob((blob) => {
        if (!blob) {
          mostrarToast("Error al copiar");
          return;
        }

        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard
          .write([item])
          .then(() => mostrarToast("Imagen copiada"))
          .catch(() => mostrarToast("No se pudo copiar"));
      }),
    );
  };

  // ============================================================
  // TOAST DE NOTIFICACIONES
  // ============================================================

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
  // LIMPIAR FORMULARIO
  // ============================================================

  const limpiarFormulario = () => {
    FORM_FIELDS.forEach((id) => {
      const el = getEl(id);
      if (el) el.value = "";
    });

    const tipoSel = getEl("tipoInspeccion");
    if (tipoSel) tipoSel.selectedIndex = 0;

    fotosVerticales = [];
    verticalIndex = 0;

    const primerChip = document.querySelector(".estructura-wrap .tipo-chip");
    if (primerChip) {
      seleccionarEstructura(primerChip);
    } else {
      renderFotosForm();
    }

    actualizarPreview();
  };

  // ============================================================
  // INICIALIZACIÓN
  // ============================================================

  const registrarEventListeners = () => {
    FORM_FIELDS.forEach((id) =>
      getEl(id)?.addEventListener("input", actualizarPreview),
    );
    getEl("tipoInspeccion")?.addEventListener("change", actualizarPreview);
  };

  const iniciarReloj = () => {
    setInterval(() => {
      setText("pvGeneradoSede", timestampGenerado());
    }, 1000);
  };

  const init = () => {
    renderFotosForm();
    registrarEventListeners();
    actualizarPreview();
    iniciarReloj();
  };

  document.addEventListener("DOMContentLoaded", init);

  // ============================================================
  // API PÚBLICA
  // ============================================================
  return {
    seleccionarEstructura,
    agregarFotoVertical,
    generarReporte,
    copiarPreview,
    limpiarFormulario,
  };
})();
