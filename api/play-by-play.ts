import { eventParser } from "./event-parsers";
import { CSTeam, MapMeta } from "./events/types";

export type RoundData = Record<string, Array<ReturnType<typeof eventParser>>>;

export interface PlayByPlay {
  map: {
    name: string;
    url: string;
    urlLower: string;
    meta: MapMeta;
  };
  players: Record<string, CSTeam>;
  rounds: Array<RoundData>;
}

export const playByPlay = (match: string) => {
  const events = match.split("\n");

  const lastMatchStart = events.findLastIndex((e) => e.includes("Match_Start"));
  const eventsBeforeMatchStart = events.slice(0, lastMatchStart);

  const initialPlayersWithTeams = eventsBeforeMatchStart.reduce<
    Record<string, CSTeam>
  >((acc, e) => {
    const parsedEvent = eventParser(e);
    if (parsedEvent.type === "player-team") {
      acc[parsedEvent.data.player] = parsedEvent.data.toTeam;
    }

    return acc;
  }, {});

  const eventsFromMatchStart = events.slice(lastMatchStart, undefined);

  let round_buffer: RoundData = {};

  const grouped = eventsFromMatchStart.reduce(
    (acc, ev) => {
      const match = ev.match(/^(\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}:\d{2}:\s)/);

      const date = match[0];
      const parsedEvent = eventParser(ev);

      if (parsedEvent.type === "other") {
        return acc;
      }

      if (parsedEvent.type === "map-select") {
        return {
          ...acc,
          map: {
            name: parsedEvent.data.map,
          },
        };
      }

      round_buffer[date] = [...(round_buffer[date] || []), parsedEvent];

      if (parsedEvent.type === "round-end") {
        const newAcc = {
          ...acc,
          rounds: [...acc.rounds, { ...round_buffer }],
        };

        round_buffer = {};

        return newAcc;
      }

      return acc;
    },
    {
      rounds: [],
      players: initialPlayersWithTeams,
    } as PlayByPlay,
  );

  return grouped;
};
