
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`, credentials: "include" }),
    tagTypes: ["AdminUser", "AdminBooking", "AdminCategory"],
    endpoints: (builder) => ({
        getUsers: builder.query<any[], void>({
            query: () => "/admin/users",
            providesTags: ["AdminUser"],
        }),
        banUser: builder.mutation({
            query: (id: string) => ({
                url: `/admin/users/${id}/ban`,
                method: "PATCH",
            }),
            invalidatesTags: ["AdminUser"],
        }),
        unbanUser: builder.mutation({
            query: (id: string) => ({
                url: `/admin/users/${id}/unban`,
                method: "PATCH",
            }),
            invalidatesTags: ["AdminUser"],
        }),
        promoteUser: builder.mutation({
            query: ({ id, role }: { id: string; role: "tutor" | "admin" }) => ({
                url: `/admin/users/${id}/promote`,
                method: "PATCH",
                body: { role },
            }),
            invalidatesTags: ["AdminUser"],
        }),

        demoteUser: builder.mutation({
            query: ({ id, role }: { id: string; role: "student" | "tutor" }) => ({
                url: `/admin/users/${id}/demote`,
                method: "PATCH",
                body: { role },
            }),
            invalidatesTags: ["AdminUser"],
        }),
    }),
});

export const {
    useGetUsersQuery,
    useBanUserMutation,
    useUnbanUserMutation,
    usePromoteUserMutation,
    useDemoteUserMutation,
} = adminApi;