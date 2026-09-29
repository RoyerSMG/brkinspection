export function renderFooter(containerId = "app-footer") {
  const container = document.getElementById(containerId);

  if (!container) return;

  container.innerHTML = `
    <footer>
      <div class="footer-content">
        <p>&copy; 2026 Inspection Advanced. Todos los derechos reservados.</p>
      </div>
    </footer>
  `;
}