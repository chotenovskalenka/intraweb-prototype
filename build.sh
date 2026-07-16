#!/usr/bin/env bash
# build.sh — slepí modulární zdrojáky ze src/ zpět do jednosouborových HTML v dist/.
# Každý <link rel="stylesheet" href="LOKÁLNÍ"> nahradí <style>…obsahem…</style> a
# každý <script src="LOKÁLNÍ"></script> nahradí <script>…obsahem…</script>.
# Externí URL (např. Google Fonts) nechává beze změny. Bez závislostí, idempotentní,
# spustitelné z rootu repa (./build.sh).
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$ROOT/src"
DIST="$ROOT/dist"
mkdir -p "$DIST"

# Vloží obsah lokálního souboru mezi otevírací a uzavírací tag.
emit_inline() {
  local open="$1" file="$2" close="$3"
  printf '%s\n' "$open"
  cat "$file"
  printf '%s\n' "$close"
}

build_one() {
  local infile="$1"
  local name="$2"
  local out="$DIST/prototyp_$name.html"
  local srcdir
  srcdir="$(dirname "$infile")"
  : > "$out"
  while IFS= read -r line || [ -n "$line" ]; do
    # Lokální stylesheet: <link ... href="styles/x.css" ...>
    if [[ "$line" =~ \<link[^\>]*rel=\"stylesheet\"[^\>]*href=\"([^\"]+)\" ]] || \
       [[ "$line" =~ \<link[^\>]*href=\"([^\"]+)\"[^\>]*rel=\"stylesheet\" ]]; then
      href="${BASH_REMATCH[1]}"
      if [[ "$href" != http* && -f "$srcdir/$href" ]]; then
        emit_inline "<style>" "$srcdir/$href" "</style>" >> "$out"
        continue
      fi
    fi
    # Lokální skript: <script src="scripts/x.js"></script>
    if [[ "$line" =~ \<script[^\>]*src=\"([^\"]+)\"[^\>]*\>\</script\> ]]; then
      src="${BASH_REMATCH[1]}"
      if [[ "$src" != http* && -f "$srcdir/$src" ]]; then
        emit_inline "<script>" "$srcdir/$src" "</script>" >> "$out"
        continue
      fi
    fi
    printf '%s\n' "$line" >> "$out"
  done < "$infile"
  echo "built: dist/prototyp_$name.html"
}

for f in "$SRC"/*.html; do
  [ -e "$f" ] || continue
  base="$(basename "$f" .html)"
  build_one "$f" "$base"
done

# Rozcestník do dist/: kopie root index.html, ale s relativními odkazy
# (dist/prototyp_x.html → prototyp_x.html), aby šla sdílet samotná složka dist/.
if [ -f "$ROOT/index.html" ]; then
  sed 's#href="dist/prototyp_#href="prototyp_#g' "$ROOT/index.html" > "$DIST/index.html"
  echo "built: dist/index.html"
fi
