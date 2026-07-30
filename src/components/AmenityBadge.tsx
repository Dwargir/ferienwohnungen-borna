import { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  label: string;
  small?: boolean;
}

export default function AmenityBadge({ icon, label, small }: Props) {
  return (
    <div className={`flex items-center gap-2 bg-[#fef3c7]/60 rounded-lg border border-amber-200/60 ${small ? 'px-2.5 py-1.5 text-xs' : 'px-3 py-2 text-sm'}`}>
      {icon && <span className="text-deep-blue flex-shrink-0">{icon}</span>}
      <span className="text-[#292524] font-medium">{label}</span>
    </div>
  );
}
