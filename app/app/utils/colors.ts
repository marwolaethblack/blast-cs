import { CSTeam } from "../../../api/events/types";

export const teamBorderColors: Record<CSTeam, string> = {
  CT: "bg-blue-500",
  Spectator: "bg-green-600",
  TERRORIST: "bg-amber-400",
  Unassigned: "bg-white",
};

export const teamTextColors: Record<CSTeam, string> = {
  CT: "text-blue-500",
  Spectator: "text-green-600",
  TERRORIST: "text-amber-400",
  Unassigned: "text-white",
};
