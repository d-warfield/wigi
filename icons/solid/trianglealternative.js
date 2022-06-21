import React from "react";
import { Svg, Path, Polygon, Rect } from "react-native-svg";
import { View } from "react-native";

function Triangle(props) {
  return (
    <Svg
      width={props.width || "60"}
      height={props.height || "60"}
      fill={props.fill || "black"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 176.72 147.49"
    >
      <Path d="M135.64,147.49H41.07c-33.44,0-52.82-37.88-33.24-65L55.12,17a41,41,0,0,1,66.48,0l47.29,65.49C188.46,109.61,169.09,147.49,135.64,147.49Z" />
    </Svg>
  );
}

export default Triangle;
