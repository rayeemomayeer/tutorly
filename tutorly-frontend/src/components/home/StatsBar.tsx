const STATS = [
  { value: "1,200+", label: "Active tutors" },
  { value: "40+",    label: "Subjects covered" },
  { value: "8,500+", label: "Sessions booked" },
  { value: "4.8 ★",  label: "Average rating" },
];

export function StatsBar() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-[#e5e3de] border-t border-b border-[#e5e3de]">
      {STATS.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-0.5 bg-[#fafaf8] px-6 sm:px-8 py-6 sm:py-8">
          <span className="font-display text-[26px] sm:text-[30px] font-normal text-[#1a1a18] tracking-[-0.5px] leading-none">
            {stat.value}
          </span>
          <span className="text-xs text-[#9e9c97] font-light mt-1">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}