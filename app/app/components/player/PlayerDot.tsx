import { FunctionComponent, Ref, RefObject } from "react";
import { CSTeam } from "../../../../api/events/types";
import { teamBackgroundColors, teamDeadColors } from "@/app/utils/colors";

interface IProps {
  left: number;
  top: number;
  dead: boolean;
  team: CSTeam;
  name: string;
  ref?: Ref<HTMLDivElement>;
}

export const PlayerDot: FunctionComponent<IProps> = ({
  team,
  left,
  top,
  dead,
  name,
  ref,
}) => {
  if (dead) {
    return (
      <div className="z-20 absolute " style={{ left, top }}>
        <div ref={ref}>
          <svg
            width="8px"
            height="8px"
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            aria-hidden="true"
            role="img"
            className=" bg-blend-lighten"
            preserveAspectRatio="xMidYMid meet"
            style={{ fill: teamDeadColors[team] }}
          >
            <path d="M330.443 256l136.765-136.765c14.058-14.058 14.058-36.85 0-50.908l-23.535-23.535c-14.058-14.058-36.85-14.058-50.908 0L256 181.557L119.235 44.792c-14.058-14.058-36.85-14.058-50.908 0L44.792 68.327c-14.058 14.058-14.058 36.85 0 50.908L181.557 256L44.792 392.765c-14.058 14.058-14.058 36.85 0 50.908l23.535 23.535c14.058 14.058 36.85 14.058 50.908 0L256 330.443l136.765 136.765c14.058 14.058 36.85 14.058 50.908 0l23.535-23.535c14.058-14.058 14.058-36.85 0-50.908L330.443 256z"></path>
          </svg>
        </div>
        <div className="text-xs text-white">{name}</div>
      </div>
    );
  }
  return (
    <div style={{ left, top }} className="absolute z-21">
      <div
        className={`rounded-full w-2 h-2  ${teamBackgroundColors[team]} border border-solid border-blue-200`}
        ref={ref}
      />
      <div className="text-xs text-white">{name}</div>
    </div>
  );
};
