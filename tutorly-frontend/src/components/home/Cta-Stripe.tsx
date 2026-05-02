import Link from "next/link";

export function CtaStrip() {
  return (
    <div className="mx-4 sm:mx-10 mb-12 sm:mb-16 bg-[#1a1a18] rounded-xl px-7 sm:px-12 py-9 sm:py-12
                    flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8">
      <h2 className="font-display text-[24px] sm:text-[30px] font-normal text-[#fafaf8] tracking-[-0.5px] leading-snug max-w-sm">
        Ready to find your{" "}
        <em className="font-display italic font-light text-indigo-400">perfect</em>{" "}
        tutor?
      </h2>
      <Link
        href="/tutors"
        className="shrink-0 bg-[#fafaf8] text-[#1a1a18] text-sm px-6 py-3 rounded-md
                   hover:bg-white transition-colors whitespace-nowrap w-full sm:w-auto text-center"
      >
        Browse all tutors →
      </Link>
    </div>
  );
}