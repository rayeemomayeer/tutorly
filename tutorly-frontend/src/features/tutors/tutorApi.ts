import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type TutorFilters = {
  page?: number;
  limit?: number;
  categoryId?: string;
  minRate?: number;
  maxRate?: number;
  search?: string;
};

export const tutorApi = createApi({
  reducerPath: "tutorApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }), // Adjust the base URL as needed
  tagTypes: ["Tutor"],
  endpoints: (builder) => ({
    getTutors: builder.query<any, TutorFilters>({
      query: ({ page = 1, limit = 10, categoryId, minRate, maxRate, search }) => {
        const params = new URLSearchParams();
        params.set("page", page.toString());
        params.set("limit", limit.toString());
        if (categoryId) params.set("categoryId", categoryId);
        if (minRate !== undefined) params.set("minRate", minRate.toString());
        if (maxRate !== undefined) params.set("maxRate", maxRate.toString());
        if (search) params.set("search", search);

        return `/tutors?${params.toString()}`;
      },
      providesTags: ["Tutor"],
    }),
    getTutorById: builder.query<any, string>({
      query: (id) => `/tutors/${id}`,
      providesTags: ["Tutor"],
    }),
    createTutorProfile: builder.mutation({
      query: (body) => ({
        url: "/tutors/profile",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tutor"],
    }),
    updateTutorProfile: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/tutors/profile/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Tutor"],
    }),
    deleteTutorProfile: builder.mutation({
      query: (id) => ({
        url: `/tutors/profile/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tutor"],
    }),
  }),
});

export const {
  useGetTutorsQuery,
  useGetTutorByIdQuery,
  useCreateTutorProfileMutation,
  useUpdateTutorProfileMutation,
  useDeleteTutorProfileMutation,
} = tutorApi;