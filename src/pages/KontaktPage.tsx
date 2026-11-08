import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Brief, Sprechblase } from '../components/Icons';
import { KONTAKT, wohnungen, euro, DIREKT_VORTEIL } from '../data/wohnungen';
import DatumsAuswahl, { datumLang } from '../components/DatumsAuswahl';
import { useBelegung } from '../data/belegung';
import { berechne } from '../data/preisrechner';

/*
  Das Formular verschickt nichts über einen Server.
  Es setzt die Anfrage als Text zusammen und öffnet damit das E-Mail-Programm
  oder WhatsApp des Gastes. So kommt jede Anfrage sicher bei Uta Finke an.
*/

const auswahl = [
  ...wohnungen.map((w) => ({ wert: w.id, text: `${w.name} (${w.etage})` })),
  { wert: 'egal', text: 'Egal, Hauptsache frei' },
];

function datumDeutsch(iso: string) {
  if (!iso) return '';
  const [j, m, t] = iso.split('-');
  return `${t}.${m}.${j}`;
}

export default function KontaktPage() {
  const { search } = useLocation();
  const vorauswahl = new URLSearchParams(search).get('wohnung');
  const [f, setF] = useState({
    wohnung: auswahl.some((a) => a.wert === vorauswahl) ? vorauswahl! : 'simply-good',
    anreise: '',
    abreise: '',
    erwachsene: '2',
    kinder: '0',
    kaminholz: false,
    babybett: false,
    aufbettung: false,
    name: '',
    telefon: '',
    nachricht: '',
  });
  const [fehler, setFehler] = useState('');
  const [gesendet, setGesendet] = useState<'mail' | 'whatsapp' | null>(null);

  const setze = (feld: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const t = e.target as HTMLInputElement;
    setF({ ...f, [feld]: t.type === 'checkbox' ? t.checked : t.value });
  };

  const { belegungen, status } = useBelegung();
  const gewaehlte = wohnungen.filter((w) => f.wohnung === 'egal' || w.id === f.wohnung);
  // Bei „egal“ ist eine Nacht nur belegt, wenn beide Wohnungen belegt sind
  const nachtBelegt = (iso: string) =>
    gewaehlte.every((w) => belegungen.some((b) => b.wohnung === w.id && b.von <= iso && iso < b.bis));
  const kaminholzMoeglich = gewaehlte.some((w) => w.kaminholz);
  const preise = f.anreise && f.abreise ? gewaehlte.map((w) => ({ w, r: berechne(w, f.anreise, f.abreise) })) : [];
  const wohnungText = auswahl.find((a) => a.wert === f.wohnung)?.text ?? '';
  const extras = [kaminholzMoeglich && f.kaminholz && 'Kaminholz', f.babybett && 'Babybett', f.aufbettung && 'Aufbettung'].filter(Boolean).join(', ');

  const text = [
    `Hallo Frau Finke,`,
    ``,
    `ich möchte gern eine Ferienwohnung anfragen.`,
    ``,
    `Wohnung: ${wohnungText}`,
    `Anreise: ${datumDeutsch(f.anreise)}`,
    `Abreise: ${datumDeutsch(f.abreise)}`,
    `Personen: ${f.erwachsene} Erwachsene${f.kinder !== '0' ? `, ${f.kinder} Kinder` : ''}`,
    ...preise.map(({ w, r }) => `Preis laut Website (${w.name}): ${euro(r.gesamt)} für ${r.anzahl} Nächte inkl. Endreinigung`),
    extras ? `Zusätzlich: ${extras}` : null,
    f.nachricht.trim() ? `\n${f.nachricht.trim()}` : null,
    ``,
    `Viele Grüße`,
    f.name,
    f.telefon.trim() ? `Telefon: ${f.telefon.trim()}` : null,
  ]
    .filter((z) => z !== null)
    .join('\n');

  const pruefen = () => {
    if (!f.name.trim()) return 'Bitte geben Sie Ihren Namen an.';
    if (!f.anreise || !f.abreise) return 'Bitte wählen Sie im Kalender An- und Abreisetag.';
    if (f.abreise <= f.anreise) return 'Der Abreisetag muss nach dem Anreisetag liegen.';
    return '';
  };

  const senden = (weg: 'mail' | 'whatsapp') => {
    const problem = pruefen();
    setFehler(problem);
    if (problem) return;
    const betreff = `Anfrage ${wohnungText.split(' (')[0]}: ${datumDeutsch(f.anreise)} bis ${datumDeutsch(f.abreise)}`;
    const url =
      weg === 'mail'
        ? `mailto:${KONTAKT.email}?subject=${encodeURIComponent(betreff)}&body=${encodeURIComponent(text)}`
        : `https://wa.me/${KONTAKT.whatsapp}?text=${encodeURIComponent(text)}`;
    if (weg === 'mail') window.location.href = url;
    else window.open(url, '_blank', 'noopener');
    setGesendet(weg);
  };

  const beschriftung = 'block klein font-semibold mb-1.5';

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-12">
      <h1 className="text-4xl sm:text-5xl">Anfrage</h1>
      <p className="mt-4 max-w-[38rem] text-lg">
        Füllen Sie die Felder aus und schicken Sie die Anfrage per E-Mail oder WhatsApp.
        Ihr E-Mail-Programm oder WhatsApp öffnet sich dann mit dem fertigen Text.
      </p>

      <div className="mt-10 grid gap-14 lg:grid-cols-[1fr_300px]">
        <form className="space-y-6 max-w-2xl" onSubmit={(e) => { e.preventDefault(); senden('mail'); }} noValidate>
          <div>
            <label htmlFor="wohnung" className={beschriftung}>Wohnung</label>
            <select id="wohnung" className="feld" value={f.wohnung} onChange={(e) => setF({ ...f, wohnung: e.target.value, anreise: '', abreise: '' })}>
              {auswahl.map((a) => <option key={a.wert} value={a.wert}>{a.text}</option>)}
            </select>
          </div>

          <fieldset>
            <legend className={beschriftung}>Anreise und Abreise</legend>
            <DatumsAuswahl
              von={f.anreise}
              bis={f.abreise}
              onChange={(anreise, abreise) => setF({ ...f, anreise, abreise })}
              nachtBelegt={nachtBelegt}
              belegungBekannt={status === 'ok'}
            />
            {f.anreise && (
              <p className="mt-3 klein">
                <strong>Anreise:</strong> {datumLang(f.anreise)}
                {f.abreise && <><br /><strong>Abreise:</strong> {datumLang(f.abreise)}</>}
              </p>
            )}
          </fieldset>

          {preise.length > 0 && (
            <div className="bg-papier border border-linie rounded-md p-5" aria-live="polite">
              <div className="font-semibold text-lg">Ihr Preis</div>
              {preise.map(({ w, r }) => (
                <div key={w.id} className="mt-4">
                  {preise.length > 1 && <div className="font-semibold">{w.name}</div>}
                  <dl className="klein divide-y divide-linie">
                    {r.zeilen.map((z) => (
                      <div key={z.stufe} className="flex justify-between gap-4 py-1.5">
                        <dt>
                          {z.anzahl} {z.anzahl === 1 ? 'Nacht' : 'Nächte'} × {euro(z.einzel)}
                          <span className="text-schilf"> ({z.stufe === 'werktags' ? 'So–Do' : z.stufe === 'wochenende' ? 'Fr und Sa' : 'Weihnachten'})</span>
                        </dt>
                        <dd className="tabular-nums">{euro(z.summe)}</dd>
                      </div>
                    ))}
                    {r.rabatt > 0 && (
                      <div className="flex justify-between gap-4 py-1.5 text-wasser font-semibold">
                        <dt>Eine Nacht gratis (ab {w.gratisNachtAb} Nächten)</dt>
                        <dd className="tabular-nums">−{euro(r.rabatt)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-4 py-1.5">
                      <dt>Endreinigung</dt>
                      <dd className="tabular-nums">{euro(r.reinigung)}</dd>
                    </div>
                    <div className="flex justify-between gap-4 pt-2 text-base font-semibold border-t-2 border-see">
                      <dt>Gesamt für {r.anzahl} Nächte</dt>
                      <dd className="tabular-nums">{euro(r.gesamt)}</dd>
                    </div>
                  </dl>
                </div>
              ))}
              <p className="klein mt-3 text-wasser font-semibold">{DIREKT_VORTEIL}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="erwachsene" className={beschriftung}>Erwachsene</label>
              <select id="erwachsene" className="feld" value={f.erwachsene} onChange={setze('erwachsene')}>
                {['1', '2', '3'].map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="kinder" className={beschriftung}>Kinder</label>
              <select id="kinder" className="feld" value={f.kinder} onChange={setze('kinder')}>
                {['0', '1', '2', '3'].map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
          </div>

          <fieldset>
            <legend className={beschriftung}>Zusätzlich gewünscht</legend>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {([['kaminholz', 'Kaminholz'], ['babybett', 'Babybett'], ['aufbettung', 'Aufbettung']] as const)
                .filter(([k]) => k !== 'kaminholz' || kaminholzMoeglich)
                .map(([k, l]) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-see" checked={f[k]} onChange={setze(k)} />
                  {l}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className={beschriftung}>Ihr Name</label>
              <input id="name" className="feld" autoComplete="name" value={f.name} onChange={setze('name')} required />
            </div>
            <div>
              <label htmlFor="telefon" className={beschriftung}>Telefon <span className="font-normal text-schilf">(freiwillig)</span></label>
              <input id="telefon" type="tel" className="feld" autoComplete="tel" value={f.telefon} onChange={setze('telefon')} />
            </div>
          </div>

          <div>
            <label htmlFor="nachricht" className={beschriftung}>Nachricht <span className="font-normal text-schilf">(freiwillig)</span></label>
            <textarea id="nachricht" rows={4} className="feld" value={f.nachricht} onChange={setze('nachricht')} placeholder="Fragen oder besondere Wünsche" />
          </div>

          {fehler && <p role="alert" className="klein font-semibold text-[#9b2c1f]">{fehler}</p>}

          <div className="flex flex-wrap gap-3 pt-2">
            <button type="submit" className="knopf"><Brief className="w-4 h-4" /> Per E-Mail senden</button>
            <button type="button" className="knopf knopf-hell" onClick={() => senden('whatsapp')}><Sprechblase className="w-4 h-4" /> Per WhatsApp senden</button>
          </div>

          {gesendet && (
            <div className="bg-papier border border-linie rounded-md p-4 klein" role="status">
              {gesendet === 'mail'
                ? 'Ihr E-Mail-Programm sollte sich jetzt mit der fertigen Anfrage geöffnet haben. Bitte dort noch auf „Senden“ tippen.'
                : 'WhatsApp sollte sich jetzt mit der fertigen Nachricht geöffnet haben. Bitte dort noch auf „Senden“ tippen.'}
              <br />
              Hat sich nichts geöffnet? Schreiben Sie direkt an <a className="verweis" href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a> oder rufen Sie an: <a className="verweis" href={KONTAKT.telefonLink}>{KONTAKT.telefon}</a>.
            </div>
          )}
          <p className="klein text-schilf">Die Buchung ist erst nach Bestätigung verbindlich.</p>
        </form>

        <aside className="klein space-y-6">
          <div>
            <div className="font-semibold">So läuft die Buchung</div>
            <ol className="mt-2 space-y-1 list-decimal pl-5">
              <li>Anfrage schicken</li>
              <li>Bestätigung von {KONTAKT.name} abwarten – erst dann ist die Buchung verbindlich</li>
              <li>Bei Ankunft den Schlüssel aus dem Schlüsselsafe nehmen</li>
            </ol>
          </div>
          <div>
            <div className="font-semibold">Telefon und WhatsApp</div>
            <a className="verweis text-lg" href={KONTAKT.telefonLink}>{KONTAKT.telefon}</a>
          </div>
          <div>
            <div className="font-semibold">E-Mail</div>
            <a className="verweis" href={`mailto:${KONTAKT.email}`}>{KONTAKT.email}</a>
          </div>
          <div>
            <div className="font-semibold">Adresse</div>
            <p>{KONTAKT.strasse}<br />{KONTAKT.ort}</p>
            <a className="verweis" href={KONTAKT.karte} target="_blank" rel="noopener noreferrer">In Google Maps öffnen</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
