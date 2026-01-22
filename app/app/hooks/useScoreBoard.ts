import { CSTeam } from "../../../api/events/types";
import { RoundData } from "../../../api/play-by-play";
import { match } from "ts-pattern";

interface PlayerScore {
  damage: number;
  kills: number;
  assists: number;
  deaths: number;
}

type PlayerId = string;

export type ScoreBoard = {
  teamScores: Record<string, number>;
  playerScores: Record<PlayerId, PlayerScore>;
};

export const getScoreForRound = (
  players: string[],
  teams: Record<CSTeam, string>,
  round?: RoundData,
) => {
  const emptyScoreBoard = players.reduce<ScoreBoard>(
    (acc, p) => {
      acc.playerScores[p] = {
        assists: 0,
        damage: 0,
        kills: 0,
        deaths: 0,
      };
      return acc;
    },
    { teamScores: {}, playerScores: {} },
  );

  Object.values(teams).forEach((t) => (emptyScoreBoard.teamScores[t] = 0));

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
            const attackerData = acc.playerScores[data.attacker.name] || {};

            acc.playerScores[data.attacker.name] = {
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
          return acc;
        })
        .with({ type: "kill" }, ({ data }) => {
          if (data) {
            acc.playerScores[data.killer.name].kills++;

            acc.playerScores[data.victim.name].deaths++;

            assistTracker[data.victim.name]
              ?.filter((attacker) => attacker !== data.killer.name)
              .forEach((attacker) => {
                acc.playerScores[attacker].assists++;
              });

            return acc;
          }
          return acc;
        })
        .with({ type: "ct-win" }, () => {
          const ctTeam = teams["CT"];
          acc.teamScores[ctTeam]++;

          return acc;
        })
        .with({ type: "bomb-defused" }, () => {
          const ctTeam = teams["CT"];
          acc.teamScores[ctTeam]++;
          return acc;
        })
        .with({ type: "terrorists-win" }, () => {
          const tTeam = teams["TERRORIST"];
          acc.teamScores[tTeam]++;

          return acc;
        })
        .with({ type: "target-bombed" }, () => {
          const tTeam = teams["TERRORIST"];
          acc.teamScores[tTeam]++;

          return acc;
        })
        .otherwise(() => acc) || acc
    );
  }, emptyScoreBoard);
};

export const mergeScoreBoards = (
  board1: ScoreBoard,
  board2: ScoreBoard,
): ScoreBoard => {
  const mergedPlayerScores = Object.entries(board1.playerScores).reduce<
    ScoreBoard["playerScores"]
  >((acc, [player, score]) => {
    acc[player] = {
      assists: (acc[player].assists || 0) + (score.assists || 0),
      kills: (acc[player].kills || 0) + (score.kills || 0),
      damage: (acc[player].damage || 0) + (score.damage || 0),
      deaths: (acc[player].deaths || 0) + (score.deaths || 0),
    };

    return acc;
  }, board2.playerScores);

  const mergedTeamScores = Object.entries(board1.teamScores).reduce<
    ScoreBoard["teamScores"]
  >((acc, [team, score]) => {
    return { ...acc, [team]: (acc[team] || 0) + score };
  }, board2.teamScores);

  return {
    playerScores: mergedPlayerScores,
    teamScores: mergedTeamScores,
  };
};
