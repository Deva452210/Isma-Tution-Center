import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const materialsApi = createApi({
  reducerPath: 'materialsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000' 
  }),
  endpoints: (builder) => ({
    getMaterials: builder.query({
      query: ({ grade, category, subject }) => `/api/materials?grade=${grade}&category=${category}&subject=${subject}`,
      // Keep data cached for 5 minutes
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetMaterialsQuery } = materialsApi;
