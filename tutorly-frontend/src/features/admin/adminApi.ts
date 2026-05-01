
import { demoBaseQuery } from "@/lib/demoBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

type AdminUser = {
    id: string;
    name?: string | null;
    email?: string;
    role?: string;
    banned?: boolean;
};

type AdminUsersResponse = {
    data: AdminUser[];
    meta: {
        total?: number;
        totalPages: number;
    };
};

export const adminApi = createApi({
    reducerPath: "adminApi",
    baseQuery: demoBaseQuery(process.env.NEXT_PUBLIC_API_BASE_URL),
    tagTypes: ["AdminUser", "AdminBooking", "AdminCategory"],
    endpoints: (builder) => ({
        getUsers: builder.query<AdminUsersResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 5 }) => `/admin/users?page=${page}&limit=${limit}`,
            providesTags: ["AdminUser"],
        }),
        banUser: builder.mutation<unknown, string>({
            query: (id: string) => ({
                url: `/admin/users/${id}/ban`,
                method: "PATCH",
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    adminApi.util.updateQueryData("getUsers", { page: 1, limit: 5 }, (draft) => {
                        const user = draft.data.find((u) => u.id === id);
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
        unbanUser: builder.mutation<unknown, string>({
            query: (id: string) => ({
                url: `/admin/users/${id}/unban`,
                method: "PATCH",
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    adminApi.util.updateQueryData("getUsers", { page: 1, limit: 5 }, (draft) => {
                        const user = draft.data.find((u) => u.id === id);
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
        promoteUser: builder.mutation<unknown, { id: string; role: string }>({
            query: ({ id, role }) => ({
                url: `/admin/users/${id}/promote`,
                method: "PATCH",
                body: { role },
            }),
            async onQueryStarted({ id, role }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    adminApi.util.updateQueryData("getUsers", { page: 1, limit: 5 }, (draft) => {
                        const user = draft.data.find((u) => u.id === id);
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


        demoteUser: builder.mutation<unknown, { id: string; role: "student" | "tutor" }>({
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
                        (draft) => {
                            const user = draft.data.find((u) => u.id === id);
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
