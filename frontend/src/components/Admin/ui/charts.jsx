/**
 * Charts, drawn as inline SVG.
 *
 * No charting library: the portal needs two shapes, both a few lines of maths,
 * and Recharts or Chart.js would add well over 100 KB to the bundle to draw
 * them. Inline SVG also inherits the design tokens directly.
 *
 * The palette is the report design's — charcoal through greys, with the tinted
 * status colours for meaning. Deliberately not the reference screenshot's
 * purples, which belong to a different product.
 *
 * Every chart takes real figures. None of them invents a series to look busy.
 */

/** Charcoal to light grey, ordered so the largest slice is the darkest. */
export const SERIES_COLORS = ['#1C1917', '#57534E', '#A8A29E', '#D6D3D1', '#E7E5E4'];

/* --------------------------------------------------------------------- donut */

const polarToCartesian = (cx, cy, radius, angleDegrees) => {
  const radians = ((angleDegrees - 90) * Math.PI) / 180;
  return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
};

const arcPath = (cx, cy, outer, inner, startAngle, endAngle) => {
  // A full circle cannot be drawn as a single arc — start and end would be the
  // same point and the path collapses. Nudging the sweep keeps it visible.
  const sweep = Math.min(endAngle - startAngle, 359.99);
  const end = startAngle + sweep;
  const largeArc = sweep > 180 ? 1 : 0;

  const outerStart = polarToCartesian(cx, cy, outer, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outer, end);
  const innerEnd = polarToCartesian(cx, cy, inner, end);
  const innerStart = polarToCartesian(cx, cy, inner, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outer} ${outer} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${inner} ${inner} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
};

/**
 * Ring chart with the total in the middle, as the report's case overview shows.
 *
 * `segments` is [{ label, value, color? }]. The figure and legend are real DOM
 * text, so the chart is readable by a screen reader without a separate table.
 */
export const DonutChart = ({ segments, total, centerLabel, size = 190 }) => {
  const sum = segments.reduce((acc, segment) => acc + segment.value, 0);
  const displayTotal = total ?? sum;

  const cx = size / 2;
  const cy = size / 2;
  const outer = size / 2 - 2;
  const inner = outer * 0.64;

  let cursor = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-8">
      <div className="relative flex-shrink-0">
        <svg width={size} height={size} role="img" aria-label={`${centerLabel}: ${displayTotal} total`}>
          {sum === 0 ? (
            <circle cx={cx} cy={cy} r={(outer + inner) / 2} fill="none" stroke="#E7E5E4" strokeWidth={outer - inner} />
          ) : (
            segments.map((segment, index) => {
              if (segment.value <= 0) return null;
              const angle = (segment.value / sum) * 360;
              const path = arcPath(cx, cy, outer, inner, cursor, cursor + angle);
              cursor += angle;

              return (
                <path
                  key={segment.label}
                  d={path}
                  fill={segment.color ?? SERIES_COLORS[index % SERIES_COLORS.length]}
                />
              );
            })
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-serif font-bold text-portal-ink tabular-nums leading-none">
            {displayTotal}
          </span>
          <span className="mt-1 text-xs text-portal-subtle">{centerLabel}</span>
        </div>
      </div>

      <ul className="w-full space-y-3">
        {segments.map((segment, index) => (
          <li key={segment.label} className="flex items-center gap-3 text-sm">
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: segment.color ?? SERIES_COLORS[index % SERIES_COLORS.length] }}
            />
            <span className="text-portal-muted flex-1 capitalize">{segment.label}</span>
            <span className="font-semibold text-portal-ink tabular-nums">{segment.value}</span>
            <span className="text-xs text-portal-subtle tabular-nums w-10 text-right">
              {sum ? Math.round((segment.value / sum) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/* ------------------------------------------------------------- ranked bars */

/**
 * Horizontal ranked list, as the report's top practice areas panel shows.
 *
 * Bars are proportional to the largest value rather than to the total, so the
 * comparison stays legible when one entry dominates.
 */
export const RankedBars = ({ items, valueLabel }) => {
  const max = Math.max(...items.map((item) => item.value), 1);

  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.label}>
          <div className="flex items-baseline justify-between gap-4 mb-1.5">
            <span className="text-sm text-portal-ink truncate">{item.label}</span>
            <span className="text-sm font-semibold text-portal-ink tabular-nums flex-shrink-0">
              {item.value}
              {valueLabel && <span className="ml-1 text-xs font-normal text-portal-subtle">{valueLabel}</span>}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-portal-raised overflow-hidden">
            <div
              className="h-full rounded-full bg-portal-ink"
              style={{ width: `${(item.value / max) * 100}%` }}
              role="presentation"
            />
          </div>
        </li>
      ))}
    </ul>
  );
};

export default DonutChart;
