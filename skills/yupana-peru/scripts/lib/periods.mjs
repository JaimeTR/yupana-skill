// Interpreta los nombres de periodo que devuelve BCRPData.
// Mensual: "Ene.2020"; trimestral: "T1.2020"; anual: "2020".
// Diario y otros formatos: NO soportados aún (se devuelve null, nunca se adivina).

const MESES = { ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6, jul: 7, ago: 8, set: 9, sep: 9, oct: 10, nov: 11, dic: 12,
  jan: 1, apr: 4, aug: 8, dec: 12 };

export function parsePeriod(name) {
  const s = String(name).trim();
  let m = s.match(/^([A-Za-zñÑ]{3})\.(\d{4})$/);
  if (m) {
    const month = MESES[m[1].toLowerCase()];
    if (month) return { freq: "M", year: Number(m[2]), index: month, key: `${m[2]}-${String(month).padStart(2, "0")}` };
  }
  m = s.match(/^T([1-4])\.(\d{4})$/i);
  if (m) return { freq: "Q", year: Number(m[2]), index: Number(m[1]), key: `${m[2]}-Q${m[1]}` };
  m = s.match(/^(\d{4})$/);
  if (m) return { freq: "A", year: Number(m[1]), index: 1, key: m[1] };
  return null;
}

export const PERIODS_PER_YEAR = { M: 12, Q: 4, A: 1 };
