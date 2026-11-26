<?php
/*
 * Ferienhaft-Admin
 * Läuft auf normalem PHP-Webspace (z. B. Hetzner Webhosting, PHP ab 8.1), ohne Datenbank.
 * Liest ../felder.json (was änderbar ist) und schreibt ../inhalt.json (die Inhalte).
 *
 * Sicherheit:
 *  - Erststart nur mit Einrichtungscode (Hash in config.php), danach nur Login.
 *  - Passwort als password_hash in daten/pw.php.
 *  - 5 Fehlversuche => 15 Minuten Sperre (je IP).
 *  - CSRF-Token bei jeder Änderung, Session-Cookie httponly + SameSite=Strict.
 *  - Alles wird anhand von felder.json bereinigt, unbekannte Felder werden verworfen.
 *  - Upload nur JPG/PNG/WebP (geprüft mit getimagesize), max. 8 MB, Zufallsname.
 *  - Speichern atomar, vorher Backup nach daten/inhalt.backup.json.
 */

declare(strict_types=1);

const MAX_VERSUCHE = 5;
const SPERRE_SEKUNDEN = 15 * 60;
const MAX_UPLOAD = 8 * 1024 * 1024;
const MAX_TIEFE = 3;

$ROOT = dirname(__DIR__);
$FELDER_DATEI = $ROOT . '/felder.json';
$INHALT_DATEI = $ROOT . '/inhalt.json';
$BILDER = $ROOT . '/bilder';
$DATEN = __DIR__ . '/daten';
$PW_DATEI = $DATEN . '/pw.php';
$VERSUCHE_DATEI = $DATEN . '/versuche.json';
$BACKUP_DATEI = $DATEN . '/inhalt.backup.json';

/* ---------- Grundeinstellungen ---------- */

$https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
  || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');

header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('Cache-Control: no-store');

session_name('fhadmin');
session_set_cookie_params([
  'lifetime' => 0,
  'path' => '/',
  'secure' => $https,
  'httponly' => true,
  'samesite' => 'Strict',
]);
session_start();

if (!is_dir($DATEN)) {
  @mkdir($DATEN, 0750, true);
}
if (!file_exists($DATEN . '/.htaccess')) {
  @file_put_contents($DATEN . '/.htaccess', "Require all denied\nDeny from all\n");
}

/* ---------- Hilfsfunktionen ---------- */

function json_antwort(array $daten, int $status = 200): never {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($daten, JSON_UNESCAPED_UNICODE);
  exit;
}

function lese_json(string $datei): array {
  if (!is_file($datei)) return [];
  $d = json_decode((string) file_get_contents($datei), true);
  return is_array($d) ? $d : [];
}

function schreibe_atomar(string $datei, string $inhalt): bool {
  $tmp = $datei . '.tmp-' . bin2hex(random_bytes(4));
  if (file_put_contents($tmp, $inhalt, LOCK_EX) === false) return false;
  @chmod($tmp, 0644);
  if (!rename($tmp, $datei)) {
    @unlink($tmp);
    return false;
  }
  return true;
}

function ip(): string {
  return substr((string) ($_SERVER['REMOTE_ADDR'] ?? 'unbekannt'), 0, 64);
}

function ist_gesperrt(string $datei): int {
  $v = lese_json($datei);
  $e = $v[ip()] ?? null;
  if ($e && ($e['bis'] ?? 0) > time()) return (int) $e['bis'] - time();
  return 0;
}

function fehlversuch(string $datei): void {
  $v = lese_json($datei);
  // alte Einträge aufräumen
  foreach ($v as $k => $e) {
    if (($e['bis'] ?? 0) < time() && ($e['zeit'] ?? 0) < time() - SPERRE_SEKUNDEN) unset($v[$k]);
  }
  $e = $v[ip()] ?? ['n' => 0, 'bis' => 0, 'zeit' => time()];
  if (($e['bis'] ?? 0) > 0 && $e['bis'] <= time()) $e = ['n' => 0, 'bis' => 0, 'zeit' => time()];
  $e['n'] = ($e['n'] ?? 0) + 1;
  $e['zeit'] = time();
  if ($e['n'] >= MAX_VERSUCHE) $e['bis'] = time() + SPERRE_SEKUNDEN;
  $v[ip()] = $e;
  schreibe_atomar($datei, json_encode($v));
}

function erfolg_versuch(string $datei): void {
  $v = lese_json($datei);
  unset($v[ip()]);
  schreibe_atomar($datei, json_encode($v));
}

function passwort_hash_lesen(string $datei): ?string {
  if (!is_file($datei)) return null;
  $h = include $datei;
  return is_string($h) && $h !== '' ? $h : null;
}

function passwort_speichern(string $datei, string $pw): bool {
  $hash = password_hash($pw, PASSWORD_DEFAULT);
  return schreibe_atomar($datei, "<?php\nreturn " . var_export($hash, true) . ";\n");
}

function csrf_token(): string {
  if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
  return $_SESSION['csrf'];
}

