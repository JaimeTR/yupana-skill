# Metodología de análisis para informes

## Antes de analizar
1. **Pregunta clara**: ¿qué decisión o comprensión apoya el análisis?
2. **Variable correcta**: nivel, tasa de variación, porcentaje del PBI o índice.
3. **Periodo y frecuencia** acordes a la pregunta.
4. **Fuente y año base** documentados.

## Pasos
1. **Descarga y cita** con los scripts.
2. **Inspecciona**: ¿faltan datos? ¿hay saltos por cambio de base? ¿hay valores extremos?
3. **Transforma**: variaciones, medias móviles, desestacionalización (solo si la fuente la entrega o con método explícito).
4. **Compara** con algo: periodo anterior, mismo periodo del año previo, promedio histórico, meta o pares regionales.
5. **Explica el porqué**, distinguiendo hecho observado, posible causa e hipótesis.
6. **Revisa**: cada cifra del texto coincide con la salida de los datos.

## Errores frecuentes
- **Efecto base**: la variación interanual cambia por lo ocurrido hace 12 meses, no solo por hoy.
- **Estacionalidad**: no compares meses de distinta estacionalidad sin ajustar.
- **Real vs. nominal**: no mezclar.
- **Promedios engañosos**: pesos distintos entre componentes.
- **Correlación ≠ causalidad.**
- **Cambios de metodología** y empalmes de series.
- **Gráficos engañosos**: ejes truncados sin avisar, doble eje que sugiere relaciones espurias.
- **Datos preliminares tratados como definitivos.**

## Gráficos
- Un mensaje por gráfico; título con la conclusión.
- Eje y con unidad; fuente y fecha al pie.
- Para series temporales: línea; para comparar categorías: barras desde cero.
- Colores accesibles (no depender solo del color).
- Marcar eventos relevantes y la meta o el umbral si aplica.

## Redacción de resultados con incertidumbre
- "Los datos muestran…" (hecho) frente a "podría deberse a…" (hipótesis).
- Reconoce límites: periodo corto, datos preliminares, cambio de metodología.
