export const bombDefusedEvent = (event: string) => {
  return { type: "bomb-defused" as const, data: null, raw: event };
};
