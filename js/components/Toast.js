let hideTimer = null;

export function showToast(message, duration = 2000) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }

  toast.innerText = message;
  toast.classList.add("show");

  // Evita que un toast anterior oculte al nuevo antes de tiempo
  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => toast.classList.remove("show"), duration);
}