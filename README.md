# Encuesta de cenas — Carbone × Pollos Karen

Sitio **independiente**, con los logotipos oficiales y cinco preguntas aprobadas.

**Sitio público (GitHub Pages):** https://alediaz07.github.io/Encuesta-carbone/

## Diseño de una sola pantalla

El sitio ya no incrusta un formulario largo ni obliga a desplazarse entre dos páginas. Cada pregunta se presenta dentro del panel derecho, con las opciones y el botón de continuar visibles en el mismo alto de pantalla. En pantallas muy pequeñas o con letra aumentada puede haber desplazamiento limitado dentro de la pregunta para mantener la accesibilidad.

## Base de datos

Se mantiene **Google Sheets**, en la pestaña `Respuestas`:

https://docs.google.com/spreadsheets/d/1zAZpOuBLgxnUkVG5J5qhe-1tXCY16xX3eHK-5p0LSOk/edit

Las cinco preguntas son: tipo de cenas, proteínas, menú semanal, restricciones y sugerencias. Empresa fija: **Carbone**. Sin preguntas sobre nombre, empresa, presupuesto ni frecuencia.

## Activación del envío desde GitHub Pages — paso requerido

La nueva versión del formulario ya no utiliza el iframe antiguo. Para permitir el envío y la **confirmación real** desde GitHub Pages, es necesario añadir el receptor `doPost` a **Apps Script** y publicar una nueva versión de la misma implementación.

1. Abrir el proyecto de Google Apps Script que ya tiene `Código.gs`, `Index.html` y `saveSurvey(data)`.
2. **Agregar** el código de [apps-script/doPost.gs](apps-script/doPost.gs) al final de `Código.gs`, o crear un nuevo archivo de secuencia de comandos llamado `Post.gs` y pegar ahí la función. No reemplazar ni duplicar `saveSurvey`.
3. Guardar. **Implementar → Administrar implementaciones → editar (lápiz) → Versión: Nueva versión → Implementar**. Se debe actualizar la implementación existente, no generar otra dirección `/exec`.
4. Abrir GitHub Pages, responder las cinco preguntas y enviar una prueba. Comprobar la fila en Google Sheets.
5. Si el envío se bloquea, usar el enlace **Abrir formulario alternativo** que aparece cuando no hay confirmación.

**URL actual de la implementación:** https://script.google.com/macros/s/AKfycbz9vPqxDwHYXtDtNnD1e6jmjWkkBLm3XA-esnKi3KuZmxcW-hdkSOTsBOCIpHjGKOI/exec

## Publicación

En **Settings → Pages** seleccionar GitHub Actions. El workflow `.github/workflows/deploy-pages.yml` publica cada actualización de `main`.

El proyecto no utiliza Supabase ni expone secretos de Google Sheets en el repositorio.
