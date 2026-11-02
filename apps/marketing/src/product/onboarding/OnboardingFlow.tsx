import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Loader2 } from 'lucide-react';
import logoM1 from '../../assets/1267bf6fbc31a56c-image_15C1A29E-A00E-4063-8F36-6B9DEFD3F3ED.jpeg';
import { ALL_FIELDS } from './fields';
import { getEligibleFields } from './gating';
import { WHY_TEXT } from './whyText';
import OnboardingStep from './OnboardingStep';
import { enterTestLab } from '../demo/testLab';
import {
  isOnboardingDone,
  loadAnswers,
  markOnboardingDone,
  saveAnswers,
} from './storage';
import { appendTurn } from './services/OnboardingConversationService';
import { completeOnboarding, saveStep } from './services/OnboardingMemoryService';

export default function OnboardingFlow() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentFieldId, setCurrentFieldId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<any>(undefined);
  const [isThinking, setIsThinking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const initRef = useRef(false);

  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    if (isOnboardingDone()) {
      navigate('/app/dashboard', { replace: true });
      return;
    }
    const saved = loadAnswers();
    setAnswers(saved);
    const { eligible } = getEligibleFields(saved);
    if (eligible.length === 0) {
      markOnboardingDone(saved);
      navigate('/app/dashboard', { replace: true });
      return;
    }
    setCurrentFieldId(eligible[0].id);
  }, [navigate]);

  const eligibleInfo = getEligibleFields(answers);
  const currentField = ALL_FIELDS.find((f) => f.id === currentFieldId) || null;
  const progressCount = Object.keys(answers).length;
  const whyText = currentField
    ? WHY_TEXT[currentField.id] || currentField.help || 'Building your UPRM profile…'
    : '';

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const advance = useCallback(
    async (fieldId: string, value: any) => {
      let base = { ...answers };
      // Changing craft resets trade-specific answers so options stay relevant.
      if (fieldId === 'tradeType' && answers.tradeType && answers.tradeType !== value) {
        base = { tradeType: value };
      }
      const newAnswers = { ...base, [fieldId]: value, ...eligibleInfo.autoAnswered };
      setAnswers(newAnswers);
      saveAnswers(newAnswers);
      saveStep(fieldId, value);
      appendTurn({
        fieldId,
        questionText: ALL_FIELDS.find((f) => f.id === fieldId)?.label,
        whyText: WHY_TEXT[fieldId],
        userAnswer: String(value ?? ''),
        answerValue: value,
      });
      setIsThinking(true);
      await new Promise((r) => setTimeout(r, 450));
      const next = getEligibleFields(newAnswers);
      if (next.eligible.length === 0) {
        markOnboardingDone(newAnswers);
        completeOnboarding();
        setIsThinking(false);
        showToast('UPRM unlocked — opening dashboard');
        navigate('/app/dashboard', { replace: true });
        return;
      }
      setCurrentFieldId(next.eligible[0].id);
      setInputValue(newAnswers[next.eligible[0].id]);
      setIsThinking(false);
    },
    [answers, eligibleInfo.autoAnswered, navigate],
  );

  const handleSubmit = async () => {
    if (!currentField) return;
    if (
      currentField.required &&
      (inputValue === undefined ||
        inputValue === '' ||
        (Array.isArray(inputValue) && inputValue.length === 0))
    ) {
      showToast('Please answer before continuing.');
      return;
    }
    await advance(currentField.id, inputValue);
  };

  return (
    <div
      className="min-h-screen bg-[#050505] text-white relative overflow-x-clip"
      style={{ paddingTop: 'var(--safe-area-inset-top)' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(143,255,74,0.12),transparent_55%)]" />

      <header className="relative z-10 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl px-4 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-9 w-9 rounded-[12px] overflow-hidden bg-white shrink-0">
              <img src={logoM1} alt="MyFace" className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0">
              <div className="font-extrabold text-sm truncate">UPRM Onboarding</div>
              <div className="text-[10px] uppercase tracking-widest text-white/40 truncate">
                {progressCount} / {ALL_FIELDS.length} fields
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              className="text-xs text-[#8FFF4A] hover:text-white font-semibold"
              onClick={() => {
                enterTestLab();
                navigate('/app/dashboard', { replace: true });
              }}
            >
              Test Lab seed
            </button>
            <button
              type="button"
              className="text-xs text-white/50 hover:text-white"
              onClick={() => {
                markOnboardingDone(answers);
                navigate('/app/dashboard', { replace: true });
              }}
            >
              Skip → dashboard
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-3">
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8FFF4A] via-[#00E5C0] to-[#FFE600] transition-all"
              style={{ width: `${(progressCount / ALL_FIELDS.length) * 100}%` }}
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 py-6 pb-28">
        <div className="flex gap-3 items-start mb-5">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#8FFF4A] to-[#00E5C0] grid place-items-center shrink-0">
            <img src={logoM1} alt="" className="h-7 w-7 rounded-full object-cover" />
          </div>
          <div className="rounded-2xl rounded-tl-md border border-white/10 bg-white/[0.05] px-4 py-3 max-w-[92%]">
            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">
              Why we ask
            </div>
            <div className="text-sm text-white/85">{whyText}</div>
            {isThinking ? (
              <div className="mt-2 text-xs text-white/40 flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Choosing next field…
              </div>
            ) : null}
          </div>
        </div>

        {currentField && !isThinking ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
            <OnboardingStep
              field={currentField}
              answers={answers}
              value={inputValue}
              onChange={setInputValue}
            />
            <div className="mt-6 pt-5 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => void handleSubmit()}
                className="inline-flex items-center gap-2 min-h-12 px-6 rounded-xl bg-[#8FFF4A] text-black font-extrabold"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="py-16 grid place-items-center text-white/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}
      </main>

      {toast ? (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="rounded-full bg-black border border-[#8FFF4A]/40 px-4 py-2 text-sm flex items-center gap-2">
            <Check className="h-4 w-4 text-[#8FFF4A]" />
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}
