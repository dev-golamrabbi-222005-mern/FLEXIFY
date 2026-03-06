export default function CircularProgress({
  value,
  max,
  label,
  color,
  size = 120,
}: {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: number;
}) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = circ * pct;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e8e4d9"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)",
          }}
        />
        <text
          x={size / 2}
          y={size / 2 - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#2c2c2c"
          fontSize="18"
          fontWeight="700"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: `${size / 2}px ${size / 2}px`,
            fontFamily: "'Sora', sans-serif",
          }}
        >
          {value}g
        </text>
        <text
          x={size / 2}
          y={size / 2 + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#9a9690"
          fontSize="10"
          fontWeight="600"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: `${size / 2}px ${size / 2}px`,
            fontFamily: "'Sora', sans-serif",
          }}
        >
          {label.toUpperCase()}
        </text>
      </svg>
      <p style={{ color: "#9a9690", fontSize: "12px", fontWeight: 500 }}>
        {Math.round(pct * 100)}% of {max}g goal
      </p>
    </div>
  );
}