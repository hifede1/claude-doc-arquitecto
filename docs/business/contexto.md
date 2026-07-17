---
tema: Contexto de negocio de doc-arquitecto — quién, para qué y el ecosistema hermano
fecha: 2026-07-17
triggers: [negocio, ecosistema, audit-tracker, gobernanza, colaboradores]
resumen: Para quién es la herramienta, cómo se relaciona con el audit-tracker y la regla de gobernanza que rige todas sus funciones.
---

# Contexto de negocio — doc-arquitecto

> Destilado del contrato de diseño (`docs/FICHA.md`) el 2026-07-17. Altitud: este
> documento es el QUÉ del negocio; el CÓMO técnico vive en `../references/`.

## Quién y para qué

Herramienta de Fede (y colaboradores) para producir y auditar la documentación-contrato
de un proyecto **antes** de correr `/audit-tracker` por primera vez (FICHA §1). Resuelve
que el audit-tracker no audite contra un plano roto: sin docs, o con docs incompletos o no
verificables, el drift que detecta no distingue si falla la obra o el plano.

## El ecosistema

doc-arquitecto es la mitad «plano» de un par de herramientas hermanas: **doc-arquitecto**
(produce y audita el contrato) y **audit-tracker** (audita la obra contra ese contrato).
Se instalan juntas desde el marketplace `fede-tools` y se complementan — la salida de una
es la entrada de la otra, sin traducción.

## Modelo

Open source (MIT, declarado en `plugin.json`). Sin modelo de monetización: el valor es el
tiempo ahorrado y la calidad del pipeline de construcción propio.

## Gobernanza (regla transversal)

Lo estructural se le pregunta SIEMPRE al humano con opciones y tradeoffs. La herramienta
jamás inventa decisiones de negocio ni de arquitectura; lo no decidido queda como decisión
pendiente explícita con dueño. Herencia directa del modo orquestado del audit-tracker.
