export const ctWinEvent = (event: string) => {
  return { type: "ct-win" as const, data: null, raw: event };
};
