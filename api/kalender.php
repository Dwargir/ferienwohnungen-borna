<?php
/*
 * Kalender-Export für Booking.com (iCal).
 * Adresse je Wohnung: /api/kalender.php?wohnung=simply-good
 * Enthält die im Admin gesperrten Nächte (z. B. Direktbuchungen, Eigennutzung).
 * Buchungen, die von Booking.com selbst kommen, werden NICHT zurückgeschickt – sonst entstünde eine Schleife.
 */
declare(strict_types=1);

$id = (string) ($_GET['wohnung'] ?? '');
if (!preg_match('/^[a-z0-9-]{1,40}$/', $id)) {
  http_response_code(400);
  exit('Unbekannte Wohnung');
}

$inhalt = json_decode((string) @file_get_contents(dirname(__DIR__) . '/inhalt.json'), true);
$wohnung = null;
foreach (($inhalt['wohnungen'] ?? []) as $w) {
  if (is_array($w) && ($w['_id'] ?? '') === $id) { $wohnung = $w; break; }
}
if (!$wohnung) {
  http_response_code(404);
  exit('Unbekannte Wohnung');
}

// gesperrte Nächte zu zusammenhängenden Zeiträumen zusammenfassen
$tage = array_values(array_filter((array) ($wohnung['gesperrt'] ?? []), fn($d) => is_string($d) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)));
sort($tage);
$zeitraeume = [];
foreach ($tage as $d) {
  $letzter = count($zeitraeume) - 1;
  if ($letzter >= 0 && date('Y-m-d', strtotime($zeitraeume[$letzter][1])) === $d) {
    $zeitraeume[$letzter][1] = date('Y-m-d', strtotime($d . ' +1 day'));
  } else {
    $zeitraeume[] = [$d, date('Y-m-d', strtotime($d . ' +1 day'))];
  }
}

$host = preg_replace('/[^a-z0-9.-]/i', '', (string) ($_SERVER['HTTP_HOST'] ?? 'ferienwohnungen-borna'));
$jetzt = gmdate('Ymd\THis\Z');
$zeilen = [
  'BEGIN:VCALENDAR',
  'VERSION:2.0',
  'PRODID:-//Ferienwohnungen Borna//Kalender//DE',
  'CALSCALE:GREGORIAN',
  'METHOD:PUBLISH',
];
foreach ($zeitraeume as [$von, $bis]) {
  $zeilen[] = 'BEGIN:VEVENT';
  $zeilen[] = 'UID:' . $id . '-' . str_replace('-', '', $von) . '@' . $host;
  $zeilen[] = 'DTSTAMP:' . $jetzt;
  $zeilen[] = 'DTSTART;VALUE=DATE:' . str_replace('-', '', $von);
  $zeilen[] = 'DTEND;VALUE=DATE:' . str_replace('-', '', $bis);
  $zeilen[] = 'SUMMARY:Belegt';
  $zeilen[] = 'END:VEVENT';
}
$zeilen[] = 'END:VCALENDAR';

header('Content-Type: text/calendar; charset=utf-8');
header('Content-Disposition: inline; filename="' . $id . '.ics"');
header('Cache-Control: no-cache');
echo implode("\r\n", $zeilen) . "\r\n";
