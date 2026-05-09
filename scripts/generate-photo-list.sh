#!/usr/bin/env bash
# Regenerate js/photos-list.js from whatever's currently in assets/photos/.
# Run from the project root:   bash scripts/generate-photo-list.sh
set -euo pipefail

cd "$(dirname "$0")/.."

OUT="js/photos-list.js"
echo "/* AUTO-GENERATED — do not edit by hand. */"        >  "$OUT"
echo "/* Regenerate: bash scripts/generate-photo-list.sh */" >> "$OUT"
echo "window.PHOTO_LIST = ["                                 >> "$OUT"

cd assets/photos
# match .jpg / .jpeg / .png / .webp
shopt -s nullglob nocaseglob
files=(*.jpg *.jpeg *.png *.webp)
shopt -u nocaseglob

# Sort case-insensitively
IFS=$'\n' sorted=($(printf '%s\n' "${files[@]}" | LC_ALL=C sort))
unset IFS

cd ../..
for f in "${sorted[@]}"; do
  # JSON-escape backslashes and quotes
  esc=${f//\\/\\\\}
  esc=${esc//\"/\\\"}
  printf '  "assets/photos/%s",\n' "$esc" >> "$OUT"
done

echo "];" >> "$OUT"
echo "Wrote $OUT with ${#sorted[@]} photos."
