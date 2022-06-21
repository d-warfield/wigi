import React from "react";
import { Svg, Path, Circle } from "react-native-svg";

function Search(props) {
  return (
    <Svg
      width={props.width || "23"}
      height={props.height || "23"}
      viewBox="0 0 25 25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Circle
        cx="11.7666"
        cy="11.7666"
        r="8.98856"
        stroke={props.stroke || "black"}
        strokeWidth={props.strokeWidth || "4.8"}
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <Path
        d="M18.0183 18.4851L21.5423 22"
        stroke={props.stroke || "black"}
        strokeWidth={props.strokeWidth || "4.8"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default Search;
