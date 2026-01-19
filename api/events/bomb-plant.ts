export const bombPlantEvent = (event: string) => {
  const regex = /"([^<]+)<.*triggered "Planted_The_Bomb" at bombsite ([AB])"/;
  const match = event.match(regex);

  if (match) {
    const data = {
      player: match[1],
      bombSite: match[2],
    };

    return {
      type: "bomb-plant" as const,
      data,
      raw: event,
    };
  }

  return { type: "bomb-plant" as const, data: null, raw: event };
};
