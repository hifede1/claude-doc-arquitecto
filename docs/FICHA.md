# Ficha de diseño: doc-arquitecto

> Estado: ✅ v1.0.0 — completado y publicado (firmada por Fede el 2026-07-17)
> Diseñada: 2026-07-17 · S01–S05 ✅ completas y verificadas · repo público, tag v1.0.0

## 1. Propósito

**Problema que resuelve:** el audit-tracker audita el código contra la documentación del proyecto — pero es tan bueno como esa documentación. Hoy, si un proyecto arranca sin docs (o con docs incompletos, contradictorios o con criterios no verificables), el audit-tracker audita contra un plano roto: el drift doc↔código que detecta no distingue si falla el código o si el plano estaba mal dibujado desde el principio.

**Para quién:** Fede (y colaboradores) al arrancar un proyecto nuevo o al retomar uno existente, SIEMPRE antes de correr `/audit-tracker` por primera vez.

**Una frase:** `doc-arquitecto` produce y audita la documentación de un proyecto para que sea un contrato completo, coherente y verificable — el plano que el audit-tracker necesita para auditar la obra.

**El ciclo completo que cierra:**

```
/documentar  →  /auditar-docs  →  código (encargos)  →  /audit-tracker
(escribir el plano) (auditar el plano)  (construir)        (auditar la obra)
└──────── doc-arquitecto ────────┘     └────── audit-tracker ──────┘
```

## 2. Tipo y forma

