#!/usr/bin/env node
// Uso: node scripts/bcrp.mjs get <CÓDIGO[,CÓDIGO...]> <desde> <hasta> [--calc prev|yoy|ytd|ma:N]
// Ejemplo: node scripts/bcrp.mjs get CODIGO 2024-1 2025-6 --calc yoy
// Salida: JSON por stdout con series, cálculo opcional y la cita (fuente, URL, fecha de consulta).
import { fetchSeries, BcrpError } from "./lib/bcrp-client.mjs";
import { varPrevia, varInteranual, varAcumuladaAnio, mediaMovil } from "./lib/calc.mjs";

const USO = `Uso: bcrp.mjs get <códigos separados por coma> <desde> <hasta> [--calc prev|yoy|ytd|ma:N]
Fechas: AAAA-M (ej. 2024-1). Los códigos salen de https://estadisticas.bcrp.gob.pe/estadisticas/series/`;

export function parseArgs(argv) {
  const [cmd, codes, from, to, ...rest] = argv;
  if (cmd !== "get" || !codes || !from || !to) throw new Error(USO);
  let calc = null;
  const i = rest.indexOf("--calc");
  if (i !== -1) {
    calc = rest[i + 1];
    if (!calc || !/^(prev|yoy|ytd|ma:\d+)$/.test(calc)) throw new Error("--calc debe ser prev, yoy, ytd o ma:N");
  }
  return { codes: codes.split(",").map((c) => c.trim()).filter(Boolean), from, to, calc };
}

export function applyCalc(points, calc) {
  if (!calc) return null;
  if (calc === "prev") return varPrevia(points);
  if (calc === "yoy") return varInteranual(points);
  if (calc === "ytd") return varAcumuladaAnio(points);
  return mediaMovil(points, Number(calc.split(":")[1]));
}

async function main() {
  try {
    const { codes, from, to, calc } = parseArgs(process.argv.slice(2));
    const r = await fetchSeries(codes, from, to);
    const out = { ...r, series: r.series.map((s) => ({ ...s, calc: calc ? { type: calc, points: applyCalc(s.points, calc) } : undefined })) };
    process.stdout.write(JSON.stringify(out, null, 2) + "\n");
  } catch (e) {
    process.stderr.write(`Error: ${e.message}\n`);
    process.exit(e instanceof BcrpError ? 2 : 1);
  }
}

import { fileURLToPath } from "node:url";
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
