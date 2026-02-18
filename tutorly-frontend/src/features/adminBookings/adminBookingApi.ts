
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminBookingApi = createApi({
  reducerPath: "adminBookingApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`, credentials: "include" }),
  tagTypes: ["AdminBooking"],
  endpoints: (builder) => ({
    getAllBookings: builder.query<any[], void>({
      query: () => "/bookings/admin/all",
      providesTags: ["AdminBooking"],
    }),
    cancelBooking: builder.mutation({
      query: (id: string) => ({
        url: `/bookings/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminBooking"],
    }),
    completeBooking: builder.mutation({
      query: (id: string) => ({
        url: `/bookings/${id}/complete`,
        method: "PATCH",
      }),
      invalidatesTags: ["AdminBooking"],
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useCancelBookingMutation,
  useCompleteBookingMutation,
} = adminBookingApi;