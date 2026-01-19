"use client";
import { useState } from "react";
import { Map } from "./components/Map";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { MapProvider } from "./components/MapProvider";

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black ">
        <MapProvider />
      </div>
    </QueryClientProvider>
  );
}
