# 012 — El merge por el validador ES la firma; el informe de verificación es obligatorio

- **Estado:** aceptada (2026-07-19)
- **superaA:** la Consecuencia de [006](006-calibracion-del-loop-orquestado-sdd-mixto.md) que fijaba «la firma de validación es un comentario `✅ validado` desde la misma cuenta». El **umbral** del 006 —nada automergea— queda intacto y vigente.
- **Fuente:** issue [#24](https://github.com/hifede1/claude-doc-arquitecto/issues/24) · análisis con posturas enfrentadas del 2026-07-19 · decisión de Fede

## Contexto

El ADR 006 fijó dos cosas distintas en una sola frase, y conviene separarlas porque tuvieron destinos opuestos:

| Cláusula | Qué exige | Cumplimiento real |
|---|---|---|
| **Umbral** | «nada automergea, todo se firma» | ✅ **nunca se violó**: los 22 PRs mergeados figuran con `mergedBy: hifede1` |
| **Canal** | «la firma es un comentario `✅ validado`» | ❌ **0 de 22** puestas por el validador |

Los únicos dos `✅ validado` del repo (PRs #1 y #12) los escribió Claude por delegación explícita en sesión («firmalo por mí»). El validador nunca escribió uno.

Una regla que no se cumple ninguna vez en veintidós oportunidades no es una regla incumplida: es una regla mal formulada. Y el canal nunca fue decidido — la tabla de opciones del ADR 006 tiene tres filas sobre modos de loop y **cero sobre canales de firma**. Se heredó como default de `~/.claude/commands/orquestar.md`, donde el comentario aparece explícitamente como *fallback técnico* para el caso de cuenta única, no como el canal deseable.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **El merge ES la firma; el informe es obligatorio** ✅ | Es lo que la práctica ya inventó en sus mejores corridas, y el informe dice más que un tilde: enumera qué verificó la máquina y **qué queda a juicio humano**. Cuesta cero montarlo. En contra: su evidencia histórica es 2 de 5 — el PR #31 cerró el criterio C2 del contrato sin una línea de registro |
| Gate de CI que exija el string `✅ validado` | Restaura la coherencia formal sin tocar el ADR. Pero **con una sola cuenta, el mismo token que mergea escribe el comentario**: es un gate que la máquina satisface sola. Cambia una ausencia visible y no forjable (`reviews: 0` — que es exactamente cómo se detectó este problema) por una presencia mentirosa |
| Dos ámbitos (asíncrono firma, síncrono deja nota) | Explica el vocabulario de validador ausente del modo orquestado. Pero la frontera la declara la parte interesada, y contradice lo que este mismo plugin le exige a sus usuarios: «pieza sin respuesta clara de procedencia = NO firmada» |
| Canal que la máquina no pueda ejecutar (segunda cuenta, GPG) | Única que produce evidencia no fabricable por el agente. Descartada por ahora: es justo la infraestructura que el ADR 006 rechazó por sobredimensionada para una máquina, y si la clave termina operable por el agente «para desbloquear el loop», degrada al gate satisfacible sin que nadie lo note |

## Decisión y porqué

**La firma de validación es el merge del PR por la cuenta del validador.** Mergear exige permisos, es deliberado, y queda registrado en `mergedBy` — es un acto de autoridad más fuerte que un comentario que el propio agente puede escribir.

**El registro obligatorio pasa a ser el informe de verificación**, publicado en el PR antes del merge, con:

1. Qué se verificó **en código** y con qué evidencia concreta.
2. **Quién escribió los commits** — si los escribió la máquina, se declara.
3. **Qué NO cubre esa verificación** y queda a juicio humano.

Un informe que solo dice «todo verde» no cumple: el punto 3 es el que hace la diferencia entre verificar y validar.

Decidido por Fede el 2026-07-19 tras el análisis de posturas enfrentadas del issue #24.

## Consecuencias

- **La excepción de bookkeeping pierde su motivo.** Existía porque firmar era ceremonia costosa; con el merge como firma, el costo desaparece. Ver [ADR 013](013-que-vive-en-el-comentario-del-tracker.md).
- **Override explícito sobre `~/.claude/commands/orquestar.md`**, que este repo no versiona: su default define el canal de firma como comentario y habilita el automerge de bookkeeping. **Para este repo manda este ADR.** Sin esta cláusula, la próxima corrida de `/orquestar` reimporta el default y el drift vuelve solo — que es exactamente como nació la contradicción.
- **Los 5 PRs del 2026-07-18/19** (#23, #29, #30, #31, #33) se aceptan retroactivamente: el merge por el validador constituyó la validación bajo este criterio. Queda constancia en cada uno. Los #23 y #33 ya traían informe; #29, #30 y #31 no, y eso se registra como lo que fue.
- **Riesgo asumido y declarado:** el informe lo escribe la máquina sobre su propio trabajo. Mitigación parcial: el punto 3 obliga a nombrar lo que la máquina no puede validar, que es donde el humano tiene que mirar. Si aparecen PRs sin informe, la mitigación falló y hay que revisar esta decisión — no ignorarla.
