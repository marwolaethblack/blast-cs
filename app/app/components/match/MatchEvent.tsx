import { FunctionComponent, PropsWithChildren, useMemo } from "react";
import { Parsed } from "../../../../api/event-parsers";
import { match } from "ts-pattern";
import { PlayerName } from "../player/PlayerName";
import { teamTextColors } from "../../utils/colors";

interface Props {
  event: Parsed;
}

export const MatchEvent: FunctionComponent<Props> = ({ event }) => {
  const text = useMemo(() => {
    return match(event)
      .with({ type: "attack" }, (val) => {
        if (val.data) {
          return (
            <>
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
            </>
          );
        }

        return null;
      })
      .with({ type: "kill" }, (val) => {
        if (val.data) {
          return (
            <>
              <PlayerName
                name={val.data.killer.name}
                team={val.data.killer.team}
              />
              killed
              <PlayerName
                name={val.data.victim.name}
                team={val.data.victim.team}
              />
              with <span className="text-cyan-300">{val.data.weapon}</span>
              <HitGroup>{val.data.modifier}</HitGroup>
            </>
          );
        }

        return null;
      })
      .with({ type: "ct-win" }, () => {
        return (
          <div
            className={`flex items-center gap-1 border border-solid bg-green-800 w-full justify-center text-lg`}
          >
            <span className={`${teamTextColors["CT"]}`}>CT</span>
            win
          </div>
        );
      })
      .with({ type: "bomb-defused" }, () => {
        return (
          <div
            className={`flex items-center gap-1 border border-solid bg-green-800 w-full justify-center text-lg`}
          >
            <span className={`${teamTextColors["CT"]}`}>CT</span>
            win by defusing the bomb
          </div>
        );
      })
      .with({ type: "terrorists-win" }, () => {
        return (
          <div
            className={`flex items-center gap-1 border border-solid bg-green-800 w-full justify-center text-lg`}
          >
            <span className={`${teamTextColors["TERRORIST"]}`}>Terrorists</span>
            win
          </div>
        );
      })
      .with({ type: "target-bombed" }, () => {
        return (
          <div
            className={`flex items-center gap-1 border border-solid bg-green-800 w-full justify-center text-lg`}
          >
            <span className={`${teamTextColors["TERRORIST"]}`}>Terrorists</span>
            win by bombing the target
          </div>
        );
      })
      .otherwise(() => null);
  }, [event]);

  if (!text) {
    return null;
  }

  return <div className="flex gap-1 items-center flex-wrap p-1">{text}</div>;
};

const HealthDamage: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <span className="text-red-400 font-medium whitespace-nowrap">
    {children} damage
  </span>
);

const ArmorDamage: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <span className="text-blue-200 font-medium  whitespace-nowrap">
    {children} armor damage
  </span>
);

const HitGroup: FunctionComponent<PropsWithChildren> = ({ children }) => (
  <span className="text-fuchsia-400 font-medium  whitespace-nowrap">
    {children}
  </span>
);
