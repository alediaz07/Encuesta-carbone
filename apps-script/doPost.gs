/**
 * CARBONE / GitHub Pages
 * Agregar al final del Código.gs existente y publicar una NUEVA VERSIÓN.
 * Conservá tus funciones doGet() y saveSurvey(data).
 */
function doPost(e) {
  let result;
  let submissionId = '';
  try {
    if (!e || !e.parameter || !e.parameter.payload) {
      throw new Error('Solicitud vacía.');
    }
    const data = JSON.parse(e.parameter.payload);
    submissionId = String(data.submissionId || '');
    result = saveSurvey(data);
  } catch (error) {
    result = { ok: false, error: error.message || String(error) };
  }
  const message = JSON.stringify({
    kind: 'CARBONE_SURVEY_RESULT',
    submissionId,
    ok: result.ok === true,
    error: result.error || ''
  }).replace(/</g, '\\u003c');
  const origin = JSON.stringify('https://alediaz07.github.io');
  return HtmlService.createHtmlOutput(
    '<!doctype html><meta charset="utf-8"><script>' +
    'try { window.top.postMessage(' + message + ',' + origin + '); } catch(e) {}' +
    'try { window.parent.postMessage(' + message + ',' + origin + '); } catch(e) {}' +
    '</script>'
  ).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
