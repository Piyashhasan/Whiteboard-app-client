import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000" }),
  tagTypes: ["Drawings"],

  endpoints: (builder) => ({
    getAllDrawings: builder.query({
      query: () => `/drawings`,
      providesTags: ["Drawings"],
    }),

    getSingleDrawings: builder.query({
      query: (id) => `/drawings/${id}`,
    }),

    createDrawing: builder.mutation({
      query: (name) => ({
        url: "/drawings",
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Drawings"],
    }),

    updateDrawing: builder.mutation({
      query: ({ id, elements }) => ({
        url: `/drawings/${id}`,
        method: "PATCH",
        body: { elements },
      }),
    }),
  }),
});

export const {
  useGetAllDrawingsQuery,
  useGetSingleDrawingsQuery,
  useCreateDrawingMutation,
  useUpdateDrawingMutation,
} = appApi;
