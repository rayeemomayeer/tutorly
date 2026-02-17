
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api", credentials: "include" }),
  tagTypes: ["AdminUser", "AdminBooking", "AdminCategory"],
  endpoints: (builder) => ({
    getUsers: builder.query<any[], void>({
      query: () => "/admin/users",
      providesTags: ["AdminUser"],
    }),
    banUser: builder.mutation({
      query: (id: string) => ({
        url: `/admin/users/${id}/ban`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminUser"],
    }),
    unbanUser: builder.mutation({
      query: (id: string) => ({
        url: `/admin/users/${id}/unban`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminUser"],
    }),
    promoteUser: builder.mutation({
      query: (id: string) => ({
        url: `/admin/users/${id}/promote`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminUser"],
    }),
    demoteUser: builder.mutation({
      query: (id: string) => ({
        url: `/admin/users/${id}/demote`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminUser"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useBanUserMutation,
  useUnbanUserMutation,
  usePromoteUserMutation,
  useDemoteUserMutation,
} = adminApi;