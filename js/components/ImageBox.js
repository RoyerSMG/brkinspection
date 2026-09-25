export function createImageBox({
  id,
  label,
  placeholderText,
  svgIcon,
  onChange,
}) {
  const wrapper = document.createElement("div");
  wrapper.className = "img-box-wrap";

  wrapper.innerHTML = `
    <span class="img-box-label">${label}</span>
    <div class="img-box" id="${id}" tabindex="0">
      <div class="img-placeholder">
        ${svgIcon}
        <span>${placeholderText}</span>
      </div>
      <button class="img-clear" type="button" title="Eliminar imagen">✕</button>
    </div>
  `;

  const box = wrapper.querySelector(".img-box");
  const clearBtn = wrapper.querySelector(".img-clear");
  const placeholder = wrapper.querySelector(".img-placeholder");

  // Evento: enfocar
  box.addEventListener("click", () => box.focus());

  // Evento: Pegar imagen
  box.addEventListener("paste", (e) => {
    e.preventDefault();
    const items = Array.from(e.clipboardData?.items || []);
    const imageItem = items.find((item) => item.type.startsWith("image"));

    if (!imageItem) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      box.querySelector("img")?.remove();
      placeholder.style.display = "none";

      const img = document.createElement("img");
      img.src = event.target.result;
      img.style.cssText = "width:100%;height:100%;object-fit:cover;";
      box.appendChild(img);

      if (onChange) onChange(event.target.result);
    };
    reader.readAsDataURL(imageItem.getAsFile());
  });

  // Limpiar imagen
  const limpiar = () => {
    box.querySelector("img")?.remove();
    placeholder.style.display = "flex";
    if (onChange) onChange(null);
  };

  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    limpiar();
  });

  box.addEventListener("keydown", (e) => {
    if (e.key === "Delete" || e.key === "Backspace") limpiar();
  });

  return { element: wrapper, limpiar };
}
