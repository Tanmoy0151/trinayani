// Custom types for our application that won't conflict with Next.js internal types

// For blog edit page
export interface BlogEditParams {
  id: string;
}

// For job edit page
export interface JobEditParams {
  id: string;
}

// Generic page parameters interface that doesn't use "PageProps" name
export interface RouteParams<T> {
  params: T;
  searchParams?: Record<string, string | string[] | undefined>;
} 