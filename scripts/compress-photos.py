"""
Compress photos in dist/assets/photos/ for web delivery.
- Resizes to max 1600px on the longest side
- Re-encodes JPEGs at quality 82 with progressive
- Strips EXIF (privacy + smaller files)

Usage from project root:
    python scripts/compress-photos.py
"""
from pathlib import Path
from PIL import Image, ImageOps

SRC = Path("dist/assets/photos")
MAX_SIDE = 1600
QUALITY = 82

if not SRC.exists():
    raise SystemExit(f"Not found: {SRC}. Build the dist folder first.")

before = sum(p.stat().st_size for p in SRC.rglob("*") if p.is_file())
files = [p for p in SRC.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}]
print(f"Compressing {len(files)} photos...")

for p in files:
    try:
        with Image.open(p) as img:
            img = ImageOps.exif_transpose(img)  # respect rotation, then strip
            img.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
            if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
            # Always write as .jpg with original filename's stem
            out = p.with_suffix(".jpeg") if p.suffix.lower() != ".jpeg" else p
            img.save(out, "JPEG", quality=QUALITY, optimize=True, progressive=True)
            if out != p:
                p.unlink()
    except Exception as e:
        print(f"  ! skipped {p.name}: {e}")

after = sum(p.stat().st_size for p in SRC.rglob("*") if p.is_file())
print(f"Before: {before / 1024 / 1024:.1f} MB  ->  After: {after / 1024 / 1024:.1f} MB")
print(f"Saved {(before - after) / 1024 / 1024:.1f} MB ({100 * (before - after) / before:.0f}%)")
