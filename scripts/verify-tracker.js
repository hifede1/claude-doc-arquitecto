#!/usr/bin/env node
/**
 * Verificador anti-drift del tracker vivo.
 *
 *   node scripts/verify-tracker.js
 *
 * Corré esto en CADA re-auditoría, ANTES del deploy del artifact.
 * Sale con código 1 si encuentra drift, así sirve como gate de CI.
 *
 * ── Historia (léela antes de tocar nada) ───────────────────────────────────
 * La v1 de este archivo tenía tres checks y DABA FALSOS VERDES. Una auditoría
 * adversarial del 2026-07-19 (5 lentes independientes + verificación por
 * mutación demostrable) encontró que:
 *
 *   · El check 3 recortaba el texto entre dos `indexOf`. Si `const DECISION_PENDS`
 *     aparecía ANTES que `const DECISIONS`, el slice daba '' y el script imprimía
 *     «✅ el índice sigue siendo índice» CON contenido duplicado adentro. No es que
 *     no detectara: afirmaba lo contrario.
 *   · El check 2 se apagaba con la mutación exacta que existía para atrapar:
 *     borrar el frontmatter entero producía un `⏭️ skip` y salida verde.
 *
 * Lección que gobierna este archivo: **un skip silencioso es un agujero**. Si algo
 * no se puede verificar, se reporta como fallo o se declara en una allowlist con
 * nombre y motivo — nunca se saltea calladamente.
 *
 * ── Qué protege ────────────────────────────────────────────────────────────
 *  1. Índice de decisiones ↔ archivos de docs/decisiones/ (1:1, ambas direcciones).
 *  2. Triggers del tracker ↔ frontmatter real, SIN escapes por skip.
 *  3. El índice de decisiones no duplica contenido de los ADRs (ADR 004),
 *     validado sobre el array parseado y no sobre un recorte de texto.
 *  4. Integridad referencial INTERNA del tracker: los punteros por id entre
 *     DATA, PLAN, REFS, DECISION_PENDS y el mapa. Todos degradan en silencio
 *     en el render, así que sin este check el tracker miente sin avisar.
 *
 * Pendientes documentados en el issue #32 (auditoría completa): el catálogo
 * markdown docs/references/README.md triangulado, anatomía de ADR, schema de
 * frontmatter por mitad, y anclaje TESTS.gates ↔ validate.yml.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TRACKER = path.join(ROOT, 'docs/audits/claude-doc-arquitecto-tracker.html');
const ADR_DIR = path.join(ROOT, 'docs/decisiones');

/**
 * Allowlists EXPLÍCITAS. Cada entrada es una excepción con nombre que un
 * revisor ve crecer en el diff. Si esto se llena, el gate dejó de servir.
 */
// Archivos que el tracker referencia pero que legítimamente no llevan
// frontmatter `triggers` (son documentos de contrato, no referencias de catálogo).
const EXENTOS_FRONTMATTER = new Set(['docs/FICHA.md']);
// Referencias que viven fuera de este repo y por eso no se pueden verificar acá.
const REFS_EXTERNAS = new Set(['ref-plugins']);

let fail = 0;
const bad = (msg) => { console.log('  ❌ ' + msg); fail++; };
const ok = (msg) => console.log('  ✅ ' + msg);

if (!fs.existsSync(TRACKER)) {
  console.error('❌ no encuentro el tracker en ' + path.relative(ROOT, TRACKER));
  process.exit(1);
}
const html = fs.readFileSync(TRACKER, 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*)<\/script>/);
if (!scriptMatch) { console.error('❌ el tracker no tiene bloque <script>'); process.exit(1); }
const script = scriptMatch[1];

/**
 * Extrae un array literal del script por nombre, balanceando corchetes.
 * Los arrays del tracker son datos literales sin referencias externas, así que
 * evaluarlos es seguro: el input es este repo, no entrada de usuario.
 *
 * Limitación conocida: balancea corchetes sin conciencia de strings. Si algún
 * campo de texto gana un `[` o `]` literal, corta mal — por eso el llamador
 * envuelve en try/catch y reporta como fallo en vez de tirar un stack trace.
 */
function grabArray(name) {
  const decl = script.indexOf('const ' + name + ' = [');
  if (decl === -1) throw new Error('no encuentro el array ' + name);
  const start = script.indexOf('[', decl);
  let depth = 0, end = start;
  for (; end < script.length; end++) {
    if (script[end] === '[') depth++;
    else if (script[end] === ']' && --depth === 0) break;
  }
  if (depth !== 0) throw new Error('corchetes desbalanceados en ' + name);
  return new Function('return ' + script.slice(start, end + 1))();
}

