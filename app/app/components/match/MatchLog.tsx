import { FunctionComponent } from "react";
import { Parsed } from "../../../../api/event-parsers";
import { MatchEvent } from "./MatchEvent";

interface Props {
  eventLog: Parsed[];
  round: number;
  start: boolean;
}

export const MatchLog: FunctionComponent<Props> = ({
  eventLog,
  round,
  start,
}) => {
  return (
    <section className="p-2 rounded-md border borer-white border-solid min-w-[350px] max-w-[350px] w-[350px] h-full">
      <h3 className="font-medium text-lg">Match log - Round {round}</h3>
      <div className="overflow-y-auto max-h-[400px] w-full flex flex-col h-full">
        {eventLog.length === 0 && !start && (
          <div className="w-full h-full flex items-center justify-center text-lg font-medium text-center">
            Press start to see logs
          </div>
        )}
        {eventLog.map((e) => (
          <MatchEvent event={e} key={e.raw} />
        ))}
      </div>
    </section>
  );
};
