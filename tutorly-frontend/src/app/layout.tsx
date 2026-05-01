import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import SessionProvider from "@/features/auth/SessionProvider";
import { Toaster } from "@/components/ui/sonner";


const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz"],
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Tutorly — Find your perfect tutor",
  description:
    "Book 1-on-1 sessions with expert tutors across any subject. No back-and-forth, no hassle.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${dmSans.variable} antialiased p-5`}
      >
        
        <Providers>
          <SessionProvider>
            {children}
            <Toaster />
          </SessionProvider>

        </Providers>


      </body>
    </html>
  );
}
