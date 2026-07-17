# Changelog — doc-arquitecto

Formato: una entrada por versión del plugin. El detalle fino vive en los mensajes de commit.

## v0.5.0 — 2026-07-17
- **S05 — Integración y cierre (pipeline e2e)**: la verificación adversarial del criterio 4 (audit-tracker consume la salida sin adaptación manual) encontró dos gaps bloqueantes en la Fase 2 de `/documentar` — el catálogo de `references/` no exponía los `triggers` y `business/` no se cataloga ni llevaba frontmatter machine-readable. **Arreglado en la fuente**: el catálogo ahora cubre AMBAS mitades (references/ = CÓMO, business/ = QUÉ) con todos los campos que el tracker consume (tema · qué resuelve · fecha · triggers con valores · quién la usa · frescura pill 🟢🟠🔴 · path), y `business/` lleva frontmatter `tema`/`fecha`/`triggers`/`resumen`. Re-verificado: pipeline sin traducción confirmado. README final. La publicación (repo público + tag v1.0.0) es el ADR 006 pendiente — decisión de Fede.

## v0.4.0 — 2026-07-17
- **S04 — `/auditar-docs`**: las seis dimensiones de auditoría (completitud, contradicciones, criterios no verificables, decisiones sin registrar, referencias faltantes/vencidas, drift doc↔doc) con heurísticas operativas embebidas, severidades 🔴🟠🟡⚪, informe por dimensión con `file:línea` (dimensión limpia se declara), y arreglos uno por uno con diff confirmado — los que implicarían inventar se marcan «requiere decisión humana» y se preguntan con opciones y tradeoffs. Diseño fijado en `docs/references/auditoria-de-docs.md` (nueva, con triggers y fecha).

## v0.3.0 — 2026-07-17
- **S03 — `/documentar` modo existente**: nueva FASE 1-E — inventario antes de preguntar, detección de huecos contra el contrato (incluye decisiones visibles en el código sin ADR), informe de huecos al humano antes de tocar nada, entrevista SOLO de lo faltante (lo documentado está firmado y no se re-litiga), generación con diff confirmado POR ARCHIVO (un rechazo descarta el cambio entero), e idempotencia (repo completo = no-op verificable con `git status`). Los formatos de la Fase 2 se reusan: cero duplicación del contrato.

## v0.2.0 — 2026-07-17
- **S02 — `/documentar` modo nuevo**: entrevista guiada por etapas (propósito → alcance → caza de decisiones estructurales con opciones y tradeoffs → plan de sesiones) y generación de la estructura completa de `docs/` (VISION, ALCANCE, PLAN con fichas 🎯🛠️✅📚⛓️, decisiones/ como ADRs con pendientes explícitas, references/ con catálogo de faltantes, business/). Detección de modo en Fase 0: con docs y/o código existente declara que el modo existente llega en S03 y frena — no improvisa. Cero archivos antes de que el humano confirme el plan; cada sesión con ≥1 criterio verificable.

## v0.1.0 — 2026-07-17
- **S01 — Esqueleto**: repo del plugin, marketplace `fede-tools` (mismo patrón que `claude-audit-tracker`: `marketplace.json` propio con source relativo), y los dos comandos instalables como placeholders honestos — `/documentar` (implementación en S02/S03) y `/auditar-docs` (implementación en S04). CI mínimo: manifiestos JSON válidos + existencia de los comandos.
