# Visión — doc-arquitecto

> Destilado de `docs/FICHA.md` §1 (contrato firmado por Fede el 2026-07-17).
> Fecha de este documento: 2026-07-18.

## El problema

El `audit-tracker` audita el código contra la documentación del proyecto — pero es tan bueno
como esa documentación. Si un proyecto arranca sin docs, o con docs incompletos,
contradictorios o con criterios no verificables, el audit-tracker audita contra un **plano
roto**: el drift doc↔código que detecta no distingue si falla la obra o si el plano estaba
mal dibujado desde el principio.

## Para quién

Fede (y colaboradores) al arrancar un proyecto nuevo o al retomar uno existente, **siempre
antes** de correr `/audit-tracker` por primera vez.

## Qué es

`doc-arquitecto` produce y audita la documentación de un proyecto para que sea un contrato
**completo, coherente y verificable** — el plano que el audit-tracker necesita para auditar
la obra.

## El ciclo que cierra

```
/documentar  →  /auditar-docs  →  código (encargos)  →  /audit-tracker
(escribir el plano) (auditar el plano)  (construir)        (auditar la obra)
└──────── doc-arquitecto ────────┘     └────── audit-tracker ──────┘
```

## Cómo se ve el éxito

El éxito es observable y está clavado en los criterios de aceptación de `docs/FICHA.md` §6
(los cinco, todos ✅ verificados a v1.0.0). Los tres que definen la visión:

1. `/documentar` en un repo sin docs produce la estructura completa y **cada sesión del plan
   tiene ≥1 criterio de aceptación verificable**.
2. `/documentar` sobre un repo con docs existentes **no pisa nada sin confirmación**.
3. Sobre los docs generados, `/audit-tracker` corre y los consume **sin adaptación manual**.

## Regla transversal

Lo estructural se le pregunta **SIEMPRE** al humano con opciones y tradeoffs. La herramienta
jamás inventa decisiones de negocio ni de arquitectura; lo no decidido queda como decisión
pendiente explícita con dueño. Ver [ADR 003](decisiones/003-entrevista-guiada-lo-estructural-lo-decide-el-humano.md).
