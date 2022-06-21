import React from "react";
import { Svg, Path } from "react-native-svg";

function Profile(props) {
  return (
    <Svg
      fill={props.fill || "black"}
      width={props.width || "20"}
      height={props.height || "20"}
      id="Outline"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <Path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z" />
      <Path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z" />
    </Svg>
  );
}

export default Profile;
