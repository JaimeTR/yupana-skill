import test from "node:test";
import assert from "node:assert/strict";
import { varPrevia, varInteranual, varAcumuladaAnio, mediaMovil } from "../../skills/yupana-peru/scripts/lib/calc.mjs";

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

// Serie de PRUEBA inventada solo para verificar fórmulas. No son datos reales.
const serie = [
  { period: "Ene.2023", value: 100 }, { period: "Feb.2023", value: 110 }, { period: "Mar.2023", value: 121 },
  { period: "Abr.2023", value: 121 }, { period: "May.2023", value: 121 }, { period: "Jun.2023", value: 121 },
  { period: "Jul.2023", value: 121 }, { period: "Ago.2023", value: 121 }, { period: "Set.2023", value: 121 },
  { period: "Oct.2023", value: 121 }, { period: "Nov.2023", value: 121 }, { period: "Dic.2023", value: 200 },
  { period: "Ene.2024", value: 210 }, { period: "Feb.2024", value: null }, { period: "Mar.2024", value: 242 },
];

test("varPrevia: primera es null, luego % respecto al anterior", () => {
  const r = varPrevia(serie);
  assert.equal(r[0].value, null);
  close(r[1].value, 10);
  close(r[2].value, 10);
  close(r[3].value, 0);
});

test("varPrevia: un dato ausente produce null y no se interpola", () => {
  const r = varPrevia(serie);
  assert.equal(r[13].value, null); // Feb.2024 es null
  assert.equal(r[14].value, null); // Mar.2024 depende de un null
});

test("varInteranual: compara contra el mismo mes del año previo", () => {
  const r = varInteranual(serie);
  assert.equal(r[0].value, null);           // no hay Ene.2022
  close(r[12].value, 110);                  // 210 vs 100
  assert.equal(r[13].value, null);          // Feb.2024 ausente
  close(r[14].value, 100);                  // 242 vs 121
});

test("varAcumuladaAnio: contra diciembre del año previo", () => {
  const r = varAcumuladaAnio(serie);
  assert.equal(r[3].value, null);           // 2022 no está en la serie
  close(r[12].value, 5);                    // 210 vs Dic.2023=200
  close(r[14].value, 21);                   // 242 vs 200
});

test("mediaMovil: ventana 3", () => {
  const r = mediaMovil(serie, 3);
  assert.equal(r[1].value, null);
  close(r[2].value, (100 + 110 + 121) / 3);
  assert.equal(r[14].value, null);          // ventana contiene null
});

test("mediaMovil: ventana inválida lanza error", () => {
  assert.throws(() => mediaMovil(serie, 0));
});
