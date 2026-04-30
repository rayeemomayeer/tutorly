import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, credentials: "include" }),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getTutorReviews: builder.query<any[], string>({
      query: (tutorId) => `/reviews/${tutorId}`,
      providesTags: ["Review"],
    }),
    createReview: builder.mutation({
      query: ({ tutorId, rating, comment }) => ({
        url: `/reviews`,
        method: "POST",
        body: { tutorId, rating, comment },
      }),
      invalidatesTags: ["Review"],
    }),
    deleteReview: builder.mutation({
      query: (id: string) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review"],
    }),

  }),
});

export const {
  useGetTutorReviewsQuery,
  useCreateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;
