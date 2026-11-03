<h1 align="center">Yupana</h1>
<p align="center"><em>De la pregunta al informe, con datos oficiales del Perú y cada cifra citada.</em></p>
<p align="center">Un skill abierto y gratuito para economistas, estudiantes y analistas.<br>Creado por <strong>Jaime TR</strong> · Licencia MIT</p>

---

> **Estado:** v0.2.0. Conocimiento, plantillas, cálculos y cliente del BCRP listos. La API del BCRP es pública y gratuita (sin clave) y la forma de la URL está confirmada con su guía oficial. Pendiente: confirmar el esquema JSON de la respuesta con una respuesta real y publicar el catálogo verificado de series. Ver [CHANGELOG](CHANGELOG.md).

## ¿Qué problema resuelve?
Hacer un informe económico del Perú consume horas en buscar datos, limpiarlos, calcular variaciones, darle formato y citar. Los asistentes de IA genéricos, además, inventan cifras. Yupana obliga a que **cada número tenga fuente, código, URL y fecha de consulta**.

## ¿Qué incluye?
| Componente | Para qué |
|---|---|
| `scripts/bcrp.mjs` | Descarga series de la API pública del BCRP con su cita |
| `scripts/verify.mjs` | Verifica que cada cifra de un informe coincida con los datos descargados (sale con error si hay cifras sin respaldo) |
| `scripts/lib/calc.mjs` | Variaciones mensual, interanual, acumulada y medias móviles (sin interpolar) |
| `references/` | Guías: indicadores, fuentes peruanas, metodología, redacción, econometría, citas, glosario |
| `assets/` | Plantillas: informe de coyuntura, nota breve, capítulo de datos para tesis |
| `SKILL.md` | Reglas duras y enrutamiento para el agente |

## Instalación rápida (Claude Code)
```bash
git clone https://github.com/JaimeTR/yupana-skill
mkdir -p ~/.claude/skills && cp -r yupana-skill/skills/yupana-peru ~/.claude/skills/
```
Más opciones en [docs/INSTALACION.md](docs/INSTALACION.md). Guía en [docs/USO.md](docs/USO.md).

## Principios
1. **Ninguna cifra sin fuente.**
2. **Si la consulta falla, se informa; nunca se inventan datos.**
3. **Abierto y gratuito (MIT).** Los datos pertenecen a sus fuentes.

## Desarrollo
```bash
npm test                                           # pruebas unitarias
BCRP_LIVE=1 npm run test:live   # prueba contra la API real (no requiere clave)
```
Ver [CONTRIBUTING.md](CONTRIBUTING.md).

## Hoja de ruta
- [x] v0.1: conocimiento, plantillas, cálculos, cliente BCRP
- [ ] v0.3: catálogo verificado de series del BCRP y respaldo con Banco Mundial
- [x] v0.2: verificador de cifras (`verify.mjs`)
- [ ] v1.0: skill estable + web app (ver proyecto `yupana-web`)

## Aviso
Herramienta de apoyo. No sustituye el criterio profesional ni constituye asesoría financiera o legal.

## Licencia
[MIT](LICENSE) © 2026 Jaime TR
