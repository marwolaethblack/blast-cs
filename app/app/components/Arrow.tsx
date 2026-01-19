import React, {
  FunctionComponent,
  Ref,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";

interface Props {
  fromRef: RefObject<{ getBoundingClientRect: () => DOMRect }>;
  toRef: RefObject<{ getBoundingClientRect: () => DOMRect }>;
  updateTrigger: number;
}

export const Arrow: FunctionComponent<Props> = ({
  fromRef,
  toRef,
  updateTrigger,
}) => {
  const [path, setPath] = useState("");

  useEffect(() => {
    const updateArrow = () => {
      if (!fromRef.current || !toRef.current) return;

      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      const fromX = fromRect.left + fromRect.width / 2;
      const fromY = fromRect.top + fromRect.height / 2;
      const toX = toRect.left + toRect.width / 2;
      const toY = toRect.top + toRect.height / 2;

      setPath(`M ${fromX} ${fromY} L ${toX} ${toY}`);
    };

    updateArrow();
    window.addEventListener("resize", updateArrow);
    return () => window.removeEventListener("resize", updateArrow);
  }, [fromRef, toRef, updateTrigger]);

  return (
    <svg
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="5"
          markerHeight="5"
          refX="9"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 10 3, 0 6" fill="#eb4034" />
        </marker>
      </defs>
      <path
        d={path}
        stroke="#eb4034"
        strokeWidth="1"
        fill="none"
        markerEnd="url(#arrowhead)"
      />
    </svg>
  );
};
