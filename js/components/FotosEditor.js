import { createFotoItem } from "./FotoItem.js";

/**
 * Contenedor de fotos del formulario de Sedes.
 * Solo se vuelve a renderizar cuando cambia la ESTRUCTURA o la lista de fotos
 * (no en cada tecla), así el input del nombre no pierde el foco.
 */
export function createFotosEditor({ container, onChange, onRemove }) {
  return {
    render({ fotos, gridClass, removable }) {
      container.className = gridClass;
      container.replaceChildren(
        ...fotos.map(
          (foto) =>
            createFotoItem({
              foto,
              removable,
              onChange: (patch) => onChange?.(foto.id, patch),
              onRemove: () => onRemove?.(foto.id),
            }).element,
        ),
      );
    },
  };
}