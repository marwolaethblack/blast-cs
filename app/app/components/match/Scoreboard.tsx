import { Player } from "@/app/hooks/usePlayByPlay";
import { ScoreBoard } from "@/app/hooks/useScoreBoard";
import { Table } from "antd";
import { FunctionComponent, useMemo } from "react";
import { CSTeam } from "../../../../api/events/types";

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
    <div>
      CT {teams["CT"]}
      <Table
        size="small"
        columns={columns}
        dataSource={ct.map((p) => ({ ...scoreboard[p], player: p }))}
        pagination={false}
      />
      Terrorist {teams["TERRORIST"]}
      <Table
        size="small"
        columns={columns}
        dataSource={terrorists.map((p) => ({ ...scoreboard[p], player: p }))}
        pagination={false}
      />
    </div>
  );
};
