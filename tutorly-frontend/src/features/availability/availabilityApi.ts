import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const availabilityApi = createApi({
  reducerPath: "availabilityApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, credentials: "include" }),
  tagTypes: ["Availability"],
  endpoints: (builder) => ({
    getAvailability: builder.query<any, string>({
      query: (tutorId) => `/tutors/${tutorId}/availability`,
      providesTags: ["Availability"],
    }),
    setAvailability: builder.mutation({
      query: ({ tutorId, slots }) => ({
        url: `/tutors/${tutorId}/availability`,
        method: "POST",
        body: slots,
      }),
      invalidatesTags: ["Availability"],
    }),
  }),
});

export const { useGetAvailabilityQuery, useSetAvailabilityMutation } = availabilityApi;
