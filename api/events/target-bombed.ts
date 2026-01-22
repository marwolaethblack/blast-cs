export const targetBombedEvent = (event: string) => {
  return { type: "target-bombed" as const, data: null, raw: event };
};
