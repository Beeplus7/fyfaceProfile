export type ConversationTurn = {
  turnIndex: number;
  fieldId?: string;
  questionText?: string;
  whyText?: string;
  userAnswer?: string;
  answerValue?: unknown;
  createdAt: string;
};

const KEY = 'myface_onboarding_conversations';

export function loadTurns(userId?: string): ConversationTurn[] {
  try {
    const raw = localStorage.getItem(userId ? `${KEY}:${userId}` : KEY);
    if (raw) return JSON.parse(raw) as ConversationTurn[];
  } catch {
    /* ignore */
  }
  return [];
}

export function appendTurn(turn: Omit<ConversationTurn, 'createdAt' | 'turnIndex'>, userId?: string) {
  const turns = loadTurns(userId);
  const next: ConversationTurn = {
    ...turn,
    turnIndex: turns.length,
    createdAt: new Date().toISOString(),
  };
  turns.push(next);
  localStorage.setItem(userId ? `${KEY}:${userId}` : KEY, JSON.stringify(turns));
  return next;
}
