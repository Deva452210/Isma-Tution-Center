import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const materialsApi = createApi({
  reducerPath: 'materialsApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'https://script.google.com/macros/s/AKfycbxU0zXHGva3WDb_Jd032fjYY9044K-HbGWFWq6aY96cF77WoVkkujro9dR-Y5t3wYGN/exec' 
  }),
  endpoints: (builder) => ({
    getMaterials: builder.query({
      query: ({ grade, category, subject }) => `?grade=${grade}&category=${category}&subject=${subject}`,
      // Keep data cached for 5 minutes
      keepUnusedDataFor: 300,
    }),
  }),
});

export const { useGetMaterialsQuery } = materialsApi;
