import { RoundData } from "../../../api/play-by-play";
import { match } from "ts-pattern";

interface PlayerScore {
  damage: number;
  kills: number;
  assists: number;
  deaths: number;
}

type PlayerId = string;

export type ScoreBoard = Record<PlayerId, PlayerScore>;

export const getScoreForRound = (players: string[], round?: RoundData) => {
  const emptyScoreBoard = players.reduce<ScoreBoard>((acc, p) => {
    acc[p] = {
      assists: 0,
      damage: 0,
      kills: 0,
      deaths: 0,
    };
    return acc;
  }, {});

  if (!round) {
    return emptyScoreBoard;
  }

  const assistTracker = players.reduce<Record<PlayerId, PlayerId[]>>(
    (acc, p) => {
      acc[p] = [];
      return acc;
    },
    {},
  );

  return round.reduce<ScoreBoard>((acc, round) => {
    return (
      match(round)
        .with({ type: "attack" }, ({ data }) => {
          if (data) {
            const attackerData = acc[data.attacker.name] || {};

            acc[data.attacker.name] = {
              ...attackerData,
              damage: attackerData.damage + data.damage + data.armorDamage,
            };

            assistTracker[data.victim.name] = Array.from(
              new Set([
                ...(assistTracker[data.victim.name] || []),
                data.attacker.name,
              ]),
            );

            return acc;
          }
        })
        .with({ type: "kill" }, ({ data }) => {
          if (data) {
            acc[data.killer.name].kills++;

            acc[data.victim.name].deaths++;

            assistTracker[data.victim.name]
              ?.filter((attacker) => attacker !== data.killer.name)
              .forEach((attacker) => {
                acc[attacker].assists++;
              });

            return acc;
          }
        })
        .otherwise(() => acc) || acc
    );
  }, emptyScoreBoard);
};

export const mergeScoreBoards = (board1: ScoreBoard, board2: ScoreBoard) => {
  return Object.entries(board1).reduce<ScoreBoard>((acc, [player, score]) => {
    acc[player] = {
      assists: (acc[player].assists || 0) + (score.assists || 0),
      kills: (acc[player].kills || 0) + (score.kills || 0),
      damage: (acc[player].damage || 0) + (score.damage || 0),
      deaths: (acc[player].deaths || 0) + (score.deaths || 0),
    };

    return acc;
  }, board2);
};
