export const terroristsWinEvent = (event: string) => {
  return { type: "terrorists-win" as const, data: null, raw: event };
};
