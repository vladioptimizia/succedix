import { scoreStatus } from "@/lib/scoring";

const colorMap = {
  green: "#10b981",
  amber: "#f59e0b",
  orange: "#f97316",
  red: "#ef4444",
};

export default function ScoreCircle({
  score,
  label,
  size = 120,
}: {
  score: number;
  label: string;
  size?: number;
}) {
  const { color, label: statusLabel } = scoreStatus(score);
  const stroke = colorMap[color];
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90 absolute top-0 left-0">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#374151"
            strokeWidth={8}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={stroke}
            strokeWidth={8}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{score}%</span>
          <span className="text-xs text-gray-400">{statusLabel}</span>
        </div>
      </div>
      <span className="text-sm text-gray-300">{label}</span>
    </div>
  );
}
