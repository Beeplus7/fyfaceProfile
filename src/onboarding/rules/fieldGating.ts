import { STEPS, type CompanionQuestion } from '../config/onboardingSteps';
import { computeEligibleFields, type GatingRule } from './gatingEngine';

export interface FieldDef extends CompanionQuestion {
  stepId: string;
}

export const ALL_FIELDS: FieldDef[] = STEPS.flatMap((step) =>
  step.questions.map((q) => ({ ...q, stepId: step.id })),
);

type Answers = Record<string, any>;

function isNo(value: any): boolean {
  if (value === false) return true;
  if (typeof value === 'string') return value.trim().toLowerCase() === 'no';
  return false;
}

const RULES: GatingRule[] = [
  {
    // Skip live workshop ask if they refused filming — auto "no".
    fieldId: 'liveWorkshopInterest',
    appliesIf: (a) => !isNo(a.willingToFilm),
    autoAnswer: () => 'no',
  },
];

export function getEligibleFields(answers: Answers) {
  return computeEligibleFields(ALL_FIELDS, RULES, answers);
}
