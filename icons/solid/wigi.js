import React from "react";
import { Svg, Path, Circle } from "react-native-svg";

function Wigi(props) {
  return (
    <Svg
      height={props.height || 800}
      width={props.width || 800}
      fill={props.fill || "black"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 647.79 744.71"
    >
      <Path d="M.74,284.63.9,47.73C1.29,5.4,31.48-12,68.33,8.8l140.1,80.89A351.66,351.66,0,0,0,.74,284.63ZM0,420.82C0,241.94,145,96.92,323.9,96.92a324.29,324.29,0,0,1,84.61,11.17l171-99.29c36.85-20.83,67-3.4,67.43,38.93l.9,373.09c0,178.88-145,323.89-323.89,323.89S0,599.7,0,420.82ZM323.89,464c-65,0-91.34,35.19-58.84,78.6s85.19,43.4,117.69,0S388.89,464,323.89,464ZM124.27,354.28c-17.1,12.32,1.36,38,18.46,25.65,33.21-23.57,77.89-28.34,103.94,11.61,11.51,17.64,38,.38,26.47-17.26-33.27-51-86-53.61-133.79-29A126.76,126.76,0,0,0,124.27,354.28Zm399.25,0a126.76,126.76,0,0,0-15.08-9c-47.82-24.64-100.52-22.05-133.79,29-11.5,17.64,15,34.9,26.47,17.26,26.05-40,70.73-35.18,103.94-11.61C522.16,392.24,540.62,366.6,523.52,354.28Z" />
    </Svg>
  );
}

export default Wigi;