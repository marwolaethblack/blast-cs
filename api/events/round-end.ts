// 11/28/2021 - 21:12:27: World triggered "Round_End"

export const roundEndEvent = (event: string) => {
  return { type: "round-end" as const, data: null, raw: event };
};
