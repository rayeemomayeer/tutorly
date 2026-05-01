import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import TutorList from "@/features/tutors/TutorList";

export const metadata = {
  title: "Browse Tutors — Tutorly",
  description: "Find expert tutors across any subject and book a session instantly.",
};

export default function TutorsPage() {
  return <>

  <TutorList/>

  </>;
}