export type CSTeam = "TERRORIST" | "CT" | "Unassigned" | "Spectator";

export type MapMeta = {
  meta: {
    material: string;
    pos_x: number;
    pos_y: number;
    scale: number;

    verticalsections: {
      default: {
        AltitudeMax: number;
        AltitudeMin: number;
      };
      lower: {
        AltitudeMax: number;
        AltitudeMin: number;
      };
    };

    CTSpawn_x: number;
    CTSpawn_y: number;
    TSpawn_x: number;
    TSpawn_y: number;

    bombA_x: number;
    bombA_y: number;
    bombB_x: number;
    bombB_y: number;
  };
};
