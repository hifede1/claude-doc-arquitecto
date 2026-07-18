# 010 — Topología de catálogo único `fede-tools`

- **Estado:** aceptada (2026-07-18)
- **superaA:** [001 — Plugin separado del audit-tracker](001-plugin-separado-del-audit-tracker.md), **parcialmente**: deroga la parte «con marketplace propio `fede-tools`». La separación en plugins distintos sigue vigente.
- **Fuente:** issue [hifede1/claude-doc-arquitecto#20](https://github.com/hifede1/claude-doc-arquitecto/issues/20) · `docs/references/marketplaces-plugins-claude-code.md` §«Topología decidida»

## Contexto

`doc-arquitecto` declaraba su propio marketplace llamado `fede-tools`, **colisionando** con el
que ya publicaba `claude-audit-tracker`: el nombre de marketplace es **único** en Claude Code.
Con los dos repos agregados, el segundo choca con el primero.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **Catálogo canónico único en `claude-audit-tracker`** ✅ | Cada plugin nuevo se lista ahí como fuente externa; cero disrupción del camino de instalación ya publicado |
| Repo dedicado `hifede1/fede-tools` | Más limpio conceptualmente (el catálogo no vive dentro de un plugin), pero rompe el `plugin marketplace add hifede1/claude-audit-tracker` ya publicado |
| Renombrar el marketplace de doc-arquitecto | Evita la colisión, pero fragmenta el ecosistema en dos catálogos que instalar por separado |

## Decisión y porqué

El catálogo canónico `fede-tools` vive en **un solo repo: `claude-audit-tracker`** — fue el
primero publicado con ese nombre, así que conservarlo ahí es cero disrupción para quien ya lo
tenía agregado. **Ningún otro repo de plugin declara ese marketplace.** `doc-arquitecto`
conserva solo su `plugins/doc-arquitecto/.claude-plugin/plugin.json` y se lista en el catálogo
del audit-tracker como fuente externa `git-subdir`.

**Regla de oro para futuros plugins** (publicador, verificador, cartera…): no crean su propio
marketplace; se suman al catálogo del audit-tracker como fuente externa.

## Consecuencias

- `doc-arquitecto` **no** es instalable por sí solo: depende de estar listado en el catálogo del
  repo hermano. El camino de instalación es
  `/plugin marketplace add hifede1/claude-audit-tracker` → `/plugin install doc-arquitecto@fede-tools`.
- La entrada externa debe usar **`git-subdir` con URL HTTPS completa**, no el shorthand
  `owner/repo`: verificado empíricamente (CLI 2.1.214) que el shorthand se resuelve a SSH y el
  install falla en cualquier máquina sin SSH configurado. Detalle en
  `docs/references/marketplaces-plugins-claude-code.md`.
- Un cambio de nombre o de ubicación del repo de doc-arquitecto rompe el catálogo del hermano.
