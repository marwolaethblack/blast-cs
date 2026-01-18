import { eventParser } from "./event-parsers";

export const playByPlay = (match: string) => {
  const events = match.split("\n");

  const grouped = events.reduce<
    Record<string, Array<ReturnType<typeof eventParser>>>
  >((acc, ev) => {
    const match = ev.match(/^(\d{2}\/\d{2}\/\d{4} - \d{2}:\d{2}:\d{2}:\s)/);

    const date = match[0];
    const parsedEvent = eventParser(ev);

    if (parsedEvent.type === "other") {
      return acc;
    }

    if (parsedEvent.type === "map-select") {
    }

    return {
      ...acc,
      [date]: [...(acc[date] || []), parsedEvent],
    };
  }, {});

  return grouped;
};
