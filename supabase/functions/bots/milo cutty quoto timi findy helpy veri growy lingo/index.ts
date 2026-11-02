/** Bot worker stub: milo cutty quoto timi findy helpy veri growy lingo — deploy with supabase functions deploy bots-milo cutty quoto timi findy helpy veri growy lingo */
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty */ }
  return Response.json({
    bot: 'milo cutty quoto timi findy helpy veri growy lingo',
    ok: true,
    mode: 'edge-stub',
    input: body,
    note: 'Wire BullMQ/OpenAI in Sprint 3 runtime — local apps/web/lib/bots.ts runBot(\'milo cutty quoto timi findy helpy veri growy lingo\')',
  });
});
