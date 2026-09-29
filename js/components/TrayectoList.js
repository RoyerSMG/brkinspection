import { ESTADO_TRAYECTO } from "../config/BlindadoData.js";
import { createCitySelect } from "./CitySelect.js";

/**
 * Lista dinámica de trayectos (Moneda BOR).
 * - useCities=false → origen/destino son <input>; true → <select> de ciudades
 * Retorna { add, clear, count, ensureOne, setUseCities, read }
 */
export function createTrayectoList({ container, onChange }) {
  let useCities = false;

  const read = () =>
    Array.from(container.querySelectorAll(".trayecto-row")).map((row) => ({
      origen: row.querySelector(".origen")?.value ?? "",
      destino: row.querySelector(".destino")?.value ?? "",
      estado: row.querySelector(".estado")?.value ?? ESTADO_TRAYECTO[0].value,
    }));

  const emit = () => onChange?.(read());

  const crearCampo = (clase, valor = "") => {
    if (useCities) return createCitySelect({ className: clase, value: valor });
    const input = document.createElement("input");
    input.type = "text";
    input.className = clase;
    input.value = valor;
    return input;
  };

  const add = (data = {}) => {
    const row = document.createElement("div");
    row.className = "trayecto-row field-row";

    const opts = ESTADO_TRAYECTO.map(
      (e) => `<option value="${e.value}">${e.label}</option>`,
    ).join("");

    row.innerHTML = `
      <div class="trayecto-row-inner">
        <div class="field"><label>Origen</label></div>
        <div class="field"><label>Destino</label></div>
        <div class="field">
          <label>Estado</label>
          <select class="estado">${opts}</select>
        </div>
        <button type="button" class="btn-remove-trayecto" title="Eliminar trayecto">✕</button>
      </div>
    `;

    const fields = row.querySelectorAll(".field");
    fields[0].appendChild(crearCampo("origen", data.origen));
    fields[1].appendChild(crearCampo("destino", data.destino));
    if (data.estado) row.querySelector(".estado").value = data.estado;

    row.querySelector(".btn-remove-trayecto").addEventListener("click", () => {
      row.remove();
      emit();
    });

    container.appendChild(row);
    emit();
  };

  // Delegación: un solo listener para todas las filas
  container.addEventListener("input", emit);
  container.addEventListener("change", emit);

  return {
    add,
    read,
    count: () => container.children.length,
    ensureOne() {
      if (container.children.length === 0) add();
    },
    clear() {
      container.replaceChildren();
      emit();
    },
    /** Cambia origen/destino entre input y select conservando el valor */
    setUseCities(flag) {
      if (flag === useCities) return;
      useCities = flag;
      container.querySelectorAll(".trayecto-row").forEach((row) => {
        ["origen", "destino"].forEach((clase) => {
          const actual = row.querySelector(`.${clase}`);
          if (actual) actual.replaceWith(crearCampo(clase, actual.value));
        });
      });
      emit();
    },
  };
}