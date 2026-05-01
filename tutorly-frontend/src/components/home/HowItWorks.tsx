const STEPS = [
  {
    number: "01",
    title: "Find your tutor",
    body: "Browse by subject, read detailed profiles, and check real-time availability. No guesswork.",
  },
  {
    number: "02",
    title: "Book a slot",
    body: "One click to claim an open slot. No emails, no waiting for a confirmation reply.",
  },
  {
    number: "03",
    title: "Start learning",
    body: "Show up, learn, repeat. Leave a review afterwards to help the next student decide.",
  },
];

export function HowItWorks() {
  return (

    <section id="how-it-works" className="px-10 pb-16">
      {/* Section header */}
      <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#9e9c97] mb-2">
        Process
      </p>
      <h2 className="font-display text-[34px] font-normal tracking-[-0.8px] text-[#1a1a18] leading-tight mb-10">
        Three steps to your
        <br />
        first session
      </h2>

      {/* Steps */}
      <div className="grid grid-cols-3 gap-6">
        {STEPS.map((step) => (
          <div
            key={step.number}
            className="border-t-2 border-[#1a1a18] pt-6"
          >
            {/* Step number — muted, serif, small */}
            <p className="font-display text-sm text-[#c4c2bd] font-light mb-4">
              {step.number}
            </p>
            <p className="text-sm font-medium text-[#1a1a18] mb-2">
              {step.title}
            </p>
            <p className="text-sm text-[#6b6b66] font-light leading-relaxed">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}