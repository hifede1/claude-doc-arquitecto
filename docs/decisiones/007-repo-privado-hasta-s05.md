# 007 — Repo privado hasta S05

- **Estado:** aceptada (2026-07-17) · **superada** por [009](009-publicacion-repo-publico-y-tag-v1-0-0.md) el 2026-07-17
- **superaA:** —
- **Fuente:** tracker `DECISIONS.d07`

## Contexto

El modo orquestado necesitaba un remote **ya** para habilitar issues y PRs, pero publicar el
plugin era parte de la sesión S05.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| Público desde el arranque | Habilita todo de una, pero publica un plugin a medio construir |
| **Privado ahora, público en S05** ✅ | Habilita el loop hoy sin exponer trabajo incompleto; la instalación de terceros queda rota mientras tanto |
| Diferir el remote | Sin exposición, pero bloquea el loop orquestado entero |

## Decisión y porqué

Privado ahora; el pase a público queda como pendiente de S05. Habilita issues y PRs hoy sin
publicar un plugin a medio construir. Decidido por Fede en la calibración.

## Consecuencias

- La instalación remota de terceros falla hasta S05 — quedó listada como deuda visible en el tracker.
- La pendiente se resolvió en [ADR 009](009-publicacion-repo-publico-y-tag-v1-0-0.md).
