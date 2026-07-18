# 002 — La salida es el formato que consume el audit-tracker

- **Estado:** aceptada (2026-07-17)
- **superaA:** —
- **Fuente:** `docs/FICHA.md` §4 · tracker `DECISIONS.d02`

## Contexto

Qué estructura generan los docs que produce `/documentar`.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| Formato genérico (README + specs + ADRs sueltos) | Familiar y portable, pero exige traducción manual antes de que el audit-tracker pueda consumirlo |
| **El contrato del audit-tracker** ✅ (fichas 🎯🛠️✅📚⛓️, `references/` con triggers, `business/`) | Acopla las dos herramientas, a cambio de un pipeline sin traducción |

## Decisión y porqué

El contrato del audit-tracker, extraído de su código real. Pipeline sin traducción: la salida
de una herramienta es la entrada de la otra. Decidido por Fede.

## Consecuencias

- Los cambios de formato en el audit-tracker impactan acá — territorio del criterio 4 de
  `docs/FICHA.md` §6 (verificación end-to-end).
- El contrato de formato no se negocia dentro de `/documentar`: fichas 🎯🛠️✅📚⛓️,
  referencias con `triggers` y fecha, ADRs con tradeoffs.
