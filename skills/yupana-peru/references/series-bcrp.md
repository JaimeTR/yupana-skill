# Series del BCRP verificadas

Solo se listan series **comprobadas con una respuesta real de la API**. Para añadir una: consultar con `bcrp.mjs`, guardar la respuesta en `tests/fixtures/` y registrar aquí código, nombre exacto, unidad, frecuencia, año base y estado.

| Código | Nombre (tal como lo publica el BCRP) | Frecuencia | Decimales | Estado | Verificada |
|---|---|---|---|---|---|
| `PN01288PM` | Índice de precios Lima Metropolitana (índice 2009 = 100) (descontinuada) - IPC Sin Alimentos y Bebidas | Mensual | 2 | **Descontinuada** (base 2009=100) | 2026-11-03, muestra Ene.2013 a Sep.2016 |
| `PN01289PM` | Índice de precios Lima Metropolitana (índice 2009 = 100) (descontinuada) - IPC Sin Alimentos y Energía | Mensual | 2 | **Descontinuada** (base 2009=100) | 2026-11-03, muestra Ene.2013 a Sep.2016 |

## Cómo encontrar series vigentes
Portal: https://estadisticas.bcrp.gob.pe/estadisticas/series/ → Consulta de series → Por categoría → *Inflación (Mensuales)*. En esa categoría aparecen, entre otras, las familias:
- Índice de precios Lima Metropolitana (índice Dic.2021 = 100) — vigente
- Índice de precios Lima Metropolitana (var% mensual / acumulada / 12 meses)
- Índice de precios al consumidor Lima Metropolitana: clasificación sectorial y transables / no transables
- Índices de precios al consumidor desestacionalizados (Dic.2021 = 100)

Los códigos de esas series se obtienen en la sección **Metadatos** del portal. Pendiente de verificar y agregar a esta tabla.

## Reglas
- Una serie descontinuada no se usa para informes actuales salvo para comparaciones históricas explícitas.
- Antes de usar una serie, mostrar su nombre exacto y año base al usuario.
