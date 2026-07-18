# 011 — `docs/PLAN.md` diferido a v1.1

- **Estado:** aceptada (2026-07-18)
- **superaA:** —
- **Fuente:** `docs/ALCANCE.md` §«Fuera de alcance de esta corrida de `/documentar`» · corrida de `/documentar` en modo existente del 2026-07-18

## Contexto

`docs/PLAN.md` es pieza obligatoria de la estructura que `/documentar` genera (`docs/FICHA.md`
§3) y la dimensión 1 de `/auditar-docs` la audita como tal. Pero al correr `/documentar` sobre
este repo, las cinco sesiones de construcción (S01–S05) ya estaban **completas y verificadas a
v1.0.0**: no había trabajo por delante que planificar.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| **No generarlo ahora** ✅ | El set queda sin una pieza del contrato, a cambio de no fabricar ceremonia; la ausencia queda declarada y fechada |
| Generarlo como histórico (S01–S05 en formato ficha) | Completa la estructura formal, pero documenta pasado, no plano — y duplica lo que `docs/FICHA.md` §7 ya registra |
| Entrevistar para planificar v1.1 ahora | Produce un PLAN vivo y real, pero exige decidir en el momento qué viene, sin que ese trabajo esté todavía sobre la mesa |

## Decisión y porqué

No se genera `docs/PLAN.md` en esta corrida. Un PLAN de sesiones cerradas es registro
histórico, no plano — y el histórico de construcción ya vive en `docs/FICHA.md` §7. Decidido
por Fede el 2026-07-18.

## Pendiente derivada

- **Qué falta:** escribir `docs/PLAN.md` con las sesiones de v1.1 en formato ficha
  (🎯 Planteamiento · 🛠️ Método · ✅ Criterios con `(verificación: …)` · 📚 Referencias ·
  ⛓️ Prerrequisitos · estimación).
- **Dueño:** Fede.
- **Qué la desbloquea:** que arranque trabajo real de v1.1 — es decir, que exista al menos una
  sesión con objetivo y criterio verificable por delante.

## Consecuencias

- Mientras `PLAN.md` no exista, los chequeos de completitud «cada sesión con ≥1 criterio
  verificable» y «fichas con sus cinco secciones» pasan **vacuamente**, no por cumplimiento.
  Una auditoría limpia de la dimensión 1 no prueba, hoy, que el generador de fichas funcione.
- El set no es un ejemplo completo del contrato que la propia herramienta produce: quien mire
  este repo buscando un `PLAN.md` de referencia no lo va a encontrar.
