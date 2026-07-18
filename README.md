# doc-arquitecto — plugin de Claude Code

Produce y audita la documentación de un proyecto para que sea un **contrato completo, coherente y verificable** — el plano que el [audit-tracker](https://github.com/hifede1/claude-audit-tracker) necesita para auditar la obra.

```
/documentar  →  /auditar-docs  →  código (encargos)  →  /audit-tracker
(escribir el plano) (auditar el plano)  (construir)        (auditar la obra)
└──────── doc-arquitecto ────────┘     └────── audit-tracker ──────┘
```

El audit-tracker es tan bueno como la documentación contra la que audita. Si un proyecto arranca sin docs — o con docs incompletos, contradictorios o con criterios no verificables — audita contra un plano roto: el drift que detecta no distingue si falla la obra o si el plano estaba mal dibujado. `doc-arquitecto` dibuja bien el plano y lo audita **antes** de que se levante un solo ladrillo.

## Los dos comandos

### `/documentar` — escribir el plano

Detecta el modo solo, y ante la duda elige el modo seguro (nunca pisa lo existente):

- **Modo nuevo** (repo sin docs) — entrevista guiada por etapas: propósito → alcance → caza de decisiones estructurales con opciones y tradeoffs → plan de sesiones. Recién con el plan confirmado por el humano genera la estructura `docs/` completa (VISION, ALCANCE, PLAN con fichas 🎯🛠️✅📚⛓️, decisiones/ como ADRs, references/, business/). Cada sesión sale con ≥1 criterio de aceptación **verificable**.
- **Modo existente** (repo con docs y/o código) — inventaría lo que hay, detecta huecos contra el contrato, y los completa con **diffs confirmados archivo por archivo**. Una **Guardia de Escritura Universal** garantiza que ningún archivo existente se pise sin tu sí explícito, en cualquier modo. Idempotente: re-correrlo sobre un repo completo deja `git status` limpio.

### `/auditar-docs` — auditar el plano

Audita el contrato mismo en **seis dimensiones** — completitud, contradicciones entre documentos, criterios no verificables, decisiones sin registrar, referencias faltantes o vencidas (frescura fechada), drift interno doc↔doc — con informe de severidad (🔴🟠🟡⚪) y ubicación `file:línea`. Ofrece los arreglos **uno por uno con confirmación**; lo que implicaría inventar (qué lado de una contradicción vale, el porqué de una decisión) se marca «requiere decisión humana» y se pregunta con opciones y tradeoffs — nunca se rellena.

El documentador no corrige su propio examen: `/auditar-docs` es el revisor independiente del plano que `/documentar` escribió.

## Instalación

```bash
claude plugin marketplace add hifede1/claude-audit-tracker
claude plugin install doc-arquitecto@fede-tools
```

O desde dentro de Claude Code:

```
/plugin marketplace add hifede1/claude-audit-tracker
/plugin install doc-arquitecto@fede-tools
```

> Los comandos de plugin quedan namespaceados: `/doc-arquitecto:documentar` y `/doc-arquitecto:auditar-docs`. El marketplace `fede-tools` es el mismo que publica el [audit-tracker](https://github.com/hifede1/claude-audit-tracker) — las dos herramientas se instalan juntas y se complementan: la salida de una es la entrada de la otra, sin traducción.

## Uso

```
/documentar   [contexto opcional del proyecto]   # escribe o completa el plano
/auditar-docs [contexto opcional]                 # audita el plano y ofrece arreglos
```

El flujo recomendado en un proyecto nuevo: `/documentar` → `/auditar-docs` (arreglar lo que marque) → y ya tenés el plano listo para `/audit-tracker` desde el día cero.

## Regla transversal

Lo estructural se le pregunta **SIEMPRE** al humano con opciones y tradeoffs — la herramienta jamás inventa decisiones de negocio ni de arquitectura. Lo que el humano no decide queda como decisión pendiente explícita, con dueño. Es la herencia directa del modo orquestado del audit-tracker, y es innegociable en todas las funciones.

## Licencia

MIT
