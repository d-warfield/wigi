import React from "react";
import { View } from "react-native";
import { Svg, Path } from "react-native-svg";

function Question(props) {
  return (
    <Svg
      height={props.height || "34"}
      width={props.width || "34"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 131.69 131.69"
    >
      <Path
        fill={props.fill || "black"}
        class="cls-1"
        d="M65.82,131.69a63.28,63.28,0,0,0,20.68-3.37,67.43,67.43,0,0,0,18.09-9.42,66.51,66.51,0,0,0,14.31-14.31,67.43,67.43,0,0,0,9.42-18.09,65.14,65.14,0,0,0,0-41.36,66.68,66.68,0,0,0-9.45-18.07,67.79,67.79,0,0,0-14.3-14.3,66,66,0,0,0-18.1-9.43,65.66,65.66,0,0,0-41.35,0,65.5,65.5,0,0,0-18.07,9.43,67.93,67.93,0,0,0-14.28,14.3A66.07,66.07,0,0,0,3.34,45.14a65.69,65.69,0,0,0,0,41.36,66.91,66.91,0,0,0,41.8,41.82A63.28,63.28,0,0,0,65.82,131.69Z"
      />
      <Path
        fill={props.fillQuestionMark || "white"}
        class="cls-2"
        d="M64.26,78.32a8.43,8.43,0,0,1-5.4-1.51A5.45,5.45,0,0,1,57,72.31v-.68a10.19,10.19,0,0,1,2.2-6.69,28.27,28.27,0,0,1,5.66-5.13A53.53,53.53,0,0,0,71,55.08a6.31,6.31,0,0,0,2-4.79,6.12,6.12,0,0,0-2.22-4.81A8.48,8.48,0,0,0,65,43.55a9.51,9.51,0,0,0-3.37.59,9,9,0,0,0-2.86,1.76,11.62,11.62,0,0,0-2.27,2.88l-.78,1.07A6.75,6.75,0,0,1,53.37,52a7,7,0,0,1-3.27.74A5.7,5.7,0,0,1,46,51.05,5.46,5.46,0,0,1,44.29,47a8.47,8.47,0,0,1,.19-1.85A11.83,11.83,0,0,1,45,43.36a13.72,13.72,0,0,1,4-5.79,21.23,21.23,0,0,1,7.27-4.07,30.48,30.48,0,0,1,10-1.52,28.11,28.11,0,0,1,11.11,2.13,19.29,19.29,0,0,1,8,6,14.83,14.83,0,0,1,3,9.3,13.56,13.56,0,0,1-2.66,8.74A31.5,31.5,0,0,1,78,64.75a30.72,30.72,0,0,0-4.74,3.76,7.29,7.29,0,0,0-2.15,4.19,1.4,1.4,0,0,0,0,.4,2,2,0,0,1,0,.48A5,5,0,0,1,68.92,77,7.7,7.7,0,0,1,64.26,78.32ZM64.21,99a8.76,8.76,0,0,1-5.91-2.1,6.8,6.8,0,0,1-2.44-5.42,6.93,6.93,0,0,1,2.42-5.44,8.64,8.64,0,0,1,5.93-2.12,8.5,8.5,0,0,1,5.86,2.12,7,7,0,0,1,2.39,5.44A6.89,6.89,0,0,1,70.07,97,8.66,8.66,0,0,1,64.21,99Z"
      />
    </Svg>
  );
}

export default Question;