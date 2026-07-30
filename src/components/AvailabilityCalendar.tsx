import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  parseISO,
  isWithinInterval,
  isBefore,
} from 'date-fns';
import { de } from 'date-fns/locale';
import { Booking } from '../store/useAppStore';

interface Props {
  apartment: 'simply-good' | 'simply-nice';
  bookings: Booking[];
  compact?: boolean;
}

function getBookingStatus(date: Date, bookings: Booking[]): 'free' | 'booked' | 'arrival' | 'departure' {
  for (const b of bookings) {
    const start = parseISO(b.startDate);
    const end = parseISO(b.endDate);

    if (isSameDay(date, start)) return 'arrival';
    if (isSameDay(date, end)) return 'departure';
    if (isWithinInterval(date, { start, end }) && !isSameDay(date, start) && !isSameDay(date, end)) {
      return 'booked';
    }
  }
  return 'free';
}

const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export default function AvailabilityCalendar({ apartment, bookings, compact = false }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const apartmentBookings = bookings.filter((b) => b.apartment === apartment);

  const canGoPrev = !isBefore(subMonths(currentMonth, 1), startOfMonth(today));

  return (
    <div className={`bg-white rounded-xl border border-stone-200 shadow-sm ${compact ? 'p-3' : 'p-5'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          disabled={!canGoPrev}
          className="p-1.5 rounded-lg hover:bg-coastal50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[#292524]" />
        </button>
        <h3 className={`font-semibold text-[#292524] ${compact ? 'text-sm' : 'text-base'}`} style={{ fontFamily: 'Playfair Display, serif' }}>
          {format(currentMonth, 'MMMM yyyy', { locale: de })}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 rounded-lg hover:bg-coastal50 transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-[#292524]" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div key={d} className={`text-center font-medium text-stone-400 ${compact ? 'text-[10px] py-1' : 'text-xs py-1.5'}`}>
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((day) => {
          const status = getBookingStatus(day, apartmentBookings);
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isTodayDate = isToday(day);
          const isPast = isBefore(day, today) && !isToday(day);

          let cellClass = 'relative flex items-center justify-center rounded-md ';
          let textClass = '';

          if (!isCurrentMonth) {
            cellClass += 'opacity-0 pointer-events-none ';
          } else if (isPast) {
            cellClass += 'opacity-30 ';
            textClass = 'text-stone-400';
          } else if (status === 'booked') {
            cellClass += 'bg-red-100 ';
            textClass = 'text-red-700';
          } else if (status === 'arrival') {
            cellClass += 'bg-gradient-to-r from-white to-red-100 ';
            textClass = 'text-red-700';
          } else if (status === 'departure') {
            cellClass += 'bg-gradient-to-r from-red-100 to-white ';
            textClass = 'text-red-700';
          } else {
            cellClass += 'hover:bg-green-50 ';
            textClass = 'text-stone-700';
          }

          return (
            <div
              key={day.toString()}
              className={`${compact ? 'h-8 text-xs' : 'h-9 text-sm'} ${cellClass}`}
            >
              {isTodayDate && isCurrentMonth && (
                <span className="absolute inset-0 rounded-md ring-2 ring-[#b45309] ring-offset-0 pointer-events-none" />
              )}
              <span className={`font-medium z-10 relative ${textClass}`}>
                {format(day, 'd')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {!compact && (
        <div className="mt-4 flex flex-wrap gap-3 pt-3 border-t border-stone-100">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-green-50 border border-green-200" />
            <span className="text-xs text-stone-500">Verfügbar</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-red-100" />
            <span className="text-xs text-stone-500">Belegt</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded ring-2 ring-[#b45309] ring-offset-0" />
            <span className="text-xs text-stone-500">Heute</span>
          </div>
        </div>
      )}
    </div>
  );
}
