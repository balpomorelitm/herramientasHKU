# Spanish Learning Tools · HKU

Catálogo de juegos, lecturas, actividades y recursos de español de Pablo Torrado para estudiantes de HKU.

**Sitio público:** https://spanishhkutools.netlify.app/

## Uso

El buscador consulta títulos, descripciones, cursos y etiquetas en español e inglés, sin distinguir tildes ni mayúsculas. Al seleccionar un curso aparecen primero sus recursos específicos y después los generales. Se puede combinar con el tipo de actividad y ordenar alfabéticamente o por incorporación.

La interfaz comienza en inglés, permite cambiar a español y ofrece temas claro y oscuro. Las galerías se abren con teclado y admiten flechas y Escape. Compartir copia un enlace; si el navegador impide copiar, muestra el enlace para seleccionarlo. El catálogo funciona aunque el almacenamiento local esté bloqueado. No utiliza contadores de uso ni consultas a GitHub.

El diseño combina fondo crema cuadriculado, rojo, titulares condensados, bordes y sombras marcados. Cada tipo de recurso tiene un color propio. En móvil las fichas muestran la captura junto al título; en escritorio usan galerías amplias. Anton y DM Sans se sirven desde `assets/fonts/`, con sus licencias OFL.

Ejemplos para compartir:

- Curso: `https://spanishhkutools.netlify.app/?course=SPAN1001`
- Ficha y curso: `https://spanishhkutools.netlify.app/?tool=palabrero&course=SPAN1002`
- Español: añadir `&lang=es` al enlace anterior.

Palabrero reúne SPAN1001, SPAN1002 y SPAN2001 en una ficha. ProfeBot tiene un único acceso y está asignado exclusivamente a SPAN1001 y SPAN1002.

## Desarrollo y pruebas

Requiere Node.js 22 o posterior. La web resultante es HTML, CSS y JavaScript estáticos, sin servidor de aplicación.

```sh
npm ci
npm run build
npm start
```

Vista previa: http://127.0.0.1:4173/

```sh
npm test
npm run test:browser
```

Las pruebas de navegador usan Microsoft Edge mediante Playwright. Si no está instalado, ejecutar `npx playwright install msedge` o cambiar el canal en `playwright.config.js`. Comprueban móvil y escritorio, filtros, enlaces compartidos, galerías, imágenes, idiomas, temas, errores de carga y almacenamiento bloqueado.

## Mantener el catálogo

`tools.json` es la única fuente del contenido público. Cada ficha contiene:

- `id`: identificador estable, sin tildes; conservarlo para no romper enlaces compartidos.
- `title`, `description.en/es`, `tags.en/es`: contenido bilingüe. Los nombres propios pueden conservar su idioma.
- `courses`: identificadores como `SPAN1001`; una lista vacía significa **General**.
- `type`: `game`, `reading`, `chatbot`, `activity` o `resource`.
- `link`: producción HTTPS verificada o documento local con `download: true`.
- `screenshots`: dos o tres imágenes WebP locales con `src` y `alt.en/es`.
- `dateAdded`: fecha de incorporación `YYYY-MM-DD`.
- Opcionalmente `variants`: accesos con `course`, `label` y `link`; y `aliases` para búsquedas alternativas.

Comprobar una interacción principal antes de añadir una herramienta. Preferir el enlace de Netlify cuando sea la producción verificada. Agrupar versiones del mismo proyecto; asignar cursos según el contenido o una decisión expresa, no por suponer un nivel. Revisar visualmente las capturas y evitar datos personales. Las imágenes están en `assets/tools/<id>/`; los documentos, en `assets/documents/`.

La selección actual reúne 26 fichas y 68 imágenes. Tras la revisión inicial de los 83 repositorios se retiraron 20 fichas por petición del autor. Mapamundi está asignado a SPAN1001; Sustantivos: artículos y cantidades, a SPAN1001 y SPAN1002.

El inventario de los 83 repositorios, las incidencias y la evidencia de revisión se guardan localmente en `.maintenance/inventory.html`, `.maintenance/inventory.json` y `.maintenance/verification.json`. Esta carpeta está excluida de Git y del despliegue porque también documenta herramientas internas. El portfolio es una fuente de consulta y no forma parte de este despliegue.

## Publicación

El sitio Netlify existente está conectado a la rama `main`. `netlify.toml` define `npm run build` y la carpeta de publicación `dist/`. El proceso de compilación copia únicamente los archivos públicos y `assets/`; excluye pruebas, inventarios y archivos de trabajo.

La reparación de Palabrero SPAN1002 pertenece a su repositorio independiente y se publicó antes de esta actualización. Conserva el tablero cuando falta una palabra diaria y permite acceder a práctica y archivo sin modificar el calendario de palabras.
