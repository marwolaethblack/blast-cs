import { FunctionComponent, PropsWithChildren, useMemo } from "react";
import { Parsed } from "../../../api/event-parsers";
import { match } from "ts-pattern";
import { PlayerName } from "./player/PlayerName";
import { teamTextColors } from "../utils/colors";

interface Props {
  event: Parsed;
}

export const MatchEvent: FunctionComponent<Props> = ({ event }) => {
  const text = useMemo(() => {
    return match(event)
      .with({ type: "attack" }, (val) => {
        if (val.data) {
          return (
            <div className="flex items-center gap-1">
              <PlayerName
                name={val.data.attacker.name}
                team={val.data.attacker.team}
              />
              attacked
              <PlayerName
                name={val.data.victim.name}
                team={val.data.victim.team}
              />
              with {val.data.weapon} for{" "}
              <HealthDamage>{val.data.damage}</HealthDamage> and{" "}
              <ArmorDamage>{val.data.armorDamage}</ArmorDamage>
              <HitGroup>{val.data.hitgroup}</HitGroup>
            </div>
          );
        }

        return null;
      })
      .with({ type: "kill" }, (val) => {
        if (val.data) {
          return (
            <div className="flex items-center gap-1">
              <PlayerName
                name={val.data.killer.name}
                team={val.data.killer.team}
              />
              killed
              <PlayerName
                name={val.data.victim.name}
                team={val.data.victim.team}
              />
              with {val.data.weapon}
              <HitGroup>{val.data.modifier}</HitGroup>
            </div>
          );
        }

        return null;
      })
      .with({ type: "ct-win" }, () => {
        return (
          <div
            className={`flex items-center gap-1 border border-solid border-green-600 text-lg`}
          >
            <span className={`${teamTextColors["CT"]}`}>CT</span>
            win
          </div>
        );
      })
      .otherwise(() => null);
  }, [event]);

  if (!text) {
    return null;
  }

  return <div>{text}</div>;
};

const HealthDamage: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <span className="text-red-400 font-medium">{children} damage</span>
);

const ArmorDamage: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <span className="text-blue-200 font-medium">{children} armor damage</span>
);

const HitGroup: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <span className="text-fuchsia-400 font-medium">{children}</span>
);
