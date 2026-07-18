# 008 — Licencia MIT, open source, sin monetización

- **Estado:** aceptada (2026-07-17)
- **superaA:** —
- **Fuente:** `docs/FICHA.md` §4 (fila «Licencia y modelo») · `LICENSE` · `plugin.json`

## Contexto

Bajo qué licencia se publica la herramienta y con qué modelo de negocio.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **MIT** ✅ | La más permisiva y estándar para tooling de desarrollo; cero fricción para colaboradores y terceros |
| Licencia propietaria | Permitiría monetizar, pero no hay modelo de monetización ni intención de tenerlo |
| Otra OSS (Apache-2.0, GPL) | Apache-2.0 agrega cláusula de patentes y GPL impone copyleft — ambas suman fricción sin beneficio para una herramienta interna |

## Decisión y porqué

MIT, open source, sin monetización. Es la licencia más permisiva y estándar para tooling de
desarrollo, sin fricción para colaboradores ni terceros, y coherente con una herramienta
interna sin monetización. Decidido por Fede.

## Consecuencias

- El valor de la herramienta es el tiempo ahorrado y la calidad del pipeline de construcción
  propio, no ingresos (ver `docs/business/contexto.md`).
- La licencia queda declarada en `LICENSE` y en `plugins/doc-arquitecto/.claude-plugin/plugin.json`.
