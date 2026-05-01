import { demoBaseQuery } from "@/lib/demoBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

type Booking = {
  id: string;
  status: string;
  scheduledAt: string;
  student?: { name?: string };
  tutor?: { name?: string };
};

type CreateBookingPayload = {
  tutorId: string;
  scheduledAt: string;
  slotId: string;
};

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: demoBaseQuery(process.env.NEXT_PUBLIC_API_BASE_URL),
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      query: () => "/bookings",
      providesTags: ["Booking"],
    }),
    getTutorBookings: builder.query<Booking[], string>({
      query: (tutorId) => `/tutors/${tutorId}/bookings`,
      providesTags: ["Booking"],
    }),
    createBooking: builder.mutation<Booking, CreateBookingPayload>({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking"],
    }),
    cancelBooking: builder.mutation<Booking, string>({
      query: (id) => ({
        url: `/bookings/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Booking"],
    }),
    completeBooking: builder.mutation<Booking, string>({
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
