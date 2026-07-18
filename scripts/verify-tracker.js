#!/usr/bin/env node
/**
 * Verificador anti-drift del tracker vivo.
 *
 *   node scripts/verify-tracker.js
 *
 * Corré esto en CADA re-auditoría, ANTES del deploy del artifact.
 * Sale con código 1 si encuentra drift, así sirve como gate de CI.
 *
 * Qué protege (y por qué existe):
 *
 *   1. Índice ↔ archivos. El tracker guarda las decisiones como un ÍNDICE con link
 *      a docs/decisiones/, NO como copia (ADR 004: markdown en el repo es la fuente
 *      de verdad). Este check falla si el índice apunta a un archivo que no existe,
 *      o si hay un ADR en disco que nadie indexó.
 *
 *   2. Triggers ↔ frontmatter. Las referencias se cargan POR TRIGGER: el ejecutor lee
 *      toda referencia cuyos triggers matcheen su encargo. Si el tracker lista un
 *      SUBCONJUNTO de los triggers reales, la referencia no se carga por los que faltan
 *      y nadie se entera. Por eso se exige el conjunto idéntico, no «parecido».
 *
 *   3. Sin contenido duplicado. Copiar contexto/opciones/porqué de los ADRs dentro del
 *      HTML fue la causa raíz de 13 hallazgos en la auditoría del 2026-07-19. Este check
 *      falla si alguien vuelve a hacerlo.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const TRACKER = path.join(ROOT, 'docs/audits/claude-doc-arquitecto-tracker.html');
const ADR_DIR = path.join(ROOT, 'docs/decisiones');

let fail = 0;
const bad = (msg) => { console.log('  ❌ ' + msg); fail++; };

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
 * Los arrays del tracker son datos literales (sin referencias externas), así que
 * evaluarlos es seguro: el input es este mismo repo, no entrada de usuario.
 */
function grabArray(name) {
  const decl = script.indexOf('const ' + name + ' = [');
  if (decl === -1) throw new Error('no encuentro el array ' + name + ' en el tracker');
  const start = script.indexOf('[', decl);
  let depth = 0, end = start;
  for (; end < script.length; end++) {
    if (script[end] === '[') depth++;
    else if (script[end] === ']' && --depth === 0) break;
  }
  return new Function('return ' + script.slice(start, end + 1))();
}

console.log('=== 1. Índice de decisiones ↔ archivos reales ===');
const DECISIONS = grabArray('DECISIONS');
const enDisco = fs.readdirSync(ADR_DIR).filter(f => f.endsWith('.md')).sort();
const indexados = DECISIONS.filter(d => d.file).map(d => d.file).sort();

indexados.forEach(f => {
  if (!fs.existsSync(path.join(ADR_DIR, f))) bad('el índice apunta a un archivo inexistente: ' + f);
});
enDisco.forEach(f => {
  if (!indexados.includes(f)) bad('ADR en disco SIN entrada en el índice: ' + f);
});
if (!fail) console.log('  ✅ ' + indexados.length + ' indexados ↔ ' + enDisco.length + ' en disco — 1:1');

console.log('=== 2. Triggers del tracker ↔ frontmatter real ===');
const REFS = grabArray('REFS');
REFS.forEach(r => {
  if (!r.path.startsWith('docs/')) {
    console.log('  ⏭️  ' + r.id + ' — fuera de este repo, no verificable acá');
    return;
  }
  const abs = path.join(ROOT, r.path);
  if (!fs.existsSync(abs)) { bad(r.id + ' apunta a un path inexistente: ' + r.path); return; }

  const fm = fs.readFileSync(abs, 'utf8').match(/triggers:\s*\[(.*?)\]/);
  if (!fm) { console.log('  ⏭️  ' + r.id + ' — sin frontmatter triggers (doc de contrato)'); return; }

  const real = fm[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).sort();
  const listados = [...r.triggers].sort();
  const faltan = real.filter(t => !listados.includes(t));
  const sobran = listados.filter(t => !real.includes(t));

  if (faltan.length || sobran.length) {
    bad(r.id + ' triggers difieren del frontmatter:' +
      (faltan.length ? '\n     falta(n) en el tracker: ' + faltan.join(', ') : '') +
      (sobran.length ? '\n     sobra(n) en el tracker: ' + sobran.join(', ') : ''));
  } else {
    console.log('  ✅ ' + r.id + ' — ' + real.length + '/' + real.length + ' idénticos');
  }
});

console.log('=== 3. El índice no duplica contenido de los ADRs ===');
const desde = script.indexOf('const DECISIONS = [');
const hasta = script.indexOf('const DECISION_PENDS');
const bloque = script.slice(desde, hasta);
['contexto:', 'opciones:', 'porque:', 'consecuencias:'].forEach(campo => {
  if (bloque.includes(campo)) {
    bad('el índice volvió a duplicar el campo «' + campo + '» — la fuente de verdad es docs/decisiones/ (ADR 004)');
  }
});
if (!bloque.includes('contexto:') && !bloque.includes('opciones:')) {
  console.log('  ✅ el índice sigue siendo índice, no copia');
}

console.log('');
console.log(fail === 0
  ? '✅ TRACKER COHERENTE — listo para deploy'
  : '❌ ' + fail + ' problema(s) de drift — NO deployar hasta resolverlos');
process.exit(fail ? 1 : 0);
