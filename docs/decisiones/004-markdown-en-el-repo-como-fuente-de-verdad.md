# 004 — Markdown en el repo como fuente de verdad

- **Estado:** aceptada (2026-07-17)
- **superaA:** —
- **Fuente:** `docs/FICHA.md` §4 · tracker `DECISIONS.d04`

## Contexto

Dónde viven los docs que genera la herramienta.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| Artifact HTML | Vistoso y compartible, pero no se versiona con el código ni se diffea |
| Wiki externa | Cómoda de editar, pero se desincroniza del repo y no viaja con el checkout |
| **Markdown en git** ✅ | Menos vistoso, a cambio de versionado, diffs y viaje con el código |

## Decisión y porqué

Markdown en el repo. Los docs viajan con el código y se versionan; el HTML vistoso ya lo pone
el tracker del audit-tracker.

## Consecuencias

- La v1 **no traduce** desde Notion ni Confluence (fuera de alcance declarado, ver `docs/ALCANCE.md`).
- Toda escritura pasa por diffs confirmados ([ADR 005](005-idempotencia-con-diffs-confirmados.md)),
  porque el archivo es la fuente de verdad y pisarlo destruye el contrato.
