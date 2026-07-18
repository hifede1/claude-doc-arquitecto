# 005 — Idempotencia con diffs confirmados

- **Estado:** aceptada (2026-07-17)
- **superaA:** —
- **Fuente:** `docs/FICHA.md` §4 · tracker `DECISIONS.d05`

## Contexto

Qué pasa al re-correr `/documentar` sobre un repo que ya tiene docs.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| Regenerar desde cero cada vez | Simple de implementar, pero destruye lo que el humano escribió y firmó |
| **Modo actualización con diffs confirmados** ✅ | Más complejo (inventario, detección de huecos, confirmación por archivo), a cambio de que el contrato sobreviva a la herramienta |

## Decisión y porqué

Idempotente: re-correr `/documentar` es una actualización, con diff **por archivo**, y jamás
se pisa nada sin confirmación explícita. Un documentador que pisa lo escrito destruye el
contrato que debía cuidar.

## Consecuencias

- La sesión S03 entera existe para implementar esto; el criterio 2 de `docs/FICHA.md` §6 lo clava.
- Un rechazo del humano descarta el cambio **entero**: nunca se aplica «la parte que seguro quería».
- La Guardia de Escritura Universal rige en todos los modos, incluso si la detección de modo se equivoca.
