/**
 * Edge fn stub — onboarding-chat
 * Input: { answersSoFar, eligibleFields, conversationHistory, latestUserReply }
 * Output: { done, nextFieldId, questionText, whyText }
 *
 * Deploy: supabase functions deploy onboarding-chat
 * Deterministic gating lives client-side in fieldGating / tradeProfiles until LLM path added.
 */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  try {
    const body = await req.json();
    const eligible: { id: string; label?: string; why?: string }[] = body.eligibleFields || [];
    const answers = body.answersSoFar || {};
    const next = eligible.find((f) => answers[f.id] === undefined || answers[f.id] === null || answers[f.id] === '');

    if (!next) {
      return Response.json({ done: true, nextFieldId: null, questionText: null, whyText: null });
    }

    return Response.json({
      done: false,
      nextFieldId: next.id,
      questionText: next.label || next.id,
      whyText: next.why || 'To show your work in Work Feed within 10mi Oldham',
      mode: 'deterministic-stub',
    });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 400 });
  }
});
