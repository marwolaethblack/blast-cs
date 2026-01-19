import { FunctionComponent } from "react";

interface IProps {
  color: string;
  left: number;
  top: number;
  dead: boolean;
}

export const PlayerDot: FunctionComponent<IProps> = ({
  color,
  left,
  top,
  dead,
}) => {
  return (
    <div
      className={`${dead ? "bg-amber-950!" : "rounded-full"} w-2 h-2 absolute z-20 ${color} border border-solid border-blue-200`}
      style={{ left, top }}
    />
  );
};
