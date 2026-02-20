import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const adminCategoryApi = createApi({
    reducerPath: "adminCategoryApi",
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL, credentials: "include" }),
    tagTypes: ["AdminCategory"],
    endpoints: (builder) => ({
        getCategories: builder.query<any[], void>({
            query: () => "/category",
            providesTags: ["AdminCategory"],
        }),
        createCategory: builder.mutation({
            query: (body) => ({
                url: "/category",
                method: "POST",
                body,
            }),
            async onQueryStarted(body, { dispatch, queryFulfilled }) {

                const patchResult = dispatch(
                    adminCategoryApi.util.updateQueryData("getCategories", undefined, (draft) => {
                        draft.push({ id: "temp-id", name: body.name });
                    })
                );
                try {
                    const { data: created } = await queryFulfilled;

                    dispatch(
                        adminCategoryApi.util.updateQueryData("getCategories", undefined, (draft) => {
                            const idx = draft.findIndex((c) => c.id === "temp-id");
                            if (idx !== -1) draft[idx] = created;
                        })
                    );
                } catch {
                    patchResult.undo();
                }
            },
        }),
        updateCategory: builder.mutation({
            query: ({ id, name }: { id: string; name: string }) => ({
                url: `/category/${id}`,
                method: "PATCH",
                body: { name },
            }),
            async onQueryStarted({ id, name }, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    adminCategoryApi.util.updateQueryData("getCategories", undefined, (draft) => {
                        const cat = draft.find((c) => c.id === id);
                        if (cat) cat.name = name;
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
            },
        }),
        deleteCategory: builder.mutation({
            query: (id: string) => ({
                url: `/category/${id}`,
                method: "DELETE",
            }),
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    adminCategoryApi.util.updateQueryData("getCategories", undefined, (draft) => {
                        return draft.filter((c) => c.id !== id);
                    })
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
    useGetCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = adminCategoryApi;