/** Extrae varios arrays; un fallo de parseo es DRIFT REPORTADO, no un crash. */
function grabAll(nombres) {
  const out = {};
  for (const n of nombres) {
    try {
      out[n] = grabArray(n);
      if (!Array.isArray(out[n])) { bad(`${n} no es un array`); out[n] = []; }
    } catch (e) {
      bad(`no pude parsear «${n}» del tracker: ${e.message}`);
      out[n] = [];
    }
  }
  return out;
}

const { DECISIONS, REFS, DATA, PLAN, DECISION_PENDS, nodes } =
  grabAll(['DECISIONS', 'REFS', 'DATA', 'PLAN', 'DECISION_PENDS', 'nodes']);

// ───────────────────────────────────────────────────────────────────────────
console.log('=== 1. Índice de decisiones ↔ archivos reales ===');

if (!fs.existsSync(ADR_DIR)) {
  bad('no existe docs/decisiones/ — el registro de decisiones es la fuente de verdad (ADR 004)');
} else {
  const enDisco = fs.readdirSync(ADR_DIR).filter(f => f.endsWith('.md')).sort();
  if (enDisco.length === 0) bad('docs/decisiones/ está vacío: 0 ↔ 0 pasaría como 1:1 sin serlo');

  // Una entrada sin `file` es invisible para ambos loops: se reporta aparte.
  DECISIONS.filter(d => !d.file).forEach(d =>
    bad(`la entrada «${d.id || d.titulo}» del índice no tiene campo file — no apunta a ningún ADR`));

  const indexados = DECISIONS.filter(d => d.file).map(d => d.file).sort();
  indexados.forEach(f => {
    if (!fs.existsSync(path.join(ADR_DIR, f))) bad('el índice apunta a un archivo inexistente: ' + f);
  });
  enDisco.forEach(f => {
    if (!indexados.includes(f)) bad('ADR en disco SIN entrada en el índice: ' + f);
  });
  if (!fail) ok(indexados.length + ' indexados ↔ ' + enDisco.length + ' en disco — 1:1');
}

// ───────────────────────────────────────────────────────────────────────────
console.log('=== 2. Triggers del tracker ↔ frontmatter real ===');

/** Lee `triggers` SOLO del bloque de frontmatter, nunca del cuerpo del documento. */
function leerTriggers(abs) {
  const txt = fs.readFileSync(abs, 'utf8');
  const fm = txt.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return { estado: 'sin-frontmatter' };
  const inline = fm[1].match(/^triggers:\s*\[(.*)\]\s*$/m);
  if (inline) {
    return { estado: 'ok', lista: inline[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean) };
  }
  // Lista YAML de bloque: es YAML válido, así que hay que detectarla para dar un
  // mensaje útil — pero el contrato fija la forma inline, así que igual es fallo.
  if (/^triggers:\s*$/m.test(fm[1])) return { estado: 'lista-de-bloque' };
  return { estado: 'sin-triggers' };
}

if (REFS.length === 0) {
  bad('REFS vacío: el catálogo por trigger es el mecanismo de carga del ejecutor');
}

REFS.forEach(r => {
  const abs = path.resolve(ROOT, r.path || '');
  const dentroDelRepo = abs.startsWith(ROOT + path.sep);

  // Externa: solo se saltea si está declarada por id en la allowlist.
  if (!dentroDelRepo || !fs.existsSync(abs)) {
    if (REFS_EXTERNAS.has(r.id)) { console.log('  ⏭️  ' + r.id + ' — externa declarada (allowlist)'); return; }
    bad(`${r.id} apunta a «${r.path}», que no existe en este repo y no está en REFS_EXTERNAS`);
    return;
  }
  if (REFS_EXTERNAS.has(r.id)) {
    bad(`${r.id} está en REFS_EXTERNAS pero su path SÍ existe en el repo — sacalo de la allowlist`);
    return;
  }

  const rel = path.relative(ROOT, abs);
  const t = leerTriggers(abs);

  if (EXENTOS_FRONTMATTER.has(rel)) {
    // La excepción no se fosiliza: si el archivo gana triggers, hay que sacarlo de la lista.
    if (t.estado === 'ok') bad(`${rel} ya tiene frontmatter triggers — sacalo de EXENTOS_FRONTMATTER`);
    else console.log('  ⏭️  ' + r.id + ' — doc de contrato sin frontmatter (allowlist)');
    return;
  }

  if (t.estado === 'sin-frontmatter') { bad(`${rel} no tiene bloque de frontmatter`); return; }
  if (t.estado === 'lista-de-bloque') { bad(`${rel} declara triggers como lista YAML de bloque; el contrato fija la forma inline [a, b, c]`); return; }
  if (t.estado === 'sin-triggers') { bad(`${rel} tiene frontmatter pero sin campo triggers`); return; }

  const real = [...t.lista].sort();
  const listados = [...(r.triggers || [])].sort();
  const faltan = real.filter(x => !listados.includes(x));
  const sobran = listados.filter(x => !real.includes(x));
  if (faltan.length || sobran.length) {
    bad(`${r.id} triggers difieren del frontmatter:` +
      (faltan.length ? `\n     falta(n) en el tracker: ${faltan.join(', ')}` : '') +
      (sobran.length ? `\n     sobra(n) en el tracker: ${sobran.join(', ')}` : ''));
  } else {
    ok(`${r.id} — ${real.length}/${real.length} idénticos`);
  }
});

