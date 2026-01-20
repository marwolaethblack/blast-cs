import { CSTeam } from "./types";

export const teamFactionEvent = (event: string) => {
  const regex = /MatchStatus:\s+Team\s+playing\s+"([^"]+)":\s+(.+)/;
  const match = event.match(regex);

  if (match) {
    const data = {
      teamSide: match[1] as CSTeam,
      teamName: match[2],
    };

    return {
      type: "team-faction" as const,
      data,
      raw: event,
    };
  }

  return {
    type: "team-faction" as const,
    data: null,
    raw: event,
  };
};
