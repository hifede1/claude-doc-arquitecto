# doc-arquitecto — plugin de Claude Code

> 🚧 **Estado: S01 — Esqueleto.** Los comandos están instalables pero son placeholders; la funcionalidad llega en S02–S05. El contrato de diseño completo vive en [`docs/FICHA.md`](docs/FICHA.md).

Produce y audita la documentación de un proyecto para que sea un **contrato completo, coherente y verificable** — el plano que el [audit-tracker](https://github.com/hifede1/claude-audit-tracker) necesita para auditar la obra.

```
/documentar  →  /auditar-docs  →  código (encargos)  →  /audit-tracker
(escribir el plano) (auditar el plano)  (construir)        (auditar la obra)
└──────── doc-arquitecto ────────┘     └────── audit-tracker ──────┘
```

- **`/documentar`** — en un repo sin docs: entrevista guiada (propósito → alcance → decisiones estructurales con opciones y tradeoffs → plan de sesiones) y generación de la estructura `docs/` completa. En un repo con docs: detecta huecos y propone completarlos con diffs confirmados — nunca pisa nada. *(Implementación: S02–S03.)*
- **`/auditar-docs`** — audita el plano mismo: completitud, contradicciones entre documentos, criterios no verificables, decisiones sin registrar, referencias vencidas y drift doc↔doc. Informe `file:línea` accionable, arreglos con confirmación. *(Implementación: S04.)*

## Instalación

```bash
claude plugin marketplace add hifede1/claude-doc-arquitecto   # o la ruta local del repo
claude plugin install doc-arquitecto@fede-tools
```

## Regla transversal

Lo estructural se le pregunta SIEMPRE al humano con opciones y tradeoffs — la herramienta jamás inventa decisiones de negocio ni de arquitectura.
