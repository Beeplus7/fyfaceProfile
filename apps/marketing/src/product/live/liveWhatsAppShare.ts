import type { LiveInviteContact } from './liveAudience';

/** Build a private-live join URL contacts can open. */
export function privateLiveInviteUrl(opts?: { origin?: string; contactId?: string }): string {
  const origin = opts?.origin || (typeof window !== 'undefined' ? window.location.origin : '');
  const url = new URL('/app/feed', origin || 'https://myfaceprofile.aikova.co.uk');
  url.searchParams.set('live', '1');
  url.searchParams.set('invite', 'private');
  if (opts?.contactId) url.searchParams.set('c', opts.contactId);
  return url.toString();
}

export function privateLiveWhatsAppText(opts: {
  contactName?: string;
  hostName?: string;
  title?: string;
  url: string;
}): string {
  const who = opts.contactName ? `Hi ${opts.contactName}` : 'Hi';
  const host = opts.hostName || 'me';
  const title = opts.title ? ` (${opts.title})` : '';
  return `${who} — you're invited to my private MyFace live${title} with ${host}. Join here: ${opts.url}`;
}

/** Digits only for wa.me (strip +, spaces, dashes). */
export function normalizeWaPhone(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 8 ? digits : null;
}

/** Open WhatsApp with invite text. With phone → that chat; without → WhatsApp contact picker. */
export function openWhatsAppPrivateLiveInvite(opts: {
  contact?: LiveInviteContact | null;
  hostName?: string;
  title?: string;
  url?: string;
}): void {
  const url =
    opts.url ||
    privateLiveInviteUrl({ contactId: opts.contact?.id });
  const text = privateLiveWhatsAppText({
    contactName: opts.contact?.name,
    hostName: opts.hostName,
    title: opts.title,
    url,
  });
  const phone = normalizeWaPhone(opts.contact?.phone);
  const href = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(href, '_blank', 'noopener,noreferrer');
}

/** Share the same private link to WhatsApp without a specific phone (user picks chat). */
export function openWhatsAppPrivateLiveBroadcast(opts: {
  hostName?: string;
  title?: string;
  contactNames?: string[];
}): void {
  const url = privateLiveInviteUrl();
  const names = opts.contactNames?.filter(Boolean).slice(0, 6) || [];
  const list = names.length ? ` Invited: ${names.join(', ')}.` : '';
  const text = `You're invited to my private MyFace live${opts.title ? ` · ${opts.title}` : ''}.${list} Join: ${url}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
}
