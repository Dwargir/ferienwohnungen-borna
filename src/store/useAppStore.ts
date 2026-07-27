import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Booking {
  id: string;
  apartment: 'simply-good' | 'simply-nice';
  startDate: string;
  endDate: string;
  guestName: string;
  source: 'manual' | 'ical' | 'inquiry';
  status: 'confirmed' | 'pending' | 'blocked';
  notes?: string;
}

export interface Inquiry {
  id: string;
  apartment: 'simply-good' | 'simply-nice' | 'both';
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  firewood: boolean;
  crib: boolean;
  extraBed: boolean;
  status: 'new' | 'confirmed' | 'rejected';
  createdAt: string;
}

export interface ICalLink {
  id: string;
  apartment: 'simply-good' | 'simply-nice';
  name: string;
  url: string;
  active: boolean;
  lastSync?: string;
  lastError?: string;
}

export interface ApartmentSettings {
  id: 'simply-good' | 'simply-nice';
  name: string;
  pricePerNight: number;
  cleaningFee: number;
  firewoodPrice: string;
  cribPrice: string;
  extraBedPrice: string;
  minStay: number;
  maxGuests: number;
}

export interface CookieConsent {
  accepted: boolean | null;
  timestamp?: string;
}

interface AppState {
  bookings: Booking[];
  inquiries: Inquiry[];
  icalLinks: ICalLink[];
  apartmentSettings: ApartmentSettings[];
  cookieConsent: CookieConsent;
  addBooking: (booking: Booking) => void;
  removeBooking: (id: string) => void;
  addInquiry: (inquiry: Inquiry) => void;
  updateInquiryStatus: (id: string, status: Inquiry['status']) => void;
  setCookieConsent: (accepted: boolean) => void;
  getBookingsForApartment: (apartment: 'simply-good' | 'simply-nice') => Booking[];
}

const defaultSettings: ApartmentSettings[] = [
  {
    id: 'simply-good',
    name: 'Simply Good',
    pricePerNight: 86.40,
    cleaningFee: 25.00,
    firewoodPrice: 'auf Anfrage',
    cribPrice: 'auf Anfrage',
    extraBedPrice: 'auf Anfrage',
    minStay: 2,
    maxGuests: 3,
  },
  {
    id: 'simply-nice',
    name: 'Simply Nice',
    pricePerNight: 89.00,
    cleaningFee: 25.00,
    firewoodPrice: 'auf Anfrage',
    cribPrice: 'auf Anfrage',
    extraBedPrice: 'auf Anfrage',
    minStay: 2,
    maxGuests: 3,
  },
];

// 🔥 NEUE iCal-Links für Booking.com
const defaultICalLinks: ICalLink[] = [
  {
    id: '1',
    apartment: 'simply-nice',
    name: 'Booking.com - Simply Nice',
    url: 'https://ical.booking.com/v1/export?t=8a5c57c3-5612-4ae5-bae6-983bed6f59a8',
    active: true,
    lastSync: new Date().toISOString()
  },
  {
    id: '2',
    apartment: 'simply-good',
    name: 'Booking.com - Simply Good',
    url: 'https://ical.booking.com/v1/export?t=905a3d45-7b7b-4962-a1b1-a065bcdbe995',
    active: true,
    lastSync: new Date().toISOString()
  }
];

// 🔥 Demo-Buchungen auf 2026 (dein aktuelles Jahr)
const demoBookings: Booking[] = [
  {
    id: 'demo-1',
    apartment: 'simply-good',
    startDate: '2026-08-10',
    endDate: '2026-08-17',
    guestName: 'Familie Müller',
    source: 'ical',
    status: 'confirmed',
  },
  {
    id: 'demo-2',
    apartment: 'simply-good',
    startDate: '2026-08-22',
    endDate: '2026-08-25',
    guestName: 'Herr Schmidt',
    source: 'ical',
    status: 'confirmed',
  },
  {
    id: 'demo-3',
    apartment: 'simply-nice',
    startDate: '2026-08-05',
    endDate: '2026-08-12',
    guestName: 'Familie Wagner',
    source: 'ical',
    status: 'confirmed',
  },
  {
    id: 'demo-4',
    apartment: 'simply-nice',
    startDate: '2026-08-18',
    endDate: '2026-08-21',
    guestName: 'Frau Becker',
    source: 'manual',
    status: 'confirmed',
  },
  {
    id: 'demo-5',
    apartment: 'simply-good',
    startDate: '2026-09-05',
    endDate: '2026-09-10',
    guestName: 'Herr Fischer',
    source: 'ical',
    status: 'confirmed',
  },
  {
    id: 'demo-6',
    apartment: 'simply-nice',
    startDate: '2026-09-12',
    endDate: '2026-09-15',
    guestName: 'Familie Braun',
    source: 'ical',
    status: 'confirmed',
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      bookings: demoBookings,
      inquiries: [],
      icalLinks: defaultICalLinks,  // 🔥 HIER: iCal-Links sind jetzt im Store!
      apartmentSettings: defaultSettings,
      cookieConsent: { accepted: null },

      addBooking: (booking) =>
        set((state) => ({ bookings: [...state.bookings, booking] })),

      removeBooking: (id) =>
        set((state) => ({ bookings: state.bookings.filter((b) => b.id !== id) })),

      addInquiry: (inquiry) =>
        set((state) => ({ inquiries: [...state.inquiries, inquiry] })),

      updateInquiryStatus: (id, status) =>
        set((state) => ({
          inquiries: state.inquiries.map((i) =>
            i.id === id ? { ...i, status } : i
          ),
        })),

      setCookieConsent: (accepted) =>
        set({
          cookieConsent: {
            accepted,
            timestamp: new Date().toISOString(),
          },
        }),

      getBookingsForApartment: (apartment) =>
        get().bookings.filter((b) => b.apartment === apartment),
    }),
    {
      name: 'ferienwohnungen-borna-store',
      partialize: (state) => ({
        inquiries: state.inquiries,
        cookieConsent: state.cookieConsent,
        // 🔥 icallinks werden NICHT persistiert (werden bei jedem Start neu geladen)
      }),
    }
  )
);