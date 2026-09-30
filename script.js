import { TYPES, selectTools, readState, selectionUrl } from "./catalog.js";
const $ = (id) => document.getElementById(id);
const copy = {
  en: {
    skip: "Skip to tools",
    programme: "Our programme",
    brandSub: "DISCOVER · PLAY · LEARN",
    collectionTitle: "Pick your next challenge",
    eyebrow: "YOUR SPANISH TOOLKIT",
    headline: "A little practice.",
    headlineAccent: "Mucho español.",
    intro:
      "Games, stories and a helping hand. Find your course and make Spanish part of your day.",
    note: "Play. Read.\nSpeak. Repeat.",
    searchLabel: "Search tools",
    searchPlaceholder: "What would you like to practise?",
    yourCourse: "YOUR COURSE",
    type: "Explore",
    sort: "Sort",
    alphabetical: "A–Z",
    newest: "Recently added",
    reset: "Clear filters",
    shareSelection: "Share selection",
    collectionHint: "A good day to learn something.",
    loading: "Opening the toolkit…",
    closing: "A few minutes. A new word. A little more confidence.",
    madeBy: "Made by Pablo Torrado",
    footer:
      "Spanish Programme · School of Modern Languages and Cultures\nThe University of Hong Kong",
    all: "All",
    general: "General",
    allTypes: "All resources",
    game: "Games",
    reading: "Readings",
    chatbot: "Chatbot",
    activity: "Activities",
    resource: "Resources",
    open: "Open",
    download: "Download",
    share: "Share",
    views: "screenshots",
    gallery: "See screenshots of",
    close: "Close",
    prev: "Previous image",
    next: "Next image",
    copyLink: "Copy link",
    copyManual: "Select and copy this link:",
    copied: "Link copied. Ready to share!",
    count: "resources to explore",
    forCourse: "For",
    forEveryone: "For every course",
    generalDescription: "More ways to practise, whatever your course.",
    empty: "No matches this time.",
    emptyDescription: "Try another word, course or activity.",
    error: "The toolkit could not be loaded.",
    retry: "Try again",
    dark: "Switch to dark mode",
    light: "Switch to light mode",
  },
  es: {
    skip: "Ir a las herramientas",
    programme: "Nuestro programa",
    brandSub: "DESCUBRE · JUEGA · APRENDE",
    collectionTitle: "Elige tu próximo reto",
    eyebrow: "TU CAJA DE HERRAMIENTAS",
    headline: "Un poco de práctica.",
    headlineAccent: "Mucho español.",
    intro:
      "Juegos, historias y una mano amiga. Encuentra tu curso y haz del español parte de tu día.",
    note: "Juega. Lee.\nHabla. Repite.",
    searchLabel: "Buscar herramientas",
    searchPlaceholder: "¿Qué te apetece practicar?",
    yourCourse: "TU CURSO",
    type: "Explorar",
    sort: "Ordenar",
    alphabetical: "A–Z",
    newest: "Últimas incorporaciones",
    reset: "Limpiar filtros",
    shareSelection: "Compartir selección",
    collectionHint: "Un buen día para aprender algo.",
    loading: "Abriendo las herramientas…",
    closing: "Unos minutos. Una palabra nueva. Un poco más de confianza.",
    madeBy: "Creado por Pablo Torrado",
    footer:
      "Programa de Español · School of Modern Languages and Cultures\nUniversidad de Hong Kong",
    all: "Todos",
    general: "General",
    allTypes: "Todos los recursos",
    game: "Juegos",
    reading: "Lecturas",
    chatbot: "Chatbot",
    activity: "Actividades",
    resource: "Recursos",
    open: "Abrir",
    download: "Descargar",
    share: "Compartir",
    views: "capturas",
    gallery: "Ver capturas de",
    close: "Cerrar",
    prev: "Imagen anterior",
    next: "Imagen siguiente",
    copyLink: "Copiar enlace",
    copyManual: "Selecciona y copia este enlace:",
    copied: "¡Enlace copiado! Listo para compartir.",
    count: "recursos para explorar",
    forCourse: "Para",
    forEveryone: "Para todos los cursos",
    generalDescription: "Más formas de practicar, sea cual sea tu curso.",
    empty: "No hay resultados esta vez.",
    emptyDescription: "Prueba otra palabra, curso o actividad.",
    error: "No se han podido cargar las herramientas.",
    retry: "Volver a intentar",
    dark: "Cambiar a modo oscuro",
    light: "Cambiar a modo claro",
  },
};
let tools = [],
  state = {
    lang: "en",
    q: "",
    course: "",
    type: "",
    sort: "alphabetical",
    tool: "",
  },
  galleryTool = null,
  imageIndex = 0,
  loaded = false,
  toastTimer;
