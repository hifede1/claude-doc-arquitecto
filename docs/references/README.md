# Catálogo de referencias — doc-arquitecto

> Catálogo vivo que la pestaña Referencias del `/audit-tracker` consume sin traducir.
> Cubre AMBAS mitades: `references/` (el CÓMO técnico) y `business/` (el QUÉ del negocio).

| Tema | Qué resuelve | Mitad | Fecha | Frescura | Triggers | La usa | Path |
|---|---|---|---|---|---|---|---|
| Auditoría de documentación (6 dimensiones) | Heurísticas por dimensión, severidades y formato del informe de `/auditar-docs` | CÓMO | 2026-07-17 | 🟢 fresca | `auditoría`, `auditar-docs`, `contradicciones`, `criterios verificables`, `completitud`, `drift`, `referencias vencidas`, `severidad` | `/auditar-docs` (embebida en el comando) | `docs/references/auditoria-de-docs.md` |
| Contexto de negocio de doc-arquitecto | Quién, para qué, el ecosistema hermano y la gobernanza | QUÉ | 2026-07-17 | 🟢 fresca | `negocio`, `ecosistema`, `audit-tracker`, `gobernanza`, `colaboradores` | Marco de negocio (todas las funciones) | `docs/business/contexto.md` |
| Marketplaces y fuentes de plugins en Claude Code | Schema de `source`, caso subdirectorio de repo externo (`git-subdir`) y topología del catálogo único `fede-tools` | CÓMO | 2026-07-18 | 🟢 fresca | `marketplace`, `plugin`, `source`, `git-subdir`, `github`, `catálogo`, `publicar`, `publicación`, `instalación`, `colisión`, `fede-tools`, `plugin.json`, `marketplace.json` | Publicación de plugins (#20 y futuros publicador/verificador/cartera) | `docs/references/marketplaces-plugins-claude-code.md` |

## Frontmatter de cada archivo

Los paths viven en la columna **Path** de la tabla. Acá solo qué frontmatter lleva cada mitad:

- **Referencias técnicas** (`docs/references/*.md`) — `tema` / `triggers` / `fecha` / `fuentes`.
- **Docs de negocio** (`docs/business/*.md`) — `tema` / `fecha` / `triggers` / `resumen`.

## Regla de carga

Las fichas y encargos LINKEAN referencias (jamás copian su contenido), y además se cargan
POR TRIGGER: el ejecutor lee toda referencia cuyos `triggers` matcheen el tema de su
encargo. Por eso los `triggers` viven acá y no solo en el frontmatter. Frescura fechada:
sin fecha, vieja o contradicha → 🟠 pendiente de refresco; faltante → 🔴.
