import React from "react";
import { Svg, Path, Polygon, Rect } from "react-native-svg";
import { View } from "react-native";

function Triangle(props) {
  return (
    <Svg
      width={props.width || "60"}
      height={props.height || "60"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 305.95 159.59"
    >
      <Path
        fill={props.fill || "white"}
        stroke={props.stroke || "grey"}
        strokeWidth={props.stroke || 8}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M182.43,11.75c-13.09-15.67-45.82-15.67-58.91,0L0,159.59H306Z"
      />
    </Svg>
  );
}

export default Triangle;
