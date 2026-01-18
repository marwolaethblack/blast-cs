import { FunctionComponent } from "react";

interface IProps {
    color: string
    left: number
    top: number
}

export const PlayerDot: FunctionComponent<IProps> = ({ color, left, top }) => {
    return <div className={`rounded-full w-2 h-2 absolute z-20 ${color} border border-solid border-blue-200`} style={{ left, top }} />
}