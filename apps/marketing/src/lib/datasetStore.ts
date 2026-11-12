import { supabase, isSupabaseConfigured } from './supabase';

export type SupplierListing = {
  id: string;
  title: string;
  category: string;
  type: string;
  hours: number;
  location: string;
  language: string;
  price: number;
  seller: string;
  createdLabel: string;
  created_at?: string;
};

export type CatalogRow = {
  id: string;
  title: string;
  category: string;
  capture_type: string;
  badge: string | null;
  price_hr: number;
  total_price: number;
  hours: number;
  pros_count: number;
  quality_score: number;
  languages: string;
  hands_pct: number;
  blurred_pct: number;
  seller: string;
  trust_score: number;
  location: string;
  emoji: string | null;
  gradient: string | null;
  sample_labels: string[] | null;
  buyers: string | null;
};

const LISTINGS_KEY = 'mfp-dataset-listings-v1';
const ORDERS_KEY = 'mfp-dataset-orders-v1';
const PAYOUTS_KEY = 'mfp-dataset-payouts-v1';

function readLocal<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocal<T>(key: string, rows: T[]) {
  localStorage.setItem(key, JSON.stringify(rows));
}

export async function listCatalog(): Promise<{ rows: CatalogRow[]; source: 'supabase' | 'empty' }> {
  if (!supabase) return { rows: [], source: 'empty' };
  const { data, error } = await supabase
    .from('dataset_catalog')
    .select('*')
    .eq('is_published', true)
    .order('id');
  if (error || !data) return { rows: [], source: 'empty' };
  return { rows: data as CatalogRow[], source: 'supabase' };
}

export async function listSupplierListings(): Promise<{
  rows: SupplierListing[];
  source: 'supabase' | 'local';
  error?: string;
}> {
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('dataset_listings')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      return {
        source: 'supabase',
        rows: data.map((r) => ({
          id: r.id as string,
          title: r.title as string,
          category: r.category as string,
          type: r.capture_type as string,
          hours: Number(r.hours),
          location: (r.location as string) || '',
          language: (r.language as string) || '',
          price: Number(r.price_hr),
          seller: r.seller as string,
          createdLabel: new Date(r.created_at as string).toLocaleDateString('en-GB'),
          created_at: r.created_at as string,
        })),
      };
    }
    return {
      source: 'local',
      rows: readLocal<SupplierListing>(LISTINGS_KEY),
      error: error?.message || 'Supabase listings unavailable — using local store.',
    };
  }
  return { source: 'local', rows: readLocal<SupplierListing>(LISTINGS_KEY) };
}

export async function createSupplierListing(input: {
  title: string;
  category: string;
  type: string;
  hours: number;
  location: string;
  language: string;
  price: number;
  seller: string;
}): Promise<SupplierListing> {
  const createdLabel = new Date().toLocaleDateString('en-GB');
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('dataset_listings')
      .insert({
        title: input.title,
        category: input.category,
        capture_type: input.type,
        hours: input.hours,
        location: input.location,
        language: input.language,
        price_hr: input.price,
        seller: input.seller,
        status: 'pending',
      })
      .select('*')
      .single();
    if (!error && data) {
      return {
        id: data.id as string,
        title: data.title as string,
        category: data.category as string,
        type: data.capture_type as string,
        hours: Number(data.hours),
        location: (data.location as string) || '',
        language: (data.language as string) || '',
        price: Number(data.price_hr),
        seller: data.seller as string,
        createdLabel,
        created_at: data.created_at as string,
      };
    }
  }
  const row: SupplierListing = {
    id: `local-${Date.now()}`,
    ...input,
    createdLabel,
  };
  const rows = [row, ...readLocal<SupplierListing>(LISTINGS_KEY)];
  writeLocal(LISTINGS_KEY, rows);
  return row;
}

export async function deleteSupplierListing(id: string): Promise<void> {
  if (supabase && isSupabaseConfigured && !id.startsWith('local-')) {
    await supabase.from('dataset_listings').delete().eq('id', id);
  }
  writeLocal(
    LISTINGS_KEY,
    readLocal<SupplierListing>(LISTINGS_KEY).filter((r) => r.id !== id),
  );
}

export async function createDatasetOrder(input: {
  items: { id: string; title: string; total: number }[];
  license: string;
  total: number;
}): Promise<{ id: string; source: 'supabase' | 'local' }> {
  if (supabase && isSupabaseConfigured) {
    const { data: order, error } = await supabase
      .from('dataset_orders')
      .insert({
        license_type: input.license,
        total: input.total,
        status: 'pending_payment',
        metadata: { demo: true },
      })
      .select('id')
      .single();
    if (!error && order?.id) {
      await supabase.from('dataset_order_items').insert(
        input.items.map((item) => ({
          order_id: order.id,
          catalog_id: item.id.startsWith('d') ? item.id : null,
          title: item.title,
          line_total: item.total,
        })),
      );
      return { id: order.id as string, source: 'supabase' };
    }
  }
  const id = `local-order-${Date.now()}`;
  const rows = [{ id, ...input, createdLabel: new Date().toLocaleDateString('en-GB') }, ...readLocal(ORDERS_KEY)];
  writeLocal(ORDERS_KEY, rows);
  return { id, source: 'local' };
}

export async function createPayoutRequest(input: {
  method: string;
  amount: number;
}): Promise<{ id: string; source: 'supabase' | 'local' }> {
  if (supabase && isSupabaseConfigured) {
    const { data, error } = await supabase
      .from('dataset_payout_requests')
      .insert({
        method: input.method,
        amount_gbp: input.amount,
        status: 'pending',
      })
      .select('id')
      .single();
    if (!error && data?.id) return { id: data.id as string, source: 'supabase' };
  }
  const id = `local-payout-${Date.now()}`;
  writeLocal(PAYOUTS_KEY, [{ id, ...input, createdLabel: new Date().toLocaleDateString('en-GB') }, ...readLocal(PAYOUTS_KEY)]);
  return { id, source: 'local' };
}
