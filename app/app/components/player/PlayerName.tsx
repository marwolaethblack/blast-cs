import { FunctionComponent } from "react";
import { CSTeam } from "../../../../api/events/types";
import { teamTextColors } from "../../utils/colors";

interface Props {
  name: string;
  team: CSTeam;
}

export const PlayerName: FunctionComponent<Props> = ({ name, team }) => {
  return (
    <span className={`${teamTextColors[team]} text-sm font-medium`}>
      {name}
    </span>
  );
};
