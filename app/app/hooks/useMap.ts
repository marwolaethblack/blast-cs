import { useCallback, useState } from "react";

export const useMap = () => {
  const mapThreshold = -445;
  const [mapLevel, setMapLevel] = useState<"top" | "bot">("top");

  const changeMapLevel = useCallback(
    (coordinates: number[]) => {
      if (coordinates.some((c) => c <= mapThreshold)) {
        setMapLevel("bot");
      } else {
        setMapLevel("top");
      }
    },
    [mapThreshold],
  );

  const resetMapLevel = useCallback(() => {
    setMapLevel("top");
  }, []);

  return {
    mapLevel,
    resetMapLevel,
    changeMapLevel,
    map:
      mapLevel === "top"
        ? "/overviews/de_nuke_radar.png"
        : "/overviews/de_nuke_lower_radar.jpg",
  };
};
