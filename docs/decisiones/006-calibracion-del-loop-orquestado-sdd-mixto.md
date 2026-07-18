# 006 — Calibración del loop: orquestado con metodología mixta

- **Estado:** aceptada (2026-07-17)
- **superaA:** —
- **Fuente:** tracker `DECISIONS.d06` (calibración de la auditoría inicial)

## Contexto

Cómo se ejecuta el trabajo restante del propio plugin — decidido en la calibración de la
primera corrida de `/audit-tracker` sobre este repo.

## Opciones evaluadas

| Opción | Tradeoffs |
|---|---|
| Loop a mano | Control total, pero Fede queda en el camino crítico de cada paso |
| Despacho multi-máquina | Escala, pero es infraestructura de más para un repo con una sola máquina |
| **Orquestado con firma humana** ✅ | Autonomía de ejecución dejando al humano solo en la validación |

## Decisión y porqué

Modo orquestado (`/orquestar`), que activa el despacho aunque haya una sola máquina.
Metodología **mixta**: S04 con SDD ligero, el resto directo. Umbral de firma: **nada
automergea**. Fede quiere el loop autónomo quedándose solo en la validación; S04 era la única
sesión con decisiones de diseño abiertas.

## Consecuencias

- La cola de trabajo vive en GitHub (issues #2–#5).
- La firma de validación es un comentario «✅ validado» desde la misma cuenta.
