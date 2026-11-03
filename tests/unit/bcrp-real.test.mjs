// Pruebas con una RESPUESTA REAL de la API de BCRPData (series PN01288PM y PN01289PM,
// 2013-1 a 2016-9), guardada en tests/fixtures. Los valores esperados se calcularon
// por separado con Python, no con este código.
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { parseResponse } from "../../skills/yupana-peru/scripts/lib/bcrp-client.mjs";
import { parsePeriod } from "../../skills/yupana-peru/scripts/lib/periods.mjs";
import { varPrevia, varInteranual, varAcumuladaAnio, mediaMovil } from "../../skills/yupana-peru/scripts/lib/calc.mjs";
import { collectEvidence, verifyText } from "../../skills/yupana-peru/scripts/lib/verify-core.mjs";

const raw = JSON.parse(readFileSync(new URL("../fixtures/bcrp-PN01288PM-PN01289PM_2013-1_2016-9.json", import.meta.url), "utf8"));
const r = parseResponse(raw, { url: "https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PN01288PM-PN01289PM/json/2013-1/2016-9", retrievedAt: "2026-11-03T00:00:00Z" });
const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test("esquema real: título, 2 series con nombre y decimales, 45 periodos", () => {
  assert.match(r.title, /Índice de precios Lima Metropolitana/);
  assert.equal(r.series.length, 2);
  assert.match(r.series[0].name, /IPC Sin Alimentos y Bebidas$/);
  assert.match(r.series[1].name, /IPC Sin Alimentos y Energía$/);
  assert.deepEqual(r.series.map((s) => s.decimals), [2, 2]);
  assert.equal(r.series[0].points.length, 45);
  assert.deepEqual(r.series[0].points[0], { period: "Ene.2013", value: 106.621335670408 });
  assert.equal(r.series[1].points[44].value, 118.418968590005);
  assert.equal(r.source.name, "BCRPData");
});

test("todos los nombres de periodo reales (incluido 'Sep') se interpretan", () => {
  for (const p of r.series[0].points) assert.ok(parsePeriod(p.period), p.period);
  assert.equal(parsePeriod("Sep.2013").index, 9);
});

test("cálculos sobre datos reales coinciden con el cálculo independiente", () => {
  const s1 = r.series[0].points, s2 = r.series[1].points;
  close(varInteranual(s1)[12].value, 3.215972447011528);   // Ene.2014 a/a, IPC sin alimentos y bebidas
  close(varInteranual(s2)[44].value, 3.012176281950074);   // Sep.2016 a/a, IPC sin alimentos y energía
  close(varPrevia(s1)[1].value, 0.32496060942064364);      // Feb.2013 m/m
  close(varAcumuladaAnio(s2)[38].value, 1.1609607027258884); // Mar.2016 vs Dic.2015
  close(mediaMovil(s1, 3)[2].value, 107.20456303133601);
  assert.equal(varInteranual(s1)[0].value, null);          // 2012 no está en la serie
});

test("verificador con evidencia real: redondeo a los decimales de la serie", () => {
  const ev = collectEvidence({ series: r.series.map((s) => ({ name: s.name, points: s.points, calc: { type: "yoy", points: varInteranual(s.points) } })) });
  const ok = "El IPC sin alimentos y energía fue 106,12 en enero de 2013 y su variación interanual en setiembre de 2016 fue 3,01 %.";
  const bien = verifyText(ok, ev);
  assert.equal(bien.ok, true, JSON.stringify(bien.claims.filter((c) => c.status !== "verificada")));
  const mal = verifyText("El IPC sin alimentos y energía fue 106,52 en enero de 2013 y su variación interanual fue 3,31 %.", ev);
  assert.equal(mal.unverified, 2);
});