function pruefe_csrf(): void {
  $t = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? ($_POST['csrf'] ?? '');
  if (!is_string($t) || empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $t)) {
    json_antwort(['fehler' => 'Sicherheitsprüfung fehlgeschlagen. Bitte Seite neu laden.'], 403);
  }
}

function angemeldet(): bool {
  return !empty($_SESSION['angemeldet']) && ($_SESSION['zeit'] ?? 0) > time() - 8 * 3600;
}

/* ---------- Bereinigung anhand felder.json ---------- */

function sauberer_text($v, int $max, bool $zeilen): string {
  if (is_int($v) || is_float($v)) $v = (string) $v;
  if (!is_string($v)) return '';
  $v = str_replace(["\r\n", "\r"], "\n", $v);
  // Steuerzeichen entfernen (Zeilenumbruch nur bei textarea)
  $v = preg_replace($zeilen ? '/[\x00-\x09\x0B-\x1F\x7F]/u' : '/[\x00-\x1F\x7F]/u', '', $v) ?? '';
  $v = trim($v);
  if (function_exists('mb_substr')) return mb_substr($v, 0, $max);
  return substr($v, 0, $max);
}

function saubere_zahl($v, array $f) {
  if (is_string($v)) $v = str_replace(',', '.', trim($v));
  if (!is_numeric($v)) return null;
  $z = (float) $v;
  if (isset($f['min'])) $z = max((float) $f['min'], $z);
  if (isset($f['max'])) $z = min((float) $f['max'], $z);
  $schritt = (float) ($f['schritt'] ?? 1);
  if ($schritt >= 1) return (int) round($z);
  return round($z, 2);
}

function gueltige_bilddatei($name, string $bilder): bool {
  return is_string($name)
    && preg_match('/^[a-z0-9][a-z0-9._-]{0,100}\.(jpe?g|png|webp)$/i', $name) === 1
    && is_file($bilder . '/' . $name);
}

function bereinige_felder(array $felder, $eingabe, $alt, string $bilder, int $tiefe): array {
  $eingabe = is_array($eingabe) ? $eingabe : [];
  $alt = is_array($alt) ? $alt : [];
  $aus = [];
  foreach ($felder as $f) {
    if (!is_array($f) || !isset($f['id'], $f['typ']) || !is_string($f['id'])) continue;
    $id = $f['id'];
    $wert = array_key_exists($id, $eingabe) ? $eingabe[$id] : ($alt[$id] ?? null);
    $aus[$id] = bereinige_feld($f, $wert, $alt[$id] ?? null, $bilder, $tiefe);
  }
  return $aus;
}

function bereinige_feld(array $f, $v, $alt, string $bilder, int $tiefe) {
  $max = (int) ($f['max'] ?? 0);
  switch ($f['typ']) {
    case 'text':
      return sauberer_text($v, $max > 0 ? $max : 300, false);
    case 'textarea':
      return sauberer_text($v, $max > 0 ? $max : 5000, true);
    case 'zahl':
      $z = saubere_zahl($v, $f);
      return $z ?? (is_numeric($alt) ? $alt : 0);
    case 'liste':
      $spalten = array_values(array_filter($f['spalten'] ?? [], fn($s) => is_array($s) && isset($s['id'])));
      $liste = [];
      foreach (is_array($v) ? $v : [] as $zeile) {
        if (!is_array($zeile)) continue;
        $z = [];
        $leer = true;
        foreach ($spalten as $s) {
          $z[$s['id']] = sauberer_text($zeile[$s['id']] ?? '', 500, false);
          if ($z[$s['id']] !== '') $leer = false;
        }
        if (!$leer) $liste[] = $z;
        if ($max > 0 && count($liste) >= $max) break;
      }
      return $liste;
    case 'fotos':
      $liste = [];
      foreach (is_array($v) ? $v : [] as $foto) {
        if (!is_array($foto) || !gueltige_bilddatei($foto['datei'] ?? null, $bilder)) continue;
        $liste[] = ['datei' => $foto['datei'], 'text' => sauberer_text($foto['text'] ?? '', 150, false)];
        if ($max > 0 && count($liste) >= $max) break;
      }
      return $liste;
    case 'kalender':
      $tage = [];
      foreach (is_array($v) ? $v : [] as $d) {
        if (!is_string($d) || !preg_match('/^(\d{4})-(\d{2})-(\d{2})$/', $d, $m)) continue;
        if (!checkdate((int) $m[2], (int) $m[3], (int) $m[1])) continue;
        $tage[$d] = true;
        if (count($tage) >= 2000) break;
      }
      $tage = array_keys($tage);
      sort($tage);
      return $tage;
    case 'gruppe':
      return bereinige_felder($f['felder'] ?? [], $v, $alt, $bilder, $tiefe);
    case 'objekte':
      if ($tiefe >= MAX_TIEFE) return [];
      $alteListe = is_array($alt) ? $alt : [];
      $alteNachId = [];
      foreach ($alteListe as $o) if (is_array($o) && isset($o['_id'])) $alteNachId[$o['_id']] = $o;
      $liste = [];
      $gesehen = [];
      foreach (is_array($v) ? $v : [] as $o) {
        if (!is_array($o)) continue;
        $oid = $o['_id'] ?? '';
        if (!is_string($oid) || !preg_match('/^[a-z0-9-]{1,40}$/', $oid) || isset($gesehen[$oid])) continue;
        // bei festen Objekten: nur vorhandene _ids zulassen
        if (!empty($f['fest']) && !isset($alteNachId[$oid])) continue;
        $gesehen[$oid] = true;
        $liste[] = ['_id' => $oid] + bereinige_felder($f['felder'] ?? [], $o, $alteNachId[$oid] ?? [], $bilder, $tiefe + 1);
        if ($max > 0 && count($liste) >= $max) break;
      }
      // feste Objekte dürfen nicht verschwinden
      if (!empty($f['fest'])) {
        foreach ($alteNachId as $oid => $o) if (!isset($gesehen[$oid])) $liste[] = $o;
      }
      return $liste;
  }
  return null;
}

