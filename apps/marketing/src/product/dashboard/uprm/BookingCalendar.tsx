export type BookingRow = {
  id: string;
  contact_name?: string;
  status: string;
  calendar_date?: string;
  revenue?: number;
};

export function BookingCalendar({
  bookings,
  pipelineTotal = 8420,
}: {
  bookings: BookingRow[];
  pipelineTotal?: number;
}) {
  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">Bookings · Week</div>
        <div className="text-[13px] font-bold text-white">£{pipelineTotal.toLocaleString()} pipeline</div>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const hits = bookings.filter((b) => b.calendar_date === day);
          return (
            <div key={day} className="rounded-lg border border-white/10 bg-black/30 p-1.5 min-h-[64px]">
              <div className="mono text-[8px] text-white/40">{day.slice(5)}</div>
              {hits.map((h) => (
                <div key={h.id} className="mt-1 text-[9px] text-white truncate">
                  {h.contact_name || h.status}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div className="mt-2 mono text-[10px] text-white/40">Escrow 10% · Timi buffer</div>
    </div>
  );
}

export default BookingCalendar;
