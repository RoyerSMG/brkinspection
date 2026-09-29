/**
 * Toggle con etiqueta de estado (On Line / Off Line, etc.)
 * Retorna: { element, input, set(bool) }
 * `set()` cambia el valor SIN disparar onChange (útil para reset).
 */
export function createToggleStatus({
  id,
  label,
  iconSvg,
  iconClass = "",
  config,
  checked = false,
  onChange,
}) {
  const wrapper = document.createElement("div");
  wrapper.className = "check-item";

  wrapper.innerHTML = `
    <div class="check-label">
      <div class="check-icon ${iconClass}">${iconSvg}</div>
      ${label}
    </div>
    <div class="toggle-wrap">
      <label class="toggle">
        <input type="checkbox" id="${id}">
        <span class="toggle-slider"></span>
      </label>
      <span class="toggle-estado off">${config.off}</span>
    </div>
  `;

  const input = wrapper.querySelector("input");
  const estadoLabel = wrapper.querySelector(".toggle-estado");

  const pintar = (isChecked) => {
    estadoLabel.innerText = isChecked ? config.on : config.off;
    estadoLabel.className = `toggle-estado ${isChecked ? "on" : "off"}`;
  };

  input.checked = checked;
  pintar(checked);

  input.addEventListener("change", () => {
    pintar(input.checked);
    onChange?.(input.checked, input.checked ? config.on : config.off);
  });

  const set = (value) => {
    input.checked = !!value;
    pintar(input.checked);
  };

  return { element: wrapper, input, set };
}