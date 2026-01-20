import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CSTeam } from "../../../api/events/types";
import { match } from "ts-pattern";
import { PlayByPlay, RoundData } from "../../../api/play-by-play";
import { throttle } from "@tanstack/react-pacer";
import { Parsed } from "../../../api/event-parsers";
import { getCTSpawn, getTSpawn } from "../utils/spawns";
import { getScoreForRound, mergeScoreBoards } from "./useScoreBoard";

export interface Player {
  id: string;
  name: string;
  pos: number[];
  team: CSTeam;
  dead: boolean;
}

interface PlayerStats {
  kills: number;
  deaths: number;
  damage: number;
}

type Scoreboard = Record<CSTeam, Record<string, PlayerStats>>;

export const usePlayByPlay = ({ playByPlay }: { playByPlay: PlayByPlay }) => {
  const playersInTeams = useMemo(
    () =>
      Object.entries(playByPlay.players).reduce<Record<CSTeam, string[]>>(
        (acc, [player, team]) => {
          acc[team] = [...acc[team], player];
          return acc;
        },
        { TERRORIST: [], CT: [], Unassigned: [], Spectator: [] },
      ),
    [playByPlay.players],
  );

  const playersBaseState: Array<Player> = useMemo(() => {
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
  }, [playersInTeams]);

  const [roundIndex, setRoundIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [start, setStart] = useState(false);

  const [players, setPlayers] = useState<Array<Player>>(playersBaseState);
  const [shots, setShots] = useState<
    Array<{ id: string; attacker: string; victim: string }>
  >([]);
  const [eventLog, setEventLog] = useState<Parsed[]>([]);

  const [scoreboard, setScoreboard] = useState(
    getScoreForRound(playersBaseState.map((p) => p.name)),
  );

  const changeRound = (roundIndex: number) => {
    setPlayers(playersBaseState);
    setRoundIndex(roundIndex);
    setEventLog([]);
    setStart(false);
    setShots([]);
    entryIndexRef.current = 0;

    const scoresForPreviousRounds = playByPlay.rounds
      .slice(0, roundIndex)
      .map((r) =>
        getScoreForRound(
          playersBaseState.map((p) => p.name),
          r,
        ),
      );

    const total = scoresForPreviousRounds.reduce(
      (acc, scoreboard) => {
        return mergeScoreBoards(acc, scoreboard);
      },
      getScoreForRound(playersBaseState.map((p) => p.name)),
    );

    setScoreboard(total);
  };

  const resetRound = () => {
    changeRound(roundIndex);
  };

  const handleEvent = useCallback((e: Parsed) => {
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
        if (data) {
          const { attacker, victim } = data;
          setShots((prev) => [
            ...prev,
            {
              attacker: attacker.name,
              victim: victim.name,
              id: val.raw,
            },
          ]);

          const attackerZ = [...attacker.position].pop() || 0;
          const victimZ = [...victim.position].pop() || 0;

          if (attackerZ <= -445 || victimZ <= -445) {
            //bottom map
          } else {
            //top map
          }

          const team = data?.attacker.team;
          const name = data?.attacker.name;

          if (team && name) {
            // setScoreboard((prev) => ({
            //   ...prev,
            //   [team]: {
            //     ...prev[team],
            //     [name]: {
            //       ...prev[team][name],
            //       damage: prev[team][name].damage + data.damage,
            //     },
            //   },
            // }));
          }

          setPlayers((prev) =>
            prev.map((p) => {
              if (p.id === attacker.name) {
                return { ...p, pos: attacker.position };
              }

              if (p.id === victim.name) {
                return { ...p, pos: victim.position };
              }

              return p;
            }),
          );
        }
      })
      .with({ type: "kill" }, (val) => {
        const { data } = val;
        if (data) {
          setShots((prev) => [
            ...prev,
            {
              attacker: data.killer.name,
              victim: data.victim.name,
              id: val.raw,
            },
          ]);

          const team = data?.killer.team;
          const name = data?.killer.name;

          if (team && name) {
            // setScoreboard((prev) => ({
            //   ...prev,
            //   [team]: {
            //     ...prev[team],
            //     [name]: {
            //       ...prev[team][name],
            //       kills: prev[team][name].kills + 1,
            //     },
            //   },
            // }));
          }

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
        }
      })
      .otherwise(() => null);
  }, []);

  const intervalRef = useRef<NodeJS.Timeout>(undefined);
  const entryIndexRef = useRef<number>(0);

  useEffect(() => {
    const round = playByPlay.rounds[roundIndex];

    if (start) {
      intervalRef.current = setInterval(() => {
        const index = entryIndexRef.current;
        if (index > round.length - 1) {
          clearInterval(intervalRef.current);
          return;
        }

        setShots([]);
        setEventLog((prev) => [...prev, round[index]]);
        [round[index]].map(handleEvent);
        entryIndexRef.current++;
      }, 1000 / speed);
    }

    return () => clearInterval(intervalRef.current);
  }, [handleEvent, start, playByPlay.rounds, roundIndex, speed]);

  return {
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
  };
};