function bereinige_inhalt(array $felder, $eingabe, array $alt, string $bilder): array {
  $aus = $alt; // nicht verwaltete Bereiche bleiben erhalten
  foreach ($felder['gruppen'] ?? [] as $g) {
    $aus = array_merge($aus, bereinige_felder($g['felder'] ?? [], $eingabe, $alt, $bilder, 0));
  }
  return $aus;
}

/* ---------- Anfragen bearbeiten ---------- */

$aktion = $_GET['aktion'] ?? '';
$methode = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$pwHash = passwort_hash_lesen($PW_DATEI);
$eingerichtet = $pwHash !== null;
$meldung = '';

// Einrichtung (nur solange noch kein Passwort existiert)
if ($methode === 'POST' && $aktion === 'einrichten' && !$eingerichtet) {
  $warte = ist_gesperrt($VERSUCHE_DATEI);
  if ($warte > 0) {
    $meldung = 'Zu viele Fehlversuche. Bitte in ' . ceil($warte / 60) . ' Minuten erneut versuchen.';
  } else {
    $EINRICHTUNG_HASH = null;
    if (is_file(__DIR__ . '/config.php')) include __DIR__ . '/config.php';
    $code = trim((string) ($_POST['code'] ?? ''));
    $pw = (string) ($_POST['passwort'] ?? '');
    $pw2 = (string) ($_POST['passwort2'] ?? '');
    if (!is_string($EINRICHTUNG_HASH) || $EINRICHTUNG_HASH === '' || !password_verify($code, $EINRICHTUNG_HASH)) {
      fehlversuch($VERSUCHE_DATEI);
      $meldung = 'Der Einrichtungscode stimmt nicht.';
    } elseif (strlen($pw) < 10) {
      $meldung = 'Das Passwort muss mindestens 10 Zeichen lang sein.';
    } elseif ($pw !== $pw2) {
      $meldung = 'Die beiden Passwörter stimmen nicht überein.';
    } elseif (!passwort_speichern($PW_DATEI, $pw)) {
      $meldung = 'Das Passwort konnte nicht gespeichert werden (Schreibrechte prüfen).';
    } else {
      erfolg_versuch($VERSUCHE_DATEI);
      session_regenerate_id(true);
      $_SESSION = ['angemeldet' => true, 'zeit' => time()];
      header('Location: ./');
      exit;
    }
  }
}

// Anmelden
if ($methode === 'POST' && $aktion === 'login' && $eingerichtet) {
  $warte = ist_gesperrt($VERSUCHE_DATEI);
  if ($warte > 0) {
    $meldung = 'Zu viele Fehlversuche. Bitte in ' . ceil($warte / 60) . ' Minuten erneut versuchen.';
  } elseif (password_verify((string) ($_POST['passwort'] ?? ''), $pwHash)) {
    erfolg_versuch($VERSUCHE_DATEI);
    session_regenerate_id(true);
    $_SESSION = ['angemeldet' => true, 'zeit' => time()];
    header('Location: ./');
    exit;
  } else {
    fehlversuch($VERSUCHE_DATEI);
    $rest = ist_gesperrt($VERSUCHE_DATEI);
    $meldung = $rest > 0 ? 'Zu viele Fehlversuche. Der Zugang ist für 15 Minuten gesperrt.' : 'Das Passwort stimmt nicht.';
  }
}

// Abmelden
if ($aktion === 'logout') {
  $_SESSION = [];
  session_destroy();
  header('Location: ./');
  exit;
}

