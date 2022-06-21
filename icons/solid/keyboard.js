import React from "react";
import { Svg, Path } from "react-native-svg";

function Keyboard(props) {
  return (
    <Svg
      width={props.width || 32}
      height={props.height || 32}
      fill={props.fill || "black"}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 162.26 104.3"
    >
      <Path d="M21.48,104.3H140.82q10.4,0,15.92-5.5t5.52-15.89V21.34q0-10.41-5.52-15.87T140.82,0H21.48Q11,0,5.49,5.47T0,21.34V82.91Q0,93.37,5.49,98.83T21.48,104.3ZM27,37.65q-3.22,0-3.22-3.23V28.37q0-3.23,3.22-3.22h6q3.27,0,3.27,3.22v6.05q0,3.22-3.27,3.23Zm20.36,0q-3.16,0-3.17-3.23V28.37q0-3.23,3.17-3.22h6q3.27,0,3.27,3.22v6.05q0,3.22-3.27,3.23Zm20.41,0q-3.17,0-3.17-3.23V28.37q0-3.23,3.17-3.22h6q3.27,0,3.27,3.22v6.05q0,3.22-3.27,3.23Zm20.46,0Q85,37.65,85,34.42V28.37q0-3.23,3.22-3.22h6q3.23,0,3.22,3.22v6.05q0,3.22-3.22,3.23Zm20.71,0q-3.57,0-3.57-3.23V28.37q0-3.23,3.57-3.22h5.71q3.16,0,3.17,3.22v6.05q0,3.22-3.17,3.23Zm20.11,0q-3.23,0-3.22-3.23V28.37q0-3.23,3.22-3.22h6q3.23,0,3.22,3.22v6.05q0,3.22-3.22,3.23ZM27,58.4c-2.15,0-3.22-1.08-3.22-3.22V49.07q0-3.23,3.22-3.22h6q3.27,0,3.27,3.22v6.11c0,2.14-1.09,3.22-3.27,3.22Zm20.36,0c-2.11,0-3.17-1.08-3.17-3.22V49.07q0-3.23,3.17-3.22h6q3.27,0,3.27,3.22v6.11c0,2.14-1.09,3.22-3.27,3.22Zm20.41,0c-2.11,0-3.17-1.08-3.17-3.22V49.07q0-3.23,3.17-3.22h6q3.27,0,3.27,3.22v6.11c0,2.14-1.09,3.22-3.27,3.22Zm20.46,0c-2.15,0-3.22-1.08-3.22-3.22V49.07q0-3.23,3.22-3.22h6q3.23,0,3.22,3.22v6.11c0,2.14-1.07,3.22-3.22,3.22Zm20.71,0a3.71,3.71,0,0,1-2.62-.88,3.06,3.06,0,0,1-.95-2.34V49.07a3,3,0,0,1,.95-2.34,3.71,3.71,0,0,1,2.62-.88h5.71q3.16,0,3.17,3.22v6.11c0,2.14-1.06,3.22-3.17,3.22Zm20.11,0c-2.15,0-3.22-1.08-3.22-3.22V49.07q0-3.23,3.22-3.22h6q3.23,0,3.22,3.22v6.11c0,2.14-1.07,3.22-3.22,3.22ZM27,79.1q-3.22,0-3.22-3.22V69.82c0-2.14,1.07-3.22,3.22-3.22h6c2.18,0,3.27,1.08,3.27,3.22v6.06q0,3.23-3.27,3.22Zm20.75,0q-3.55,0-3.56-3.61V70.21c0-2.4,1.19-3.61,3.56-3.61h66.51c2.37,0,3.56,1.21,3.56,3.61v5.28q0,3.62-3.56,3.61Zm81.3,0q-3.23,0-3.22-3.22V69.82c0-2.14,1.07-3.22,3.22-3.22h6c2.15,0,3.22,1.08,3.22,3.22v6.06q0,3.23-3.22,3.22Z" />
    </Svg>
  );
}

export default Keyboard;
