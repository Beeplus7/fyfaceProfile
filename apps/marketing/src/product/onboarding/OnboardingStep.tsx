import { Check } from 'lucide-react';
import type { FieldDef } from './fields';
import { resolveField } from './fields';

export default function OnboardingStep({
  field,
  answers,
  value,
  onChange,
}: {
  field: FieldDef;
  answers: Record<string, any>;
  value: any;
  onChange: (v: any) => void;
}) {
  const f = resolveField(field, answers);
  const options = f.options ?? [];

  return (
    <div className="space-y-4">
      <div>
        <div className="mono text-[10px] tracking-[0.18em] text-white/30 uppercase mb-2">
          {answers.tradeType ? `${answers.tradeType} · ` : ''}
          Phase {f.phase} · {f.id}
        </div>
        <h3 className="text-[22px] md:text-[26px] leading-[1.15] text-white font-bold">
          {f.label}
        </h3>
        {f.help ? (
          <div className="mt-2 text-[12px] text-white/45 font-mono leading-snug">
            {f.help}
          </div>
        ) : null}
      </div>

      {f.type === 'text' && (
        <input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={f.placeholder}
          className="w-full min-h-12 rounded-[14px] bg-white/[0.06] border border-white/10 px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none focus:border-[#8FFF4A]/50"
        />
      )}

      {f.type === 'number' && (
        <input
          type="number"
          value={value ?? ''}
          onChange={(e) =>
            onChange(e.target.value === '' ? '' : Number(e.target.value))
          }
          placeholder={f.placeholder}
          className="w-full min-h-12 rounded-[14px] bg-white/[0.06] border border-white/10 px-4 py-3 text-[15px] text-white placeholder:text-white/30 outline-none focus:border-[#00E5C0]/50"
        />
      )}

      {f.type === 'select' && (
        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`text-left rounded-[12px] px-4 py-3 min-h-12 border text-[14px] font-medium transition ${
                value === opt
                  ? 'bg-white text-black border-white'
                  : 'bg-white/[0.04] border-white/10 text-white/80 hover:bg-white/[0.08]'
              }`}
            >
              {opt}{' '}
              {value === opt ? <Check className="inline ml-2 h-4 w-4" /> : null}
            </button>
          ))}
        </div>
      )}

      {f.type === 'multi' && (
        <div className="grid grid-cols-1 gap-2">
          {options.map((opt) => {
            const selected = Array.isArray(value) && value.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  const cur = Array.isArray(value) ? value : [];
                  onChange(
                    selected
                      ? cur.filter((x: string) => x !== opt)
                      : [...cur, opt],
                  );
                }}
                className={`text-left rounded-[12px] px-4 py-3 min-h-12 border text-[13px] font-medium transition flex justify-between items-center ${
                  selected
                    ? 'bg-[#8FFF4A] text-black border-[#8FFF4A]'
                    : 'bg-white/[0.04] border-white/10 text-white/70 hover:bg-white/[0.08]'
                }`}
              >
                <span className="pr-2">{opt}</span>
                {selected ? <Check className="h-4 w-4 shrink-0" /> : null}
              </button>
            );
          })}
        </div>
      )}

      {f.type === 'yesno' && (
        <div className="grid grid-cols-2 gap-3">
          {['yes', 'no'].map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={`rounded-[14px] py-4 min-h-12 border text-[15px] font-bold uppercase tracking-wide transition ${
                value === o
                  ? 'bg-white text-black border-white'
                  : 'bg-white/[0.04] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
