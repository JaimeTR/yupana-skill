import test from "node:test";
import assert from "node:assert/strict";
import { parseNumberToken, extractClaims, collectEvidence, verifyText } from "../../skills/yupana-peru/scripts/lib/verify-core.mjs";

// Evidencia SINTÉTICA (valores inventados) solo para probar el verificador. No son datos reales.
const evidencia = collectEvidence([
  { series: [{ name: "S1", points: [{ period: "Ene.2024", value: 3.24 }, { period: "Feb.2024", value: 1234.5 }, { period: "Mar.2024", value: -0.31 }],
      calc: { type: "yoy", points: [{ period: "Ene.2024", value: 2.0 }, { period: "Feb.2024", value: null }] } }] },
  { constants: [{ value: 1, source: "meta BCRP" }, { value: 3, source: "meta BCRP" }] },
]);

test("parseNumberToken: formatos con coma decimal, punto decimal y miles", () => {
  const v = (t) => parseNumberToken(t).map((c) => `${c.value}/${c.decimals}`);
  assert.deepEqual(v("3,2"), ["3.2/1"]);
  assert.deepEqual(v("3.2"), ["3.2/1"]);
  assert.deepEqual(v("1 234,5"), ["1234.5/1"]);
  assert.deepEqual(v("1.234,5"), ["1234.5/1"]);
  assert.deepEqual(v("1,234.5"), ["1234.5/1"]);
  assert.deepEqual(v("12"), ["12/0"]);
  assert.deepEqual(v("1.234").sort(), ["1.234/3", "1234/0"].sort()); // ambiguo: ambas lecturas
});

test("extractClaims ignora años, referencias [n], códigos, URLs, fechas y la sección Fuentes", () => {
  const md = `# Informe 2025
La inflación fue 3,2 % en enero de 2024 [1], según PN01288PM (https://x.pe/api/PN01288PM/json/2024-1/2024-6/esp).
Fecha 2024-01-15. Entre 1 % y 3 %.
## Fuentes
[1] Serie PN01288PM consultada el 2026-11-03 con 99 puntos.`;
  const nums = extractClaims(md).map((c) => c.raw);
  assert.deepEqual(nums, ["3,2", "1", "3"]);
});

test("verifyText: cifras correctas verificadas; alteradas, no", () => {
  const md = "La variación fue 3,2 % en enero y 1.234,5 en febrero. El dato de marzo fue 0,4 %. Interanual 2,0 %. Otro 9,9 %.";
  const r = verifyText(md, evidencia);
  const por = Object.fromEntries(r.claims.map((c) => [c.raw, c.status]));
  assert.equal(por["3,2"], "verificada");        // 3.24 redondeado a 1 decimal
  assert.equal(por["1.234,5"], "verificada");
  assert.equal(por["0,4"], "no_encontrada");     // en la evidencia hay 0,31, no 0,4
  assert.equal(por["2,0"], "verificada");        // viene del cálculo interanual
  assert.equal(por["9,9"], "no_encontrada");
  assert.equal(r.ok, false);
  assert.equal(r.unverified, 2);
});

test("el redondeo respeta los decimales escritos: 3,24 y 3,2 valen; 3,3 no", () => {
  assert.equal(verifyText("Fue 3,24 %.", evidencia).ok, true);
  assert.equal(verifyText("Fue 3,2 %.", evidencia).ok, true);
  assert.equal(verifyText("Fue 3,3 %.", evidencia).ok, false);
});

test("signo: 'cayó 0,3 %' coincide con -0,31, y se marca como coincidencia por valor absoluto", () => {
  const r = verifyText("Cayó 0,3 %.", evidencia);
  assert.equal(r.ok, true);
  assert.equal(r.claims[0].matchedBySign, true);
});

test("constantes declaradas (meta de inflación) se aceptan con su fuente", () => {
  const r = verifyText("Dentro del rango de 1 % a 3 %.", evidencia);
  assert.equal(r.ok, true);
  assert.equal(r.claims[0].evidence.source, "meta BCRP");
});

test("texto sin cifras no falla; evidencia vacía hace fallar toda cifra", () => {
  assert.equal(verifyText("Sin números aquí.", evidencia).ok, true);
  assert.equal(verifyText("Fue 5 %.", collectEvidence([])).ok, false);
});

test("collectEvidence ignora valores nulos y acepta salidas de bcrp.mjs tal cual", () => {
  const e = collectEvidence({ series: [{ points: [{ period: "Ene.2024", value: null }, { period: "Feb.2024", value: 7 }] }] });
  assert.equal(e.length, 1);
});
