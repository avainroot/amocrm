import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ILeads } from "../types";
import { viewState } from "./viewReducer";

export const amocrmApi = createApi({
  reducerPath: "amocrmApi",
  tagTypes: ["Leads", "Contacts", "Companies"],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
    prepareHeaders: (headers, { getState }) => {
      headers.set("Authorization", `Bearer ${process.env.AMOCRM_ACCESS_TOKEN}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getLeads: builder.query<ILeads, Partial<viewState>>({
      query: ({ page, limit }: viewState) => ({
        url: "leads",
        params: {
          page,
          limit,
          with: "contacts",
        },
      }),
      providesTags: (result, error, arg) => [{ type: "Leads" }],
    }),
    getCompanies: builder.query({
      query: () => ({
        url: "companies",
        params: {
          page: 1,
          limit: 250,
        },
      }),
      providesTags: (result, error, arg) => [{ type: "Companies" }],
    }),
    getContacts: builder.query({
      query: () => ({
        url: "contacts",
        params: {
          page: 1,
          limit: 250,
        },
      }),
      providesTags: (result, error, arg) => [{ type: "Contacts" }],
    }),
  }),
});

export const { useGetLeadsQuery, useGetContactsQuery, useGetCompaniesQuery } =
  amocrmApi;
