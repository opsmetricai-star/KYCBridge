export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 font-semibold tracking-tight ${className}`}>
      <svg width="26" height="22" viewBox="0 0 26 22" fill="none" aria-hidden>
        <path d="M2 2 L16 11 L2 20 Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M8 2 L24 11 L8 20" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
      <span className="text-[22px] leading-none uppercase">KYCBridge</span>
    </span>
  );
}
