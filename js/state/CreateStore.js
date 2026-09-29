/** Store mínimo reutilizable por todas las páginas */
export function createStore(initialFactory) {
  let state = initialFactory();
  const subs = new Set();
  const notify = () => subs.forEach((fn) => fn(state));

  return {
    get: () => state,
    set(patch) {
      state = { ...state, ...patch };
      notify();
    },
    reset() {
      state = initialFactory();
      notify();
    },
    /** Ejecuta fn una vez de inmediato y en cada cambio */
    subscribe(fn) {
      subs.add(fn);
      fn(state);
      return () => subs.delete(fn);
    },
  };
}