# Alcance — doc-arquitecto v1

> Destilado de `docs/FICHA.md` §3 (funciones) y §5 (fuera de alcance).
> **Firmado por Fede el 2026-07-17** · documento escrito el 2026-07-18 · estado: v1.0.0 entregada.

## Qué hace la v1

| Capacidad | Entrada | Salida |
|---|---|---|
| **`/documentar` — modo nuevo** | Repo sin docs ni código relevante + contexto opcional | Entrevista guiada por etapas (propósito → alcance → decisiones estructurales con tradeoffs → plan de sesiones) y, recién con el plan confirmado, la estructura `docs/` completa: VISION, ALCANCE, PLAN con fichas 🎯🛠️✅📚⛓️, `decisiones/`, `references/`, `business/` |
| **`/documentar` — modo existente** | Repo con docs y/o código | Inventario de lo que hay, detección de huecos contra el contrato, y su relleno con **diffs confirmados archivo por archivo**. Idempotente: sin huecos confirmados, cero bytes escritos ([ADR 005](decisiones/005-idempotencia-con-diffs-confirmados.md)) |
| **`/auditar-docs`** | La documentación del proyecto | Informe de hallazgos con severidad (🔴🟠🟡⚪) y ubicación `file:línea` sobre **seis dimensiones**: completitud, contradicciones entre documentos, criterios no verificables, decisiones sin registrar, referencias faltantes o vencidas, drift interno doc↔doc. Ofrece los arreglos uno por uno con confirmación |
| **Garantía transversal** | — | Guardia de Escritura Universal: ningún archivo existente se pisa sin un sí explícito, en cualquier modo |

Cada sesión que `/documentar` produce sale con **≥1 criterio de aceptación verificable**, con
su método de verificación, o el plan no se entrega.

## Qué NO hace la v1 — y por qué

| Fuera de alcance | Por qué |
|---|---|
| **No audita código** | Esa es la responsabilidad del `audit-tracker`. Documentar el plano y auditar la obra son trabajos distintos, con ritmos de versión distintos ([ADR 001](decisiones/001-plugin-separado-del-audit-tracker.md)) |
| **No despacha encargos ni crea issues** | Es el modo despacho del `audit-tracker` |
| **No genera el tracker HTML** | El HTML vistoso lo pone el `audit-tracker`; acá la fuente de verdad es markdown versionado ([ADR 004](decisiones/004-markdown-en-el-repo-como-fuente-de-verdad.md)) |
| **No integra CI ni valida en pipelines** | La v1 se ejecuta a demanda desde Claude Code; automatizar la auditoría del plano no tiene todavía un caso de uso firmado |
| **No traduce documentación de otros formatos** (Notion, Confluence) | La v1 trabaja sobre markdown en el repo. Consecuencia directa de [ADR 004](decisiones/004-markdown-en-el-repo-como-fuente-de-verdad.md) |

## Fuera de alcance de esta corrida de `/documentar`

- **`docs/PLAN.md` no se generó.** Las cinco sesiones de construcción (S01–S05) están completas
  y verificadas a v1.0.0; un PLAN de sesiones cerradas sería registro histórico, no plano.
  Decisión de Fede el 2026-07-18, registrada en
  [ADR 011](decisiones/011-plan-md-diferido-a-v1-1.md) con su dueño y su desbloqueador:
  se generará cuando haya trabajo real por delante (v1.1).
  El histórico de construcción vive en `docs/FICHA.md` §7.
