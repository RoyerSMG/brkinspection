/**
 * Enlaza inputs del DOM con claves del store (DOM → store).
 * map: [[idDelInput, claveEnStore], ...]
 * transforms: { clave: (valor) => valorTransformado }  (ej. placa → mayúsculas)
 * Retorna { sync(state) } para volver a escribir el estado en los inputs (reset).
 */
export function bindFields({ map, store, transforms = {} }) {
  map.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const handler = () => {
      if (transforms[key]) el.value = transforms[key](el.value);
      store.set({ [key]: el.value });
    };
    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  });

  return {
    sync(state) {
      map.forEach(([id, key]) => {
        const el = document.getElementById(id);
        if (el) el.value = state[key];
      });
    },
  };
}