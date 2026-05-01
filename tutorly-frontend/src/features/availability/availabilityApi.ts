import { demoBaseQuery } from "@/lib/demoBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

type AvailabilitySlot = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  status: string;
};

type AvailabilityPayload = Omit<AvailabilitySlot, "id" | "status">;

export const availabilityApi = createApi({
  reducerPath: "availabilityApi",
  baseQuery: demoBaseQuery(process.env.NEXT_PUBLIC_API_BASE_URL),
  tagTypes: ["Availability"],
  endpoints: (builder) => ({
    getAvailability: builder.query<AvailabilitySlot[], string>({
      query: (tutorId) => `/tutors/${tutorId}/availability`,
      providesTags: ["Availability"],
    }),
    setAvailability: builder.mutation<unknown, { tutorId: string; slots: AvailabilityPayload[] }>({
      query: ({ tutorId, slots }) => ({
        url: `/tutors/${tutorId}/availability`,
        method: "POST",
        body: slots,
      }),
      invalidatesTags: ["Availability"],
    }),
    updateAvailability: builder.mutation<unknown, { tutorId: string; slotId: string; slot: AvailabilityPayload }>({
      query: ({ tutorId, slotId, slot }) => ({
        url: `/tutors/${tutorId}/availability/${slotId}`,
        method: "PUT",
        body: slot,
      }),
      invalidatesTags: ["Availability"],
    }),
    deleteAvailability: builder.mutation<unknown, { tutorId: string; slotId: string }>({
      query: ({ tutorId, slotId }) => ({
        url: `/tutors/${tutorId}/availability/${slotId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Availability"],
    }),

  }),
});

export const { useGetAvailabilityQuery, useSetAvailabilityMutation, useUpdateAvailabilityMutation, useDeleteAvailabilityMutation } = availabilityApi;
