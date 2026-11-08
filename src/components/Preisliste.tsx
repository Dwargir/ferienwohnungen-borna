import { PREISSTUFEN, euro } from '../data/wohnungen';
import type { Wohnung } from '../data/wohnungen';

// Preise pro Nacht für eine Wohnung, nach Wochentag und Weihnachten
export default function Preisliste({ w }: { w: Wohnung }) {
  return (
    <dl className="divide-y divide-linie">
      {PREISSTUFEN.map((p) => (
        <div key={p.key} className="flex items-baseline justify-between gap-4 py-2">
          <dt className="klein">{p.name}</dt>
          <dd className="font-semibold tabular-nums">{euro(w.preise[p.key])}</dd>
        </div>
      ))}
    </dl>
  );
}
