import { demoBaseQuery } from "@/lib/demoBaseQuery";
import { createApi } from "@reduxjs/toolkit/query/react";

type AdminCategory = {
    id: string;
    name: string;
};

export const adminCategoryApi = createApi({
    reducerPath: "adminCategoryApi",
    baseQuery: demoBaseQuery(process.env.NEXT_PUBLIC_API_BASE_URL),
    tagTypes: ["AdminCategory"],
    endpoints: (builder) => ({
        getCategories: builder.query<AdminCategory[], void>({
            query: () => "/category",
            providesTags: ["AdminCategory"],
        }),
        createCategory: builder.mutation<AdminCategory, { name: string }>({
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
        updateCategory: builder.mutation<unknown, { id: string; name: string }>({
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
        deleteCategory: builder.mutation<unknown, string>({
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
