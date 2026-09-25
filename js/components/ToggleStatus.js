export function createToggleStatus({ id, label, iconSvg, config, onChange }) {
  const wrapper = document.createElement("div");
  wrapper.className = "check-item";

  wrapper.innerHTML = `
    <div class="check-label">
      <div class="check-icon">${iconSvg}</div>
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

  input.addEventListener("change", () => {
    const isChecked = input.checked;
    estadoLabel.innerText = isChecked ? config.on : config.off;
    estadoLabel.className = `toggle-estado ${isChecked ? "on" : "off"}`;
    if (onChange) onChange(isChecked, isChecked ? config.on : config.off);
  });

  return { element: wrapper, input };
}
