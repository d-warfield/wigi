import React from "react";
import { Svg, Path, Circle } from "react-native-svg";
import { PrimaryPurple, Background, PrimaryPink } from "constants";

function Pencil(props) {
  return (
    <Svg
      height={props.height || 18}
      width={props.width || 18}
      fill={props.fill || "black"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 119.61 119.54"
    >
      <Path d="M22.83,112.76l77.39-77.44-16-16L6.86,96.74.27,114.27a3.47,3.47,0,0,0,.1,2.91,4.4,4.4,0,0,0,2,2,3.33,3.33,0,0,0,2.76.12ZM108,27.6l8.45-8.45a9.44,9.44,0,0,0,3.13-6.39,8.58,8.58,0,0,0-2.74-6.3l-3.66-3.71A8,8,0,0,0,106.89,0a10,10,0,0,0-6.47,3.18L92,11.54Z" />
    </Svg>
  );
}

export default Pencil;
