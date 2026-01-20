import React, { useEffect, useRef, useState } from "react";

interface ArrowProps {
  fromRef: React.RefObject<HTMLElement>;
  toRef: React.RefObject<HTMLElement>;
  updateTrigger?: number;
  color?: string;
  strokeWidth?: number;
}

export const Arrow: React.FC<ArrowProps> = ({
  fromRef,
  toRef,
  updateTrigger,
  color = "#eb4034",
  strokeWidth = 2,
}) => {
  const [coords, setCoords] = useState({ fromX: 0, fromY: 0, toX: 0, toY: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const updateArrow = () => {
      if (!fromRef.current || !toRef.current || !svgRef.current) return;

      // Get the parent container (assumes both elements share same positioned parent)
      const parent = svgRef.current.parentElement;
      if (!parent) return;

      const parentRect = parent.getBoundingClientRect();
      const fromRect = fromRef.current.getBoundingClientRect();
      const toRect = toRef.current.getBoundingClientRect();

      // Calculate center points relative to parent
      const fromCenterX = fromRect.left + fromRect.width / 2 - parentRect.left;
      const fromCenterY = fromRect.top + fromRect.height / 2 - parentRect.top;
      const toCenterX = toRect.left + toRect.width / 2 - parentRect.left;
      const toCenterY = toRect.top + toRect.height / 2 - parentRect.top;

      // Calculate angle between centers
      const angle = Math.atan2(
        toCenterY - fromCenterY,
        toCenterX - fromCenterX,
      );

      // Shorten the arrow by 3px on each end
      const offset = 3;
      const fromX = fromCenterX + Math.cos(angle) * offset;
      const fromY = fromCenterY + Math.sin(angle) * offset;
      const toX = toCenterX - Math.cos(angle) * offset;
      const toY = toCenterY - Math.sin(angle) * offset;

      setCoords({ fromX, fromY, toX, toY });
    };

    updateArrow();
    window.addEventListener("resize", updateArrow);
    return () => window.removeEventListener("resize", updateArrow);
  }, [fromRef, toRef, updateTrigger]);

  const { fromX, fromY, toX, toY } = coords;

  return (
    <svg
      ref={svgRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        overflow: "visible",
      }}
    >
      <defs>
        <marker
          id={`arrowhead-${color.replace("#", "")}`}
          markerWidth="10"
          markerHeight="10"
          refX="6.3"
          refY="3"
          orient="auto"
        >
          <polygon points="0 0, 7 3, 0 6" fill={color} />
        </marker>
      </defs>
      <path
        d={`M ${fromX} ${fromY} L ${toX} ${toY}`}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        markerEnd={`url(#arrowhead-${color.replace("#", "")})`}
      />
    </svg>
  );
};
