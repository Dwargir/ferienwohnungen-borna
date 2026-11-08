import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brief, Sprechblase } from '../components/Icons';
import { KONTAKT, wohnungen } from '../data/wohnungen';

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

  const heute = new Date().toISOString().slice(0, 10);
  const wohnungText = auswahl.find((a) => a.wert === f.wohnung)?.text ?? '';
  const extras = [f.kaminholz && 'Kaminholz', f.babybett && 'Babybett', f.aufbettung && 'Aufbettung'].filter(Boolean).join(', ');

  const text = [
    `Hallo Frau Finke,`,
    ``,
    `ich möchte gern eine Ferienwohnung anfragen.`,
    ``,
    `Wohnung: ${wohnungText}`,
    `Anreise: ${datumDeutsch(f.anreise)}`,
    `Abreise: ${datumDeutsch(f.abreise)}`,
    `Personen: ${f.erwachsene} Erwachsene${f.kinder !== '0' ? `, ${f.kinder} Kinder` : ''}`,
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
    if (!f.anreise || !f.abreise) return 'Bitte wählen Sie An- und Abreisetag.';
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
            <select id="wohnung" className="feld" value={f.wohnung} onChange={setze('wohnung')}>
              {auswahl.map((a) => <option key={a.wert} value={a.wert}>{a.text}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="anreise" className={beschriftung}>Anreise</label>
              <input id="anreise" type="date" className="feld" min={heute} value={f.anreise} onChange={setze('anreise')} required />
            </div>
            <div>
              <label htmlFor="abreise" className={beschriftung}>Abreise</label>
              <input id="abreise" type="date" className="feld" min={f.anreise || heute} value={f.abreise} onChange={setze('abreise')} required />
            </div>
          </div>
          <p className="klein -mt-3 text-schilf">
            Freie Termine sehen Sie unter <Link to="/verfuegbarkeit" className="verweis">Belegung</Link>.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="erwachsene" className={beschriftung}>Erwachsene</label>
              <select id="erwachsene" className="feld" value={f.erwachsene} onChange={setze('erwachsene')}>
                {['1', '2', '3', '4'].map((n) => <option key={n}>{n}</option>)}
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
              {([['kaminholz', 'Kaminholz'], ['babybett', 'Babybett'], ['aufbettung', 'Aufbettung']] as const).map(([k, l]) => (
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
