import type { CSSProperties, ReactNode } from "react";

const GRAD =
  "linear-gradient(90deg, #8FFF4A 0%, #00E5C0 25%, #1A7CFF 50%, #FFE600 75%, #FF8A00 100%)";

export function QuantumBackground({
  children,
  className = "",
  style,
}: {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full blur-[80px] opacity-40"
        style={{ background: GRAD }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full blur-[90px] opacity-30"
        style={{ background: GRAD }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default QuantumBackground;
