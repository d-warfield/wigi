import React from "react";
import { Svg, Path } from "react-native-svg";

function Chat(props) {
  return (
    <Svg
      width={props.width || "27"}
      height={props.height || "27"}
      fill={props.fill || "black"}
      id="Capa_1"
      enable-background="new 0 0 511.096 511.096"
      viewBox="0 0 511.096 511.096"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path d="m74.414 480.548h-36.214l25.607-25.607c13.807-13.807 22.429-31.765 24.747-51.246-59.127-38.802-88.554-95.014-88.554-153.944 0-108.719 99.923-219.203 256.414-219.203 165.785 0 254.682 101.666 254.682 209.678 0 108.724-89.836 210.322-254.682 210.322-28.877 0-59.01-3.855-85.913-10.928-25.467 26.121-59.973 40.928-96.087 40.928z" />
    </Svg>
  );
}

export default Chat;