#!/usr/bin/env node
// Uso: node scripts/verify.mjs <informe.md> <evidencia.json> [evidencia2.json ...]
// La evidencia son las salidas de `bcrp.mjs get` (y, opcionalmente, un archivo
// {"constants":[{"value":1,"source":"meta BCRP"}]} con constantes citadas).
// Sale con código 0 si todas las cifras están verificadas, 1 si hay cifras sin verificar, 2 si hay error de uso.
import { readFile } from "node:fs/promises";
import { collectEvidence, verifyText } from "./lib/verify-core.mjs";
import { fileURLToPath } from "node:url";

async function main() {
  const [report, ...ev] = process.argv.slice(2);
  if (!report || ev.length === 0) { process.stderr.write("Uso: verify.mjs <informe.md> <evidencia.json> [...]\n"); process.exit(2); }
  let md, evidence = [];
  try {
    md = await readFile(report, "utf8");
    for (const f of ev) evidence = evidence.concat(collectEvidence(JSON.parse(await readFile(f, "utf8"))));
  } catch (e) { process.stderr.write(`Error leyendo archivos: ${e.message}\n`); process.exit(2); }
  const r = verifyText(md, evidence);
  for (const c of r.claims) {
    const tag = c.status === "verificada" ? "OK " : "??";
    const extra = c.status === "verificada" ? `← ${c.evidence.series ?? c.evidence.source ?? "evidencia"} ${c.evidence.period ?? ""}${c.matchedBySign ? " (valor absoluto)" : ""}` : (c.nearest ? `(valor más cercano en la evidencia: ${c.nearest.value})` : "(sin evidencia)");
    process.stdout.write(`${tag} línea ${c.line}: ${c.raw}${c.kind === "porcentaje" ? " %" : ""} ${extra}\n`);
  }
  process.stdout.write(`\n${r.verified}/${r.total} cifras verificadas. ${r.ok ? "Todo coincide con la evidencia." : `${r.unverified} sin verificar: corrige o elimina antes de entregar.`}\n`);
  process.exit(r.ok ? 0 : 1);
}
if (process.argv[1] === fileURLToPath(import.meta.url)) main();
