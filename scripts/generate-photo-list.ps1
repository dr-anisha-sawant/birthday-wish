# Regenerate js/photos-list.js from whatever's in assets/photos/.
# Run from the project root:   powershell -File scripts\generate-photo-list.ps1

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$photoDir = "assets/photos"
$out = "js/photos-list.js"

$files = Get-ChildItem -LiteralPath $photoDir -File |
  Where-Object { $_.Extension -match '^\.(jpg|jpeg|png|webp)$' } |
  Sort-Object Name

$lines = @(
  "/* AUTO-GENERATED — do not edit by hand. */",
  "/* Regenerate: powershell -File scripts\generate-photo-list.ps1 */",
  "window.PHOTO_LIST = ["
)

foreach ($f in $files) {
  $name = $f.Name
  $esc  = $name -replace '\\','\\\\' -replace '"','\\"'
  $lines += "  ""assets/photos/$esc"","
}
$lines += "];"

$lines | Out-File -FilePath $out -Encoding utf8 -Force
Write-Host "Wrote $out with $($files.Count) photos."
