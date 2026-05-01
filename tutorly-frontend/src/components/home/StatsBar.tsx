const STATS = [
  { value: "1,200+", label: "Active tutors" },
  { value: "40+",    label: "Subjects covered" },
  { value: "8,500+", label: "Sessions booked" },
  { value: "4.8 ★",  label: "Average rating" },
];

export function StatsBar() {
  return (

    <div className="flex items-center gap-12 px-10 py-8 border-t border-b border-[#e5e3de] bg-[#fafaf8]">
      {STATS.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-0.5">
          <span className="font-display text-[30px] font-normal text-[#1a1a18] tracking-[-0.5px] leading-none">
            {stat.value}
          </span>
          <span className="text-xs text-[#9e9c97] font-light mt-1">
            {stat.label}
          </span>
        </div>
      ))}
    </div>
  );
}