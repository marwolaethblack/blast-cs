import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CSTeam } from "../../../api/events/types";
import { match } from "ts-pattern";
import { PlayByPlay, RoundData } from "../../../api/play-by-play";
import { throttle } from "@tanstack/react-pacer";
import { Parsed } from "../../../api/event-parsers";
import { getCTSpawn, getTSpawn } from "../utils/spawns";

export interface Player {
  id: string;
  name: string;
  pos: number[];
  team: CSTeam;
  dead: boolean;
}

export const usePlayers = (
  round: RoundData,
  initialPlayers: Record<string, CSTeam>,
  start: boolean,
) => {
  const playersBaseState = useMemo(() => {
    const playersInTeams = Object.entries(initialPlayers).reduce<
      Record<CSTeam, string[]>
    >(
      (acc, [player, team]) => {
        acc[team] = [...acc[team], player];
        return acc;
      },
      { TERRORIST: [], CT: [], Unassigned: [], Spectator: [] },
    );

    return [
      ...playersInTeams.CT.map((player, index) => ({
        id: player || "",
        name: player || "",
        pos: getCTSpawn(index),
        team: "CT" as CSTeam,
        dead: false,
      })),

      ...playersInTeams.TERRORIST.map((player, index) => ({
        id: player || "",
        name: player || "",
        pos: getTSpawn(index),
        team: "TERRORIST" as CSTeam,
        dead: false,
      })),
    ];
  }, [initialPlayers]);

  const [players, setPlayers] = useState<Array<Player>>(playersBaseState);
  const [currentEvents, setCurrentEvents] = useState<Parsed[]>([]);

  const handleEvent = useCallback(
    (e: Parsed) => {
      console.log("@@@", e);
      match(e)
        .with({ type: "player-team" }, (val) => {
          const { data } = val;
          setPlayers((prev) =>
            prev.map((p) => {
              if (p.id === data?.player) {
                return { ...p, team: data.toTeam, pos: [0, 0, 0] };
              }

              return p;
            }),
          );
        })
        .with({ type: "attack" }, (val) => {
          const { data } = val;
          setPlayers((prev) =>
            prev.map((p) => {
              if (p.id === data?.attacker.name) {
                return { ...p, pos: data.attacker.position };
              }

              if (p.id === data?.victim.name) {
                return { ...p, pos: data.victim.position };
              }

              return p;
            }),
          );
        })
        .with({ type: "kill" }, (val) => {
          const { data } = val;
          setPlayers((prev) =>
            prev.map((p) => {
              if (p.id === data?.killer.name) {
                return { ...p, pos: data.killer.position };
              }

              if (p.id === data?.victim.name) {
                return { ...p, pos: data.victim.position, dead: true };
              }

              return p;
            }),
          );
        })
        .with({ type: "round-end" }, (val) => {
          setPlayers(playersBaseState);
        })
        .otherwise(() => null);
    },
    [playersBaseState],
  );

  const intervalRef = useRef<NodeJS.Timeout>(undefined);
  const entryIndexRef = useRef<number>(0);

  useEffect(() => {
    const entries = Object.entries(round);

    console.log("@@", intervalRef.current, start);

    if (start) {
      intervalRef.current = setInterval(() => {
        if (entryIndexRef.current >= entries.length - 1) {
          clearInterval(intervalRef.current);
        }
        setCurrentEvents(entries[entryIndexRef.current][1]);
        entries[entryIndexRef.current][1].map(handleEvent);
        entryIndexRef.current++;
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [round, handleEvent, start]);

  console.log("@@@", players);

  return { players, currentEvents };
};
