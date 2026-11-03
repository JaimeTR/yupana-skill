# Yupana Skill

Skill gratuito y abierto para consultar datos económicos del Perú y redactar informes en español con **cada cifra citada**.

> Estado: en construcción (v0.0.x). Funciona el cliente de la API pública del BCRP, los cálculos de variaciones y la plantilla de informe. Falta confirmar el esquema real de la API y añadir el catálogo de series.

## Qué hace
- Descarga series del BCRP (API pública de BCRPData) con su cita: fuente, URL y fecha.
- Calcula variaciones mensual, interanual, acumulada y medias móviles.
- Guía la redacción de un informe de coyuntura sin cifras sin fuente.

## Instalación (Claude Code)
```bash
git clone https://github.com/JaimeTR/yupana-skill
cp -r yupana-skill/skills/yupana-peru ~/.claude/skills/
```
Requiere Node 18 o superior. Luego pide, por ejemplo: *"Haz un informe de coyuntura con la inflación y el tipo de cambio de los últimos 12 meses"*.

## Desarrollo
```bash
npm test          # pruebas unitarias
BCRP_LIVE=1 BCRP_CODE=<código> npm run test:live   # prueba contra la API real
```

## Principios
1. Ninguna cifra sin fuente. 2. Si falla la consulta, se informa; nunca se inventan datos. 3. Abierto y gratuito (MIT).

## Licencia
MIT. Los datos pertenecen a sus fuentes (BCRP) y se rigen por sus condiciones de uso.
