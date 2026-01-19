import { FunctionComponent, useMemo } from "react";
import { Parsed } from "../../../api/event-parsers";
import { match } from "ts-pattern";

interface Props {
  event: Parsed;
}

export const MatchEvent: FunctionComponent<Props> = ({ event }) => {
  const text = useMemo(() => {
    return match(event)
      .with({ type: "attack" }, (val) => {})
      .otherwise(() => null);
  }, [event]);

  if (!text) {
    return null;
  }

  return <p>{text}</p>;
};
