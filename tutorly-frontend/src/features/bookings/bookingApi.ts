import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, credentials: "include" }),
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    getBookings: builder.query<any, void>({
      query: () => "/bookings",
      providesTags: ["Booking"],
    }),
    getTutorBookings: builder.query<any, string>({
      query: (tutorId) => `/tutors/${tutorId}/bookings`,
      providesTags: ["Booking"],
    }),
    createBooking: builder.mutation({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),
    cancelBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Booking"],
    }),
    completeBooking: builder.mutation({
      query: (id) => ({
        url: `/bookings/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useGetTutorBookingsQuery,
  useCreateBookingMutation,
  useCancelBookingMutation,
  useCompleteBookingMutation,
} = bookingApi;
