import { demoBaseQuery } from "@/lib/demoBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

type Review = {
  id: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment?: string;
  student?: {
    name?: string;
  };
};

type CreateReviewPayload = {
  tutorId: string;
  rating: number;
  comment: string;
};

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: demoBaseQuery(process.env.NEXT_PUBLIC_API_BASE_URL),
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getTutorReviews: builder.query<Review[], string>({
      query: (tutorId) => `/reviews/${tutorId}`,
      providesTags: ["Review"],
    }),
    createReview: builder.mutation<Review, CreateReviewPayload>({
      query: ({ tutorId, rating, comment }) => ({
        url: `/reviews`,
        method: "POST",
        body: { tutorId, rating, comment },
      }),
      invalidatesTags: ["Review"],
    }),
    deleteReview: builder.mutation<unknown, string>({
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
