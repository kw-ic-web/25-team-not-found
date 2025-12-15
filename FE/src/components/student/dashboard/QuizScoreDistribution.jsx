const FIXED_BINS = [
  { label: "0-20", from: 0, to: 20 },
  { label: "20-40", from: 20, to: 40 },
  { label: "40-60", from: 40, to: 60 },
  { label: "60-80", from: 60, to: 80 },
  { label: "80-100", from: 80, to: 100 },
];

const parseRange = (rangeStr) => {
  if (typeof rangeStr !== "string") return null;
  const m = rangeStr.match(/^\s*(\d+)\s*-\s*(\d+)\s*$/);
  if (!m) return null;
  return { from: Number(m[1]), to: Number(m[2]) };
};

export default function QuizScoreDistribution({ apiQuizScores }) {
  const list = Array.isArray(apiQuizScores) ? apiQuizScores : [];

  const countsByLabel = new Map();

  for (const item of list) {
    const parsed = parseRange(item?.range);
    const count = typeof item?.count === "number" ? item.count : null;
    if (!parsed || count == null) continue;

    for (const bin of FIXED_BINS) {
      const overlap =
        Math.max(parsed.from, bin.from) < Math.min(parsed.to, bin.to) ||
        (parsed.from === bin.from && parsed.to === bin.to);

      if (overlap) {
        countsByLabel.set(bin.label, (countsByLabel.get(bin.label) ?? 0) + count);
        break;
      }
    }
  }

  const merged = FIXED_BINS.map((bin) => {
    const hasValue = countsByLabel.has(bin.label);
    const value = hasValue ? countsByLabel.get(bin.label) : null;
    return { ...bin, hasValue, value };
  });

  const maxValue = Math.max(
    ...merged.filter((b) => b.hasValue).map((b) => b.value),
    1
  );

  const minVisiblePct = 10;
  const placeholderPct = 6;

  return (
    <div className="mt-[12px] flex items-end gap-[18px] h-[190px] px-[8px]">
      {merged.map((bin) => {
        const heightPct = bin.hasValue
          ? Math.max((bin.value / maxValue) * 100, minVisiblePct)
          : placeholderPct;

        return (
          <div key={bin.label} className="flex flex-col items-center gap-[8px]">
            <div className="relative w-[92px] h-[145px] flex items-end">
              <div
                className="w-full rounded-[6px] bg-[#13A4EC]"
                style={{
                  height: `${heightPct}%`,
                  opacity: bin.hasValue ? 1 : 0.35,
                }}
                title={
                  bin.hasValue
                    ? `${bin.label}: ${bin.value}`
                    : `${bin.label}: 데이터 없음`
                }
              />
            </div>
            <p className="text-[12px] text-[#64748B]">{bin.label}</p>
          </div>
        );
      })}
    </div>
  );
}