/**
 * Caja de imagen pegable (Ctrl+V).
 *
 * Opciones:
 *  - initialSrc: imagen con la que arranca (para re-renderizar sin perderla)
 *  - bare: true → sin wrapper ni label; `element` es directamente el .img-box
 *
 * Retorna: { element, limpiar, getSrc }
 */
export function createImageBox({
  id,
  label = "",
  placeholderText,
  svgIcon,
  initialSrc = null,
  bare = false,
  onChange,
}) {
  const wrapper = document.createElement("div");
  wrapper.className = "img-box-wrap";

  wrapper.innerHTML = `
    ${bare ? "" : `<span class="img-box-label">${label}</span>`}
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

  const getSrc = () => box.querySelector("img")?.src ?? null;

  const mostrar = (src) => {
    box.querySelector("img")?.remove();
    placeholder.style.display = "none";
    const img = document.createElement("img");
    img.src = src;
    img.style.cssText = "width:100%;height:100%;object-fit:cover;";
    box.appendChild(img);
    box.classList.add("has-image");
  };

  const limpiar = () => {
    box.querySelector("img")?.remove();
    box.classList.remove("has-image");
    placeholder.style.display = "flex";
    onChange?.(null);
  };

  box.addEventListener("click", () => box.focus());

  box.addEventListener("paste", (e) => {
    e.preventDefault();
    const items = Array.from(e.clipboardData?.items || []);
    const imageItem = items.find((item) => item.type.startsWith("image"));
    if (!imageItem) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      mostrar(event.target.result);
      onChange?.(event.target.result);
    };
    reader.readAsDataURL(imageItem.getAsFile());
  });

  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    limpiar();
  });

  box.addEventListener("keydown", (e) => {
    if (e.key === "Delete" || e.key === "Backspace") limpiar();
  });

  if (initialSrc) mostrar(initialSrc);

  return { element: bare ? box : wrapper, limpiar, getSrc };
}