const t = (key) => copy[state.lang][key] || key;
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}
function stored(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {}
}
let theme = stored("preferred-theme") === "dark" ? "dark" : "light";
function updateTheme() {
  document.documentElement.dataset.theme = theme;
  $("themeBtn").ariaLabel = t(theme === "light" ? "dark" : "light");
  $("themeBtn").title = $("themeBtn").ariaLabel;
  document.querySelector('meta[name="theme-color"]').content =
    theme === "dark" ? "#211f1b" : "#f1ebdd";
}
function translate() {
  document.documentElement.lang = state.lang;
  document.title =
    state.lang === "es"
      ? "Herramientas de español · HKU"
      : "Spanish Learning Tools · HKU";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  $("searchInput").placeholder = t("searchPlaceholder");
  $("languageBtn").textContent = state.lang === "en" ? "ES" : "EN";
  $("languageBtn").ariaLabel =
    state.lang === "en" ? "Cambiar a español" : "Switch to English";
  $("closeGallery").ariaLabel = t("close");
  $("closeShare").ariaLabel = t("close");
  $("prevImage").ariaLabel = t("prev");
  $("nextImage").ariaLabel = t("next");
  updateTheme();
  renderControls();
  if (galleryTool) renderGallery();
}
function renderControls() {
  const courses = [...new Set(tools.flatMap((tool) => tool.courses))].sort();
  $("courseFilters").replaceChildren(
    ...["", ...courses, "general"].map((course) => {
      const b = element(
        "button",
        "course-chip",
        course === "" ? t("all") : course === "general" ? t("general") : course,
      );
      b.type = "button";
      b.dataset.course = course;
      b.setAttribute("aria-pressed", String(state.course === course));
      b.addEventListener("click", () => {
        state.course = course;
        state.tool = "";
        changed();
        $("courseFilters")
          .querySelector('[aria-pressed="true"]')
          .focus({ preventScroll: true });
      });
      return b;
    }),
  );
  $("typeFilter").replaceChildren(
    ...["", ...TYPES].map((type) => {
      const option = element("option", "", t(type || "allTypes"));
      option.value = type;
      return option;
    }),
  );
  $("typeFilter").value = state.type;
  $("sortFilter").value = state.sort;
  $("searchInput").value = state.q;
}
function card(tool) {
  const article = element(
    "article",
    "tool-card" + (tool.id === state.tool ? " is-target" : ""),
  );
  article.id = "tool-" + tool.id;
  article.dataset.type = tool.type;
  article.tabIndex = -1;
  const shot = tool.screenshots[0];
  const thumb = element("button", "thumbnail-button");
  thumb.type = "button";
  thumb.ariaLabel = t("gallery") + " " + tool.title;
  const img = element("img");
  img.src = shot.src;
  img.alt = shot.alt[state.lang];
  img.width = 1200;
  img.height = 900;
  img.loading = "lazy";
  img.decoding = "async";
  thumb.append(
    img,
    element(
      "span",
      "image-count",
      tool.screenshots.length + " " + t("views") + " ↗",
    ),
  );
  thumb.addEventListener("click", () => {
    galleryTool = tool;
    imageIndex = 0;
    renderGallery();
    $("galleryDialog").showModal();
  });
  const body = element("div", "card-content");
  const eyebrow = element("div", "card-eyebrow");
  eyebrow.append(
    element("span", "type-label", t(tool.type)),
    element(
      "span",
      "card-course",
      tool.courses.length ? tool.courses.join(" · ") : t("general"),
    ),
  );
  body.append(
    eyebrow,
    element("h3", "tool-title", tool.title),
    element("p", "tool-description", tool.description[state.lang]),
  );
  const tags = element("div", "tool-tags");
  tool.tags[state.lang]
    .slice(0, 3)
    .forEach((tag) => tags.append(element("span", "tag", tag)));
  body.append(tags);
  const footer = element("div", "tool-footer");
  function link(url, text, cls) {
    const a = element("a", cls, text);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }
  if (tool.variants?.length) {
    const variants = element("div", "variant-links");
    for (const variant of tool.variants) {
      const a = link(
        variant.link,
        variant.label + " ↗",
        "variant-link" +
          (state.course === variant.course ? " is-selected" : ""),
      );
      a.ariaLabel = t("open") + " " + tool.title + " " + variant.label;
      variants.append(a);
    }
    footer.append(variants);
  } else {
    const a = link(tool.link, "", "open-link");
    a.append(
      element("span", "", t(tool.download ? "download" : "open")),
      element("span", "", "↗"),
    );
    a.ariaLabel = t(tool.download ? "download" : "open") + " " + tool.title;
    footer.append(a);
  }
  const share = element("button", "share-tool", "⧉");
  share.type = "button";
  share.ariaLabel = t("share") + " " + tool.title;
  share.title = share.ariaLabel;
  share.addEventListener("click", () =>
    shareUrl(selectionUrl(location.href, state, tool).href),
  );
  footer.append(share);
  body.append(footer);
  article.append(thumb, body);
  return article;
}
function render() {
  if (!loaded) return;
  const selected = selectTools(tools, state);
  $("resultCount").textContent = selected.length + " " + t("count");
  const host = $("collection");
  host.replaceChildren();
  if (!selected.length) {
    const box = element("div", "empty-state");
    box.append(
      element("h2", "", t("empty")),
      element("p", "", t("emptyDescription")),
    );
    const b = element("button", "", t("reset"));
    b.onclick = clearFilters;
    box.append(b);
    host.append(box);
    return;
  }
  function section(items, title, description) {
    if (!items.length) return;
    const section = element("section");
    if (title) {
      const heading = element("div", "section-heading");
      heading.append(
        element("h2", "", title),
        element("span", "", String(items.length)),
      );
      section.append(heading);
      if (description)
        section.append(element("p", "section-description", description));
    }
    const grid = element("div", "tools-grid");
    grid.append(...items.map(card));
    section.append(grid);
    host.append(section);
  }
  if (state.course && state.course !== "general") {
    section(
      selected.filter((x) => x.courses.includes(state.course)),
      t("forCourse") + " " + state.course,
    );
    section(
      selected.filter((x) => !x.courses.length),
      t("forEveryone"),
      t("generalDescription"),
    );
  } else section(selected);
}
function changed() {
  history.replaceState(null, "", selectionUrl(location.href, state));
  renderControls();
  render();
}
function clearFilters() {
  Object.assign(state, {
    q: "",
    course: "",
    type: "",
    sort: "alphabetical",
    tool: "",
  });
  changed();
}
function renderGallery() {
  const shot = galleryTool.screenshots[imageIndex];
  $("galleryTitle").textContent = galleryTool.title;
  $("galleryImage").src = shot.src;
  $("galleryImage").alt = shot.alt[state.lang];
  $("galleryCaption").textContent =
    imageIndex +
    1 +
    " / " +
    galleryTool.screenshots.length +
    " · " +
    shot.alt[state.lang];
  $("prevImage").disabled = $("nextImage").disabled =
    galleryTool.screenshots.length < 2;
}
function advance(delta) {
  imageIndex =
    (imageIndex + delta + galleryTool.screenshots.length) %
    galleryTool.screenshots.length;
  renderGallery();
}
async function shareUrl(url) {
  try {
    await navigator.clipboard.writeText(url);
    $("toast").textContent = t("copied");
    $("toast").hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => ($("toast").hidden = true), 3500);
  } catch {
    $("shareUrl").value = url;
    $("shareDialog").showModal();
    $("shareUrl").focus();
    $("shareUrl").select();
  }
}
function focusSharedTool() {
  if (!state.tool) return;
  const node = $("tool-" + state.tool);
  if (node) {
    requestAnimationFrame(() => {
      node.scrollIntoView({ block: "center" });
      node.focus({ preventScroll: true });
    });
  }
}
async function load() {
  $("collection").replaceChildren(element("div", "empty-state", t("loading")));
  try {
    const response = await fetch("tools.json");
    if (!response.ok) throw new Error("Could not load catalogue");
    const data = await response.json();
    if (!Array.isArray(data.tools)) throw new Error("Invalid catalogue");
    tools = data.tools;
    state = readState(location.search, tools);
    loaded = true;
    translate();
    render();
    focusSharedTool();
  } catch {
    const box = element("div", "empty-state");
    box.append(element("h2", "", t("error")));
    const retry = element("button", "", t("retry"));
    retry.onclick = load;
    box.append(retry);
    $("collection").replaceChildren(box);
  }
}
let searchTimer;
$("searchForm").addEventListener("submit", (e) => e.preventDefault());
$("searchInput").addEventListener("input", (e) => {
  state.q = e.target.value;
  state.tool = "";
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    history.replaceState(null, "", selectionUrl(location.href, state));
    render();
  }, 100);
});
$("typeFilter").addEventListener("change", (e) => {
  state.type = e.target.value;
  state.tool = "";
  changed();
});
$("sortFilter").addEventListener("change", (e) => {
  state.sort = e.target.value;
  changed();
});
$("resetBtn").onclick = clearFilters;
$("languageBtn").onclick = () => {
  state.lang = state.lang === "en" ? "es" : "en";
  translate();
  changed();
};
$("themeBtn").onclick = () => {
  theme = theme === "light" ? "dark" : "light";
  save("preferred-theme", theme);
  updateTheme();
};
$("shareFiltersBtn").onclick = () =>
  shareUrl(selectionUrl(location.href, state).href);
$("closeGallery").onclick = () => $("galleryDialog").close();
$("closeShare").onclick = () => $("shareDialog").close();
$("prevImage").onclick = () => advance(-1);
$("nextImage").onclick = () => advance(1);
$("galleryDialog").addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
    e.preventDefault();
    advance(e.key === "ArrowLeft" ? -1 : 1);
  }
});
for (const id of ["galleryDialog", "shareDialog"])
  $(id).addEventListener("click", (e) => {
    if (e.target === $(id)) {
      const rect = $(id).getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      )
        $(id).close();
    }
  });
window.addEventListener("popstate", () => {
  state = readState(location.search, tools);
  translate();
  render();
  focusSharedTool();
});
state.lang =
  new URLSearchParams(location.search).get("lang") === "es" ? "es" : "en";
translate();
load();
