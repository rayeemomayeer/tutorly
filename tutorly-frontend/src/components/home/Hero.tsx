import Link from "next/link";

export function Hero() {
  return (
<section className="px-10 pt-20 pb-16 max-w-3xl mx-auto flex flex-col items-center text-center">

      <div className="flex items-center gap-2.5 mb-7">
        
        <span className="text-[11px] font-medium tracking-[0.12em] uppercase text-indigo-500">
          1-on-1 tutoring, on your terms
        </span>
      </div>


      <h1 className="font-display text-[58px] font-normal leading-[1.07] tracking-[-1.8px] text-[#1a1a18] mb-6">
        Learn from someone
        <br />
        who{" "}
        <em className="font-display italic font-light text-indigo-500">
          gets it.
        </em>
      </h1>

  
      <p className="text-[15px] text-[#6b6b66] font-light leading-[1.7] mb-10 max-w-[440px]">
        Find expert tutors across any subject — book a session in seconds, no
        back-and-forth required.
      </p>


      <div className="flex items-center gap-4">
        <Link
          href="/tutors"
          className="bg-[#1a1a18] text-[#fafaf8] text-sm px-6 py-3 rounded-md hover:bg-[#2c2c2a] transition-colors"
        >
          Browse tutors
        </Link>
        <a
          href="#how-it-works"
          className="text-sm text-[#1a1a18] flex items-center gap-1.5 hover:text-indigo-600 transition-colors group"
        >
          How it works
          <span className="group-hover:translate-x-0.5 transition-transform inline-block">
            →
          </span>
        </a>
      </div>
    </section>
  );
}