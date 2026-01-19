import { match, P } from "ts-pattern";
import { killEvent } from "./events/kill";
import { attackEvent } from "./events/attack";
import { connectEvent } from "./events/connect";
import { teamFactionEvent } from "./events/team-faction";
import { playerTeamEvent } from "./events/player-team";
import { mapSelectEvent } from "./events/map-select";
import { roundEndEvent } from "./events/round-end";
import { bombPlantEvent } from "./events/bomb-plant";
import { terroristsWinEvent } from "./events/terrorists-win";

export type Parsed =
  | ReturnType<typeof connectEvent>
  | ReturnType<typeof teamFactionEvent>
  | ReturnType<typeof playerTeamEvent>
  | ReturnType<typeof killEvent>
  | ReturnType<typeof attackEvent>
  | ReturnType<typeof bombPlantEvent>
  | ReturnType<typeof terroristsWinEvent>
  | ReturnType<typeof mapSelectEvent>
  | ReturnType<typeof roundEndEvent>
  | { type: "other"; raw: string };

export const eventParser = (event: string): Parsed =>
  match(event)
    .with(P.string.includes(" STEAM USERID validated"), () => {
      return connectEvent(event);
    })
    .with(P.string.includes(" Team playing"), () => {
      return teamFactionEvent(event);
    })
    .with(P.string.includes(" switched from team "), () => {
      return playerTeamEvent(event);
    })
    .with(P.string.includes(' killed \"'), () => {
      return killEvent(event);
    })
    .with(P.string.includes(" attacked "), () => {
      return attackEvent(event);
    })
    .with(P.string.includes("Planted_The_Bomb"), () => {
      return bombPlantEvent(event);
    })
    .with(P.string.includes("SFUI_Notice_Terrorists_Win"), () => {
      return terroristsWinEvent(event);
    })
    .with(P.string.includes('World triggered "Match_Start" on'), () => {
      return mapSelectEvent(event);
    })
    .with(P.string.includes('World triggered \"Round_End\"'), () => {
      return roundEndEvent(event);
    })
    .otherwise(() => {
      return {
        type: "other",
        raw: event,
      };
    });
