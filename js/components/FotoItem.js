import { createImageBox } from "./ImageBox.js";
import { ICONS } from "../config/icons.js";

/**
 * Una foto del formulario de Sedes: nombre editable + caja de imagen (+ botón eliminar).
 * onChange(patch) recibe { nombre } o { src }.
 */
export function createFotoItem({ foto, removable, onChange, onRemove }) {
  const wrap = document.createElement("div");
  wrap.className = "foto-item" + (foto.full ? " foto-item-full" : "");
  wrap.dataset.fotoId = foto.id;

  wrap.innerHTML = `
    <div class="foto-item-header">
      <input type="text" class="foto-nombre-input" id="nombre_${foto.id}" placeholder="Nombre de la foto">
      ${removable ? `<button type="button" class="btn-remove-foto" title="Eliminar foto">✕</button>` : ""}
    </div>
  `;

  const input = wrap.querySelector(".foto-nombre-input");
  input.value = foto.nombre;
  input.addEventListener("input", () => onChange?.({ nombre: input.value }));

  wrap.querySelector(".btn-remove-foto")?.addEventListener("click", () => onRemove?.());

  const image = createImageBox({
    id: `box_${foto.id}`,
    bare: true,
    placeholderText: "Haz clic aquí y pega<br>la imagen con <kbd>Ctrl+V</kbd>",
    svgIcon: ICONS.cctv,
    initialSrc: foto.src,
    onChange: (src) => onChange?.({ src }),
  });
  wrap.appendChild(image.element);

  return { element: wrap, imageBox: image };
}