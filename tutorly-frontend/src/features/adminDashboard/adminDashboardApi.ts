import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminDashboardApi = createApi({
  reducerPath: "adminDashboardApi",
  baseQuery: fetchBaseQuery({  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, credentials: "include" }),
  tagTypes: ["AdminStats"],
  endpoints: (builder) => ({
    getStats: builder.query<any, void>({
      query: () => "/admin/stats",
      providesTags: ["AdminStats"],
    }),
  }),
});

export const { useGetStatsQuery } = adminDashboardApi;