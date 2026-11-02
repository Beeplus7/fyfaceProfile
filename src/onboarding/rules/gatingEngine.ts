export interface FieldDef {
  id: string;
  type: string;
  label: string;
  options?: string[];
}

type Answers = Record<string, any>;

export interface GatingRule {
  fieldId: string;
  appliesIf: (answers: Answers) => boolean;
  autoAnswer?: (answers: Answers) => any;
}

export interface GatingResult<F extends FieldDef> {
  eligible: F[];
  autoAnswered: Answers;
}

export function computeEligibleFields<F extends FieldDef>(
  allFields: F[],
  rules: GatingRule[],
  answers: Answers,
): GatingResult<F> {
  const autoAnswered: Answers = {};

  const eligible = allFields.filter((field) => {
    if (field.id in answers) return false;

    const rule = rules.find((r) => r.fieldId === field.id);
    if (rule && !rule.appliesIf(answers)) {
      if (rule.autoAnswer) {
        const value = rule.autoAnswer(answers);
        if (value !== undefined) autoAnswered[field.id] = value;
      }
      return false;
    }
    return true;
  });

  return { eligible, autoAnswered };
}
