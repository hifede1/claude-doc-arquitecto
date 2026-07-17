# Changelog — doc-arquitecto

Formato: una entrada por versión del plugin. El detalle fino vive en los mensajes de commit.

## v0.3.0 — 2026-07-17
- **S03 — `/documentar` modo existente**: nueva FASE 1-E — inventario antes de preguntar, detección de huecos contra el contrato (incluye decisiones visibles en el código sin ADR), informe de huecos al humano antes de tocar nada, entrevista SOLO de lo faltante (lo documentado está firmado y no se re-litiga), generación con diff confirmado POR ARCHIVO (un rechazo descarta el cambio entero), e idempotencia (repo completo = no-op verificable con `git status`). Los formatos de la Fase 2 se reusan: cero duplicación del contrato.

## v0.2.0 — 2026-07-17
- **S02 — `/documentar` modo nuevo**: entrevista guiada por etapas (propósito → alcance → caza de decisiones estructurales con opciones y tradeoffs → plan de sesiones) y generación de la estructura completa de `docs/` (VISION, ALCANCE, PLAN con fichas 🎯🛠️✅📚⛓️, decisiones/ como ADRs con pendientes explícitas, references/ con catálogo de faltantes, business/). Detección de modo en Fase 0: con docs y/o código existente declara que el modo existente llega en S03 y frena — no improvisa. Cero archivos antes de que el humano confirme el plan; cada sesión con ≥1 criterio verificable.

## v0.1.0 — 2026-07-17
- **S01 — Esqueleto**: repo del plugin, marketplace `fede-tools` (mismo patrón que `claude-audit-tracker`: `marketplace.json` propio con source relativo), y los dos comandos instalables como placeholders honestos — `/documentar` (implementación en S02/S03) y `/auditar-docs` (implementación en S04). CI mínimo: manifiestos JSON válidos + existencia de los comandos.
