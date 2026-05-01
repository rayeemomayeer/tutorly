import {
  BaseQueryApi,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";
import {
  DEMO_BLOCKED_ACTION_MESSAGE,
  isDemoEmail,
} from "@/features/auth/demoAuth";

type AuthState = {
  auth?: {
    user?: {
      email?: string | null;
    } | null;
  };
};

function getMethod(args: string | FetchArgs) {
  if (typeof args === "string") return "GET";

  return (args.method ?? "GET").toUpperCase();
}

export function demoBaseQuery(baseUrl?: string) {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    credentials: "include",
  });

  return async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: object) => {
    const state = api.getState() as AuthState;
    const method = getMethod(args);

    if (isDemoEmail(state.auth?.user?.email) && method !== "GET" && method !== "POST") {
      toast.warning(DEMO_BLOCKED_ACTION_MESSAGE);

      return {
        error: {
          status: "CUSTOM_ERROR",
          error: DEMO_BLOCKED_ACTION_MESSAGE,
        },
      };
    }

    return rawBaseQuery(args, api, extraOptions);
  };
}
