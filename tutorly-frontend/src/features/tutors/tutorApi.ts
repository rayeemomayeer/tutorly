import { demoBaseQuery } from "@/lib/demoBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

export type TutorFilters = {
  page?: number;
  limit?: number;
  categoryId?: string;
  minRate?: number;
  maxRate?: number;
  search?: string;
};

export type TutorSubject = {
  id: string;
  name: string;
};

export type Tutor = {
  id: string;
  user: {
    id: string;
    name: string;
    image?: string;
    tutorReviews?: { rating: number }[];
  };
  bio: string;
  hourlyRate: number;
  subjects: TutorSubject[];
  tutorReviews?: { rating: number }[];
  averageRating?: number;
  reviewCount?: number;
};

export type TutorListResponse = {
  data: Tutor[];
  meta?: {
    total?: number;
    totalPages?: number;
  };
};

export const tutorApi = createApi({
  reducerPath: "tutorApi",
  baseQuery: demoBaseQuery(process.env.NEXT_PUBLIC_API_BASE_URL),
  tagTypes: ["Tutor"],
  endpoints: (builder) => ({
    getTutors: builder.query<TutorListResponse, TutorFilters>({
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
    getFeaturedTutors: builder.query<TutorListResponse, void>({
      query: () => "/tutors/featured?limit=3",
      providesTags: ["Tutor"],
    }),
    getTutorById: builder.query<Tutor, string>({
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
      query: ({ id, bio, hourlyRate, categories }) => ({
        url: `/tutors/profile/${id}`,
        method: "PUT",
        body: {bio, hourlyRate, categories},
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
  useGetFeaturedTutorsQuery,
  useGetTutorByIdQuery,
  useCreateTutorProfileMutation,
  useUpdateTutorProfileMutation,
  useDeleteTutorProfileMutation,
} = tutorApi;
