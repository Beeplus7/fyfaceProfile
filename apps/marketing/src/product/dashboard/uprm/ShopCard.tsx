export type ShopItem = {
  id: string;
  title: string;
  price: number;
  stock?: number;
  delivery_radius_mi?: number;
  escrow_pct?: number;
  image?: string;
};

export function ShopCard({ item }: { item: ShopItem }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
      <div className="h-28 bg-black/40 grid place-items-center mono text-[10px] text-white/40">
        {item.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        ) : (
          "SHOP"
        )}
      </div>
      <div className="p-3">
        <div className="text-[13px] font-bold text-white">{item.title}</div>
        <div className="mono text-[11px] text-white/60 mt-1">
          £{item.price}/m · stock {item.stock ?? 0} · {item.delivery_radius_mi ?? 10}mi · escrow{" "}
          {item.escrow_pct ?? 5}%
        </div>
      </div>
    </div>
  );
}

export default ShopCard;
