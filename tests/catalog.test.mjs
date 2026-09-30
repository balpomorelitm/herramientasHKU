import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import {
  TYPES,
  normalize,
  selectTools,
  readState,
  selectionUrl,
} from "../catalog.js";
const { tools } = JSON.parse(
  await readFile(new URL("../tools.json", import.meta.url)),
);
const base = {
  lang: "en",
  q: "",
  course: "",
  type: "",
  sort: "alphabetical",
  tool: "",
};
test("every published resource has complete bilingual content, valid local images and distinct links", async () => {
  const ids = new Set(),
    links = new Set();
  for (const tool of tools) {
    assert.match(tool.id, /^[a-z0-9-]+$/);
    assert(!ids.has(tool.id));
    ids.add(tool.id);
    assert(!links.has(tool.link));
    links.add(tool.link);
    assert(TYPES.includes(tool.type));
    assert.match(tool.dateAdded, /^\d{4}-\d{2}-\d{2}$/);
    assert.equal(new Set(tool.courses).size, tool.courses.length);
    for (const c of tool.courses) assert.match(c, /^SPAN\d{4}$/);
    for (const lang of ["en", "es"]) {
      assert(tool.description[lang]);
      assert(tool.tags[lang].length);
    }
    if (tool.download)
      assert(
        (await stat(new URL("../" + tool.link, import.meta.url))).size > 1000,
      );
    else assert.equal(new URL(tool.link).protocol, "https:");
    assert(tool.screenshots.length >= (tool.download ? 1 : 2));
    assert(tool.screenshots.length <= 3);
    for (const shot of tool.screenshots) {
      assert.match(shot.src, /^assets\/tools\/[a-z0-9-]+\/\d{2}\.webp$/);
      assert(
        (await stat(new URL("../" + shot.src, import.meta.url))).size > 1000,
      );
      for (const lang of ["en", "es"]) assert(shot.alt[lang]);
    }
    for (const v of tool.variants || []) {
      assert(tool.courses.includes(v.course));
      assert.equal(new URL(v.link).protocol, "https:");
    }
  }
  assert(!JSON.stringify(tools).includes("\ufffd"));
});
test("each course returns its own resources and all general resources only", () => {
  const general = tools.filter((t) => !t.courses.length);
  for (const course of new Set(tools.flatMap((t) => t.courses))) {
    const selected = selectTools(tools, { ...base, course });
    assert(
      selected.every((t) => !t.courses.length || t.courses.includes(course)),
    );
    assert(general.every((t) => selected.includes(t)));
    assert(
      tools
        .filter((t) => t.courses.includes(course))
        .every((t) => selected.includes(t)),
    );
  }
  assert.deepEqual(
    selectTools(tools, { ...base, course: "general" })
      .map((t) => t.id)
      .sort(),
    general.map((t) => t.id).sort(),
  );
  const bot = tools.find((t) => t.id === "profebot");
  assert.deepEqual(bot.courses, ["SPAN1001", "SPAN1002"]);
  assert(!selectTools(tools, { ...base, course: "SPAN2001" }).includes(bot));
  assert.equal(bot.link, "https://profebotsphku.streamlit.app/");
  assert(!bot.variants);
  const pal = tools.filter((t) => t.id === "palabrero");
  assert.equal(pal.length, 1);
  assert.deepEqual(
    pal[0].variants.map((v) => v.course),
    ["SPAN1001", "SPAN1002", "SPAN2001"],
  );
  for (const [id, course] of [
    ["elalmadesevilla", "SPAN1001"],
    ["elultimotango", "SPAN1002"],
    ["latido-latino", "SPAN2001"],
  ])
    assert.deepEqual(tools.find((t) => t.id === id).courses, [course]);
});
test("search ignores accents and case, spans both languages and combines with type/course", () => {
  assert.equal(normalize("  COMPRENSIÓN  "), "comprension");
  assert(
    selectTools(tools, {
      ...base,
      q: "comprension oral",
      course: "SPAN1002",
      type: "activity",
    }).some((t) => t.id === "mocktest-span1002"),
  );
  assert(
    selectTools(tools, { ...base, q: "VOCABULARY", type: "game" }).every(
      (t) => t.type === "game",
    ),
  );
  assert.equal(selectTools(tools, { ...base, q: "zzzxmissing" }).length, 0);
});
test("share links preserve validated state and individual tool/course", () => {
  const state = {
    ...base,
    course: "SPAN1001",
    q: "números",
    type: "game",
    sort: "date",
    lang: "es",
  };
  assert.deepEqual(
    readState(selectionUrl("https://example.com/", state).search, tools),
    state,
  );
  const pal = tools.find((t) => t.id === "palabrero");
  const url = selectionUrl("https://example.com/?old=x#hash", state, pal);
  assert.equal(url.searchParams.get("tool"), "palabrero");
  assert.equal(url.searchParams.get("course"), "SPAN1001");
  assert(!url.searchParams.has("q"));
  assert.equal(url.hash, "");
  assert.deepEqual(
    readState("?course=invalid&type=invalid&tool=invalid", tools),
    base,
  );
});
