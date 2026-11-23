#!/usr/bin/env bash
# Baut das Kundenpaket für den Webspace des Kunden (netcup Webhosting, PHP ab 8.1):
#   ./paket.sh [quellordner] [name.zip]
# quellordner = fertig gebaute Seite (Standard: dist, wird bei Bedarf mit "npm run build" erzeugt)
# Erzeugt einen frischen Einrichtungscode. Ins Paket kommt nur dessen Hash.
set -euo pipefail

QUELLE="${1:-dist}"
ZIP="${2:-ferienwohnungen-borna.zip}"
cd "$(dirname "$0")"

if [ "$QUELLE" = "dist" ] && [ ! -f dist/index.html ]; then
  echo "Baue die Seite (npm ci && npm run build) …"
  npm ci
  npm run build
fi
[ -f "$QUELLE/index.html" ] || { echo "Keine gebaute Seite in $QUELLE gefunden."; exit 1; }
command -v php >/dev/null || { echo "PHP wird zum Erzeugen des Code-Hashes benötigt."; exit 1; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
cp -R "$QUELLE"/. "$TMP"/

# Nichts Altes mitliefern: keine Passwörter, Sperren oder Backups
rm -rf "$TMP/admin/daten"
mkdir -p "$TMP/admin/daten" "$TMP/bilder"
printf 'Require all denied\nDeny from all\n' > "$TMP/admin/daten/.htaccess"
cp public/.htaccess "$TMP/.htaccess"
cp public/bilder/.htaccess "$TMP/bilder/.htaccess"
cp public/admin/.htaccess "$TMP/admin/.htaccess"

# Bestehenden Einrichtungscode behalten? (CONFIG=pfad/zur/alten/admin/config.php ./paket.sh …)
if [ -n "${CONFIG:-}" ] && [ -f "$CONFIG" ]; then
  cp "$CONFIG" "$TMP/admin/config.php"
  case "$ZIP" in /*) ZIEL="$ZIP" ;; *) ZIEL="$PWD/$ZIP" ;; esac
  rm -f "$ZIEL"
  (cd "$TMP" && zip -qr -X "$ZIEL" . -x '*.DS_Store')
  echo; echo "Paket erstellt: $ZIP"; echo "Einrichtungscode: unverändert (aus $CONFIG)"
  exit 0
fi

# Einrichtungscode erzeugen (ohne leicht verwechselbare Zeichen)
CODE="$(php -r '$a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; $c=""; for($i=0;$i<12;$i++){ $c.=$a[random_int(0,strlen($a)-1)]; if($i==3||$i==7) $c.="-"; } echo $c;')"
CODE="$CODE" php -r 'file_put_contents($argv[1], "<?php\n// Nur der Hash des Einrichtungscodes – der Code selbst steht nirgends im Paket.\n\$EINRICHTUNG_HASH = " . var_export(password_hash(getenv("CODE"), PASSWORD_DEFAULT), true) . ";\n");' "$TMP/admin/config.php"

case "$ZIP" in /*) ZIEL="$ZIP" ;; *) ZIEL="$PWD/$ZIP" ;; esac
rm -f "$ZIEL"
(cd "$TMP" && zip -qr -X "$ZIEL" . -x '*.DS_Store')

echo
echo "Paket erstellt: $ZIP"
echo "Einrichtungscode für den Kunden: $CODE"
echo "(Nur in der Übergabe-E-Mail weitergeben. Er wird nirgends gespeichert.)"
