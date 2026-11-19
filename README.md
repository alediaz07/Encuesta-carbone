# Carbone × Pollos Karen — Encuesta de cenas

Sitio independiente, responsivo, preparado para GitHub Pages. Incluye la portada aprobada con los logotipos originales de Carbone y Pollos Karen, foto de la cena y las cinco categorías de preguntas.

## Sitio
Una vez publicado: **https://alediaz07.github.io/Encuesta-carbone/**

## Cómo funciona
El botón **Comenzar encuesta** carga la aplicación web de **Google Apps Script** dentro de la misma página. El formulario responde las cinco preguntas aprobadas y guarda las respuestas directamente en Google Sheets mediante la función `saveSurvey`. No utiliza Supabase ni guarda credenciales en GitHub.

- Aplicación web: https://script.google.com/macros/s/AKfycbz9vPqxDwHYXtDtNnD1e6jmjWkkBLm3XA-esnKi3KuZmxcW-hdkSOTsBOCIpHjGKOI/exec
- Base de datos: https://docs.google.com/spreadsheets/d/1zAZpOuBLgxnUkVG5J5qhe-1tXCY16xX3eHK-5p0LSOk/edit
- Para mostrarlo incrustado, `doGet` en Apps Script debe conservar `HtmlService.XFrameOptionsMode.ALLOWALL`. Hay un enlace directo de respaldo por si un navegador bloquea el iframe.

## Publicar
En GitHub, abrir **Settings → Pages** y en **Build and deployment → Source**, elegir **GitHub Actions**. El workflow `.github/workflows/deploy-pages.yml` publica automáticamente los cambios en `main`. Si ya está configurado correctamente, no hay que repetir este paso.

## Archivos
- `index.html`: portada web premium.
- `assets/carbone.png`: logotipo de Carbone.
- `assets/pollos-karen.png`: logotipo oficial de Pollos Karen.
- `assets/cena-carbone.webp`: fotografía ilustrativa de cena.
- `.github/workflows/deploy-pages.yml`: despliegue GitHub Pages.

## Verificación pendiente
Probar el enlace de GitHub Pages en un navegador, enviar una respuesta de prueba y comprobar que aparece en **Respuestas** de Google Sheets. El repositorio por sí solo no demuestra que la implementación de Apps Script y permisos de Google estén correctos.
