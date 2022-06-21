import React from "react";
import { Svg, Path, Rect } from "react-native-svg";

function Roate(props) {
  return (
    <Svg
      height={props.height || "22"}
      width={props.width || "22"}
      id="Layer_1"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 493 500"
      fill={props.fill || "black"}
    >
      <Path
        class="cls-1"
        d="M246.48,193.82a60.66,60.66,0,1,0,60.65,60.66A60.66,60.66,0,0,0,246.48,193.82Zm0,81a20.35,20.35,0,1,1,20.35-20.35A20.36,20.36,0,0,1,246.48,274.83Z"
      />
      <Path
        class="cls-1"
        d="M410.75,255.66a25.36,25.36,0,0,1-25.36-25.35V177.05c-.87-25.24-10.55-43.16-29.57-54.79a85.53,85.53,0,0,0-31.44-11.16H189.45a25.36,25.36,0,1,1,0-50.72H326.8l1,.08a133.51,133.51,0,0,1,52.24,17.2,110.48,110.48,0,0,1,37.59,35.41c11.5,17.73,17.71,38.85,18.46,62.77v54.47A25.35,25.35,0,0,1,410.75,255.66Z"
      />
      <Rect
        class="cls-1"
        x="141.68"
        y="45.64"
        width="50.02"
        height="131.94"
        rx="20.68"
        transform="translate(-28.25 158.95) rotate(-47.45)"
      />
      <Rect
        class="cls-1"
        x="101.87"
        y="29.6"
        width="131.94"
        height="50.02"
        rx="20.68"
        transform="translate(2.52 116.42) rotate(-38.52)"
      />
      <Path
        class="cls-1"
        d="M82.68,242.75A25.35,25.35,0,0,1,108,268.11v53.26c.88,25.23,10.56,43.16,29.58,54.79A85.56,85.56,0,0,0,169,387.32H304A25.36,25.36,0,1,1,304,438H166.63l-1-.08a133.23,133.23,0,0,1-52.24-17.2,110.37,110.37,0,0,1-37.59-35.4c-11.5-17.73-17.71-38.85-18.46-62.77V268.11A25.35,25.35,0,0,1,82.68,242.75Z"
      />
      <Rect
        class="cls-1"
        x="301.72"
        y="320.83"
        width="50.02"
        height="131.94"
        rx="20.68"
        transform="translate(-179.17 365.96) rotate(-47.45)"
      />
      <Rect
        class="cls-1"
        x="259.61"
        y="418.8"
        width="131.94"
        height="50.02"
        rx="20.68"
        transform="translate(-205.55 299.37) rotate(-38.52)"
      />
    </Svg>
  );
}

export default Roate;