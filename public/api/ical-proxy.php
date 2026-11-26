<?php
/*
 * Holt die Belegungskalender von Booking.com für die Website (Version für PHP-Webspace, z. B. Hetzner).
 * Nur Adressen von Booking.com werden abgerufen.
 * ?pruefen=1 zeigt eine lesbare Zusammenfassung zum Nachsehen.
 */
declare(strict_types=1);

$ERLAUBTE_HOSTS = ['ical.booking.com', 'admin.booking.com'];
$CACHE_SEKUNDEN = 60;

function antwort(int $status, array $daten): never {
  http_response_code($status);
  header('Content-Type: application/json; charset=utf-8');
  echo json_encode($daten, JSON_UNESCAPED_UNICODE);
  exit;
}

$url = (string) ($_GET['url'] ?? '');
$teile = parse_url($url);
if (!$teile || ($teile['scheme'] ?? '') !== 'https' || !in_array($teile['host'] ?? '', $ERLAUBTE_HOSTS, true)) {
  antwort(403, ['error' => 'Host not allowed']);
}

// kurz zwischenspeichern, damit Booking.com nicht bei jedem Besuch gefragt wird
$cache = sys_get_temp_dir() . '/fh-ical-' . sha1($url) . '.ics';
$daten = null;
if (is_file($cache) && filemtime($cache) > time() - $CACHE_SEKUNDEN) {
  $daten = (string) file_get_contents($cache);
}

if ($daten === null) {
  $status = 0;
  if (function_exists('curl_init')) {
    $c = curl_init($url);
    curl_setopt_array($c, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_FOLLOWLOCATION => false,
      CURLOPT_TIMEOUT => 15,
      CURLOPT_USERAGENT => 'Mozilla/5.0 (Ferienwohnungen Borna Kalender)',
    ]);
    $daten = curl_exec($c);
    $status = (int) curl_getinfo($c, CURLINFO_HTTP_CODE);
    curl_close($c);
  } else {
    $ctx = stream_context_create(['http' => ['timeout' => 15, 'ignore_errors' => true, 'header' => "User-Agent: Mozilla/5.0\r\n"]]);
    $daten = @file_get_contents($url, false, $ctx);
    if (isset($http_response_header[0]) && preg_match('/\s(\d{3})\s/', $http_response_header[0], $m)) $status = (int) $m[1];
  }
  if (!is_string($daten) || $daten === '') antwort(502, ['error' => 'Booking.com nicht erreichbar']);
  if ($status !== 200) antwort(502, ['error' => 'Booking.com hat die Anfrage abgelehnt', 'status' => $status, 'antwort' => substr($daten, 0, 300)]);
  @file_put_contents($cache, $daten, LOCK_EX);
}

if (!empty($_GET['pruefen'])) {
  $termine = [];
  foreach (array_slice(preg_split('/BEGIN:VEVENT/i', $daten) ?: [], 1) as $block) {
    $block = preg_split('/END:VEVENT/i', $block)[0];
    preg_match('/\nDTSTART[^:\n]*:(\d{8})/i', $block, $a);
    preg_match('/\nDTEND[^:\n]*:(\d{8})/i', $block, $b);
    preg_match('/\nSUMMARY[^:\n]*:([^\r\n]*)/i', $block, $s);
    $termine[] = trim(($a[1] ?? '?') . ' bis ' . ($b[1] ?? '(kein Ende)') . ' ' . ($s[1] ?? ''));
  }
  antwort(200, ['ok' => true, 'anzahlTermine' => count($termine), 'termine' => $termine]);
}

header('Content-Type: text/calendar; charset=utf-8');
header('Cache-Control: public, max-age=60');
echo $daten;
