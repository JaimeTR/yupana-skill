import test from "node:test";
import assert from "node:assert/strict";
import { buildUrl, parseResponse, fetchSeries, BcrpError } from "../../skills/yupana-peru/scripts/lib/bcrp-client.mjs";

// FIXTURE SINTÉTICO: forma esperada de la respuesta, valores inventados. No es un dato real.
const sintetico = {
  config: { title: "Serie de prueba", series: [{ name: "A" }, { name: "B" }] },
  periods: [
    { name: "Ene.2024", values: ["1.5", "n.d."] },
    { name: "Feb.2024", values: ["2,000.25", "3"] },
  ],
};

test("buildUrl: una y varias series", () => {
  assert.match(buildUrl(["PN00001MM"], "2024-1", "2024-6"), /\/api\/PN00001MM\/json\/2024-1\/2024-6\/esp$/);
  assert.match(buildUrl(["A1", "B2"], "2024-1", "2024-6", "ing"), /\/api\/A1-B2\/json\/2024-1\/2024-6\/ing$/);
});
test("buildUrl rechaza códigos peligrosos o vacíos", () => {
  assert.throws(() => buildUrl([], "2024-1", "2024-2"), BcrpError);
  assert.throws(() => buildUrl(["../x"], "2024-1", "2024-2"), BcrpError);
  assert.throws(() => buildUrl(["A1"], "", "2024-2"), BcrpError);
});
test("parseResponse: columnas por serie, n.d. -> null, separador de miles", () => {
  const r = parseResponse(sintetico, { url: "u", retrievedAt: "2026-01-01T00:00:00Z" });
  assert.equal(r.series.length, 2);
  assert.deepEqual(r.series[0].points, [{ period: "Ene.2024", value: 1.5 }, { period: "Feb.2024", value: 2000.25 }]);
  assert.deepEqual(r.series[1].points, [{ period: "Ene.2024", value: null }, { period: "Feb.2024", value: 3 }]);
  assert.deepEqual(r.source, { name: "BCRPData", url: "u", retrievedAt: "2026-01-01T00:00:00Z" });
});
test("parseResponse: formato inesperado lanza error claro", () => {
  assert.throws(() => parseResponse({ foo: 1 }), BcrpError);
  assert.throws(() => parseResponse(null), BcrpError);
});
test("fetchSeries: HTTP de error -> BcrpError con status", async () => {
  const fake = async () => ({ ok: false, status: 503 });
  await assert.rejects(fetchSeries(["A1"], "2024-1", "2024-2", { fetchImpl: fake }), (e) => e instanceof BcrpError && e.status === 503);
});
test("fetchSeries: sin red -> error explícito, nunca datos inventados", async () => {
  const fake = async () => { throw new Error("ENOTFOUND"); };
  await assert.rejects(fetchSeries(["A1"], "2024-1", "2024-2", { fetchImpl: fake }), /No se pudo conectar/);
});
test("fetchSeries: éxito devuelve cita con URL", async () => {
  const fake = async () => ({ ok: true, status: 200, json: async () => sintetico });
  const r = await fetchSeries(["A1", "B2"], "2024-1", "2024-2", { fetchImpl: fake });
  assert.match(r.source.url, /A1-B2/);
  assert.ok(r.source.retrievedAt);
});
