"use client";
import { FunctionComponent } from "react";
import Image from "next/image";
import { PlayerDot } from "./PlayerDot";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlayByPlay, RoundData } from "../../../api/play-by-play";
import { match, P } from "ts-pattern";
import { CSTeam } from "../../../api/events/types";
import { usePlayers } from "../hooks/usePlayers";

interface Props {
  playByPlay: PlayByPlay;
}

export const Map: FunctionComponent<Props> = ({ playByPlay }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);

  const [start, setStart] = useState(false);
  const { players, currentEvents } = usePlayers(
    playByPlay.rounds[1] || {},
    playByPlay.players,
    start,
  );

  useEffect(() => {
    const ref = imgRef.current;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width } = entry.contentRect;
        const newScale = width / 1024;
        setScale(newScale);
      }
    });

    if (ref) {
      observer.observe(ref);
    }

    return () => ref && observer.unobserve(ref);
  }, [imgRef.current]);

  function getPosX(pos_x: number) {
    return Math.abs(pos_x + 3453) / 7.0 - 10;
  }
  function getPosY(pos_y: number) {
    return Math.abs(pos_y - 2887) / 7.0 - 10;
  }

  // z = -445 lower levele

  return (
    <div>
      <button onClick={() => setStart(true)}>Start</button>
      <button onClick={() => setStart(false)}>Stop</button>
      <div className="relative">
        <Image
          src="/overviews/de_nuke_radar.png"
          alt="Next.js logo"
          width={1024}
          height={1024}
          ref={imgRef}
        />
        {players.map((p) => {
          return (
            <PlayerDot
              dead={p.dead}
              key={p.id}
              left={getPosX(p.pos[0]) * scale}
              top={getPosY(p.pos[1]) * scale}
              color={p.team === "CT" ? "bg-blue-500" : "bg-red-500"}
            />
          );
        })}
      </div>
      <div>
        {currentEvents.map((e) => (
          <p key={e.raw}>{e.raw}</p>
        ))}
      </div>
    </div>
  );
};