// Ab hier nur angemeldet
if (in_array($aktion, ['daten', 'speichern', 'upload', 'passwort'], true)) {
  if (!$eingerichtet || !angemeldet()) json_antwort(['fehler' => 'Bitte neu anmelden.'], 401);
  $_SESSION['zeit'] = time();

  if ($aktion === 'daten') {
    json_antwort(['felder' => lese_json($FELDER_DATEI), 'inhalt' => lese_json($INHALT_DATEI), 'csrf' => csrf_token()]);
  }

  if ($methode !== 'POST') json_antwort(['fehler' => 'Nur POST erlaubt.'], 405);
  pruefe_csrf();

  if ($aktion === 'speichern') {
    $roh = file_get_contents('php://input');
    if (strlen((string) $roh) > 2 * 1024 * 1024) json_antwort(['fehler' => 'Zu viele Daten.'], 413);
    $eingabe = json_decode((string) $roh, true);
    if (!is_array($eingabe)) json_antwort(['fehler' => 'Ungültige Daten.'], 400);
    $felder = lese_json($FELDER_DATEI);
    $alt = lese_json($INHALT_DATEI);
    $neu = bereinige_inhalt($felder, $eingabe, $alt, $BILDER);
    if (is_file($INHALT_DATEI)) @copy($INHALT_DATEI, $BACKUP_DATEI);
    $json = json_encode($neu, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false || !schreibe_atomar($INHALT_DATEI, $json . "\n")) {
      json_antwort(['fehler' => 'Speichern fehlgeschlagen (Schreibrechte prüfen).'], 500);
    }
    json_antwort(['ok' => true, 'inhalt' => $neu]);
  }

  if ($aktion === 'upload') {
    $d = $_FILES['foto'] ?? null;
    if (!$d || !is_array($d) || ($d['error'] ?? 1) !== UPLOAD_ERR_OK || !is_uploaded_file($d['tmp_name'])) {
      json_antwort(['fehler' => 'Upload fehlgeschlagen.'], 400);
    }
    if ($d['size'] > MAX_UPLOAD) json_antwort(['fehler' => 'Das Foto ist größer als 8 MB.'], 413);
    $info = @getimagesize($d['tmp_name']);
    $endungen = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
    if (!$info || !isset($endungen[$info[2]])) json_antwort(['fehler' => 'Nur JPG, PNG oder WebP erlaubt.'], 415);
    if (!is_dir($BILDER)) @mkdir($BILDER, 0755, true);
    $name = 'foto-' . bin2hex(random_bytes(8)) . '.' . $endungen[$info[2]];
    if (!move_uploaded_file($d['tmp_name'], $BILDER . '/' . $name)) json_antwort(['fehler' => 'Foto konnte nicht gespeichert werden.'], 500);
    @chmod($BILDER . '/' . $name, 0644);
    json_antwort(['ok' => true, 'datei' => $name]);
  }

  if ($aktion === 'passwort') {
    $altPw = (string) ($_POST['alt'] ?? '');
    $neuPw = (string) ($_POST['neu'] ?? '');
    if (!password_verify($altPw, $pwHash)) json_antwort(['fehler' => 'Das bisherige Passwort stimmt nicht.'], 400);
    if (strlen($neuPw) < 10) json_antwort(['fehler' => 'Das neue Passwort muss mindestens 10 Zeichen lang sein.'], 400);
    if (!passwort_speichern($PW_DATEI, $neuPw)) json_antwort(['fehler' => 'Speichern fehlgeschlagen.'], 500);
    json_antwort(['ok' => true]);
  }
}

/* ---------- Seiten ausgeben ---------- */

