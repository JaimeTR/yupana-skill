// Cálculos sobre series [{period: "Ene.2020", value: number|null}, ...] ordenadas en el tiempo.
// Reglas: un valor ausente (null) produce null; nunca se interpola ni se rellena.
import { parsePeriod, PERIODS_PER_YEAR } from "./periods.mjs";

function pct(now, before) {
  if (now == null || before == null || before === 0) return null;
  return (now / before - 1) * 100;
}

function indexByKey(points) {
  const map = new Map();
  for (const p of points) {
    const info = parsePeriod(p.period);
    if (info) map.set(`${info.freq}:${info.year}:${info.index}`, p.value);
  }
  return map;
}

// Variación porcentual respecto al periodo anterior (m/m, t/t o a/a según frecuencia).
export function varPrevia(points) {
  return points.map((p, i) => ({ period: p.period, value: i === 0 ? null : pct(p.value, points[i - 1].value) }));
}

// Variación porcentual respecto al mismo periodo del año anterior (interanual).
export function varInteranual(points) {
  const idx = indexByKey(points);
  return points.map((p) => {
    const info = parsePeriod(p.period);
    if (!info) return { period: p.period, value: null };
    const before = idx.get(`${info.freq}:${info.year - 1}:${info.index}`);
    return { period: p.period, value: pct(p.value, before ?? null) };
  });
}

// Variación acumulada en el año respecto al cierre (último periodo) del año anterior.
// Para series de nivel (índices). Requiere el último periodo del año anterior.
export function varAcumuladaAnio(points) {
  const idx = indexByKey(points);
  return points.map((p) => {
    const info = parsePeriod(p.period);
    if (!info) return { period: p.period, value: null };
    const n = PERIODS_PER_YEAR[info.freq];
    const base = idx.get(`${info.freq}:${info.year - 1}:${n}`);
    return { period: p.period, value: pct(p.value, base ?? null) };
  });
}

// Media móvil simple de ventana w; null si hay algún null en la ventana.
export function mediaMovil(points, w) {
  if (!Number.isInteger(w) || w < 1) throw new Error("La ventana debe ser un entero >= 1");
  return points.map((p, i) => {
    if (i < w - 1) return { period: p.period, value: null };
    const win = points.slice(i - w + 1, i + 1).map((q) => q.value);
    if (win.some((v) => v == null)) return { period: p.period, value: null };
    return { period: p.period, value: win.reduce((a, b) => a + b, 0) / w };
  });
}
