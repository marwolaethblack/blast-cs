import { parseCoordinateString } from "../utils/utils";
import { CSTeam } from "./types";

export const killEvent = (event: string) => {
  const regex =
    /"([^"<]+)<\d+><[^>]+><([^>]+)>"\s+(\[-?\d+\s+-?\d+\s+-?\d+\])\s+killed\s+"([^"<]+)<\d+><[^>]+><([^>]+)>"\s+(\[-?\d+\s+-?\d+\s+-?\d+\])\s+with\s+"([^"]+)"(?:\s+\(([^)]+)\))?/;
  const match = event.match(regex);

  if (match) {
    const data = {
      killer: {
        name: match[1],
        team: match[2] as CSTeam,
        position: parseCoordinateString(match[3]),
      },
      victim: {
        name: match[4],
        team: match[5] as CSTeam,
        position: parseCoordinateString(match[6]),
      },
      weapon: match[7],
      modifier: match[8],
    };

    return {
      type: "kill" as const,
      data,
      raw: event,
    };
  }

  return { type: "kill" as const, data: null, raw: event };
};
