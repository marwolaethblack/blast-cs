export const parseCoordinateString = (coord: string) => {
  return coord
    .replace("[", "")
    .replace("]", "")
    .split(" ")
    .map((v) => parseInt(v));
};
