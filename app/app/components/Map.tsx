"use client";

import { FunctionComponent } from "react";
import Image from "next/image";
import { PlayerDot } from "./PlayerDot";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FAFA } from "../../../shared/types";

export const Map: FunctionComponent = () => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);

  const a: FAFA = { a: "fas" };

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const newScale = width / 1024;
        setScale(newScale);
      }
    });

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => imgRef.current && observer.unobserve(imgRef.current);
  }, [imgRef.current]);

  // top left
  const x_offset = -3453;
  const y_offset = 2887;

  function getPosX(pos_x: number) {
    return Math.abs(pos_x + 3453) / 7.0 - 10;
  }
  function getPosY(pos_y: number) {
    return Math.abs(pos_y - 2887) / 7.0 - 10;
  }

  const posa = getPosX(1574);
  const posb = getPosY(-2292);

  const query = useQuery({
    queryKey: ["play-by-play"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3333/play-by-play");
      return await response.json();
    },
  });

  console.log(query.data);
  // z = -445 lower levele

  if (query.isLoading) {
    return <div>Loading</div>;
  }

  return (
    <div className="relative">
      <Image
        src="/overviews/de_nuke_radar.png"
        alt="Next.js logo"
        width={1024}
        height={1024}
        ref={imgRef}
      />
      <PlayerDot left={posa * scale} top={posb * scale} color="bg-blue-500" />
    </div>
  );
};