**Plugin de Claude Code** (`doc-arquitecto@fede-tools`), repo `hifede1/claude-doc-arquitecto`, misma estructura de plugin que `claude-audit-tracker` y listado como fuente externa (`git-subdir`) en el catálogo `fede-tools` del audit-tracker — doc-arquitecto ya no declara marketplace propio (#20). Herramienta **separada** del audit-tracker (no comandos dentro de él): documentar y auditar código son responsabilidades distintas con ritmos de versión distintos; se instalan juntas y se complementan.

## 3. Funciones

| Función | Entrada | Salida | Comportamiento |
|---|---|---|---|
| `/documentar` | Proyecto (repo) + contexto opcional del usuario | Estructura de docs en el repo: visión y propósito, plan de sesiones con fichas (objetivo, criterios de aceptación, dependencias), `docs/references/`, `docs/business/`, registro de decisiones (ADR) | **Modo nuevo** (sin docs): entrevista guiada al humano — propósito, alcance, decisiones estructurales con opciones y tradeoffs — y genera la estructura completa. **Modo existente** (hay docs y/o código): lee lo que hay, detecta huecos y propone completarlos PREGUNTANDO; nunca pisa contenido sin confirmación (muestra diff). Idempotente: re-correrlo = modo actualización. |
| `/auditar-docs` | La documentación del proyecto | Informe de hallazgos con severidad y ubicación `file:línea`, accionable | Audita el plano mismo: completitud (¿cada sesión tiene ≥1 criterio verificable?), contradicciones entre documentos, criterios no verificables ("que funcione bien"), decisiones estructurales sin registrar, referencias faltantes o vencidas (frescura fechada), drift interno doc↔doc. Ofrece aplicar los arreglos con confirmación, uno por uno. |

**Regla transversal (heredada de `/orquestar`):** lo estructural se le pregunta SIEMPRE al humano con opciones y tradeoffs — la herramienta jamás inventa decisiones de negocio ni de arquitectura.

### Flujo de `/documentar` en proyecto desde 0 (modo nuevo)

1. **Detección** — repo sin docs ni código relevante → activa la entrevista guiada (por etapas, no un formulario).
2. **Entrevista de propósito** — qué problema resuelve, para quién, cómo se ve el éxito.
3. **Entrevista de alcance** — qué hace la v1 y qué NO (el fuera de alcance se firma acá).
4. **Caza de decisiones estructurales** — stack, arquitectura, persistencia…, cada una con opciones y tradeoffs; el humano decide, la herramienta registra. Lo no decidido queda como **decisión pendiente** explícita, nunca inventado.
5. **Plan de sesiones** — propuesta de sesiones ordenadas por dependencia con criterios de aceptación verificables; el humano la ajusta.
6. **Generación** — recién acá escribe:

```
docs/
├── VISION.md            # propósito, problema, éxito
├── ALCANCE.md           # v1 sí / v1 no
├── PLAN.md              # sesiones con fichas y criterios
├── decisiones/          # un ADR por decisión (+ pendientes)
├── references/          # referencias técnicas, con fecha
└── business/            # contexto de negocio de la entrevista
```

7. **Cierre** — `/auditar-docs` sobre lo generado (la herramienta no corrige su propio examen sin revisor) y el proyecto queda listo para `/audit-tracker` desde el día cero.

## 4. Decisiones técnicas

| Decisión | Elegido | Alternativas descartadas | Por qué |
|---|---|---|---|
| Forma | Plugin separado | Comandos dentro de audit-tracker; skill suelto | Responsabilidades distintas (plano vs obra), versionado independiente; el skill no versiona ni se instala por marketplace. Decidido por Fede. |
| Formato de salida | El que consume audit-tracker (plan de sesiones con fichas, `docs/references/`, `docs/business/`, criterios de aceptación) | Formato genérico (README + specs + ADRs sueltos) | Pipeline sin traducción: la salida de uno es la entrada del otro. Decidido por Fede. |
| Generación | Entrevista guiada al humano | Generación automática leyendo solo el código | Lo estructural lo decide el humano; docs inventados por la máquina son el problema, no la solución. |
| Fuente de verdad | Markdown en el repo (git) | Artifact HTML, wiki externa | Los docs viajan con el código y se versionan; el HTML vistoso ya lo pone el tracker del audit-tracker. |
| Re-ejecución | Idempotente con modo actualización y diffs confirmados | Regenerar desde cero cada vez | Un documentador que pisa lo escrito destruye el contrato que debía cuidar. |
| Licencia y modelo | MIT · open source · sin monetización (ver `LICENSE`) | Licencia propietaria; otra OSS (Apache-2.0, GPL) | MIT es la más permisiva y estándar para tooling de desarrollo; sin fricción para colaboradores ni terceros; coherente con herramienta interna sin monetización. Decidido por Fede. |

## 5. Fuera de alcance (v1)

- **No audita código** — eso es el audit-tracker.
- **No despacha encargos** ni crea issues — eso es el modo despacho del audit-tracker.
- **No genera el tracker HTML.**
- No integra CI ni valida en pipelines.
- No traduce documentación existente de otros formatos (Notion, Confluence) — v1 trabaja sobre markdown en el repo.

## 6. Criterios de aceptación

- [x] `/documentar` en un repo sin docs produce la estructura completa, y **cada sesión del plan tiene ≥1 criterio de aceptación verificable** (verificación: inspección de la salida en un repo de prueba vacío). ✅ **S02** — corrida en repo vacío + escéptico independiente SOBREVIVE.
- [x] `/documentar` en un proyecto con docs existentes **no pisa nada sin confirmación**: propone diffs y pregunta (verificación: correr sobre repo con docs sembrados y verificar que el contenido original sobrevive a un rechazo). ✅ **S03** (implementación + 3 rondas de escéptico) + **corrida de verificación protocolizada del 2026-07-19**: repo de prueba sembrado con 4 docs (proyecto «snapback»), ejecutor CIEGO corriendo `/documentar`, rechazo humano real de un diff sobre archivo existente. Resultado verificado por sha256: `PLAN.md` byte-idéntico tras el rechazo, el descarte fue ENTERO (ninguno de los 3 cambios del diff se coló), el diff aprobado sí se aplicó, y cero escrituras antes del sí (`git status` limpio en el punto de confirmación). **Idempotencia verificada aparte** (encargo #27, 2026-07-19): sobre un repo con el contrato COMPLETO, el ejecutor ciego llegó a la conclusión terminal «el contrato está completo, cero cambios» y no escribió — `git status` limpio, 9/9 sha256 iguales, HEAD sin moverse.
- [x] `/auditar-docs` detecta y reporta con ubicación una **contradicción sembrada** entre dos documentos y un **criterio no verificable** sembrado (verificación: repo de prueba con ambos defectos plantados). ✅ **S04** — corrida ciega detectó ambos defectos con `file:línea` exactos.
- [x] **Pipeline end-to-end:** sobre los docs generados, `/audit-tracker` corre y los consume **sin adaptación manual** (verificación: correr ambos en secuencia en el repo de prueba). ✅ **S05** — workflow adversarial: refutado (gap de referencias) → arreglado en la fuente → re-verificado sin adaptación.
- [x] Las decisiones estructurales de la entrevista se le preguntan al humano **con opciones y tradeoffs** — cero decisiones de negocio inventadas (verificación: revisión del transcript de una corrida de `/documentar`). ✅ **S05** — los ADRs de `docs/decisiones/` mapean a la FICHA firmada o son pendientes con dueño; cero inventadas.

## 7. Plan de construcción

1. **S01 — Esqueleto:** repo `claude-doc-arquitecto`, estructura de plugin (el marketplace `fede-tools` que S01 creó se consolidó luego en el catálogo del audit-tracker, #20), comandos vacíos instalables → verificable: `/plugin install` funciona y los comandos aparecen.
2. **S02 — `/documentar` modo nuevo:** entrevista guiada + generación de la estructura completa → verificable: criterio 1.
3. **S03 — `/documentar` modo existente:** lectura de docs/código previos, huecos, diffs confirmados, idempotencia → verificable: criterio 2.
4. **S04 — `/auditar-docs`:** las seis dimensiones de auditoría + informe accionable + arreglos confirmados → verificable: criterio 3.
5. **S05 — Integración y cierre:** pipeline end-to-end con audit-tracker, README, publicación en GitHub → verificables: criterios 4 y 5.

## 8. Referencias

- `~/Developer/tools/claude-audit-tracker` — estructura de plugin, marketplace, formato de fichas/encargos que esta herramienta debe producir, y la regla de caza de decisiones de `/orquestar`.
- `fichas/PLANTILLA.md` (plantilla externa del taller, no versionada en este repo) — esta ficha sigue su formato.
- README del audit-tracker, sección catálogo de referencias — define `docs/references/` y `docs/business/` con frescura fechada.
