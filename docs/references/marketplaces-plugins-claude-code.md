---
tema: Marketplaces y fuentes de plugins en Claude Code — schema de `source`, caso subdirectorio de repo externo (git-subdir) y topología de catálogo único
triggers: [marketplace, plugin, source, git-subdir, github, catálogo, publicar, publicación, instalación, colisión, fede-tools, plugin.json, marketplace.json]
fecha: 2026-07-18
fuentes:
  - https://code.claude.com/docs/en/plugin-marketplaces.md#plugin-sources (tabla de las 5 formas de `source`)
  - https://code.claude.com/docs/en/plugin-marketplaces.md#github-repositories (source `github`)
  - https://code.claude.com/docs/en/plugin-marketplaces.md#git-subdirectories (source `git-subdir` — url + path)
  - https://code.claude.com/docs/en/plugin-marketplaces.md#marketplace-schema (schema del marketplace)
  - https://code.claude.com/docs/en/plugin-marketplaces.md#version-resolution-and-release-channels (resolución de versión)
  - hifede1/claude-doc-arquitecto#20 (decisión de topología del catálogo único fede-tools, firmada por Fede el 2026-07-18)
  - Verificación empírica (CLI Claude Code 2.1.214, 2026-07-18): git-subdir con shorthand `owner/repo` clona por SSH y falla sin SSH configurado; con URL HTTPS explícita instala OK
---

# Marketplaces y fuentes de plugins en Claude Code — el CÓMO destilado

Esta referencia fija cómo se publica un plugin de este ecosistema (`fede-tools`) sin chocar
con los ya publicados. Nace del fix del issue #20: doc-arquitecto declaraba su propio
marketplace `fede-tools`, colisionando con el de `claude-audit-tracker` (el nombre de
marketplace es **único** en Claude Code). El schema de abajo está **verificado en la doc
oficial** — no inventado: el #20 lo exigía explícitamente.

## Topología decidida (ADR de facto, #20 — firmada 2026-07-18)

- **El catálogo canónico `fede-tools` vive en UN solo repo: `claude-audit-tracker`.** Fue el
  primero publicado con ese nombre → conservarlo ahí es cero disrupción del camino de
  instalación existente.
- **Ningún otro repo de plugin declara ese marketplace.** Cada plugin se lista en el catálogo
  del audit-tracker como **fuente externa** cuando se publica.
- doc-arquitecto conserva solo su `plugins/doc-arquitecto/.claude-plugin/plugin.json`; **no**
  necesita marketplace propio para ser instalable — basta la entrada externa en el catálogo.
- Alternativa descartada por ahora: repo dedicado `hifede1/fede-tools` — más limpio en nombre,
  pero rompería el `plugin marketplace add hifede1/claude-audit-tracker` ya publicado.

Regla de oro para futuros plugins (publicador, verificador, cartera…): **no crean su propio
marketplace**; se suman al catálogo del audit-tracker como fuente externa.

## Las 5 formas del campo `source` de una entrada de plugin

Cada entrada del array `plugins[]` de un `marketplace.json` lleva un `source` que le dice a
Claude Code de dónde traer ese plugin ([tabla oficial](https://code.claude.com/docs/en/plugin-marketplaces.md#plugin-sources)):

| Forma | Tipo | Ejemplo |
|---|---|---|
| Ruta local relativa | `string` | `"./plugins/mi-plugin"` |
| GitHub (plugin en la **raíz** del repo) | `object` | `{ "source": "github", "repo": "owner/repo" }` |
| Git URL (cualquier host) | `object` | `{ "source": "url", "url": "https://gitlab.com/…" }` |
| **Subdirectorio de un repo git** | `object` | `{ "source": "git-subdir", "url": "owner/repo", "path": "sub/dir" }` |
| npm | `object` | `{ "source": "npm", "package": "@org/plugin" }` |

Un mismo `marketplace.json` **puede mezclar** entradas locales y externas en el mismo array,
sin restricción (confirmado en la doc). Así queda el catálogo `fede-tools`: `audit-tracker`
local (`./plugins/audit-tracker`) + `doc-arquitecto` externo (`git-subdir`).

## El caso que resolvió el #20: plugin en subdirectorio de repo externo → `git-subdir`

**Gotcha central:** si el plugin externo NO está en la raíz de su repo (doc-arquitecto vive en
`plugins/doc-arquitecto/`), **no** se usa `github` — se usa **`git-subdir`**. Claude Code hace
un *sparse/partial clone* de solo ese subdirectorio.

```json
{
  "name": "doc-arquitecto",
  "source": {
    "source": "git-subdir",
    "url": "https://github.com/hifede1/claude-doc-arquitecto.git",
    "path": "plugins/doc-arquitecto",
    "ref": "main"
  },
  "description": "…"
}
```

⚠️ **Usá la URL HTTPS completa (`https://…​.git`), NO el shorthand `owner/repo`.** Verificado
empíricamente (CLI 2.1.214): en `git-subdir`, el shorthand `owner/repo` lo resuelve el CLI a
**SSH** (`git@github.com:…`) y el `install` **falla** con «Host key verification failed» en
cualquier máquina sin SSH configurado. El `marketplace add` del shorthand sí cae a HTTPS, pero
el clone del git-subdir **no** hace ese fallback. La URL HTTPS explícita instala sin depender de
SSH. (Fue el bug que rompió la instalación de doc-arquitecto tras el #20.)

Campos de `git-subdir` ([tabla oficial](https://code.claude.com/docs/en/plugin-marketplaces.md#git-subdirectories)):

| Campo | Req. | Qué es |
|---|---|---|
| `url` | sí | **URL HTTPS completa** (`https://github.com/owner/repo.git`). Evitá el shorthand `owner/repo`: en `git-subdir` el CLI lo resuelve a SSH y el `install` falla sin SSH configurado (ver ⚠️ arriba). |
| `path` | sí | Subdirectorio dentro del repo donde vive el plugin (ej. `plugins/doc-arquitecto`) |
| `ref` | no | Rama o tag; default = rama default del repo |
| `sha` | no | Commit exacto de 40 chars para pinear una versión inmutable |

## Gotchas que importan al publicar

1. **Versión duplicada gana la de `plugin.json`.** Orden de resolución: `plugin.json` version →
   version de la entrada del marketplace → git SHA. Si ponés `version` en ambos lados, la del
   `plugin.json` gana **silenciosamente**. → No pongas `version` en la entrada del catálogo si
   el plugin ya la fija en su `plugin.json` (doc-arquitecto: v1.0.0).
2. **Rutas relativas (`./…`) NO funcionan si el marketplace se agrega vía URL directa.** Solo
   resuelven cuando el marketplace se agrega desde git o directorio local. Por eso los plugins
   externos SIEMPRE van con `github`/`url`/`git-subdir`, nunca con `./`.
3. **Campos por entrada:** `name` (kebab-case, sin espacios) y `source` son obligatorios;
   `description` es recomendado.
4. **El plugin externo necesita su `plugin.json`**, no su propio marketplace. doc-arquitecto ya
   lo tiene en `plugins/doc-arquitecto/.claude-plugin/plugin.json`.

## Verificación de un cambio de catálogo

- Estática, siempre: `jq empty marketplace.json` (JSON válido) + revisar que cada `source`
  externo tenga sus campos requeridos.
- De punta a punta (requiere el catálogo mergeado en main): en Claude Code,
  `/plugin marketplace add hifede1/claude-audit-tracker` → `/plugin install doc-arquitecto@fede-tools`.
  No colisiona si **ningún otro repo agregado** declara un marketplace con el mismo nombre.
