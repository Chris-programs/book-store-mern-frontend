import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

// Keep token logic in one place
const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/books`,
  credentials: 'include', // send cookies for cross-origin requests
  prepareHeaders: (Headers) => {
    const token = localStorage.getItem('token'); // store token in localstorage for authentication
    if (token) {
      Headers.set('Authorization', `Bearer ${token}`); // For authorization, token tells server what I allow to do
    }
    return Headers;
  },
});

const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery,
  tagTypes: ['Books'],
  endpoints: (builder) => ({
    fetchAllBooks: builder.query({
      query: () => '/',
      providesTags: ['Books'],
    }),
    fetchBookById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Books', id }],
    }),
    addBook: builder.mutation({
      query: (newBook) => ({
        url: `/create-book`,
        method: 'POST',
        body: newBook,
      }),
      invalidatesTags: ['Books'],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...rest }) => ({
        url: `/edit/${id}`,
        method: 'PUT',
        body: rest,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      invalidatesTags: ['Books'],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Books'],
    }),
  }),
});

export const {
  useFetchAllBooksQuery,
  useFetchBookByIdQuery,
  useAddBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
} = booksApi;
export default booksApi;
