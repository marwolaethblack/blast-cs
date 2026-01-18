export const mapSelectEvent = (event: string) => {
  const regex = /World\s+triggered\s+"Match_Start"\s+on\s+"([^"]+)"/;
  const match = event.match(regex);

  if (match) {
    const data = {
      map: match[1],
    };

    return {
      type: "map-select" as const,
      data,
      raw: event,
    };
  }

  return { type: "map-select" as const, data: null, raw: event };
};
