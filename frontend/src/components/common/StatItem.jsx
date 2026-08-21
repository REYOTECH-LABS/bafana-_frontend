import { CountUp } from '../../animations/CountUp';

export const StatItem = ({ value, label }) => {
  return (
    // Left-aligned rather than centred. In a divided strip, centring each item
    // makes the gaps between number and rule uneven and the row reads ragged;
    // a common left edge gives the strip a spine.
    <div className="text-left">
      <p className="text-3xl md:text-4xl font-serif font-bold text-black mb-1 leading-none">
        <CountUp value={value} />
      </p>
      <p className="text-gray-500 text-xs uppercase tracking-wider leading-snug">
        {label}
      </p>
    </div>
  );
};

export default StatItem;
