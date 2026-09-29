/**
 * Llena cualquier <select>.
 * options: [{ value, label }]  ·  placeholder: texto opcional (deshabilitado)
 */
export function fillSelect(select, { placeholder, options, value = "" }) {
  select.replaceChildren();

  if (placeholder) {
    const ph = new Option(placeholder, "", true, true);
    ph.disabled = true;
    select.add(ph);
  }

  options.forEach((o) => select.add(new Option(o.label, o.value)));

  if (value && options.some((o) => o.value === value)) select.value = value;
  return select;
}