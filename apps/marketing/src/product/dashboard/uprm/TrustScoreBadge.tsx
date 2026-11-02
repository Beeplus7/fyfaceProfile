export function TrustScoreBadge({
  score = 4.9,
  verified = true,
  label = "Verified",
}: {
  score?: number;
  verified?: boolean;
  label?: string;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5">
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ background: verified ? "#8FFF4A" : "#94A3B8" }}
      />
      <span className="text-[13px] font-extrabold text-white">{score.toFixed(1)}</span>
      <span className="mono text-[10px] text-white/60 uppercase tracking-wider">
        {verified ? label : "Unverified"}
      </span>
    </div>
  );
}

export default TrustScoreBadge;
