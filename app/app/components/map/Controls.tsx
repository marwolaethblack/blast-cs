import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { Button } from "../base/Button";

interface Props {
  resetRound: () => void;
  setStart: Dispatch<SetStateAction<boolean>>;
  setSpeed: Dispatch<SetStateAction<number>>;
  speed: number;
}

export const Controls: FunctionComponent<Props> = ({
  resetRound,
  setSpeed,
  setStart,
  speed,
}) => {
  return (
    <div>
      <Button onClick={() => setStart(true)}>Start</Button>
      <Button onClick={() => setStart(false)}>Stop</Button>
      <Button onClick={resetRound}>Reset</Button>
      <div className="flex gap-2">
        <Button onClick={() => setSpeed((prev) => prev - 0.25)}>-</Button>
        {speed}
        <Button onClick={() => setSpeed((prev) => prev + 0.25)}>+</Button>
      </div>
    </div>
  );
};
