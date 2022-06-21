import React from "react";
import { Svg, Path, Rect } from "react-native-svg";

function Send(props) {
  return (
    <Svg
      width={props.width || "28"}
      height={props.height || "28"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 103.17 103.17"
    >
      <Path
        fill={props.fill || "black"}
        d="M51.56,103.17a49.87,49.87,0,0,0,20-4A52.22,52.22,0,0,0,88,88,52.92,52.92,0,0,0,99.12,71.53a49.55,49.55,0,0,0,4-20,49.48,49.48,0,0,0-4-19.92A52.88,52.88,0,0,0,88,15.19,51.86,51.86,0,0,0,71.51,4a49.78,49.78,0,0,0-20-4A49.77,49.77,0,0,0,31.62,4,51.91,51.91,0,0,0,15.16,15.19,52.45,52.45,0,0,0,4,31.64,49.64,49.64,0,0,0,0,51.56a49.7,49.7,0,0,0,4,20A52.79,52.79,0,0,0,31.64,99.15,49.8,49.8,0,0,0,51.56,103.17Z"
      />
      <Path
        fill={props.fillArrow || "white"}
        d="M51.61,78a5.86,5.86,0,0,1-4.17-1.57,5.14,5.14,0,0,1-1.69-3.95V50.83l.59-10.11-3.71,5-5.18,5.76a4.68,4.68,0,0,1-3.76,1.66A5,5,0,0,1,30,51.78a4.71,4.71,0,0,1-1.42-3.49,5.61,5.61,0,0,1,1.57-3.91L46.87,27.05a6.16,6.16,0,0,1,4.74-2.2,6.29,6.29,0,0,1,4.79,2.2L73.05,44.38a5.65,5.65,0,0,1,1.56,3.91,4.67,4.67,0,0,1-1.42,3.49,5,5,0,0,1-3.66,1.39,4.6,4.6,0,0,1-3.76-1.66L60.64,45.9l-3.76-5.23.59,10.16V72.51a5.16,5.16,0,0,1-1.68,3.95A5.9,5.9,0,0,1,51.61,78Z"
      />
    </Svg>
  );
}

export default Send;
