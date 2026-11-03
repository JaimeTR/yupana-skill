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

// Ejemplos tomados de la guía oficial "API para Desarrolladores" de BCRPData (formato json).
test("buildUrl reproduce los ejemplos oficiales", () => {
  const B = "https://estadisticas.bcrp.gob.pe/estadisticas/series/api";
  assert.equal(buildUrl(["PN01288PM"], "2010-1", "2016-9"), `${B}/PN01288PM/json/2010-1/2016-9/esp`);
  assert.equal(buildUrl(["PN01288PM", "PN01289PM"], "2013-1", "2016-9"), `${B}/PN01288PM-PN01289PM/json/2013-1/2016-9/esp`);
  assert.equal(buildUrl(["PN01288PM"], "2010-1", "2016-9", "ing"), `${B}/PN01288PM/json/2010-1/2016-9/ing`);
});
test("buildUrl: sin fechas (más recientes) o con una sola fecha", () => {
  const B = "https://estadisticas.bcrp.gob.pe/estadisticas/series/api";
  assert.equal(buildUrl(["PN01270PM"]), `${B}/PN01270PM/json`);
  assert.equal(buildUrl(["PN01288PM"], "2016-9"), `${B}/PN01288PM/json/2016-9`);
});
test("buildUrl: máximo 10 series, periodo final exige inicial, idioma exige ambos periodos", () => {
  const diez = Array.from({ length: 10 }, (_, i) => `PN0000${i}PM`);
  assert.ok(buildUrl(diez));
  assert.throws(() => buildUrl([...diez, "PN99999PM"]), /como máximo 10/);
  assert.throws(() => buildUrl(["A1"], undefined, "2016-9"), BcrpError);
  assert.throws(() => buildUrl(["A1"], "2016-9", undefined, "ing"), BcrpError);
});
test("buildUrl: una y varias series", () => {
  assert.match(buildUrl(["PN00001MM"], "2024-1", "2024-6"), /\/api\/PN00001MM\/json\/2024-1\/2024-6\/esp$/);
  assert.match(buildUrl(["A1", "B2"], "2024-1", "2024-6", "ing"), /\/api\/A1-B2\/json\/2024-1\/2024-6\/ing$/);
});
test("buildUrl rechaza códigos peligrosos o vacíos", () => {
  assert.throws(() => buildUrl([], "2024-1", "2024-2"), BcrpError);
  assert.throws(() => buildUrl(["../x"], "2024-1", "2024-2"), BcrpError);
  assert.throws(() => buildUrl(["A1"], "abc", "2024-2"), BcrpError);
});
test("buildUrl rechaza fechas e idioma que intenten alterar la URL", () => {
  for (const bad of ["2024-1/../x", "2024-1?a=b", "2024-1#x", "../2024", "abc", "2024-1-2-3", "20245"]) {
    assert.throws(() => buildUrl(["A1"], bad, "2025-1"), BcrpError, bad);
    assert.throws(() => buildUrl(["A1"], "2024-1", bad), BcrpError, bad);
  }
  assert.throws(() => buildUrl(["A1"], "2024-1", "2025-1", "esp/../x"), BcrpError);
  assert.match(buildUrl(["A1"], "2024", "2025-12"), /2024\/2025-12/);
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