// ───────────────────────────────────────────────────────────────────────────
console.log('=== 3. El índice de decisiones no duplica contenido de los ADRs ===');

// Se valida sobre el array PARSEADO, no sobre un recorte de texto por posición:
// el recorte se auto-desactivaba y afirmaba éxito. Lista blanca de claves ⇒
// cualquier campo nuevo hay que declararlo acá a propósito.
const CLAVES_INDICE = new Set(['id', 'num', 'titulo', 'estado', 'fecha', 'file', 'linea', 'nota']);
let dupes = 0;
DECISIONS.forEach(d => {
  Object.keys(d).forEach(k => {
    if (!CLAVES_INDICE.has(k)) {
      bad(`DECISIONS[${d.id || d.num}] tiene la clave «${k}» — el índice no lleva contenido de ADRs (ADR 004: la fuente de verdad es docs/decisiones/)`);
      dupes++;
    }
  });
});
if (!dupes) ok('el índice sigue siendo índice, no copia');

// ───────────────────────────────────────────────────────────────────────────
console.log('=== 4. Integridad referencial interna del tracker ===');

// Los cuatro punteros por id del artifact. Todos degradan EN SILENCIO en el
// render (sin else, sin warn): un id colgado no rompe la página, la vuelve
// mentirosa. Por eso se verifican acá.
const bloques = DATA.flatMap(z => z.bloques || []);
const bloqueIds = new Set(bloques.map(b => b.id));
const refIds = new Set(REFS.map(r => r.id));
const allPends = bloques.flatMap(b => b.pends || []);   // no todos declaran pends
const pendIds = new Set(allPends.map(p => p.id));
let colgados = 0;
const colgado = (m) => { bad(m); colgados++; };

bloques.forEach(b => (b.refs || []).forEach(r => {     // ni refs
  if (r.freshref && !refIds.has(r.freshref)) {
    colgado(`la ficha «${b.id}» cita freshref «${r.freshref}», que no existe en REFS — el link no resalta nada`);
  }
}));
PLAN.forEach(s => {
  if (s.bloque && !bloqueIds.has(s.bloque)) {
    colgado(`la sesión «${s.titulo}» apunta al bloque «${s.bloque}», inexistente — pierde tareas y botón de encargo`);
  }
});
// El primer nodo del mapa tiene id:null a propósito («FICHA firmada»): filtrarlo
// no es una concesión, es que esos nodos no apuntan a ningún bloque.
nodes.filter(n => n.id).forEach(n => {
  if (!bloqueIds.has(n.id)) colgado(`el nodo del mapa «${n.id}» no existe en DATA`);
});
DECISION_PENDS.forEach(dp => {
  if (!pendIds.has(dp.pendId)) {
    colgado(`la decisión pendiente «${dp.note || dp.pendId}» apunta al pend «${dp.pendId}», que ya no existe — el render la descarta en silencio`);
  }
});
// Los ticks viven en un diccionario plano de localStorage: dos pends con el
// mismo id comparten estado entre bloques distintos.
const vistos = new Set();
allPends.forEach(p => {
  if (vistos.has(p.id)) colgado(`el id de pendiente «${p.id}» está repetido — los ticks se pisan entre bloques`);
  vistos.add(p.id);
});
if (!colgados) {
  ok(`${bloques.length} bloques · ${allPends.length} pendientes · ${PLAN.length} sesiones · ${nodes.filter(n => n.id).length} nodos — sin punteros colgados`);
}

// NOTA deliberada: NO se reporta como fallo una REFS que ninguna ficha cite por
// freshref. REFS es el catálogo que el ejecutor carga POR TRIGGER, no un índice
// de citas; exigir citas generaría presión para inventarlas solo para apagar el gate.

console.log('');
console.log(fail === 0
  ? '✅ TRACKER COHERENTE — listo para deploy'
  : '❌ ' + fail + ' problema(s) de drift — NO deployar hasta resolverlos');
process.exit(fail ? 1 : 0);
