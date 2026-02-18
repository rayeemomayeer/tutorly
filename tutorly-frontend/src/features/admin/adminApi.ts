
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`, credentials: "include" }),
    tagTypes: ["AdminUser", "AdminBooking", "AdminCategory"],
    endpoints: (builder) => ({
        getUsers: builder.query<any, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 5 }) => `/admin/users?page=${page}&limit=${limit}`,
            providesTags: ["AdminUser"],
        }),
        banUser: builder.mutation({
            query: (id: string) => ({
                url: `/admin/users/${id}/ban`,
                method: "PATCH",
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    adminApi.util.updateQueryData("getUsers", { page: 1, limit: 5 }, (draft: any) => {
                        const user = draft.data.find((u: any) => u.id === id);
                        if (user) user.banned = true;
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        unbanUser: builder.mutation({
            query: (id: string) => ({
                url: `/admin/users/${id}/unban`,
                method: "PATCH",
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    adminApi.util.updateQueryData("getUsers", { page: 1, limit: 5 }, (draft: any) => {
                        const user = draft.data.find((u: any) => u.id === id);
                        if (user) user.banned = false;
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        promoteUser: builder.mutation({
            query: ({ id, role }) => ({
                url: `/admin/users/${id}/promote`,
                method: "PATCH",
                body: { role },
            }),
            async onQueryStarted({ id, role }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    adminApi.util.updateQueryData("getUsers", { page: 1, limit: 5 }, (draft: any) => {
                        const user = draft.data.find((u: any) => u.id === id);
                        if (user) user.role = role;
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),


        demoteUser: builder.mutation({
            query: ({ id, role }: { id: string; role: "student" | "tutor" }) => ({
                url: `/admin/users/${id}/demote`,
                method: "PATCH",
                body: { role },
            }),
            async onQueryStarted({ id, role }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    adminApi.util.updateQueryData(
                        "getUsers",
                        { page: 1, limit: 5 },
                        (draft: any) => {
                            const user = draft.data.find((u: any) => u.id === id);
                            if (user) user.role = role;
                        }
                    )
                );

                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
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