"use client";
import { FunctionComponent } from "react";
import { PlayerDot } from "../player/PlayerDot";
import { useEffect, useRef, useState } from "react";
import { PlayByPlay } from "../../../../api/play-by-play";
import { usePlayByPlay } from "../../hooks/usePlayByPlay";
import { Arrow } from "../Arrow";
import { MatchLog } from "../match/MatchLog";
import { Controls } from "./Controls";
import { Scoreboard } from "../match/Scoreboard";

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
    start,
    scoreboard,
    speed,
    setSpeed,
    shots,
    teams,
    mapLevel,
    map,
  } = usePlayByPlay({
    playByPlay,
  });

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

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <div className="relative w-full ">
        <div className="absolute left-[calc(50%-140px)] top-4">
          <Controls
            resetRound={resetRound}
            setSpeed={setSpeed}
            setStart={setStart}
            start={start}
            speed={speed}
            round={roundIndex}
            rounds={playByPlay.rounds.map((_, i) => ({
              label: `Round ${i + 1}`,
              value: i,
            }))}
            changeRound={changeRound}
          />
        </div>
        {/*  eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={map}
          alt="Match map"
          className="min-w-[400px] min-h-[400px]"
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
      <div className="flex flex-col gap-2">
        <Scoreboard players={players} scoreboard={scoreboard} teams={teams} />
        <MatchLog start={start} eventLog={eventLog} round={roundIndex + 1} />
      </div>
    </div>
  );
};
