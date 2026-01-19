import { CSTeam } from "./types";

export const playerTeamEvent = (event: string) => {
  const regex =
    /"([^"<]+)<\d+><[^>]+>"\s+switched\s+from\s+team\s+<([^>]+)>\s+to\s+<([^>]+)>/;
  const match = event.match(regex);

  if (match) {
    const data = {
      player: match[1],
      fromTeam: match[2],
      toTeam: match[3] as CSTeam,
    };

    return {
      type: "player-team" as const,
      data,
      raw: event,
    };
  }

  return { type: "player-team" as const, data: null, raw: event };
};
