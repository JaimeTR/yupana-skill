import test from "node:test";
import assert from "node:assert/strict";
import { parseArgs, applyCalc } from "../../skills/yupana-peru/scripts/bcrp.mjs";

test("parseArgs: comando válido con varios códigos y cálculo", () => {
  assert.deepEqual(parseArgs(["get", "A1, B2", "2024-1", "2025-6", "--calc", "yoy"]), { codes: ["A1", "B2"], from: "2024-1", to: "2025-6", calc: "yoy" });
});
test("parseArgs: errores claros", () => {
  assert.throws(() => parseArgs([]), /Uso/);
  assert.throws(() => parseArgs(["get", "A1", "2024-1", "2025-6", "--calc", "xyz"]), /--calc/);
});
test("applyCalc: ma:3 y sin cálculo", () => {
  const pts = [{ period: "Ene.2024", value: 1 }, { period: "Feb.2024", value: 2 }, { period: "Mar.2024", value: 3 }];
  assert.equal(applyCalc(pts, null), null);
  assert.equal(applyCalc(pts, "ma:3")[2].value, 2);
});
