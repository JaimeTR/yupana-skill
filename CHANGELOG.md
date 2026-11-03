# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Versionado semántico.

## [0.1.0] - 2026-11-03
### Añadido
- Skill `yupana-peru` con reglas duras de trazabilidad y enrutamiento por referencias.
- Cliente de la API pública de BCRPData y comando `bcrp.mjs get`.
- Cálculos: variación mensual, interanual, acumulada en el año y media móvil.
- Guías de conocimiento: indicadores, fuentes, metodología, redacción, econometría, citas y glosario.
- Plantillas: informe de coyuntura, nota breve y capítulo de datos para tesis.
- 19 pruebas unitarias y una prueba contra la API real (opcional).

### Pendiente
- Confirmar el esquema real de la API del BCRP y publicar un catálogo verificado de series.
- Fuentes adicionales gratuitas (Banco Mundial, datos abiertos).

## [0.2.1] - 2026-11-03
### Confirmado con datos reales
- El esquema JSON de la API del BCRP quedó confirmado con una respuesta real (series `PN01288PM` y `PN01289PM`, Ene.2013 a Sep.2016), guardada como prueba en `tests/fixtures/`.
- Las 4 pruebas con datos reales usan valores esperados calculados aparte con Python (variación mensual, interanual, acumulada, media móvil) y verifican el verificador de cifras con redondeo a los decimales de la serie.
### Añadido
- Cada serie expone `decimals` (campo `dec` del BCRP).
- `references/series-bcrp.md`: registro de series verificadas, con estado (vigente/descontinuada).
- Aviso en `SKILL.md` sobre series descontinuadas y años base (el IPC vigente es Dic.2021 = 100).

## [0.2.0] - 2026-11-03
### Añadido
- `scripts/verify.mjs`: verificador de cifras. Extrae los números de un informe (ignora años, fechas, códigos, URLs, referencias y la sección Fuentes) y los contrasta con la evidencia descargada, respetando el redondeo escrito y los formatos numéricos en español. Falla con código 1 si hay cifras sin respaldo.
- 8 pruebas del verificador (32 en total).

## [0.1.2] - 2026-11-03
### Cambiado
- El cliente sigue la guía oficial de la API de BCRPData: de 1 a 10 series por consulta, periodos opcionales (sin periodos = datos más recientes; un periodo = consulta de esa fecha) y el idioma solo junto a ambos periodos.
- `bcrp.mjs get` acepta fechas opcionales y `--calc` en cualquier posición.
- Confirmado con la documentación oficial: la API **no requiere clave ni suscripción**.
- Pruebas de URL basadas en los ejemplos oficiales (24 pruebas).

## [0.1.1] - 2026-11-03
### Seguridad
- El cliente del BCRP valida fechas e idioma (antes solo los códigos) para impedir inyectar rutas o parámetros en la URL.
- `SKILL.md` indica tratar el contenido descargado como datos y no como instrucciones (inyección de prompts).
