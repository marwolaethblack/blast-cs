"use client";
import { FunctionComponent } from "react";
import Image from "next/image";
import { PlayerDot } from "./player/PlayerDot";
import { useEffect, useRef, useState } from "react";
import { PlayByPlay } from "../../../api/play-by-play";
import { usePlayByPlay } from "../hooks/usePlayByPlay";
import { MatchEvent } from "./MatchEvent";
import Select from "react-select";
import { Arrow } from "./Arrow";
import { MatchLog } from "./match/MatchLog";
import { Controls } from "./map/Controls";

interface Props {
  playByPlay: PlayByPlay;
}

export const Map: FunctionComponent<Props> = ({ playByPlay }) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const playerRefs = useRef<Record<string, HTMLDivElement>>({});
  const [updateTrigger, setUpdateTrigger] = useState(0);
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
    shots,
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

    return () => {
      if (ref) {
        observer.unobserve(ref);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgRef.current]);

  function getPosX(pos_x: number) {
    return Math.abs(pos_x + 3453) / 7.0 - 10;
  }
  function getPosY(pos_y: number) {
    return Math.abs(pos_y - 2887) / 7.0 - 10;
  }

  // Trigger arrow update when players change
  useEffect(() => {
    setUpdateTrigger((prev) => prev + 1);
  }, [players, shots]);

  console.log("7877", shots);

  // z = -445 lower levele

  return (
    <div className="flex gap-2">
      <div>
        <Controls
          resetRound={resetRound}
          setSpeed={setSpeed}
          setStart={setStart}
          speed={speed}
        />
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
      <div className="relative bg-amber-400 max-w-[1024px] max-h-[1024px]">
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
              ref={(ref) => {
                if (ref) {
                  playerRefs.current[p.name] = ref;
                } else {
                  delete playerRefs.current[p.name];
                }
              }}
            />
          );
        })}
        {shots.map((s) => (
          <Arrow
            key={s.id}
            fromRef={{ current: playerRefs.current[s.attacker] }}
            toRef={{ current: playerRefs.current[s.victim] }}
            updateTrigger={updateTrigger}
          />
        ))}
      </div>
      <MatchLog eventLog={eventLog} round={roundIndex + 1} />
    </div>
  );
};
