import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://whiteboard-app-server-six.vercel.app",
  }),
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
      query: (payload) => ({
        url: "/drawings",
        method: "POST",
        body: payload,
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

    deleteDrawing: builder.mutation({
      query: (id) => ({
        url: `/drawings/${id}`,
        method: "DELETE",
        body: { id },
      }),
      invalidatesTags: ["Drawings"],
    }),
  }),
});

export const {
  useGetAllDrawingsQuery,
  useGetSingleDrawingsQuery,
  useCreateDrawingMutation,
  useUpdateDrawingMutation,
  useDeleteDrawingMutation,
} = appApi;
