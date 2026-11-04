/** Live session audience — contacts-only vs public For You feed. */

export type LiveVisibility = 'public' | 'contacts';

export type LiveAudience = {
  /** contacts = invite list only; public = open room */
  visibility: LiveVisibility;
  /** When false, live card is hidden from public For You / Discover */
  publicFeed: boolean;
  /** Selected CRM contact ids allowed to join / see invite */
  contactIds: string[];
};

export type LiveContactOption = {
  id: string;
  name: string;
  trade?: string;
  status?: string;
  /** E.164 or national; used for wa.me deep link when present */
  phone?: string;
};

export const DEFAULT_LIVE_AUDIENCE: LiveAudience = {
  visibility: 'contacts',
  publicFeed: false,
  contactIds: [],
};

export const SEED_LIVE_CONTACTS: LiveContactOption[] = [
  { id: 'c1', name: 'Aisha Bridal', trade: 'tailor', status: 'Quote', phone: '447700900101' },
  { id: 'c2', name: 'Mrs Okafor', trade: 'tailor', status: 'Repeat', phone: '447700900102' },
  { id: 'c3', name: 'Cooper Levin', trade: 'tailor', status: 'Inquiry', phone: '447700900103' },
  { id: 'c4', name: 'Anika Rosser', trade: 'tailor', status: 'Engagement', phone: '447700900104' },
  { id: 'c5', name: 'Fatima Bello', trade: 'tailor', status: 'Booked', phone: '447700900105' },
  { id: 'c6', name: 'Yusuf Mensah', trade: 'barber', status: 'Lead', phone: '447700900106' },
  { id: 'c7', name: 'Grace Okonkwo', trade: 'tailor', status: 'Fitting', phone: '447700900107' },
];

export type LiveInviteContact = {
  id: string;
  name: string;
  phone?: string;
};

export function normalizeAudience(raw?: Partial<LiveAudience> | null): LiveAudience {
  const visibility: LiveVisibility = raw?.visibility === 'public' ? 'public' : 'contacts';
  const contactIds = Array.isArray(raw?.contactIds)
    ? raw!.contactIds.filter((id): id is string => typeof id === 'string' && id.length > 0).slice(0, 40)
    : [];
  const publicFeed =
    visibility === 'public' ? true : Boolean(raw?.publicFeed);
  return { visibility, publicFeed, contactIds };
}

export function audienceLabel(a: LiveAudience): string {
  if (a.publicFeed || a.visibility === 'public') return 'Public For You';
  const n = a.contactIds.length;
  return n > 0 ? `Contacts · ${n}` : 'Contacts only';
}

/** Map picker audience → setBroadcast / patchBroadcast meta */
export function broadcastMetaFromAudience(
  audience?: LiveAudience | null,
  contacts?: LiveContactOption[] | null,
) {
  const a = normalizeAudience(audience);
  const pool = contacts?.length ? contacts : SEED_LIVE_CONTACTS;
  const allowedContacts =
    a.visibility === 'contacts'
      ? a.contactIds
          .map((id) => pool.find((c) => c.id === id))
          .filter((c): c is LiveContactOption => Boolean(c))
          .map((c) => ({
            id: c.id,
            name: c.name,
            ...(c.phone ? { phone: c.phone } : {}),
          }))
      : [];
  return {
    visibility: a.visibility,
    publicFeed: a.publicFeed,
    allowedContactIds: a.contactIds,
    allowedContacts,
  } as const;
}
