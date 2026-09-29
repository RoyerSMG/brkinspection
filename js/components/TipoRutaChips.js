/**
 * Grupo de chips seleccionables (tipo de ruta, estructura de fotos, etc.)
 * tipos: string[]  ó  [{ value, label }]
 * Retorna { setValue(v) }  (setValue NO dispara onChange)
 */
export function createTipoRutaChips({ container, tipos, value, onChange }) {
  container.replaceChildren();

  const chips = tipos.map((t) => {
    const item = typeof t === "string" ? { value: t, label: t } : t;
    const chip = document.createElement("div");
    chip.className = "tipo-chip";
    chip.dataset.value = item.value;
    chip.textContent = item.label;
    container.appendChild(chip);
    return chip;
  });

  const setValue = (v) =>
    chips.forEach((c) => c.classList.toggle("selected", c.dataset.value === v));

  container.addEventListener("click", (e) => {
    const chip = e.target.closest(".tipo-chip");
    if (!chip) return;
    setValue(chip.dataset.value);
    onChange?.(chip.dataset.value);
  });

  setValue(value);
  return { setValue };
}