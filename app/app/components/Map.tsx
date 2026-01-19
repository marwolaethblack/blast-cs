"use client";
import { FunctionComponent } from "react";
import Image from "next/image";
import { PlayerDot } from "./player/PlayerDot";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlayByPlay, RoundData } from "../../../api/play-by-play";
import { match, P } from "ts-pattern";
import { CSTeam } from "../../../api/events/types";
import { usePlayByPlay } from "../hooks/usePlayers";
import { MatchEvent } from "./MatchEvent";

interface Props {
  playByPlay: PlayByPlay;
}

export const Map: FunctionComponent<Props> = ({ playByPlay }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);

  const [start, setStart] = useState(false);
  const { players, eventLog } = usePlayByPlay({ playByPlay, start });

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
    <div className="flex gap-2">
      <div>
        <button onClick={() => setStart(true)}>Start</button>
        <button onClick={() => setStart(false)}>Stop</button>
      </div>
      <div className="relative bg-amber-400">
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
              color={p.team === "CT" ? "bg-blue-500" : "bg-amber-400"}
            />
          );
        })}
      </div>
      <div>
        {eventLog.map((e) => (
          <MatchEvent event={e} key={e.raw} />
        ))}
      </div>
    </div>
  );
};
