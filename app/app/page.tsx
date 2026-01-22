"use client";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MapProvider } from "./components/map/MapProvider";

export default function Home() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen items-center justify-center bg-gray-700 font-sans text-white">
        <MapProvider />
      </div>
    </QueryClientProvider>
  );
}
