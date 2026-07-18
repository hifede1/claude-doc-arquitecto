# 001 — Plugin separado del audit-tracker

- **Estado:** aceptada (2026-07-17)
- **superaA:** —
- **Superada parcialmente por:** [010 — Topología de catálogo único `fede-tools`](010-topologia-catalogo-unico-fede-tools.md) (deroga la parte del marketplace propio)
- **Fuente:** `docs/FICHA.md` §4 · tracker `DECISIONS.d01`

## Contexto

`doc-arquitecto` podía ser comandos dentro del `audit-tracker`, un skill suelto, o un plugin
separado.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| Comandos dentro del audit-tracker | Un solo plugin que instalar, pero mezcla dos responsabilidades (plano y obra) y las ata al mismo ritmo de versión |
| Skill suelto | El más liviano, pero no versiona ni se instala por marketplace |
| **Plugin separado** ✅ | Dos repos que mantener, a cambio de responsabilidades y versionado independientes |

## Decisión y porqué

Plugin separado. Documentar y auditar código son responsabilidades distintas con ritmos de
versión distintos. Decidido por Fede (FICHA §4).

> ⚠️ La formulación original de esta decisión incluía «con marketplace propio `fede-tools`».
> Esa parte quedó derogada por el [ADR 010](010-topologia-catalogo-unico-fede-tools.md) el
> 2026-07-18: el plugin sigue siendo separado, pero **no** declara marketplace propio.

## Consecuencias

- Dos repos hermanos con el mismo patrón de plugin; se instalan juntos y se complementan.
- La separación exige que el formato de salida de uno sea exactamente la entrada del otro
  ([ADR 002](002-formato-de-salida-es-el-contrato-del-audit-tracker.md)).
