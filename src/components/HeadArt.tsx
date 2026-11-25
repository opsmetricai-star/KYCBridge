/** Original illustration: a head silhouette built from concentric contour lines inside orbit rings. */
export function HeadArt() {
  const lines = Array.from({ length: 26 }, (_, i) => i);
  return (
    <svg viewBox="0 0 640 640" className="h-full w-full" aria-hidden>
      <g fill="none" stroke="#191919" strokeOpacity=".12">
        {[310, 240, 170].map((r) => <circle key={r} cx="320" cy="320" r={r} />)}
      </g>
      <defs>
        <clipPath id="head">
          <path d="M215 330 C205 250 245 150 340 150 C430 150 478 235 470 330 C466 392 440 420 420 440 L420 500 L300 500 L300 450 C290 425 275 410 262 396 L225 392 C232 372 222 352 215 330 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#head)" fill="none" stroke="#2b2b2b" strokeWidth="1.6">
        {lines.map((i) => (
          <ellipse key={i} cx="350" cy="320" rx={8 + i * 9.5} ry={8 + i * 11} />
        ))}
      </g>
      <circle cx="350" cy="320" r="7" fill="#8a8a6a" fillOpacity=".5" />
    </svg>
  );
}
