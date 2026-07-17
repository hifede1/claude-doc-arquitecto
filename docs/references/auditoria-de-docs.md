---
tema: Auditoría de documentación-contrato — heurísticas de las seis dimensiones, severidades y formato del informe
triggers: [auditoría, auditar-docs, contradicciones, criterios verificables, completitud, drift, referencias vencidas, severidad]
fecha: 2026-07-17
fuentes:
  - docs/FICHA.md §3 (definición firmada de las seis dimensiones) y §6 (criterio 3)
  - claude-audit-tracker (repo hermano): README y comando audit-tracker.md — conceptos de drift como hallazgo de primera clase, frescura fechada de referencias, criterios verificables como contrato de validación
  - Corrida de verificación de S02 (issue #2 de este repo) — formato real del contrato generado que esta auditoría consume
  - Michael Nygard, «Documenting Architecture Decisions» (2011) — anatomía ADR: contexto, opciones, decisión, consecuencias
---

# Auditoría de documentación como contrato — el CÓMO destilado

Esta referencia fija el diseño de `/auditar-docs` (S04): qué busca cada dimensión, con qué
heurística operativa, qué severidad asigna y cómo se estructura el informe. Es la fuente de
diseño para mantenedores del plugin; el comando embebe estas heurísticas (corre en el repo
del USUARIO, donde esta referencia no existe — el comando debe ser autocontenido).

## Modelo de severidades (decisión de diseño)

| Nivel | Significado | Ejemplos |
|---|---|---|
| 🔴 crítica | Rompe el contrato: dos partes del plano se contradicen o el plano exige lo inexistente | Contradicción alcance↔plan; prerrequisito hacia una sesión que no existe |
| 🟠 alta | El contrato no es verificable o auditable en un punto | Criterio sin método de verificación; decisión estructural afirmada sin ADR; referencia faltante para una sesión próxima |
| 🟡 media | El contrato envejece o pierde precisión | Referencia sin fecha o vencida; drift menor de datos entre docs |
| ⚪ menor | Forma: no bloquea la auditoría de la obra | Sección vacía, link roto, ficha sin estimación |

**Por qué cuatro niveles y no tres**: la frontera que importa es 🔴/🟠 («el plano miente» vs
«el plano no se puede verificar») — colapsarlas esconde la diferencia entre reparar una
contradicción (decisión humana) y completar un método de verificación (redacción).

## Las seis dimensiones — heurística operativa de cada una

1. **Completitud** — ¿está el contrato entero? Estructura esperada presente (VISION,
   ALCANCE, PLAN, decisiones/, references/, business/ — o su equivalente declarado); cada
   sesión del PLAN con ≥1 criterio y CADA criterio con su `(verificación: …)`; fichas con
   sus cinco secciones (🎯🛠️✅📚⛓️); ADRs con contexto/opciones/decisión/porqué/estado.
   Pieza ausente o sección vacía = hallazgo (severidad según tabla).
2. **Contradicciones entre documentos** — afirmaciones incompatibles entre archivos.
   Método: cruzar las afirmaciones FACTUALES del set (alcances, dependencias, fechas,
   nombres, números): «ALCANCE dice que v1 NO hace X» vs «PLAN tiene una sesión que hace X»;
   prerrequisitos circulares o hacia sesiones inexistentes. Siempre 🔴: el contrato miente
   en algún lado y decidir cuál lado vale es del humano.
3. **Criterios no verificables** — test operativo: ¿otra persona puede ejecutar la
   verificación y llegar a un sí/no? Señales: vaguedad sin método («que funcione bien»,
   «robusto», «intuitivo», «rápido»); criterio sin `(verificación: …)`; método no ejecutable
   («verificación: sentido común»). 🟠 — y el arreglo NUNCA inventa el umbral: propone una
   formulación verificable citando la intención, y el humano la firma (regla-borde de
   /documentar: la sustancia se conserva, la formulación se propone).
4. **Decisiones estructurales sin registrar** — el plano afirma decisiones («usamos X»,
   «arquitectura Y», «se persiste en Z») que no tienen ADR en decisiones/; o menciona
   pendientes sin dueño ni desbloqueador. 🟠. El arreglo propone el ESQUELETO del ADR con
   la decisión citada — el porqué y las opciones descartadas los completa el humano (la
   herramienta no inventa la historia de una decisión que no presenció).
5. **Referencias faltantes o vencidas** — catálogo vs plan: sesión de territorio nuevo sin
   referencia (🟠 si la sesión está próxima, 🟡 si lejana); referencia sin fecha o sin
   `triggers` (🟡); faltante marcada sin link al encargo que la necesita (⚪). La frescura
   es FECHADA — y con fecha, **la vejez también es hallazgo**: >6 meses por defecto, >3 en
   temas volátiles (APIs, herramientas, precios, versiones), o cualquier referencia anterior
   a un cambio del propio set que la afecte → 🟡 «pendiente de refresco». Los umbrales son
   heurística DECLARADA en el informe (el humano puede ajustarlos), no ley silenciosa.
6. **Drift interno doc↔doc** — el mismo dato con valores distintos en dos lugares:
   versiones, conteos de sesiones, nombres de archivos, fechas de firma, rutas. 🟡 (🔴 si
   el dato drifteado es un criterio o una dependencia). Diferencia con la dimensión 2:
   drift es el MISMO hecho desincronizado; contradicción es dos afirmaciones incompatibles.

## Formato del informe (decisión de diseño)

1. **Cabecera**: veredicto en una línea + conteo por severidad (🔴 n · 🟠 n · 🟡 n · ⚪ n).
2. **Cuerpo por dimensión**, las seis SIEMPRE y en este orden — una dimensión sin hallazgos
   se declara «✅ sin hallazgos» (el silencio no informa; el «revisado y limpio» sí).
3. **Cada hallazgo**: severidad · `archivo:línea` · qué está mal (citando el texto) · arreglo
   propuesto, o la marca **«requiere decisión humana»** cuando el arreglo implicaría inventar
   (qué lado de una contradicción vale, el porqué de una decisión no registrada).

**Por qué por-dimensión y no por-archivo o por-severidad**: el informe es auditable contra
la definición de la ficha (¿las seis pasaron?) y el conteo de cabecera ya da el triage por
severidad sin duplicar la estructura.

## Arreglos (decisión de diseño)

Solo DESPUÉS del informe completo (nunca inline), uno por uno en orden de severidad
descendente, con la mecánica de diff confirmado por archivo (idéntica a /documentar,
Fase 1-E paso 5): mostrar diff → preguntar → aplicar solo con sí explícito → un no descarta
ese arreglo entero. Los «requiere decisión humana» no llevan diff: llevan la pregunta con
opciones y tradeoffs (regla transversal), y sin respuesta quedan como pendiente con dueño.

## Guardias

- **No audita código** — el plano, no la obra (eso es el audit-tracker). Fuera de alcance
  firmado en la ficha.
- **Read-only hasta la fase de arreglos**: la auditoría jamás modifica nada por su cuenta.
- **Sin hallazgos = decirlo**: un auditor que inventa hallazgos para justificarse es tan
  inútil como el que no encuentra nada por no mirar.
