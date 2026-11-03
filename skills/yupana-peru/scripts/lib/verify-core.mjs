// Verificador de cifras: contrasta los números de un texto con la evidencia descargada.
// Idea: una cifra es "verificada" solo si coincide (con el redondeo escrito) con un valor
// que viene de una consulta registrada. Lo demás es "no_encontrada" y debe revisarse.
// Límite conocido: no entiende unidades ni escalas ("millones"), y una cifra entera
// (p. ej. "12") coincide con cualquier valor que redondee a 12. Es un control, no una prueba formal.

const TOL = 1e-9;

export function parseNumberToken(tok) {
  const t = String(tok).replace(/[\s ]/g, "");
  const dots = (t.match(/\./g) || []).length;
  const commas = (t.match(/,/g) || []).length;
  const out = (s, decimals) => ({ value: Number(s), decimals });
  if (dots && commas) {
    const dec = t.lastIndexOf(".") > t.lastIndexOf(",") ? "." : ",";
    const thou = dec === "." ? "," : ".";
    const [int, frac = ""] = t.split(dec);
    return [out(int.split(thou).join("") + (frac ? "." + frac : ""), frac.length)];
  }
  const sep = commas ? "," : dots ? "." : null;
  if (!sep) return [out(t, 0)];
  const n = sep === "," ? commas : dots;
  const parts = t.split(sep);
  if (n > 1) return [out(parts.join(""), 0)]; // varios separadores iguales: miles
  const [a, b] = parts;
  if (b.length === 3 && a.length >= 1 && a.length <= 3) return [out(a + b, 0), out(`${a}.${b}`, 3)]; // ambiguo: miles o decimal
  return [out(`${a}.${b}`, b.length)];
}

const MESES = "enero|febrero|marzo|abril|mayo|junio|julio|agosto|setiembre|septiembre|octubre|noviembre|diciembre";

function cleanLine(line) {
  return line
    .replace(/`[^`]*`/g, " ")
    .replace(/\{\{[^}]*\}\}/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\]\([^)]*\)/g, "] ")
    .replace(/\[\d+(?:\s*[,\-–]\s*\d+)*\]/g, " ")                 // marcadores de cita [1], [1,2]
    .replace(/\b[A-Z]{2}\d{5}[A-Z]{2}\b/g, " ")                    // códigos de serie del BCRP
    .replace(/\b\d{4}-\d{1,2}(?:-\d{1,2})?\b/g, " ")               // fechas AAAA-M(-D)
    .replace(/\b[TQ][1-4][.\s]?\d{4}\b/gi, " ")                    // T1.2024, Q1 2024
    .replace(new RegExp(`\\b\\d{1,2}\\s+de\\s+(?:${MESES})(?:\\s+de\\s+\\d{4})?`, "gi"), " ") // "15 de enero de 2024"
    .replace(/\b(?:19|20)\d{2}\b(?![.,]\d)/g, " ")                 // años sueltos
    .replace(/^\s*\d+[.)]\s+/, " ");                               // numeración de listas
}

const NUM = /(?<![\w.,])(\d{1,3}(?:[  ]\d{3})+(?:[.,]\d+)?|\d+(?:[.,]\d+)*)(?!\w)/g;

export function extractClaims(md) {
  const claims = [];
  let skipping = false;
  const lines = String(md).split(/\r?\n/);
  lines.forEach((line, i) => {
    const h = line.match(/^(#{1,6})\s*(.*)$/);
    if (h) { skipping = /^(fuentes|referencias)\b/i.test(h[2].trim()); return; } // los títulos no se verifican
    if (skipping) return;
    const clean = cleanLine(line);
    for (const m of clean.matchAll(NUM)) {
      const after = clean.slice(m.index + m[0].length, m.index + m[0].length + 3);
      claims.push({ raw: m[0], line: i + 1, kind: /^\s*%/.test(after) ? "porcentaje" : "numero" });
    }
  });
  return claims;
}

export function collectEvidence(input) {
  const out = [];
  const walk = (x, ctx = {}) => {
    if (Array.isArray(x)) { x.forEach((y) => walk(y, ctx)); return; }
    if (!x || typeof x !== "object") return;
    const c = typeof x.name === "string" && Array.isArray(x.points) ? { ...ctx, series: x.name } : ctx;
    if (typeof x.value === "number" && Number.isFinite(x.value)) out.push({ value: x.value, period: x.period ?? null, series: c.series ?? null, source: x.source ?? null });
    for (const [k, v] of Object.entries(x)) if (k !== "value") walk(v, c);
  };
  walk(input);
  return out;
}

const round = (v, d) => Math.round(Math.abs(v) * 10 ** d) / 10 ** d;

export function verifyText(md, evidence) {
  const claims = extractClaims(md).map((c) => {
    const cands = parseNumberToken(c.raw);
    for (const cand of cands) {
      const hit = evidence.find((e) => Math.abs(round(e.value, cand.decimals) - cand.value) < TOL);
      if (hit) return { ...c, value: cand.value, status: "verificada", evidence: hit, matchedBySign: hit.value < 0 };
    }
    const first = cands[0];
    const nearest = evidence.length ? evidence.reduce((a, b) => (Math.abs(Math.abs(b.value) - first.value) < Math.abs(Math.abs(a.value) - first.value) ? b : a)) : null;
    return { ...c, value: first.value, status: "no_encontrada", nearest };
  });
  const unverified = claims.filter((c) => c.status !== "verificada").length;
  return { ok: unverified === 0, total: claims.length, verified: claims.length - unverified, unverified, claims };
}
