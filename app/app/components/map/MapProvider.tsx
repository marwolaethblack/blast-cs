"use client";
import { useQuery } from "@tanstack/react-query";
import { PlayByPlay } from "../../../../api/play-by-play";
import { Map } from "./Map";

export const MapProvider = () => {
  const query = useQuery<PlayByPlay>({
    queryKey: ["play-by-play"],
    queryFn: async () => {
      const response = await fetch(
        `http://localhost:${process.env.PORT || 10000}/play-by-play`,
      );
      return await response.json();
    },
  });

  if (query.isLoading) {
    return <p>Loading</p>;
  }

  if (query.data) {
    return <Map playByPlay={query.data} />;
  }

  return <p>Error</p>;
};
