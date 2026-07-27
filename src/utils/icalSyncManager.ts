import { useAppStore, Booking } from '../store/useAppStore';

let syncInterval: number | null = null;
let isSyncing = false;

export function startICalSync() {
  if (syncInterval !== null) return;
  
  const sync = async () => {
    if (isSyncing) return;
    isSyncing = true;
    
    try {
      const { icalLinks, bookings, addBooking } = useAppStore.getState();
      
      for (const link of icalLinks) {
        if (!link.active) continue;
        
        console.log(`🔄 Sync für ${link.name} gestartet...`);
        
        try {
          // 👇 HIER IST DIE ÄNDERUNG!
          const proxyUrl = `/api/ical-proxy?url=${encodeURIComponent(link.url)}`;
          console.log(`📡 Lade von Vercel-Proxy: ${proxyUrl}`);
          
          const response = await fetch(proxyUrl);
          
          if (!response.ok) {
            throw new Error(`HTTP Fehler: ${response.status}`);
          }
          
          const data = await response.text();
          console.log(`📄 iCal-Daten empfangen, Länge: ${data.length}`);
          
          // iCal parsen
          const events: { id: string; startDate: string; endDate: string }[] = [];
          const lines = data.split('\n');
          
          let currentEvent: any = {};
          let inEvent = false;
          
          for (const line of lines) {
            const trimmed = line.trim();
            
            if (trimmed === 'BEGIN:VEVENT') {
              inEvent = true;
              currentEvent = {};
            } else if (trimmed === 'END:VEVENT') {
              inEvent = false;
              if (currentEvent.id && currentEvent.startDate && currentEvent.endDate) {
                events.push({
                  id: currentEvent.id,
                  startDate: currentEvent.startDate,
                  endDate: currentEvent.endDate
                });
              }
              currentEvent = {};
            } else if (inEvent) {
              if (trimmed.startsWith('UID:')) {
                currentEvent.id = trimmed.substring(4);
              } else if (trimmed.includes('DTSTART')) {
                const match = trimmed.match(/(\d{8})/);
                if (match) {
                  const dateStr = match[1];
                  currentEvent.startDate = `${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}`;
                }
              } else if (trimmed.includes('DTEND')) {
                const match = trimmed.match(/(\d{8})/);
                if (match) {
                  const dateStr = match[1];
                  currentEvent.endDate = `${dateStr.substring(0,4)}-${dateStr.substring(4,6)}-${dateStr.substring(6,8)}`;
                }
              }
            }
          }
          
          console.log(`📅 ${events.length} Events von ${link.name} gefunden`);
          
          const newBookings: Booking[] = events.map(event => ({
            id: event.id,
            apartment: link.apartment,
            startDate: event.startDate,
            endDate: event.endDate,
            guestName: 'Booking.com Gast',
            source: 'ical',
            status: 'confirmed'
          }));
          
          const existingIds = new Set(bookings.map(b => b.id));
          const uniqueBookings = newBookings.filter(b => !existingIds.has(b.id));
          
          if (uniqueBookings.length > 0) {
            uniqueBookings.forEach(b => addBooking(b));
            console.log(`✅ ${uniqueBookings.length} neue Buchungen von ${link.name} importiert`);
          } else {
            console.log(`ℹ️ Keine neuen Buchungen von ${link.name}`);
          }
        } catch (error) {
          console.error(`❌ Fehler bei ${link.name}:`, error);
        }
      }
    } catch (error) {
      console.error('❌ iCal-Sync Fehler:', error);
    } finally {
      isSyncing = false;
    }
  };
  
  setTimeout(sync, 3000);
  syncInterval = setInterval(sync, 10 * 60 * 1000);
}

export function stopICalSync() {
  if (syncInterval !== null) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
}