import { eventParser } from "./event-parsers";
import { CSTeam, MapMeta } from "./events/types";

export type RoundData = Array<ReturnType<typeof eventParser>>;

export interface PlayByPlay {
  // map: {
  //   name: string;
  //   url: string;
  //   urlLower: string;
  //   meta: MapMeta;
  // };
  players: Record<string, CSTeam>;
  rounds: Array<RoundData>;
  teams: Record<CSTeam, string>;
}

export const playByPlay = (match: string) => {
  const events = match.split("\n");

  const lastMatchStart = events.findLastIndex((e) => e.includes("Match_Start"));
  const eventsBeforeMatchStart = events.slice(0, lastMatchStart);

  const initialPlayersWithTeams = eventsBeforeMatchStart.reduce<{
    players: Record<string, CSTeam>;
    teams: Record<CSTeam, string>;
  }>(
    (acc, e) => {
      const parsedEvent = eventParser(e);

      if (parsedEvent.type === "player-team") {
        if (parsedEvent.data) {
          acc.players[parsedEvent.data.player] = parsedEvent.data.toTeam;
        }
      }

      if (parsedEvent.type === "team-faction") {
        if (parsedEvent.data) {
          acc.teams[parsedEvent.data.teamSide] = parsedEvent.data.teamName;
        }
      }

      return acc;
    },
    {
      players: {},
      teams: { TERRORIST: "", CT: "", Unassigned: "", Spectator: "" },
    },
  );

  const eventsFromMatchStart = events.slice(lastMatchStart, undefined);

  let round_buffer: RoundData = [];

  const grouped = eventsFromMatchStart.reduce(
    (acc, ev) => {
      const parsedEvent = eventParser(ev);

      if (parsedEvent.type === "other" || parsedEvent.type === "team-faction") {
        return acc;
      }

      if (parsedEvent.type === "map-select") {
        return {
          ...acc,
          // map: {
          //   name: parsedEvent.data.map,
          //   meta: {}
          // },
        };
      }

      round_buffer = [...(round_buffer || []), parsedEvent];

      if (parsedEvent.type === "round-end") {
        const newAcc = {
          ...acc,
          rounds: [...acc.rounds, round_buffer],
        };

        round_buffer = [];

        return newAcc;
      }

      return acc;
    },
    {
      rounds: [],
      players: initialPlayersWithTeams.players,
      teams: initialPlayersWithTeams.teams,
    } as PlayByPlay,
  );

  return grouped;
};
