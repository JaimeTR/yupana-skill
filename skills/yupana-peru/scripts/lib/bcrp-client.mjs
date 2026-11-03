// Cliente de la API pública de BCRPData (Banco Central de Reserva del Perú).
// Patrón de URL (guía oficial bcrpdataapi.pdf): /api/{códigos}/{formato}/{desde}/{hasta}/{idioma}
// Varias series se separan con "-". Fechas: "2024-1" (mensual).
//
// ESTADO: el esquema JSON de respuesta está implementado según lo conocido
// ({config:{title,series:[{name}]}, periods:[{name, values:[...]}]}) y debe
// confirmarse con una respuesta real: ejecutar `npm run test:live`.

export const BASE_URL = "https://estadisticas.bcrp.gob.pe/estadisticas/series/api";

export class BcrpError extends Error {
  constructor(message, { status, url } = {}) {
    super(message);
    this.name = "BcrpError";
    this.status = status;
    this.url = url;
  }
}

export function buildUrl(codes, from, to, lang = "esp") {
  if (!Array.isArray(codes) || codes.length === 0) throw new BcrpError("Falta al menos un código de serie");
  for (const c of codes) if (!/^[A-Za-z0-9]+$/.test(c)) throw new BcrpError(`Código de serie inválido: ${c}`);
  // Solo se aceptan fechas AAAA, AAAA-M o AAAA-M-D: evita inyectar rutas o parámetros en la URL.
  const DATE = /^\d{4}(-\d{1,2}){0,2}$/;
  if (!DATE.test(String(from)) || !DATE.test(String(to))) throw new BcrpError("Fechas inválidas: usa AAAA-M (ej. 2024-1, 2025-6)");
  if (!["esp", "ing"].includes(lang)) throw new BcrpError("Idioma no válido: usa esp o ing");
  return `${BASE_URL}/${codes.join("-")}/json/${from}/${to}/${lang}`;
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
