
"use client";
import { useMeQuery } from "./authApi";

export function useSession() {
  const { data: session, isLoading } = useMeQuery();
  return { session, isLoading };
}