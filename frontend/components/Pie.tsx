import React from "react";

type CircleProps = {
  colour: string;
  pct?: number;
};

type TextProps = {
  percentage: number;
  context: string;
};

type PieProps = {
  percentage: number;
  colour: string;
};

const cleanPercentage = (percentage: number): number => {
  const tooLow = !Number.isFinite(+percentage) || percentage < 0;
  const tooHigh = percentage > 100;
  return tooLow ? 0 : tooHigh ? 100 : +percentage;
};

const Circle: React.FC<CircleProps> = ({ colour, pct = 0 }) => {
  const r = 90;
  const circ = 2 * Math.PI * r;
  const strokePct = ((100 - pct) * circ) / 100; 
  return (
    <circle
      r={r}
      cx={100}
      cy={100}
      fill="transparent"
      stroke={strokePct !== circ ? colour : "rgba(28, 30, 33,0.8)"} 
      strokeWidth={"0.6rem"}
      strokeDasharray={circ}
      strokeDashoffset={pct ? strokePct : 1}
      strokeLinecap="round"
    ></circle>
  );
};

const Text: React.FC<TextProps> = ({ percentage, context }) => {
  return (
    <text
      x="50%"
      y="50%"
      dominantBaseline="central"
      textAnchor="middle"
      fontSize={"1.5em"}
      fill="white" 
    >
      <tspan x="50%" dy="-0.2em"> 
        {percentage.toFixed(0)}%
      </tspan>
      <tspan x="50%" dy="1.2em">
        {context}
      </tspan>
    </text>
  );
};

const Pie: React.FC<PieProps> = ({ percentage, colour }) => {
  const pct = cleanPercentage(percentage);
  return (
    <svg
      width="65%"                
      height="auto"              
      viewBox="0 0 200 200"      
      preserveAspectRatio="xMidYMid meet" 
    >
      <g transform={`rotate(-90 ${"100 100"})`}>
        <Circle colour="lightgrey" />
        <Circle colour={colour} pct={pct} />
      </g>
      <Text   percentage={pct}   context="Total progress" />
    </svg>
  );
};

export default Pie;
