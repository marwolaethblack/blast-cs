import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { Select, Button } from "antd";

interface Props {
  changeRound: (round: number) => void;
  rounds: Array<{ label: string; value: number }>;
  round: number;
  resetRound: () => void;
  setStart: Dispatch<SetStateAction<boolean>>;
  start: boolean;
  setSpeed: Dispatch<SetStateAction<number>>;
  speed: number;
}

export const Controls: FunctionComponent<Props> = ({
  rounds,
  round,
  changeRound,
  resetRound,
  setSpeed,
  setStart,
  start,
  speed,
}) => {
  return (
    <div>
      <div className="flex gap-2">
        <Button disabled={round === 0} onClick={() => changeRound(round - 1)}>
          {"<"}
        </Button>
        <Select
          className="w-full"
          options={rounds}
          onChange={(val) => {
            console.log(val);
            changeRound(val);
          }}
          value={round}
        />
        <Button
          disabled={round === rounds.length - 1}
          onClick={() => changeRound(round + 1)}
        >
          {">"}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button color="orange" onClick={() => setStart((prev) => !prev)}>
          {start ? "Stop" : "Start"}
        </Button>
        <Button onClick={resetRound}>Reset</Button>

        <div className="flex gap-2 items-center">
          <Button onClick={() => setSpeed((prev) => prev - 0.25)}>-</Button>
          {speed}x
          <Button onClick={() => setSpeed((prev) => prev + 0.25)}>+</Button>
        </div>
      </div>
    </div>
  );
};
