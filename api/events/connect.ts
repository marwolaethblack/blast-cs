export const connectEvent = (event: string) => {
  const regex = /"([^"<]+)<\d+><[^>]+><>"\s+STEAM\s+USERID\s+validated/;
  const match = event.match(regex);

  if (match) {
    const data = {
      player: match[1],
    };

    return {
      type: "connect" as const,
      data,
      raw: event,
    };
  }

  return { type: "connect" as const, data: null, raw: event };
};
