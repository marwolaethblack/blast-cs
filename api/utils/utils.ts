export const parseCoordinateString = (coord: string) => {
  console.log(coord);
  console.log(
    coord
      .replace("[", "")
      .replace("]", "")
      .split(" ")
      .map((v) => parseInt(v)),
  );
  return coord
    .replace("[", "")
    .replace("]", "")
    .split(" ")
    .map((v) => parseInt(v));
};
