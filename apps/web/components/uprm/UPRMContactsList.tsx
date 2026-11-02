export type ContactRow = {
  id: string;
  name: string;
  relationship_strength: number;
  role?: string;
  journey_state?: string;
};

const GRAD =
  "linear-gradient(90deg, #8FFF4A 0%, #00E5C0 25%, #1A7CFF 50%, #FFE600 75%, #FF8A00 100%)";

export function UPRMContactsList({
  contacts,
  onSelect,
}: {
  contacts: ContactRow[];
  onSelect?: (c: ContactRow) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="mono text-[10px] tracking-[0.16em] text-white/50 uppercase">
          UPRM Contacts · {contacts.length}
        </div>
        <div className="mono text-[10px] text-white/40">Relationship 0–100</div>
      </div>
      <div className="mt-3 space-y-2 max-h-[280px] overflow-auto">
        {contacts.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelect?.(c)}
            className="w-full text-left rounded-xl border border-white/10 bg-black/30 px-3 py-2 hover:bg-black/50 transition"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[13px] font-bold text-white">{c.name}</div>
                <div className="mono text-[10px] text-white/45">
                  {c.role || c.journey_state || "Contact"}
                </div>
              </div>
              <div className="text-[12px] font-extrabold text-white">{c.relationship_strength}</div>
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full"
                style={{ width: `${c.relationship_strength}%`, background: GRAD }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default UPRMContactsList;
