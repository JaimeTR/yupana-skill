// Cliente de la API pública de BCRPData (Banco Central de Reserva del Perú).
// Patrón de URL (guía oficial): /api/{códigos}/{formato}/{desde}/{hasta}/{idioma}
//
// ESTADO: la forma de la URL está CONFIRMADA con la guía oficial. El esquema JSON de la
// respuesta ({config:{title,series:[{name}]}, periods:[{name, values:[...]}]}) aún debe
// confirmarse con una respuesta real (ver tests/fixtures y `npm run test:live`).

export const BASE_URL = "https://estadisticas.bcrp.gob.pe/estadisticas/series/api";

export class BcrpError extends Error {
  constructor(message, { status, url } = {}) {
    super(message);
    this.name = "BcrpError";
    this.status = status;
    this.url = url;
  }
}

// Reglas de la guía oficial "API para Desarrolladores" de BCRPData:
// - de 1 a 10 códigos separados por guion; deben ser de la misma frecuencia (si no, solo se muestran los de la primera);
// - periodo inicial y final opcionales: sin periodos se devuelven los datos más recientes; con uno solo, es una consulta de esa fecha;
// - el idioma (esp/ing) va después de los dos periodos.
// - No requiere clave ni suscripción.
export const MAX_SERIES = 10;
const DATE = /^\d{4}(-\d{1,2}){0,2}$/; // AAAA, AAAA-M o AAAA-M-D: evita inyectar rutas o parámetros

export function buildUrl(codes, from, to, lang = "esp") {
  if (!Array.isArray(codes) || codes.length === 0) throw new BcrpError("Falta al menos un código de serie");
  if (codes.length > MAX_SERIES) throw new BcrpError(`El BCRP admite como máximo ${MAX_SERIES} series por consulta`);
  for (const c of codes) if (!/^[A-Za-z0-9]+$/.test(c)) throw new BcrpError(`Código de serie inválido: ${c}`);
  if (to && !from) throw new BcrpError("Si indicas periodo final, indica también el inicial");
  for (const d of [from, to]) if (d && !DATE.test(String(d))) throw new BcrpError("Fechas inválidas: usa AAAA-M (ej. 2024-1, 2025-6)");
  if (!["esp", "ing"].includes(lang)) throw new BcrpError("Idioma no válido: usa esp o ing");
  if (lang !== "esp" && !(from && to)) throw new BcrpError("El idioma solo puede cambiarse indicando periodo inicial y final");
  const parts = [BASE_URL, codes.join("-"), "json"];
  if (from) parts.push(from);
  if (to) parts.push(to);
  if (from && to) parts.push(lang);
  return parts.join("/");
}

export function parseResponse(raw, { url, retrievedAt } = {}) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.periods) || !raw.config) {
    throw new BcrpError("Respuesta del BCRP con formato inesperado", { url });
  }
  const series = (raw.config.series ?? []).map((s) => ({ name: s.name }));
  const toNum = (v) => {
    if (v === null || v === undefined) return null;
    const t = String(v).trim();
    if (t === "" || t === "n.d." || t === "n.d" || t === "-") return null;
    const n = Number(t.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  };
  const columns = series.map((_, i) =>
    raw.periods.map((p) => ({ period: p.name, value: toNum(p.values?.[i]) })),
  );
  return {
    title: raw.config.title ?? "",
    series: series.map((s, i) => ({ ...s, points: columns[i] })),
    source: { name: "BCRPData", url, retrievedAt: retrievedAt ?? new Date().toISOString() },
  };
}

export async function fetchSeries(codes, from, to, { lang = "esp", fetchImpl = fetch } = {}) {
  const url = buildUrl(codes, from, to, lang);
  let res;
  try {
    res = await fetchImpl(url);
  } catch (e) {
    throw new BcrpError(`No se pudo conectar con el BCRP: ${e.message}`, { url });
  }
  if (!res.ok) throw new BcrpError(`El BCRP respondió ${res.status}`, { status: res.status, url });
  let raw;
  try {
    raw = await res.json();
  } catch {
    throw new BcrpError("El BCRP no devolvió JSON válido", { url });
  }
  return parseResponse(raw, { url });
}
