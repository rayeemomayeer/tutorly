import Link from "next/link";

export function CtaStrip() {
  return (

    <div className="mx-10 mb-16 bg-[#1a1a18] rounded-xl px-12 py-12 flex items-center justify-between gap-8">
      <h2 className="font-display text-[30px] font-normal text-[#fafaf8] tracking-[-0.5px] leading-snug max-w-sm">
        Ready to find your{" "}
        <em className="font-display italic font-light text-indigo-400">
          perfect
        </em>{" "}
        tutor?
      </h2>

      <Link
        href="/tutors"
        className="shrink-0 bg-[#fafaf8] text-[#1a1a18] text-sm px-6 py-3 rounded-md
                   hover:bg-white transition-colors whitespace-nowrap"
      >
        Browse all tutors →
      </Link>
    </div>
  );
}