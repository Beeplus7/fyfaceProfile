import { ALL_FIELDS, type FieldDef } from './fields';

export function getEligibleFields(answers: Record<string, any>) {
  const autoAnswered: Record<string, any> = {};
  if (answers.workRadius === undefined || answers.workRadius === '') {
    autoAnswered.workRadius = 10;
  }
  const merged = { ...answers, ...autoAnswered };
  const allAnsweredKeys = new Set(Object.keys(merged));

  const eligible = ALL_FIELDS.filter((f: FieldDef) => {
    if (allAnsweredKeys.has(f.id)) return false;
    if (f.appliesIf && !f.appliesIf(merged)) return false;
    return true;
  });

  return {
    eligible,
    autoAnswered,
    total: ALL_FIELDS.length,
    answered: Object.keys(answers).length,
  };
}
