import { CSTeam } from "../../../api/events/types";

export const teamBackgroundColors: Record<CSTeam, string> = {
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

export const teamColors = {
  CT: `var(--color-blue-500)`,
  Spectator: `var(--color-green-600)`,
  TERRORIST: `var(--color-amber-400)`,
  Unassigned: "var(--color-white)",
};

export const teamDeadColors = {
  CT: `var(--color-red-400)`,
  Spectator: `var(--color-green-600)`,
  TERRORIST: `var(--color-red-600)`,
  Unassigned: "var(--color-white)",
};
