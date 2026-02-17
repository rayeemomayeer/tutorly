
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/auth", credentials: "include" }),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({ url: "/sign-up/email", method: "POST", body }),
    }),
    login: builder.mutation({
      query: (body) => ({ url: "/sign-in/email", method: "POST", body }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/logout", method: "POST" }),
    }),
    me: builder.query<any, void>({
      query: () => "/me",
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
} = authApi;