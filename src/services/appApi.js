import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/" }),
  endpoints: (builder) => ({
    getAllDrawings: builder.query({
      query: () => `drawings`,
    }),
  }),
});

export const { useGetAllDrawingsQuery } = appApi;
