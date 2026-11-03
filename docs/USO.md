# Guía de uso

## 1. Consultar una serie
```bash
node skills/yupana-peru/scripts/bcrp.mjs get <CÓDIGO> 2024-1 2025-6
```
El código lo obtienes en https://estadisticas.bcrp.gob.pe/estadisticas/series/. La salida incluye la cita (`source`).

## 2. Calcular variaciones
Agrega `--calc`: `prev` (periodo anterior), `yoy` (interanual), `ytd` (acumulada del año), `ma:N` (media móvil).

## 3. Pedir un informe
Dile a tu agente: *"Con el skill yupana-peru, prepara el informe de coyuntura de [mes] con [variables]. Usa estos códigos: …"*. El agente consultará, calculará, redactará con la plantilla y verificará las cifras.

## 4. Verificar un informe
Guarda las salidas de `bcrp.mjs` en archivos JSON y ejecuta:
```bash
node skills/yupana-peru/scripts/verify.mjs informe.md serie1.json serie2.json
```
Cada cifra aparece como verificada (`OK`) o sin verificar (`??`). El comando termina con error si hay alguna sin verificar, así puedes usarlo como control antes de publicar.

## 5. Para estudiantes
Pide explicaciones del método y cómo citar la fuente. El skill usa `references/` para dar contexto.

## 6. Buenas prácticas
- Da los códigos de serie exactos.
- Indica periodo, frecuencia y si quieres datos reales o nominales.
- Revisa siempre el informe antes de publicarlo.

## Limitaciones
Herramienta de apoyo; el criterio profesional es tuyo. No es asesoría financiera ni legal.
