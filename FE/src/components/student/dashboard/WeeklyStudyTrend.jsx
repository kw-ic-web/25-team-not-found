import { useMemo } from "react";

export default function WeeklyStudyTrend({ apiWeeklyActivity }) {
  const points = useMemo(() => {
    const raw = Array.isArray(apiWeeklyActivity) ? apiWeeklyActivity : [];

    if (raw.length === 0) {
      return Array.from({ length: 7 }, (_, i) => ({
        label: `D${i + 1}`,
        hours: 0,
      }));
    }

    const arr = raw.slice(0, 7).map((x) => ({
      label: x?.date ?? "",
      hours: Number(x?.hours ?? 0),
    }));
    while (arr.length < 7) arr.push({ label: "", hours: 0 });
    return arr;
  }, [apiWeeklyActivity]);

  const W = 560;
  const H = 190;
  const P = 18;

  const maxHours = Math.max(1, ...points.map((p) => p.hours));

  const xs = points.map((_, i) => P + (i * (W - P * 2)) / (points.length - 1));
  const ys = points.map((p) => {
    const t = p.hours / maxHours;
    return H - P - t * (H - P * 2);
  });

  const lineD = xs.map((x, i) => `${x},${ys[i]}`).join(" ");
  const areaD = `M ${P} ${H - P} L ${lineD.replaceAll(",", " ")} L ${W - P} ${H - P} Z`;

  return (
    <div className="w-full h-full">
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {/* 면적 */}
        <path d={areaD} fill="#13A4EC" opacity="0.12" />
        {/* 라인 */}
        <polyline
          points={lineD}
          fill="none"
          stroke="#13A4EC"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}