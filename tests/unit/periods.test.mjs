import test from "node:test";
import assert from "node:assert/strict";
import { parsePeriod } from "../../skills/yupana-peru/scripts/lib/periods.mjs";

test("mensual en español", () => {
  assert.deepEqual(parsePeriod("Ene.2020"), { freq: "M", year: 2020, index: 1, key: "2020-01" });
  assert.equal(parsePeriod("Set.2021").index, 9);
  assert.equal(parsePeriod("Dic.2022").index, 12);
});
test("trimestral y anual", () => {
  assert.equal(parsePeriod("T3.2019").key, "2019-Q3");
  assert.equal(parsePeriod("2018").freq, "A");
});
test("formatos no soportados devuelven null, no se adivinan", () => {
  assert.equal(parsePeriod("02.Ene.20"), null);
  assert.equal(parsePeriod("basura"), null);
});
