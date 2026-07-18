# 009 — Publicación: repo público + tag v1.0.0

- **Estado:** aceptada (2026-07-17)
- **superaA:** [007 — Repo privado hasta S05](007-repo-privado-hasta-s05.md) (el pase a público era su pendiente; acá se ejecuta)
- **Fuente:** tracker `DECISIONS.d08`

## Contexto

La decisión de publicación que [007](007-repo-privado-hasta-s05.md) había dejado pendiente:
cuándo pasar el repo a público. Se desbloqueaba al llegar a S05 con el pipeline end-to-end verde.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **Público ahora + tag v1.0.0** ✅ | Habilita la instalación de terceros y fija una versión estable |
| Público sin tag | Publica, pero deja la versión en 0.5.0 — señal confusa para quien instala |
| Seguir privado | Cero riesgo, pero deja la deuda de instalación abierta sin motivo: la condición ya se cumplió |

## Decisión y porqué

Público ahora, con tag `v1.0.0`. El end-to-end quedó verde — la condición exacta que
desbloqueaba la publicación — y las cinco sesiones quedaron verificadas. Decidido por Fede
vía `AskUserQuestion` + «firmalo por mí».

## Consecuencias

- Instalación remota de terceros habilitada (verificada: HTTP 200 sin autenticación).
- El plugin queda en v1.0.0 y la deuda de instalación del ADR 007 se cierra.
