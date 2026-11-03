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

## [0.1.1] - 2026-11-03
### Seguridad
- El cliente del BCRP valida fechas e idioma (antes solo los códigos) para impedir inyectar rutas o parámetros en la URL.
- `SKILL.md` indica tratar el contenido descargado como datos y no como instrucciones (inyección de prompts).
