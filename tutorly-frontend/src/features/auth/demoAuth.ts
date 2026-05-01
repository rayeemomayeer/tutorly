export type DemoRole = "student" | "tutor" | "admin";

export const DEMO_ACCOUNTS: Record<
  DemoRole,
  { label: string; email: string; password: string; redirectTo: string }
> = {
  student: {
    label: "Demo Student",
    email: "student@tutorly.com",
    password: "StudentPass123!",
    redirectTo: "/student",
  },
  tutor: {
    label: "Demo Tutor",
    email: "tutor@tutorly.com",
    password: "TutorPass123!",
    redirectTo: "/tutors",
  },
  admin: {
    label: "Demo Admin",
    email: "admin@tutorly.com",
    password: "AdminPass123!",
    redirectTo: "/admin",
  },
};

const DEMO_EMAILS = new Set(
  Object.values(DEMO_ACCOUNTS).map((account) => account.email)
);

export const DEMO_BLOCKED_ACTION_MESSAGE =
  "Demo users can only perform POST actions. This action is disabled in demo mode.";

export function isDemoEmail(email?: string | null) {
  return email ? DEMO_EMAILS.has(email) : false;
}
