import { FunctionComponent, useEffect, useRef } from "react";
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
  const scrollContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollContainer.current?.scrollTo({
      top: scrollContainer.current.scrollHeight,
      behavior: "smooth", // Smooth scrolling
    });
  }, [eventLog]);

  return (
    <section className="p-2 rounded-md border borer-white border-solid min-w-[350px] lg:max-w-[350px] lg:w-[350px] max-w-full w-full  h-full">
      <h3 className="font-medium text-lg">Match log - Round {round}</h3>
      <div
        className="overflow-y-auto max-h-[400px] w-full flex flex-col h-full"
        ref={scrollContainer}
      >
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
