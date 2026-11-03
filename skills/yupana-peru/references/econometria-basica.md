# Econometría básica: guía de decisión

Esta guía orienta; el criterio del economista decide. Presenta siempre supuestos, diagnósticos y limitaciones.

## ¿Qué quieres saber?
| Pregunta | Enfoque típico |
|---|---|
| Describir | Estadísticos descriptivos, gráficos |
| Asociación entre variables | Correlación, regresión (MCO) |
| Efecto causal de una política | Experimento, diferencias en diferencias, variables instrumentales, regresión discontinua, control sintético |
| Evolución en el tiempo / pronóstico | Series de tiempo (ARIMA, VAR, suavizamiento) |
| Datos de hogares o empresas | MCO con errores robustos o agrupados, modelos probit/logit, efectos fijos para paneles |

## Series de tiempo (pasos)
1. Graficar; identificar tendencia, estacionalidad, quiebres.
2. Probar estacionariedad (ADF, KPSS); si no es estacionaria, diferenciar o usar cointegración.
3. Elegir modelo y rezagos con criterios de información, sin sobreajustar.
4. Diagnosticar residuos (autocorrelación, heterocedasticidad, normalidad).
5. Evaluar pronóstico fuera de muestra.
6. Reportar intervalos, no solo el punto.

## Regresión (MCO): supuestos y chequeos
- Linealidad, exogeneidad, no multicolinealidad perfecta, homocedasticidad, no autocorrelación.
- Usar **errores estándar robustos** (o agrupados si hay clústeres).
- Revisar valores influyentes.
- Interpretar **coeficientes con unidades** y distinguir significancia estadística de importancia económica.
- Variables omitidas, endogeneidad y causalidad inversa: discutirlas.

## Datos de encuestas (por ejemplo ENAHO)
- Usar los **factores de expansión** y el diseño muestral.
- Respetar el ámbito geográfico y la unidad de análisis (persona, hogar).
- Cuidar la confidencialidad.

## Reproducibilidad
- Guardar código, versión de datos y fecha de descarga.
- Entregar los resultados con el código (Python, R o Stata).
- Fijar semillas y versiones de paquetes.

## Interpretación en español
- "Un aumento de 1 punto porcentual en X se asocia con un cambio de β en Y, manteniendo lo demás constante."
- "No se puede interpretar como causal porque…"
