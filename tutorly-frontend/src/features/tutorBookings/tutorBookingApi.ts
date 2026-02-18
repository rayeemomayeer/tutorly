
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const tutorBookingApi = createApi({
  reducerPath: "tutorBookingApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, credentials: "include" }),
  tagTypes: ["TutorBooking"],
  endpoints: (builder) => ({
    getTutorBookings: builder.query<any[], void>({
      query: () => "/bookings", // backend returns tutor-specific bookings based on session
      providesTags: ["TutorBooking"],
    }),
    completeBooking: builder.mutation({
      query: (id: string) => ({
        url: `/bookings/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["TutorBooking"],
    }),
    cancelBooking: builder.mutation({
      query: (id: string) => ({
        url: `/bookings/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["TutorBooking"],
    }),
  }),
});

export const {
  useGetTutorBookingsQuery,
  useCompleteBookingMutation,
  useCancelBookingMutation,
} = tutorBookingApi;