"use client";

import { ReactNode, useEffect } from "react";
import { useGetSessionQuery } from "./authApi";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "./authSlice";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isError } = useGetSessionQuery();
  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.user) {
      dispatch(setUser(data.user)); 
    } else if (isError) {
      dispatch(clearUser()); 
    }
  }, [data, isError, dispatch]);

  if (isLoading) {
    return <p>Loading session...</p>; 
  }

  return <>{children}</>;
}