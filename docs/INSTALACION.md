# Instalación

Requisitos: **Node.js 18 o superior** (para los scripts) y un agente de IA que soporte skills.

## Claude Code
```bash
git clone https://github.com/JaimeTR/yupana-skill
mkdir -p ~/.claude/skills
cp -r yupana-skill/skills/yupana-peru ~/.claude/skills/
```
Reinicia Claude Code. Pide por ejemplo: *"Usa el skill yupana-peru para preparar un informe de coyuntura"*.

## Claude.ai y otras apps con skills
Comprime la carpeta `skills/yupana-peru` en un `.zip` y súbela en la sección de skills (Ajustes). Los scripts requieren un entorno donde se pueda ejecutar Node y acceder a internet; si no es tu caso, el skill igual aporta metodología, guías y plantillas, y deberás pegar tú los datos.

## Otros agentes (Codex, Cursor, Gemini CLI, etc.)
El formato `SKILL.md` es abierto. Copia la carpeta a la ubicación de skills de tu agente o, si no soporta skills, usa el contenido de `SKILL.md` y de `references/` como instrucciones del proyecto (por ejemplo `AGENTS.md`).

## Verificar la instalación
```bash
cd yupana-skill && npm test
```
Deben pasar todas las pruebas.

## Solución de problemas
| Síntoma | Causa probable | Solución |
|---|---|---|
| `No se pudo conectar con el BCRP` | Sin internet o dominio bloqueado | Permite `estadisticas.bcrp.gob.pe` en tu red o entorno |
| `El BCRP respondió 404` | Código de serie o fechas incorrectos | Revisa el código en el portal de series |
| El agente no usa el skill | No está en la carpeta correcta | Revisa la ruta de skills de tu agente |
