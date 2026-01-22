import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CSTeam } from "../../../api/events/types";
import { match } from "ts-pattern";
import { PlayByPlay } from "../../../api/play-by-play";
import { Parsed } from "../../../api/event-parsers";
import { getCTSpawn, getTSpawn } from "../utils/spawns";
import { getScoreForRound, mergeScoreBoards } from "../utils/scoreBoard";
import { useMap } from "./useMap";

export interface Player {
  id: string;
  name: string;
  pos: number[];
  team: CSTeam;
  dead: boolean;
}

const getPlayersBaseState = (players: string[], team: CSTeam): Player[] => {
  return players.map((player, index) => ({
    id: player || "",
    name: player || "",
    pos: team === "CT" ? getCTSpawn(index) : getTSpawn(index),
    team,
    dead: false,
  }));
};

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
      ...getPlayersBaseState(playersInTeams.CT, "CT"),
      ...getPlayersBaseState(playersInTeams.TERRORIST, "TERRORIST"),
    ];
  }, [playersInTeams]);

  const [roundIndex, setRoundIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [start, setStart] = useState(false);

  const { changeMapLevel, map, mapLevel, resetMapLevel } = useMap();

  const [teams, setTeams] = useState(playByPlay.teams);
  const [players, setPlayers] = useState<Array<Player>>(playersBaseState);
  const [shots, setShots] = useState<
    Array<{ id: string; attacker: string; victim: string }>
  >([]);

  const [eventLog, setEventLog] = useState<Parsed[]>([]);
  const [scoreboard, setScoreboard] = useState(
    getScoreForRound(
      playersBaseState.map((p) => p.name),
      teams,
    ),
  );

  const switchTeams = (teams: Record<CSTeam, string>) => {
    return {
      ...teams,
      CT: teams.TERRORIST,
      TERRORIST: teams.CT,
    };
  };

  const changeRound = useCallback(
    (newRoundIndex: number) => {
      const halftime = 14;

      let newTeams = teams;
      // switch teams on halftime
      if (
        (roundIndex <= halftime && newRoundIndex > halftime) ||
        (roundIndex > halftime && newRoundIndex <= halftime)
      ) {
        setTeams(switchTeams);

        newTeams = switchTeams(teams);

        setPlayers((prev) => [
          ...getPlayersBaseState(
            prev.filter((p) => p.team === "CT").map((p) => p.name),
            "TERRORIST",
          ),
          ...getPlayersBaseState(
            prev.filter((p) => p.team === "TERRORIST").map((p) => p.name),
            "CT",
          ),
        ]);
      } else {
        setPlayers((prev) => [
          ...getPlayersBaseState(
            prev.filter((p) => p.team === "CT").map((p) => p.name),
            "CT",
          ),
          ...getPlayersBaseState(
            prev.filter((p) => p.team === "TERRORIST").map((p) => p.name),
            "TERRORIST",
          ),
        ]);
      }

      // Clear state
      setRoundIndex(newRoundIndex);
      setEventLog([]);
      setStart(false);
      setShots([]);
      resetMapLevel();
      entryIndexRef.current = 0;

      const scoresForPreviousRounds = playByPlay.rounds
        .slice(0, newRoundIndex)
        .map((r, i) =>
          getScoreForRound(
            playersBaseState.map((p) => p.name),
            // Switch teams back for indexes before halftime
            newRoundIndex > halftime && i <= halftime
              ? switchTeams(newTeams)
              : newTeams,
            r,
          ),
        );

      const total = scoresForPreviousRounds.reduce(
        (acc, scoreboard) => {
          return mergeScoreBoards(acc, scoreboard);
        },
        getScoreForRound(
          playersBaseState.map((p) => p.name),
          newTeams,
        ),
      );

      setScoreboard(total);
    },
    [playByPlay.rounds, playersBaseState, resetMapLevel, roundIndex, teams],
  );

  const resetRound = () => {
    changeRound(roundIndex);
  };

  const handleEvent = useCallback(
    (e: Parsed) => {
      match(e)
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

            changeMapLevel([attackerZ, victimZ]);

            // if (attackerZ <= -445 || victimZ <= -445) {
            //   //bottom map
            //   setMapLevel("bot");
            // } else {
            //   //top map
            //   setMapLevel("top");
            // }

            setScoreboard((prev) =>
              mergeScoreBoards(
                prev,
                getScoreForRound(
                  playersBaseState.map((p) => p.name),
                  teams,
                  [val],
                ),
              ),
            );

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
            const { killer, victim } = data;
            setShots((prev) => [
              ...prev,
              {
                attacker: killer.name,
                victim: victim.name,
                id: val.raw,
              },
            ]);

            const attackerZ = [...killer.position].pop() || 0;
            const victimZ = [...victim.position].pop() || 0;

            changeMapLevel([attackerZ, victimZ]);

            // if (attackerZ <= -445 || victimZ <= -445) {
            //   //bottom map
            //   setMapLevel("bot");
            // } else {
            //   //top map
            //   setMapLevel("top");
            // }

            setScoreboard((prev) =>
              mergeScoreBoards(
                prev,
                getScoreForRound(
                  playersBaseState.map((p) => p.name),
                  teams,
                  [val],
                ),
              ),
            );

            setPlayers((prev) =>
              prev.map((p) => {
                if (p.id === killer.name) {
                  return { ...p, pos: killer.position };
                }

                if (p.id === victim.name) {
                  return { ...p, pos: victim.position, dead: true };
                }

                return p;
              }),
            );
          }
        })
        .with(
          { type: "bomb-defused" },
          { type: "ct-win" },
          { type: "target-bombed" },
          { type: "terrorists-win" },
          (val) => {
            setScoreboard((prev) =>
              mergeScoreBoards(
                prev,
                getScoreForRound(
                  playersBaseState.map((p) => p.name),
                  teams,
                  [val],
                ),
              ),
            );
          },
        )
        .otherwise(() => null);
    },
    [changeMapLevel, playersBaseState, teams],
  );

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
      }, 500 / speed);
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
    teams,
    mapLevel,
    map,
  };
};
