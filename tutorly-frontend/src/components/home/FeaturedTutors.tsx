import Link from "next/link";


type FeaturedTutor = {
  id: string;
  initials: string;
  name: string;
  hourlyRate: number;
  subjects: string[];
  bio: string;
  rating: number;
  reviewCount: number;

  avatarClass: string;
};

// ─── Static data ───────────────────────────────────────────────────────────────
// TODO: Replace with a real fetch() call to your /api/tutors?featured=true endpoint.
// The component structure stays identical — just pass the fetched array as a prop.
const FEATURED_TUTORS: FeaturedTutor[] = [
  {
    id: "1",
    initials: "AR",
    name: "Ayesha Rahman",
    hourlyRate: 45,
    subjects: ["Mathematics", "Physics"],
    bio: "MSc Applied Math, 5 years tutoring IGCSE and A-Level students to top results.",
    rating: 4.9,
    reviewCount: 62,
    avatarClass: "bg-indigo-50 text-indigo-600",
  },
  {
    id: "2",
    initials: "KM",
    name: "Karim Mansoor",
    hourlyRate: 38,
    subjects: ["Chemistry", "Biology"],
    bio: "Medical grad helping students build real understanding, not just exam tricks.",
    rating: 4.8,
    reviewCount: 41,
    avatarClass: "bg-emerald-50 text-emerald-700",
  },
  {
    id: "3",
    initials: "SL",
    name: "Sophie Laroche",
    hourlyRate: 55,
    subjects: ["French", "English Lit"],
    bio: "Native French speaker, literature MA. Conversational fluency in 3 months.",
    rating: 5.0,
    reviewCount: 29,
    avatarClass: "bg-orange-50 text-orange-700",
  },
];


function TutorCard({ tutor }: { tutor: FeaturedTutor }) {
  return (
    <Link
      href={`/tutors/${tutor.id}`}
      className="group flex flex-col bg-white border border-[#e5e3de] rounded-xl p-5
                 hover:border-indigo-400 hover:-translate-y-0.5
                 transition-all duration-150 cursor-pointer"
    >
      {/* Avatar + name row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center
                      text-sm font-medium shrink-0 ${tutor.avatarClass}`}
        >
          {tutor.initials}
        </div>
        <div>
          <p className="text-sm font-medium text-[#1a1a18] leading-tight">
            {tutor.name}
          </p>
          <p className="text-xs text-[#9e9c97] mt-0.5">
            ${tutor.hourlyRate} / hour
          </p>
        </div>
      </div>

      {/* Subject tags */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {tutor.subjects.map((subject) => (
          <span
            key={subject}
            className="text-[11px] text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-[3px]"
          >
            {subject}
          </span>
        ))}
      </div>

      {/* Bio */}
      <p className="text-xs text-[#6b6b66] leading-relaxed font-light flex-1">
        {tutor.bio}
      </p>

      {/* Footer: rating + book CTA */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#f0ede8]">
        <span className="text-[11px] text-[#9e9c97]">
          ★ {tutor.rating} · {tutor.reviewCount} reviews
        </span>
        <span className="text-xs text-indigo-500 font-medium group-hover:text-indigo-700 transition-colors">
          Book →
        </span>
      </div>
    </Link>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────────
export function FeaturedTutors() {
  return (
    <section className="px-10 py-16">
      {/* Section header */}
      <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#9e9c97] mb-2">
        Featured tutors
      </p>
      <h2 className="font-display text-[34px] font-normal tracking-[-0.8px] text-[#1a1a18] leading-tight mb-10">
        Meet a few of the{" "}
        <em className="font-display italic font-light text-indigo-500">best</em>
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-4">
        {FEATURED_TUTORS.map((tutor) => (
          <TutorCard key={tutor.id} tutor={tutor} />
        ))}
      </div>

      {/* See all link */}
      <div className="mt-8">
        <Link
          href="/tutors"
          className="text-sm text-[#6b6b66] hover:text-[#1a1a18] transition-colors"
        >
          View all tutors →
        </Link>
      </div>
    </section>
  );
}