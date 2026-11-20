# Encuesta Carbone × Pollos Karen

Página de **una pregunta por pantalla**, sin doble desplazamiento, con logotipos oficiales. El formulario es anónimo, exclusivamente sobre cenas y no pregunta por empresa ni presupuesto.

**Sitio:** https://alediaz07.github.io/Encuesta-carbone/

## Cómo se guardan las respuestas

El sitio envía los datos a Google Apps Script y **solo confirma el envío cuando recibe una respuesta válida o detecta el identificador en Google Sheets**. Si no logra confirmarlo, informa del problema y ofrece el enlace del formulario alternativo. Así se evita que la página quede eternamente en «Guardando…».

La base de datos es únicamente Google Sheets:
https://docs.google.com/spreadsheets/d/1zAZpOuBLgxnUkVG5J5qhe-1tXCY16xX3eHK-5p0LSOk/edit

## Paso imprescindible para activar y corregir el envío

La aplicación de Apps Script se administra desde la cuenta de Google del propietario y GitHub no puede desplegar su código automáticamente. Se debe **actualizar manualmente la implementación existente**:

1. Abrir el editor de Apps Script de Carbone.
2. Abrir `Código.gs`. **Reemplazar todo su contenido** por [apps-script/Code.gs](apps-script/Code.gs), que incluye `doGet`, `doPost`, `saveSurvey` y la consulta segura de estado. No se debe añadir al código anterior porque duplicaría funciones.
3. **Conservar el archivo `Index.html`** ya existente, utilizado por el formulario alternativo.
4. Guardar.
5. Ir a **Implementar → Administrar implementaciones → editar (ícono de lápiz) → Versión: Nueva versión → Implementar**. Mantener la misma URL `/exec` que utiliza GitHub.
6. Abrir [GitHub Pages](https://alediaz07.github.io/Encuesta-carbone/) y probar una encuesta. Verificar el nuevo registro en `Respuestas` de Google Sheets.

**URL de Apps Script:** https://script.google.com/macros/s/AKfycbzT9_S8XsZF5aQdF_8dVyjmsoUZelDSkbKC7IpBkeyFY9cbuH4qGNXd9cjhUhFkazaAVg/exec

## Publicación

El workflow `.github/workflows/deploy-pages.yml` publica los cambios de `main` automáticamente en GitHub Pages. El proyecto no utiliza Supabase ni credenciales en el frontend.

No marcar la integración como totalmente probada hasta comprobar que una respuesta aparece en Google Sheets.
