# 013 — Qué puede vivir en el comentario del tracker y qué sube a `docs/decisiones/`

- **Estado:** aceptada (2026-07-19)
- **superaA:** —
- **Fuente:** issue [#24](https://github.com/hifede1/claude-doc-arquitecto/issues/24) · análisis con posturas enfrentadas del 2026-07-19 · decisión de Fede

## Contexto

El comentario de cabecera de `docs/audits/claude-doc-arquitecto-tracker.html` se volvió, sin que nadie lo decidiera, una **fuente de reglas vinculantes sin firma**. Dos ejemplos concretos, que el propio `DEBT` del tracker agrupaba como «dos decisiones operativas sin ADR»:

1. **«redeploy SIEMPRE a esta misma URL — URL nueva = tracker roto»** — una restricción estructural con modo de falla declarado.
2. **«bookkeeping de cierres ya firmados: automergeable en modo orquestado»** — que contradecía, **tres líneas más abajo en el mismo archivo**, al punto 5: «umbral de firma: NADA automergea, todo se firma». Las dos frases entraron en el mismo commit: el archivo se contradecía a sí mismo desde su primera versión.

Aclaración importante, porque el issue #24 lo planteaba mal: **la URL fija NO contradice al [ADR 004](004-markdown-en-el-repo-como-fuente-de-verdad.md)**. Ese ADR legisla dónde viven *los docs que genera la herramienta*, y su §Decisión **delega** el HTML («el HTML vistoso ya lo pone el tracker del audit-tracker»). `docs/ALCANCE.md:24` afirma las dos cosas en una sola línea citando al 004 como autoridad. Un ADR no puede apoyarse en X y prohibir X. El defecto nunca fue la contradicción: fue el lugar donde vivía la regla.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **Un solo ADR sobre qué clase de cosa puede vivir ahí** ✅ | Cubre los dos casos de una y **corta el patrón**: la próxima convención que aparezca en ese comentario ya tiene criterio para clasificarse. En contra: exige definir una frontera, y las fronteras se discuten |
| Dos ADRs separados | Cada decisión queda aislada y granular. Pero no ataca el patrón: la próxima convención vuelve a aparecer suelta en el comentario, sin firma, y hay que volver a decidir de cero |
| Solo borrar la contradicción textual | Lo más barato, cero ADR nuevo. Deja la URL fija sin firma igual, y deja el comentario habilitado como fuente informal de reglas |

## Decisión y porqué

**El comentario del tracker es un instructivo operativo, no una fuente de reglas.** La frontera:

| Puede vivir en el comentario | Tiene que subir a `docs/decisiones/` |
|---|---|
| **Cómo** se ejecuta algo ya decidido: pasos, comandos, orden de los gates | **Qué** está permitido o prohibido |
| Ubicaciones y datos operativos (dónde está el artifact, qué constantes se editan) | Todo lo que declare un **modo de falla** («X = tracker roto») |
| Recordatorios y gotchas | Toda **excepción** a una regla firmada |
| Punteros a los ADRs que mandan | Todo lo que un tercero deba obedecer sin poder discutirlo |

Regla práctica: **si al leerlo alguien tiene que obedecer algo que no puede rastrear hasta un ADR firmado, está en el lugar equivocado.**

Aplicación a los dos casos:

- **URL fija del artifact** → se queda en el comentario, reformulada como instrucción operativa. No es una restricción estructural: el archivo versionado es la fuente, el artifact es un render, y `docs/audits/` está en git con historia de PRs. Lo que se pierde con una URL nueva son las referencias entrantes, no el contenido.
- **Automerge de bookkeeping** → **se elimina**. Era una excepción a una regla firmada viviendo fuera de `docs/decisiones/`, y con el [ADR 012](012-el-merge-es-la-firma-y-el-informe-es-obligatorio.md) perdió su motivo: existía porque firmar era ceremonia costosa, y ahora la firma **es** el merge. La contradicción interna del archivo desaparece con ella.

Decidido por Fede el 2026-07-19.

## Consecuencias

- El comentario del tracker queda reescrito bajo esta frontera, y el punto 4 ya no habilita automerge.
- **Override explícito sobre `~/.claude/commands/orquestar.md`** (que este repo no versiona): su default declara automergeable el PR de bookkeeping. **Para este repo manda este ADR.** Sin la cláusula, la próxima corrida de `/orquestar` reimporta el default y el drift vuelve — que es exactamente como nació.
- Queda un hueco **conocido y no resuelto acá**: `DEBT`, `CHANGELOG`, `CLOSED_COUNT` y las estimaciones viven solo en el HTML, sin contraparte en markdown. Para ese contenido el HTML *es* la fuente de verdad, y esta decisión no lo cambia — solo lo nombra. Candidato a encargo propio.
- Tampoco hay verificación entre el archivo commiteado y los bytes que sirve la URL publicada: `verify-tracker.js` valida el archivo, nadie valida el deploy. Registrado como deuda.
