import { Player } from "@/app/hooks/usePlayByPlay";
import { ScoreBoard } from "@/app/hooks/useScoreBoard";
import { Table } from "antd";
import { FunctionComponent, useMemo } from "react";
import { CSTeam } from "../../../../api/events/types";
import { teamColors, teamTextColors } from "@/app/utils/colors";

interface Props {
  scoreboard: ScoreBoard;
  players: Player[];
  teams: Record<CSTeam, string>;
}

export const Scoreboard: FunctionComponent<Props> = ({
  scoreboard,
  players,
  teams,
}) => {
  const { ct, terrorists } = useMemo(() => {
    return {
      ct: players.filter((p) => p.team === "CT").map((p) => p.name),
      terrorists: players
        .filter((p) => p.team === "TERRORIST")
        .map((p) => p.name),
    };
  }, [players]);

  const columns = [
    {
      key: "player",
      title: "Name",
      dataIndex: "player",
    },
    {
      key: "kills",
      title: "K",
      dataIndex: "kills",
    },
    {
      key: "assists",
      title: "A",
      dataIndex: "assists",
    },
    {
      key: "deaths",
      title: "D",
      dataIndex: "deaths",
    },
    {
      key: "damage",
      title: "DMG",
      dataIndex: "damage",
    },
  ];

  return (
    <div className="flex flex-row lg:flex-col gap-2 w-full">
      <Table
        className="w-full lg:w-auto lg:max-w-[350px]!"
        id="ct"
        title={() => (
          <span>
            Score: {scoreboard.teamScores[teams["CT"]]} -{" "}
            <span className={`${teamTextColors["CT"]} font-medium`}>
              Counter-Terrorists
            </span>{" "}
            - {teams["CT"]}
          </span>
        )}
        size="small"
        columns={columns}
        dataSource={ct
          .map((p) => ({ ...scoreboard.playerScores[p], player: p }))
          .sort((a, b) => (a.kills > b.kills ? -1 : 1))}
        pagination={false}
      />
      <Table
        className="w-full lg:w-auto lg:max-w-[350px]!"
        id="t"
        title={() => (
          <span>
            Score: {scoreboard.teamScores[teams["TERRORIST"]]} -{" "}
            <span className={`${teamTextColors["TERRORIST"]} font-medium`}>
              Terrorists{" "}
            </span>{" "}
            - {teams["TERRORIST"]}
          </span>
        )}
        size="small"
        columns={columns}
        dataSource={terrorists
          .map((p) => ({ ...scoreboard.playerScores[p], player: p }))
          .sort((a, b) => (a.kills > b.kills ? -1 : 1))}
        pagination={false}
      />
    </div>
  );
};
