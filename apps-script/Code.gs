/**
 * CARBONE × POLLOS KAREN — ENCUESTA DE CENAS
 * Backend completo para Apps Script + Google Sheets.
 * Reemplaza el contenido de Código.gs por este archivo.
 * Conserva el archivo HTML Index existente.
 * Luego: Implementar > Administrar implementaciones > Editar > Nueva versión.
 */
const SHEET_ID = '1zAZpOuBLgxnUkVG5J5qhe-1tXCY16xX3eHK-5p0LSOk';
const TAB = 'Respuestas';
const GITHUB_ORIGIN = 'https://alediaz07.github.io';
const OPTIONS = Object.freeze({
  cenas: [
    'Casados tradicionales',
    'Hamburguesas y comida rápida',
    'Ensaladas completas',
    'Opciones vegetarianas'
  ],
  proteinas: [
    'Pollo', 'Carne de res', 'Cerdo', 'Pescado',
    'Huevo', 'Legumbres u opciones vegetarianas'
  ],
  menu: [
    'Un plato diferente todos los días',
    'Comida casera tradicional',
    'Opciones ligeras y saludables',
    'Combinación de comida casera y rápida',
    'Repetir los platos que más me gustan'
  ],
  restricciones: [
    'Ninguna', 'Vegetariana', 'Sin lácteos',
    'Sin gluten', 'Baja en grasa', 'Otra'
  ]
});

function getRespuestas_() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(TAB);
  if (!sheet) throw new Error('No se encontró la pestaña Respuestas.');
  return sheet;
}

function responseExists_(sheet, submissionId) {
  const last = sheet.getLastRow();
  if (last < 2) return false;
  return Boolean(sheet.getRange(2, 2, last - 1, 1)
    .createTextFinder(submissionId)
    .matchEntireCell(true)
    .findNext());
}

function doGet(e) {
  if (e && e.parameter && e.parameter.api === 'status') {
    return getStatus_(e);
  }
  // Mantiene la versión original de la encuesta abierta directamente.
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Carbone × Pollos Karen | Preferencias de cenas')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// Consulta de confirmación desde GitHub Pages (JSONP).
// Solo devuelve si un identificador aleatorio ya existe: no revela las respuestas.
function getStatus_(e) {
  const id = String(e.parameter.id || '').trim();
  const callback = String(e.parameter.callback || '').trim();
  if (!/^[a-zA-Z_$][a-zA-Z0-9_$]{0,80}$/.test(callback)) {
    return ContentService.createTextOutput('/* Callback inválido */')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  let result = { found: false, submissionId: id };
  try {
    if (/^[a-zA-Z0-9_-]{16,80}$/.test(id)) {
      result.found = responseExists_(getRespuestas_(), id);
    }
  } catch (err) {
    console.error('Error verificando envío: ' + err);
  }
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(result) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}

function doPost(e) {
  let result;
  let submissionId = '';
  try {
    if (!e || !e.parameter || !e.parameter.payload) {
      throw new Error('Solicitud sin datos.');
    }
    const data = JSON.parse(e.parameter.payload);
    submissionId = String(data.submissionId || '').trim();
    result = saveSurvey(data);
  } catch (error) {
    result = { ok: false, error: String(error.message || error) };
  }

  const message = JSON.stringify({
    kind: 'CARBONE_SURVEY_RESULT',
    submissionId: submissionId,
    ok: result.ok === true,
    error: result.error || ''
  }).replace(/</g, '\\u003c');

  const origin = JSON.stringify(GITHUB_ORIGIN);
  const page = '<!doctype html><html><head><meta charset="utf-8"></head><body>' +
    '<script>' +
    '(function(){var m=' + message + ';var origin=' + origin + ';' +
    'try{window.top.postMessage(m,origin)}catch(e){}' +
    'try{window.parent.postMessage(m,origin)}catch(e){}' +
    '})();' +
    '</script></body></html>';

  return HtmlService.createHtmlOutput(page)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function saveSurvey(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new Error('Solicitud inválida.');
  }
  if (data.company_website) {
    throw new Error('No se pudo procesar el envío.');
  }

  function multi(key) {
    const values = data[key];
    const valid = OPTIONS[key];
    if (!Array.isArray(values) || values.length === 0 ||
        values.length > valid.length ||
        new Set(values).size !== values.length ||
        values.some(v => typeof v !== 'string' || !valid.includes(v))) {
      throw new Error('Revisá la respuesta: ' + key);
    }
    return values;
  }

  const cenas = multi('cenas');
  const proteinas = multi('proteinas');
  const restricciones = multi('restricciones');
  if (restricciones.includes('Ninguna') && restricciones.length !== 1) {
    throw new Error('No combinés «Ninguna» con otras restricciones.');
  }

  const menu = String(data.menu || '').trim();
  if (!OPTIONS.menu.includes(menu)) {
    throw new Error('Elegí una opción válida de menú semanal.');
  }

  const otra = String(data.otraRestriccion || '').trim();
  if (otra.length > 150 ||
      (restricciones.includes('Otra') && !otra) ||
      (!restricciones.includes('Otra') && otra)) {
    throw new Error('Revisá el detalle de las restricciones.');
  }

  const comentario = String(data.comentario || '').trim();
  if (comentario.length > 450) {
    throw new Error('El comentario supera 450 caracteres.');
  }

  const submissionId = String(data.submissionId || '').trim();
  if (!/^[a-zA-Z0-9_-]{16,80}$/.test(submissionId)) {
    throw new Error('ID inválido. Recargá la encuesta.');
  }

  // Impide interpretación de fórmulas en Google Sheets.
  function safe(value) {
    const v = String(value || '').trim();
    return /^[\s]*[=+\-@\t\r]/.test(v) ? "'" + v : v;
  }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(15000)) {
    throw new Error('Servicio ocupado. Intentá de nuevo.');
  }
  try {
    const sheet = getRespuestas_();
    if (responseExists_(sheet, submissionId)) {
      return { ok: true, duplicate: true };
    }
    sheet.appendRow([
      new Date(),
      submissionId,
      'Carbone',
      safe(cenas.join(', ')),
      safe(proteinas.join(', ')),
      safe(menu),
      safe(restricciones.join(', ')),
      safe(otra),
      safe(comentario),
      'Encuesta web'
    ]);
    SpreadsheetApp.flush();
    return { ok: true };
  } finally {
    lock.releaseLock();
  }
}
