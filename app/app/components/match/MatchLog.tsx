import { FunctionComponent } from "react";
import { Parsed } from "../../../../api/event-parsers";
import { MatchEvent } from "../MatchEvent";

interface Props {
  eventLog: Parsed[];
  round: number;
}

export const MatchLog: FunctionComponent<Props> = ({ eventLog, round }) => {
  return (
    <section className="p-2 rounded-md border borer-white border-solid">
      <h3 className="font-medium text-lg">Match log - Round {round}</h3>
      <div className="min-w-[650px] max-w-[650px] overflow-y-scroll">
        {eventLog.map((e) => (
          <MatchEvent event={e} key={e.raw} />
        ))}
      </div>
    </section>
  );
};
