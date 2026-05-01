
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type AuthUser = {
  id: string;
  role: "student" | "tutor" | "admin";
  name?: string;
  email?: string;
  tutorId?: string;
  tutor?: { id?: string };
  tutorProfile?: { id?: string };
};

type SessionResponse = {
  user: AuthUser;
};

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = LoginPayload & {
  name: string;
};

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Session"],
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`, credentials: "include" }),
  endpoints: (builder) => ({
    register: builder.mutation<unknown, RegisterPayload>({
      query: (body) => ({ url: "/sign-up/email", method: "POST", body }),
      invalidatesTags: ["Session"],
    }),
    login: builder.mutation<unknown, LoginPayload>({
      query: (body) => ({ url: "/sign-in/email", method: "POST", body }),
      invalidatesTags: ["Session"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/sign-out", method: "POST" }),
      invalidatesTags: ["Session"],
    }),
    getSession: builder.query<SessionResponse, void>({
      query: () => "/get-session",
      providesTags: ["Session"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetSessionQuery,
} = authApi;
