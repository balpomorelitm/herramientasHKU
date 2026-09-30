export const TYPES = ["game", "reading", "chatbot", "activity", "resource"];
export function normalize(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
export function selectTools(tools, state) {
  const query = normalize(state.q || "");
  return tools
    .filter((tool) => {
      const terms = normalize(
        [
          tool.title,
          tool.description.en,
          tool.description.es,
          ...tool.courses,
          ...tool.tags.en,
          ...tool.tags.es,
          ...(tool.aliases || []),
        ].join(" "),
      );
      const courseMatch =
        !state.course ||
        (state.course === "general"
          ? tool.courses.length === 0
          : tool.courses.length === 0 || tool.courses.includes(state.course));
      return (
        (!query || query.split(/\s+/).every((term) => terms.includes(term))) &&
        (!state.type || tool.type === state.type) &&
        courseMatch
      );
    })
    .sort((a, b) =>
      state.sort === "date"
        ? (b.dateAdded || "").localeCompare(a.dateAdded || "") ||
          a.title.localeCompare(b.title, state.lang)
        : a.title.localeCompare(b.title, state.lang),
    );
}
export function readState(search, tools) {
  const p = new URLSearchParams(search);
  const courses = new Set(tools.flatMap((t) => t.courses));
  return {
    q: p.get("q") || "",
    course:
      courses.has(p.get("course")) || p.get("course") === "general"
        ? p.get("course")
        : "",
    type: TYPES.includes(p.get("type")) ? p.get("type") : "",
    sort: p.get("sort") === "date" ? "date" : "alphabetical",
    tool: tools.some((t) => t.id === p.get("tool")) ? p.get("tool") : "",
    lang: p.get("lang") === "es" ? "es" : "en",
  };
}
export function selectionUrl(base, state, tool) {
  const url = new URL(base);
  url.search = "";
  url.hash = "";
  if (tool) {
    url.searchParams.set("tool", tool.id);
    if (state.course && tool.courses.includes(state.course))
      url.searchParams.set("course", state.course);
  } else {
    for (const key of ["q", "course", "type"])
      if (state[key]) url.searchParams.set(key, state[key]);
    if (state.sort === "date") url.searchParams.set("sort", "date");
    if (state.tool) url.searchParams.set("tool", state.tool);
  }
  if (state.lang === "es") url.searchParams.set("lang", "es");
  return url;
}
