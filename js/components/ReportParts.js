/* Piezas del reporte PNG que comparten Rutas y Sedes */

export const reportHeaderHtml = ({ tipoId, tipoText = "" }) => `
  <div class="rpt-header">
    <div class="rpt-logo">B</div>
    <div class="rpt-brand">
      <strong>BRINKS DE COLOMBIA</strong>
      <span>Central de Inteligencia y Gestión Integral de Riesgos</span>
    </div>
    <div class="rpt-tipo"><strong id="${tipoId}">${tipoText}</strong></div>
  </div>`;

export const reportFooterHtml = (generadoId) => `
  <div class="rpt-footer">
    <span>Brinks de Colombia</span>
    <span id="${generadoId}">—</span>
  </div>`;