$nonce = base64_encode(random_bytes(16));
header("Content-Security-Policy: default-src 'self'; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'nonce-$nonce'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
$felderTitel = (string) (lese_json($FELDER_DATEI)['seitenname'] ?? 'Website');
$e = fn($s) => htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8');
?><!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Admin – <?= $e($felderTitel) ?></title>
<style>
  :root { --see:#1f3d3a; --wasser:#2f6f7e; --kalk:#eef1ec; --papier:#f8f9f6; --linie:#c9d1c6; --sonne:#e8b93a; --rot:#9b2c1f; }
  * { box-sizing: border-box; }
  body { margin:0; font:16px/1.5 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif; background:var(--kalk); color:var(--see); }
  a { color: var(--wasser); }
  .huelle { max-width: 860px; margin: 0 auto; padding: 16px; }
  .karte { background:#fff; border:1px solid var(--linie); border-radius:8px; padding:20px; }
  h1 { font-size:1.4rem; margin:0; }
  h2 { font-size:1.15rem; margin:0 0 12px; }
  label { display:block; font-weight:600; font-size:.92rem; margin:14px 0 6px; }
  input[type=text], input[type=password], input[type=number], input[type=email], textarea {
    width:100%; font:inherit; padding:10px 12px; border:1px solid var(--linie); border-radius:6px; background:#fff; color:var(--see);
  }
  textarea { min-height: 110px; resize: vertical; }
  input:focus, textarea:focus, button:focus-visible { outline: 3px solid var(--sonne); outline-offset: 1px; }
  button, .knopf { font:inherit; font-weight:600; border:0; border-radius:6px; padding:10px 16px; background:var(--see); color:#fff; cursor:pointer; text-decoration:none; display:inline-block; }
  button.hell { background:#fff; color:var(--see); box-shadow: inset 0 0 0 1.5px var(--see); }
  button.klein { padding:6px 10px; font-size:.85rem; }
  button.weg { background:#fff; color:var(--rot); box-shadow: inset 0 0 0 1.5px var(--rot); }
  button:disabled { opacity:.5; cursor:default; }
  .meldung { background:var(--rot); color:#fff; padding:10px 12px; border-radius:6px; margin-top:12px; }
  .kopf { position:sticky; top:0; z-index:5; background:var(--kalk); border-bottom:1px solid var(--linie); }
  .kopf .huelle { display:flex; gap:12px; align-items:center; justify-content:space-between; flex-wrap:wrap; }
  .reiter { display:flex; gap:6px; flex-wrap:wrap; margin:16px 0; }
  .reiter button { background:#fff; color:var(--see); box-shadow: inset 0 0 0 1px var(--linie); }
  .reiter button[aria-selected=true] { background:var(--see); color:#fff; }
  .objekt { border:1px solid var(--linie); border-radius:8px; margin:12px 0; background:var(--papier); }
  .objekt > summary { padding:14px 16px; font-weight:700; cursor:pointer; font-size:1.05rem; }
  .objekt > div { padding: 0 16px 16px; }
  .gruppe { border-top:1px solid var(--linie); margin-top:18px; padding-top:6px; }
  .zeile { display:flex; gap:6px; align-items:center; margin:6px 0; }
  .zeile input { flex:1; min-width:0; }
  .fotos { display:grid; grid-template-columns: repeat(auto-fill, minmax(150px,1fr)); gap:10px; }
  .foto { background:#fff; border:1px solid var(--linie); border-radius:6px; padding:6px; }
  .foto img { width:100%; aspect-ratio: 4/3; object-fit:cover; border-radius:4px; display:block; }
  .foto input { margin-top:6px; padding:6px 8px; font-size:.85rem; }
  .foto .knoepfe { display:flex; gap:4px; margin-top:6px; justify-content:space-between; }
  .kal { display:grid; grid-template-columns: repeat(7, 1fr); gap:3px; max-width:360px; font-size:.9rem; text-align:center; }
  .kal button { padding:8px 0; background:#fff; color:var(--see); box-shadow: inset 0 0 0 1px var(--linie); font-weight:500; }
  .kal button.an { background:var(--see); color:#fff; }
  .kal .wt { color:#6e7f4e; padding:4px 0; }
  .kalkopf { display:flex; align-items:center; gap:8px; max-width:360px; justify-content:space-between; margin-bottom:6px; }
  .hinweis { color:#6e7f4e; font-size:.88rem; }
  .leiste { position:sticky; bottom:0; background:var(--kalk); border-top:1px solid var(--linie); padding:12px 0; margin-top:24px; }
  .leiste .huelle { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }
  #status { font-weight:600; }
  .gespeichert { color: var(--wasser); }
  .fehler { color: var(--rot); }
</style>
</head>
<body>
<?php if (!$eingerichtet): ?>
  <div class="huelle" style="max-width:460px;margin-top:8vh">
    <div class="karte">
      <h1>Admin einrichten</h1>
      <p class="hinweis">Geben Sie den Einrichtungscode aus der Übergabe-E-Mail ein und legen Sie Ihr eigenes Passwort fest. Das geht nur ein einziges Mal.</p>
      <?php if ($meldung): ?><div class="meldung"><?= $e($meldung) ?></div><?php endif; ?>
      <form method="post" action="?aktion=einrichten" autocomplete="off">
        <label for="code">Einrichtungscode</label>
        <input type="text" id="code" name="code" required autocapitalize="off" spellcheck="false">
        <label for="pw">Neues Passwort (mindestens 10 Zeichen)</label>
        <input type="password" id="pw" name="passwort" required minlength="10" autocomplete="new-password">
        <label for="pw2">Passwort wiederholen</label>
        <input type="password" id="pw2" name="passwort2" required minlength="10" autocomplete="new-password">
        <p><button type="submit">Einrichten</button></p>
      </form>
    </div>
  </div>
<?php elseif (!angemeldet()): ?>
  <div class="huelle" style="max-width:420px;margin-top:10vh">
    <div class="karte">
      <h1>Anmelden</h1>
      <p class="hinweis"><?= $e($felderTitel) ?></p>
      <?php if ($meldung): ?><div class="meldung"><?= $e($meldung) ?></div><?php endif; ?>
      <form method="post" action="?aktion=login">
        <label for="pw">Passwort</label>
        <input type="password" id="pw" name="passwort" required autocomplete="current-password" autofocus>
        <p><button type="submit">Anmelden</button></p>
      </form>
    </div>
  </div>
<?php else: ?>
  <div class="kopf">
    <div class="huelle">
      <h1><?= $e($felderTitel) ?> bearbeiten</h1>
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <a class="knopf" href="../" target="_blank" rel="noopener">Seite ansehen</a>
        <button class="hell" type="button" id="pwKnopf">Passwort ändern</button>
        <a class="knopf" style="background:#fff;color:var(--see);box-shadow:inset 0 0 0 1.5px var(--see)" href="?aktion=logout">Abmelden</a>
      </div>
    </div>
  </div>
  <main class="huelle">
    <div class="reiter" role="tablist" id="reiter"></div>
    <div id="inhalt"><p>Wird geladen …</p></div>
    <div class="karte" id="pwBox" hidden style="margin-top:16px">
      <h2>Passwort ändern</h2>
      <label for="pwAlt">Bisheriges Passwort</label><input type="password" id="pwAlt" autocomplete="current-password">
      <label for="pwNeu">Neues Passwort (mindestens 10 Zeichen)</label><input type="password" id="pwNeu" autocomplete="new-password">
      <p><button type="button" id="pwSpeichern">Passwort speichern</button> <span id="pwStatus"></span></p>
    </div>
  </main>
  <div class="leiste">
    <div class="huelle">
      <button type="button" id="speichern">Änderungen speichern</button>
      <span id="status" aria-live="polite"></span>
    </div>
  </div>
<script nonce="<?= $e($nonce) ?>">
(() => {
  'use strict';
  let FELDER = null, DATEN = null, CSRF = '', geaendert = false, aktiverReiter = 0;
  const $ = (t, a = {}, ...k) => {
    const el = document.createElement(t);
    for (const [n, v] of Object.entries(a)) {
      if (n === 'text') el.textContent = v;
      else if (n.startsWith('on')) el.addEventListener(n.slice(2), v);
      else if (v !== false && v != null) el.setAttribute(n, v === true ? '' : v);
    }
    for (const x of k.flat()) if (x != null) el.append(x);
    return el;
  };
  const status = (t, art = '') => { const s = document.getElementById('status'); s.textContent = t; s.className = art; };
  const markiere = () => { geaendert = true; status('Ungespeicherte Änderungen', ''); };
  window.addEventListener('beforeunload', (e) => { if (geaendert) { e.preventDefault(); e.returnValue = ''; } });

  async function laden() {
    const r = await fetch('?aktion=daten', { credentials: 'same-origin' });
    if (r.status === 401) { location.reload(); return; }
    const j = await r.json();
    FELDER = j.felder; DATEN = j.inhalt || {}; CSRF = j.csrf;
    zeigeReiter();
  }

  function zeigeReiter() {
    const leiste = document.getElementById('reiter');
    leiste.replaceChildren(...(FELDER.gruppen || []).map((g, i) =>
      $('button', { type: 'button', role: 'tab', 'aria-selected': String(i === aktiverReiter), text: g.titel, onclick: () => { aktiverReiter = i; zeigeReiter(); } })));
    const g = FELDER.gruppen[aktiverReiter];
    const box = $('div', { class: 'karte' });
    for (const f of g.felder) box.append(feld(f, DATEN));
    document.getElementById('inhalt').replaceChildren(box);
  }

  // Ein Feld zeichnen; „ziel“ ist das Objekt, in dem der Wert liegt
  function feld(f, ziel) {
    const id = 'f' + Math.random().toString(36).slice(2);
    switch (f.typ) {
      case 'text': {
        const i = $('input', { type: 'text', id, maxlength: f.max || 300 });
        i.value = ziel[f.id] ?? '';
        i.addEventListener('input', () => { ziel[f.id] = i.value; markiere(); });
        return $('div', {}, $('label', { for: id, text: f.label }), i);
      }
      case 'textarea': {
        const i = $('textarea', { id, maxlength: f.max || 5000 });
        i.value = ziel[f.id] ?? '';
        i.addEventListener('input', () => { ziel[f.id] = i.value; markiere(); });
        return $('div', {}, $('label', { for: id, text: f.label }), i);
      }
      case 'zahl': {
        const i = $('input', { type: 'number', id, inputmode: 'decimal', min: f.min, max: f.max, step: f.schritt || 1 });
        i.value = ziel[f.id] ?? '';
        i.addEventListener('input', () => { ziel[f.id] = i.value === '' ? '' : Number(i.value); markiere(); });
        return $('div', {}, $('label', { for: id, text: f.label }), i);
      }
      case 'gruppe': {
        if (!ziel[f.id] || typeof ziel[f.id] !== 'object') ziel[f.id] = {};
        const box = $('div', { class: 'gruppe' }, $('h2', { text: f.label }));
        for (const u of f.felder) box.append(feld(u, ziel[f.id]));
        return box;
      }
      case 'objekte': {
        if (!Array.isArray(ziel[f.id])) ziel[f.id] = [];
        const box = $('div');
        const zeichnen = () => {
          box.replaceChildren(...ziel[f.id].map((o, idx) => {
            const titel = (f.titel_feld && o[f.titel_feld]) || `${f.einzahl || 'Eintrag'} ${idx + 1}`;
            const innen = $('div');
            for (const u of f.felder) innen.append(feld(u, o));
            if (!f.fest) innen.append($('p', {}, $('button', { type: 'button', class: 'weg klein', text: `${f.einzahl || 'Eintrag'} löschen`, onclick: () => {
              if (confirm(`„${titel}“ wirklich löschen?`)) { ziel[f.id].splice(idx, 1); markiere(); zeichnen(); }
            } })));
            return $('details', { class: 'objekt', open: ziel[f.id].length === 1 }, $('summary', { text: titel }), innen);
          }));
          if (!f.fest && (!f.max || ziel[f.id].length < f.max)) {
            box.append($('button', { type: 'button', class: 'hell', text: f.neu || `${f.einzahl || 'Eintrag'} hinzufügen`, onclick: () => {
              const _id = (f.einzahl || 'eintrag').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString(36);
              ziel[f.id].push({ _id }); markiere(); zeichnen();
            } }));
          }
        };
        zeichnen();
        return box;
      }
      case 'liste': {
        if (!Array.isArray(ziel[f.id])) ziel[f.id] = [];
        const box = $('div');
        const zeichnen = () => {
          box.replaceChildren($('label', { text: f.label }), ...ziel[f.id].map((z, idx) => $('div', { class: 'zeile' },
            ...f.spalten.map((s) => {
              const i = $('input', { type: 'text', placeholder: s.label, 'aria-label': s.label, maxlength: 500 });
              i.value = z[s.id] ?? '';
              i.addEventListener('input', () => { z[s.id] = i.value; markiere(); });
              return i;
            }),
            $('button', { type: 'button', class: 'hell klein', 'aria-label': 'nach oben', text: '↑', disabled: idx === 0, onclick: () => { ziel[f.id].splice(idx - 1, 0, ziel[f.id].splice(idx, 1)[0]); markiere(); zeichnen(); } }),
            $('button', { type: 'button', class: 'weg klein', 'aria-label': 'entfernen', text: '✕', onclick: () => { ziel[f.id].splice(idx, 1); markiere(); zeichnen(); } }),
          )));
          if (!f.max || ziel[f.id].length < f.max) {
            box.append($('button', { type: 'button', class: 'hell klein', text: '+ Zeile', onclick: () => { ziel[f.id].push({}); markiere(); zeichnen(); } }));
          }
        };
        zeichnen();
        return box;
      }
      case 'fotos': {
        if (!Array.isArray(ziel[f.id])) ziel[f.id] = [];
        const box = $('div');
        const zeichnen = () => {
          const liste = ziel[f.id];
          const raster = $('div', { class: 'fotos' }, ...liste.map((foto, idx) => {
            const text = $('input', { type: 'text', placeholder: 'Bildunterschrift', 'aria-label': 'Bildunterschrift', maxlength: 150 });
            text.value = foto.text ?? '';
            text.addEventListener('input', () => { foto.text = text.value; markiere(); });
            return $('div', { class: 'foto' },
              $('img', { src: '../bilder/' + encodeURIComponent(foto.datei), alt: foto.text || '' }),
              text,
              $('div', { class: 'knoepfe' },
                $('button', { type: 'button', class: 'hell klein', 'aria-label': 'nach vorne', text: '←', disabled: idx === 0, onclick: () => { liste.splice(idx - 1, 0, liste.splice(idx, 1)[0]); markiere(); zeichnen(); } }),
                $('button', { type: 'button', class: 'hell klein', 'aria-label': 'nach hinten', text: '→', disabled: idx === liste.length - 1, onclick: () => { liste.splice(idx + 1, 0, liste.splice(idx, 1)[0]); markiere(); zeichnen(); } }),
                $('button', { type: 'button', class: 'weg klein', text: 'Entfernen', onclick: () => { liste.splice(idx, 1); markiere(); zeichnen(); } }),
              ));
          }));
          const datei = $('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', multiple: (f.max || 99) > 1, hidden: true });
          const knopf = $('button', { type: 'button', class: 'hell', text: liste.length && f.max === 1 ? 'Foto ersetzen' : '+ Fotos hochladen', onclick: () => datei.click() });
          const info = $('span', { class: 'hinweis' });
          datei.addEventListener('change', async () => {
            const dateien = [...datei.files];
            for (let n = 0; n < dateien.length; n++) {
              info.textContent = ` Lade ${n + 1} von ${dateien.length} …`;
              const fd = new FormData(); fd.append('foto', dateien[n]);
              try {
                const r = await fetch('?aktion=upload', { method: 'POST', body: fd, headers: { 'X-CSRF-Token': CSRF }, credentials: 'same-origin' });
                const j = await r.json();
                if (!r.ok) { alert(`${dateien[n].name}: ${j.fehler || 'Fehler beim Hochladen'}`); continue; }
                if (f.max === 1) liste.splice(0, liste.length);
                if (!f.max || liste.length < f.max) liste.push({ datei: j.datei, text: '' });
              } catch { alert('Hochladen fehlgeschlagen. Bitte Internetverbindung prüfen.'); }
            }
            markiere(); zeichnen();
          });
          box.replaceChildren($('label', { text: f.label }), raster, $('p', {}, knopf, info), datei,
            $('p', { class: 'hinweis', text: 'Fotos erscheinen erst nach „Änderungen speichern“ auf der Seite.' }));
        };
        zeichnen();
        return box;
      }
      case 'kalender': {
        if (!Array.isArray(ziel[f.id])) ziel[f.id] = [];
        const box = $('div');
        const heute = new Date();
        let j = heute.getFullYear(), m = heute.getMonth();
        const MON = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
        const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const zeichnen = () => {
          const tage = new Set(ziel[f.id]);
          const versatz = (new Date(j, m, 1).getDay() + 6) % 7;
          const anzahl = new Date(j, m + 1, 0).getDate();
          const raster = $('div', { class: 'kal' }, ...['Mo','Di','Mi','Do','Fr','Sa','So'].map((t) => $('div', { class: 'wt', text: t })));
          for (let i = 0; i < versatz; i++) raster.append($('div'));
          for (let t = 1; t <= anzahl; t++) {
            const d = iso(new Date(j, m, t));
            raster.append($('button', { type: 'button', class: tage.has(d) ? 'an' : '', 'aria-pressed': String(tage.has(d)), text: String(t), onclick: () => {
              const i = ziel[f.id].indexOf(d);
              if (i >= 0) ziel[f.id].splice(i, 1); else ziel[f.id].push(d);
              ziel[f.id].sort(); markiere(); zeichnen();
            } }));
          }
          const liste = ziel[f.id].filter((d) => d >= iso(heute));
          box.replaceChildren(
            $('label', { text: f.label }),
            $('div', { class: 'kalkopf' },
              $('button', { type: 'button', class: 'hell klein', text: '‹', 'aria-label': 'Vorheriger Monat', onclick: () => { m--; if (m < 0) { m = 11; j--; } zeichnen(); } }),
              $('strong', { text: `${MON[m]} ${j}` }),
              $('button', { type: 'button', class: 'hell klein', text: '›', 'aria-label': 'Nächster Monat', onclick: () => { m++; if (m > 11) { m = 0; j++; } zeichnen(); } })),
            raster,
            $('p', { class: 'hinweis', text: liste.length ? `Gesperrt (ab heute): ${liste.map((d) => d.split('-').reverse().join('.')).join(', ')}` : 'Keine Nächte gesperrt. Tippen Sie auf einen Tag, um die Nacht zu sperren.' }),
            f.export_link && ziel._id ? exportLink(ziel._id) : null);
        };
        zeichnen();
        return box;
      }
    }
    return $('div');
  }

  // Link, den Booking.com unter „Kalender importieren“ bekommt
  function exportLink(id) {
    const adresse = new URL(`../api/kalender.php?wohnung=${encodeURIComponent(id)}`, location.href).href;
    const feldLink = $('input', { type: 'text', readonly: true, 'aria-label': 'Link für Booking.com' });
    feldLink.value = adresse;
    const knopf = $('button', { type: 'button', class: 'hell klein', text: 'Link kopieren', onclick: async () => {
      try { await navigator.clipboard.writeText(adresse); knopf.textContent = 'Kopiert'; } catch { feldLink.select(); }
    } });
    return $('div', { class: 'gruppe' },
      $('label', { text: 'Link für Booking.com (im Extranet unter „Kalender importieren“ eintragen)' }),
      $('div', { class: 'zeile' }, feldLink, knopf),
      $('p', { class: 'hinweis', text: 'Booking.com liest diesen Kalender selbstständig alle paar Stunden. Gesperrte Nächte erst speichern, dann übernimmt Booking sie beim nächsten Abgleich.' }));
  }

  document.getElementById('speichern').addEventListener('click', async () => {
    const k = document.getElementById('speichern');
    k.disabled = true; status('Wird gespeichert …');
    try {
      const r = await fetch('?aktion=speichern', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': CSRF }, body: JSON.stringify(DATEN), credentials: 'same-origin' });
      const j = await r.json();
      if (r.status === 401) { alert('Sie wurden abgemeldet. Bitte neu anmelden.'); location.reload(); return; }
      if (!r.ok) throw new Error(j.fehler || 'Fehler');
      // Ansicht offen lassen (nicht neu zeichnen), damit man weiterarbeiten kann
      geaendert = false;
      status('Gespeichert – die Seite ist aktualisiert.', 'gespeichert');
    } catch (e) { status('Nicht gespeichert: ' + e.message, 'fehler'); }
    finally { k.disabled = false; }
  });

  document.getElementById('pwKnopf').addEventListener('click', () => { const b = document.getElementById('pwBox'); b.hidden = !b.hidden; });
  document.getElementById('pwSpeichern').addEventListener('click', async () => {
    const fd = new FormData();
    fd.append('alt', document.getElementById('pwAlt').value);
    fd.append('neu', document.getElementById('pwNeu').value);
    const r = await fetch('?aktion=passwort', { method: 'POST', body: fd, headers: { 'X-CSRF-Token': CSRF }, credentials: 'same-origin' });
    const j = await r.json();
    document.getElementById('pwStatus').textContent = r.ok ? 'Passwort geändert.' : (j.fehler || 'Fehler');
  });

  laden();
})();
</script>
<?php endif; ?>
</body>
</html>
