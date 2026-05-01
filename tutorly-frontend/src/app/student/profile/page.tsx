"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

type StudentProfile = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

function getInitials(name?: string, email?: string) {
  const source = name?.trim() || email?.trim() || "Student";

  return source
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function StudentProfilePage() {
  const student = useSelector(
    (state: RootState) => state.auth.user as StudentProfile | null
  );

  if (!student) {
    return (
      <div className="p-6">
        <p>Loading profile...</p>
      </div>
    );
  }

  const profileItems = [
    { label: "Name", value: student.name || "Not provided" },
    { label: "Email", value: student.email || "Not provided" },
    { label: "Role", value: student.role || "student" },
    { label: "User ID", value: student.id || "Not available" },
  ];

  return (
    <div className="p-6">
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1a1a18] text-lg font-semibold text-[#fafaf8]">
              {getInitials(student.name, student.email)}
            </div>
            <div>
              <CardTitle className="text-2xl">
                {student.name || "Student Profile"}
              </CardTitle>
              <CardDescription>{student.email || "No email found"}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <Badge variant="secondary" className="capitalize">
            {student.role || "student"}
          </Badge>

          <div className="grid gap-4 sm:grid-cols-2">
            {profileItems.map((item) => (
              <div
                key={item.label}
                className="rounded-md border border-[#e5e3de] p-4"
              >
                <p className="text-xs font-medium uppercase text-[#6b6b66]">
                  {item.label}
                </p>
                <p className="mt-1 break-words text-sm text-[#1a1a18]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
