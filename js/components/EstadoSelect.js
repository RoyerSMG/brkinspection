import { ICONS } from "../config/icons.js";

/** Fila "Estado" del checklist. Retorna { element, select, set(id) } */
export function createEstadoSelect({ estados, value, onChange }) {
  const wrapper = document.createElement("div");
  wrapper.className = "check-item";

  const options = estados
    .map((e) => `<option value="${e.id}">${e.nombre}</option>`)
    .join("");

  wrapper.innerHTML = `
    <div class="check-label">
      <div class="check-icon icon-status">${ICONS.status}</div>
      Estado
    </div>
    <select id="selEstado">${options}</select>
  `;

  const select = wrapper.querySelector("select");
  select.value = String(value);

  select.addEventListener("change", () => onChange?.(Number(select.value)));

  return {
    element: wrapper,
    select,
    set: (id) => (select.value = String(id)),
  };
}