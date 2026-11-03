// Prueba contra la API real del BCRP. Solo corre con BCRP_LIVE=1 y acceso a la red (la API no requiere clave).
// Confirma que el esquema de respuesta es el esperado. Reemplace CODE por una serie real
// de https://estadisticas.bcrp.gob.pe/estadisticas/series/
import test from "node:test";
import assert from "node:assert/strict";
import { fetchSeries } from "../../skills/yupana-peru/scripts/lib/bcrp-client.mjs";

const LIVE = process.env.BCRP_LIVE === "1";
const CODE = process.env.BCRP_CODE || "PN01288PM"; // código usado en los ejemplos de la guía oficial de la API

test("API real: devuelve series con periodos y valores", { skip: !LIVE }, async () => {
  const r = await fetchSeries([CODE], "2024-1", "2024-6");
  assert.ok(r.series.length >= 1);
  assert.ok(r.series[0].points.length >= 1);
  assert.ok(typeof r.series[0].points[0].period === "string");
});
