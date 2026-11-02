import React, { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ALL_FIELDS, getEligibleFields, type FieldDef } from '../rules/fieldGating';
import { STEPS } from '../config/onboardingSteps';

export function OnboardingCompanion() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isCompact = width < 420;

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState<any>(undefined);
  const [isCompleting, setIsCompleting] = useState(false);

  const { eligible } = useMemo(() => getEligibleFields(answers), [answers]);
  const currentField: FieldDef | null = eligible[0] ?? null;
  const answeredCount = Object.keys(answers).length;
  const phase = STEPS.find((s) => s.id === currentField?.stepId);

  const finish = useCallback(async () => {
    setIsCompleting(true);
    try {
      // Persist hook point — wire to onboarding_memory when schema lands.
      router.replace('/(os)/uprm');
    } finally {
      setIsCompleting(false);
    }
  }, [router]);

  const advance = useCallback(
    async (value: any) => {
      if (!currentField) {
        await finish();
        return;
      }
      const next = { ...answers, [currentField.id]: value };
      setAnswers(next);
      setInputValue(undefined);
      const { eligible: remaining } = getEligibleFields(next);
      if (remaining.length === 0) await finish();
    },
    [answers, currentField, finish],
  );

  if (!currentField) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#8FFF4A" />
        <Text style={styles.muted}>Opening UPRM…</Text>
      </View>
    );
  }

  const options = currentField.options ?? (currentField.type === 'yesno' ? ['Yes', 'No'] : []);

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[styles.content, isCompact && styles.contentCompact]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.brand}>MyFace · UPRM Onboarding</Text>
      <Text style={styles.phase}>{phase?.title ?? 'Companion'}</Text>
      <Text style={styles.progress}>
        {answeredCount} of {ALL_FIELDS.length} fields · mobile-first
      </Text>

      <View style={styles.card}>
        <Text style={styles.question}>{currentField.label}</Text>
        {currentField.help ? <Text style={styles.help}>{currentField.help}</Text> : null}

        {currentField.type === 'text' || currentField.type === 'number' ? (
          <TextInput
            style={styles.input}
            value={typeof inputValue === 'string' ? inputValue : ''}
            onChangeText={setInputValue}
            placeholder={currentField.placeholder ?? 'Type your answer'}
            placeholderTextColor="#64748B"
            autoCapitalize="sentences"
          />
        ) : (
          <View style={styles.options}>
            {options.map((opt) => {
              const selected = inputValue === opt || (Array.isArray(inputValue) && inputValue.includes(opt));
              return (
                <Pressable
                  key={opt}
                  onPress={() => {
                    if (currentField.type === 'multi') {
                      const prev: string[] = Array.isArray(inputValue) ? inputValue : [];
                      setInputValue(
                        prev.includes(opt) ? prev.filter((x) => x !== opt) : [...prev, opt],
                      );
                    } else {
                      setInputValue(opt);
                    }
                  }}
                  style={[styles.option, selected && styles.optionSelected]}
                >
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          style={[styles.cta, isCompleting && styles.ctaDisabled]}
          disabled={isCompleting}
          onPress={() => {
            if (currentField.required && (inputValue === undefined || inputValue === '')) return;
            void advance(inputValue);
          }}
        >
          <Text style={styles.ctaText}>{isCompleting ? 'Saving…' : 'Continue'}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#050505' },
  content: { padding: 24, paddingBottom: 48, maxWidth: 560, width: '100%', alignSelf: 'center' },
  contentCompact: { paddingHorizontal: 16 },
  center: { flex: 1, backgroundColor: '#050505', alignItems: 'center', justifyContent: 'center', gap: 12 },
  brand: { color: '#8FFF4A', fontWeight: '800', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },
  phase: { color: '#F8FAFC', fontSize: 28, fontWeight: '800', marginTop: 8 },
  progress: { color: '#64748B', marginTop: 6, marginBottom: 20, fontSize: 13 },
  muted: { color: '#94A3B8' },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderRadius: 20,
    padding: 20,
    gap: 14,
  },
  question: { color: '#fff', fontSize: 20, fontWeight: '700', lineHeight: 28 },
  help: { color: '#94A3B8', fontSize: 14 },
  input: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 14,
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  options: { gap: 10 },
  option: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  optionSelected: { borderColor: '#8FFF4A', backgroundColor: 'rgba(143,255,74,0.12)' },
  optionText: { color: '#E2E8F0', fontWeight: '600' },
  optionTextSelected: { color: '#8FFF4A' },
  cta: {
    marginTop: 8,
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: '#8FFF4A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaDisabled: { opacity: 0.6 },
  ctaText: { color: '#050505', fontWeight: '800', fontSize: 16 },
});

export default OnboardingCompanion;
