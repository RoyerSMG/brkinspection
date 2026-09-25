export function renderHeader(containerId = "app-header") {
  const container = document.getElementById(containerId);
  if (!container) return;

  const currentPath = window.location.pathname.split("/").pop() || "inspeccionesv3.html";

  const links = [
    { label: "Rutas", href: "inspBlindadoV3.html" },
    { label: "Sedes", href: "inspSedeV1.html" },
    { label: "Seguimiento", href: "index.html" }
  ];

  const navHtml = links.map(link => `
    <a href="${link.href}" class="nav-btn ${currentPath === link.href ? "active" : ""}">
      ${link.label}
    </a>
  `).join("");

  container.innerHTML = `
    <header>
      <div class="logo-dot">
        <svg viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      </div>
      <h1>Inspection Advanced</h1>
      <nav class="header-nav">${navHtml}</nav>
    </header>
  `;
}