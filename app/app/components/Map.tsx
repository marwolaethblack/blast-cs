"use client";
import { FunctionComponent } from "react";
import Image from "next/image";
import { PlayerDot } from "./player/PlayerDot";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlayByPlay, RoundData } from "../../../api/play-by-play";
import { match, P } from "ts-pattern";
import { CSTeam } from "../../../api/events/types";
import { usePlayByPlay } from "../hooks/usePlayByPlay";
import { MatchEvent } from "./MatchEvent";
import Select from "react-select";

interface Props {
  playByPlay: PlayByPlay;
}

export const Map: FunctionComponent<Props> = ({ playByPlay }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);

  const {
    players,
    eventLog,
    changeRound,
    resetRound,
    roundIndex,
    setStart,
    scoreboard,
    speed,
    setSpeed,
  } = usePlayByPlay({
    playByPlay,
  });

  console.log("(((", scoreboard);

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
        <button onClick={resetRound}>Reset</button>
        <div className="flex gap-2">
          <button onClick={() => setSpeed((prev) => prev - 0.25)}>-</button>
          {speed}
          <button onClick={() => setSpeed((prev) => prev + 0.25)}>+</button>
        </div>
        <Select
          options={playByPlay.rounds.map((_, i) => ({
            label: `Round ${i + 1}`,
            value: i,
          }))}
          onChange={(val) => {
            console.log(val);
            changeRound(val?.value || 0);
          }}
        />
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
              team={p.team}
              name={p.name}
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
