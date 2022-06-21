import React from "react";
import { Svg, Path } from "react-native-svg";

function Chat(props) {
  return (
    <Svg
      fill={props.fill || "black"}
      width={props.width || "40"}
      height={props.height || "40"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 139.89 134.81"
    >
      <Path d="M99.51,134.81a8.36,8.36,0,0,0,6.59-2.68,10.59,10.59,0,0,0,2.4-7.33V110.11h2.29A31.25,31.25,0,0,0,126,106.52a25.2,25.2,0,0,0,10.23-10.33,33.19,33.19,0,0,0,3.66-16.06V30a33.5,33.5,0,0,0-3.59-16A24.67,24.67,0,0,0,126,3.61,33.48,33.48,0,0,0,109.91,0H30A33.51,33.51,0,0,0,13.89,3.61,24.72,24.72,0,0,0,3.59,13.94,33.62,33.62,0,0,0,0,30V80.13a33.65,33.65,0,0,0,3.59,16,24.7,24.7,0,0,0,10.3,10.32A33.51,33.51,0,0,0,30,110.11H66.36L87.84,129A35.67,35.67,0,0,0,94,133.42,11.48,11.48,0,0,0,99.51,134.81ZM96,118.75,76.07,99.32a12.71,12.71,0,0,0-4-2.93,12.82,12.82,0,0,0-4.8-.74H30.76a19.62,19.62,0,0,1-9-1.85,12.22,12.22,0,0,1-5.45-5.49,19.84,19.84,0,0,1-1.83-9V30.76a20,20,0,0,1,1.83-9,12.08,12.08,0,0,1,5.45-5.47,19.89,19.89,0,0,1,9-1.83h78.37a20.08,20.08,0,0,1,9.06,1.83,11.91,11.91,0,0,1,5.44,5.47,20.09,20.09,0,0,1,1.81,9V79.35a20,20,0,0,1-1.81,9,12.05,12.05,0,0,1-5.44,5.49,19.81,19.81,0,0,1-9.06,1.85h-7.76a5.86,5.86,0,0,0-4,1.22c-.91.82-1.36,2.22-1.36,4.2Z" />
    </Svg>
  );
}

export default Chat;