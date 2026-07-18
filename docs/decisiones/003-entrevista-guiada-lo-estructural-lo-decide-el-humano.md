# 003 — Entrevista guiada: la máquina no inventa lo estructural

- **Estado:** aceptada (2026-07-17)
- **superaA:** —
- **Fuente:** `docs/FICHA.md` §4 · tracker `DECISIONS.d03`

## Contexto

Cómo se generan los docs de un proyecto desde cero.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| Generación automática leyendo solo el código | Rápida y sin fricción, pero produce docs inventados por la máquina — que son el problema, no la solución |
| **Entrevista guiada al humano** ✅ | Requiere tiempo y presencia del humano, a cambio de un contrato realmente firmado |

## Decisión y porqué

Entrevista guiada por etapas; lo que el humano no decide queda como **decisión pendiente
explícita con dueño**, nunca inventado. Regla heredada del modo `/orquestar` del audit-tracker.

## Consecuencias

- La entrevista **bloquea** esperando al humano — a diferencia de la calibración del
  audit-tracker, acá bloquear ES el comportamiento correcto: la entrevista es el producto.
- Las decisiones pendientes son archivos de primera clase en `docs/decisiones/`, no notas al pie.
