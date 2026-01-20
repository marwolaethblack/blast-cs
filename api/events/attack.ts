import { parseCoordinateString } from "../utils/utils";
import { CSTeam } from "./types";

export const attackEvent = (event: string) => {
  const regex =
    /"([^"<]+)<\d+><[^>]+><([^>]+)>"\s+(\[-?\d+\s+-?\d+\s+-?\d+\])\s+attacked\s+"([^"<]+)<\d+><[^>]+><([^>]+)>"\s+(\[-?\d+\s+-?\d+\s+-?\d+\])\s+with\s+"([^"]+)"\s+\(damage\s+"(\d+)"\)\s+\(damage_armor\s+"(\d+)"\)\s+\(health\s+"(\d+)"\)\s+\(armor\s+"(\d+)"\)\s+\(hitgroup\s+"([^"]+)"\)/;
  const match = event.match(regex);

  if (match) {
    const data = {
      attacker: {
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
      damage: parseInt(match[8]),
      armorDamage: parseInt(match[9]),
      health: match[10],
      armor: match[11],
      hitgroup: match[12],
    };

    return {
      type: "attack" as const,
      data,
      raw: event,
    };
  }

  return {
    type: "attack" as const,
    data: null,
    raw: event,
  };
};
