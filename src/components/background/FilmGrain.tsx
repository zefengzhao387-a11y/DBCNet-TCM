/**
 * 全屏宣纸 / 胶片噪点：固定叠层、opacity≈0.05、mix-blend-overlay，削弱屏幕塑料感。
 */
export function FilmGrain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[140] opacity-[0.035] mix-blend-overlay"
      aria-hidden
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter
            id="dbcnet-film-grain"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.78"
              numOctaves="5"
              seed="42"
              stitchTiles="stitch"
              result="noise"
            />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.95 0"
              result="mono"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#dbcnet-film-grain)" />
      </svg>
    </div>
  );
}
