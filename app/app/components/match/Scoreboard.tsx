import { Player } from "@/app/hooks/usePlayByPlay";
import { ScoreBoard } from "@/app/hooks/useScoreBoard";
import { FunctionComponent, useMemo } from "react";

interface Props {
  scoreboard: ScoreBoard;
  players: Player[];
}

export const Scoreboard: FunctionComponent<Props> = ({
  scoreboard,
  players,
}) => {
  const { ct, terrorists } = useMemo(() => {
    return {
      ct: players.filter((p) => p.team === "CT").map((p) => p.name),
      terrorists: players
        .filter((p) => p.team === "TERRORIST")
        .map((p) => p.name),
    };
  }, [players]);

  return (
    <div>
      <p>CT</p>
      {ct.map((p) => {
        return (
          <div key={p}>
            {p} - {scoreboard[p].damage}
          </div>
        );
      })}
      <p>T</p>
      {terrorists.map((p) => {
        return (
          <div key={p}>
            {p} - {scoreboard[p].damage}
          </div>
        );
      })}
    </div>
  );
};
