#!/usr/bin/env bash
#
# Test de regresión de scripts/verify-tracker.js.
#
#   bash scripts/test-verify-tracker.sh
#
# Introduce mutaciones reales en el repo, comprueba que el verificador las
# DETECTA (exit 1), y restaura. Sale 1 si alguna mutación pasa desapercibida.
#
# Por qué existe: la v1 del verificador se probó solo contra el repo sano y
# daba falsos verdes — llegó a imprimir «el índice sigue siendo índice» con
# contenido duplicado adentro. Un verificador que solo se prueba cuando todo
# está bien no verifica nada. Las mutaciones A, B y C son exactamente esos
# falsos verdes históricos: si alguna vuelve a pasar, hay una regresión.
#
# Al agregar un check nuevo a verify-tracker.js, agregá acá su mutación.
cd /Users/federicopernice/Developer/tools/claude-doc-arquitecto || exit 1

T=docs/audits/claude-doc-arquitecto-tracker.html
BK=/Users/federicopernice/.claude/jobs/7a3bd43c/tmp/bat
mkdir -p "$BK"
cp "$T" "$BK/tracker.bak"
cp docs/references/marketplaces-plugins-claude-code.md "$BK/mk.bak"
cp docs/business/contexto.md "$BK/ctx.bak"

pass=0; falla=0
probar() {
  local nombre="$1"
  if node scripts/verify-tracker.js >/tmp/out.txt 2>&1; then
    echo "  ❌ NO DETECTA: $nombre  (exit 0)"; falla=$((falla+1))
  else
    echo "  ✅ detecta: $nombre"; pass=$((pass+1))
    sed -n 's/^  ❌ /       → /p' /tmp/out.txt | head -1
  fi
}
restaurar() {
  cp "$BK/tracker.bak" "$T"
  cp "$BK/mk.bak" docs/references/marketplaces-plugins-claude-code.md
  cp "$BK/ctx.bak" docs/business/contexto.md
  rm -f docs/decisiones/099-fantasma.md
}

echo "── Los 3 FALSOS VERDES originales ──"
python3 -c "
p='$T'; s=open(p).read()
s=s.replace('const DECISIONS = [','const DECISION_PENDS_NOTA = [];\nconst DECISIONS = [',1)
s=s.replace(\"{ id: 'adr-002',\",\"{ id: 'adr-002', contexto: 'DUPLICADO PROHIBIDO',\",1)
open(p,'w').write(s)"
probar "A · check 3 auto-desactivado por orden de constantes"; restaurar

python3 -c "
p='docs/references/marketplaces-plugins-claude-code.md'; s=open(p).read()
open(p,'w').write(s[s.index('---',3)+3:].lstrip())"
probar "B · frontmatter entero borrado"; restaurar

python3 -c "
p='docs/business/contexto.md'; s=open(p).read()
s=s.replace('triggers: [negocio, ecosistema, audit-tracker, gobernanza, colaboradores]','triggers:\n  - negocio\n  - ecosistema')
open(p,'w').write(s)"
probar "C · triggers como lista YAML de bloque"; restaurar

echo "── Punteros internos colgados (check 4) ──"
python3 -c "
p='$T'; s=open(p).read(); open(p,'w').write(s.replace(\"freshref: 'ref-ficha'\",\"freshref: 'ref-fichaa'\",1))"
probar "D · freshref apunta a REFS inexistente"; restaurar

python3 -c "
p='$T'; s=open(p).read(); open(p,'w').write(s.replace(\"bloque: 's03',\",\"bloque: 's3',\",1))"
probar "E · PLAN apunta a bloque inexistente"; restaurar

python3 -c "
p='$T'; s=open(p).read(); open(p,'w').write(s.replace(\"{ id: 's05', nm:\",\"{ id: 's05b', nm:\",1))"
probar "F · nodo del mapa sin bloque"; restaurar

python3 -c "
p='$T'; s=open(p).read()
open(p,'w').write(s.replace('const DECISION_PENDS = [','const DECISION_PENDS = [{ pendId: \'s99-inexistente\', note: \'x\' },',1))"
probar "G · decisión pendiente sobre un pend borrado"; restaurar

echo "── Índice de decisiones ──"
python3 -c "
p='$T'; s=open(p).read()
open(p,'w').write(s.replace(\"  { id: 'adr-011',\",\"  { id: 'adr-999', num: '999', titulo: 'Fantasma', estado: 'aceptada', fecha: '2026-01-01', linea: 'x', nota: null },\n  { id: 'adr-011',\",1))"
probar "H · entrada de índice sin campo file"; restaurar

printf -- '---\ntema: x\n---\n# 099\n' > docs/decisiones/099-fantasma.md
probar "I · ADR en disco sin indexar"; restaurar

echo "── Escapes del check 2 ──"
python3 -c "
p='$T'; s=open(p).read()
open(p,'w').write(s.replace(\"path: 'docs/business/contexto.md'\",\"path: 'docs/business/NO-EXISTE.md'\",1))"
probar "J · path inexistente que no está en REFS_EXTERNAS"; restaurar

python3 -c "
p='$T'; s=open(p).read()
open(p,'w').write(s.replace(\"'auditoría', 'auditar-docs',\",\"'auditoría',\",1))"
probar "K · trigger quitado del tracker"; restaurar

echo ""
echo "── control: repo sano debe seguir VERDE ──"
if node scripts/verify-tracker.js >/dev/null 2>&1; then echo "  ✅ verde tras restaurar"; else echo "  ❌ quedó roto tras restaurar"; falla=$((falla+1)); fi
echo ""
echo "detectadas: $pass · NO detectadas: $falla"
[ $falla -eq 0 ] || exit 1
