import React from "react";
import { Svg, Path } from "react-native-svg";

function Share(props) {
  return (
    <Svg
      width={props.width || "20"}
      height={props.height || "20"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M7.38948 8.984H6.45648C4.42148 8.984 2.77148 10.634 2.77148 12.669V17.544C2.77148 19.578 4.42148 21.228 6.45648 21.228H17.5865C19.6215 21.228 21.2715 19.578 21.2715 17.544V12.659C21.2715 10.63 19.6265 8.984 17.5975 8.984L16.6545 8.984"
        stroke={props.stroke || "white"}
        strokeWidth="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M12.0214 2.19051V14.2315"
        stroke={props.stroke || "white"}
        strokeWidth="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M9.10626 5.1188L12.0213 2.1908L14.9373 5.1188"
        stroke={props.stroke || "white"}
        strokeWidth="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default Share;
