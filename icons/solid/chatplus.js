import React from "react";
import { View } from "react-native";
import { Svg, Path } from "react-native-svg";

function ChatPlus(props) {
  return (
    <View style={{ marginTop: 1.5 }}>
      <Svg
        height={props.height || "25"}
        width={props.width || "25"}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 139.89 135.2"
      >
        <Path
          fill={props.fill || "black"}
          d="M106.86,133.33a7.54,7.54,0,0,0,1.64-5.11V110.11h2.29A31,31,0,0,0,126,106.49a25.36,25.36,0,0,0,10.23-10.32,33.08,33.08,0,0,0,3.66-16V30a33.5,33.5,0,0,0-3.59-16A24.67,24.67,0,0,0,126,3.61,33.48,33.48,0,0,0,109.91,0H30A33.51,33.51,0,0,0,13.89,3.61,24.72,24.72,0,0,0,3.59,13.94,33.62,33.62,0,0,0,0,30V80.13A33.76,33.76,0,0,0,3.59,96.19a24.71,24.71,0,0,0,10.3,10.35A33.17,33.17,0,0,0,30,110.11H70.65l23.64,21a23.18,23.18,0,0,0,4.22,3.1,7.86,7.86,0,0,0,3.78.95A5.73,5.73,0,0,0,106.86,133.33Z"
        />
        <Path
          fill={props.fillPlus || "red"}
          d="M96.48,59.84a6.54,6.54,0,0,1-4.78,1.88H76.56V76.86a6.43,6.43,0,0,1-6.64,6.64,6.71,6.71,0,0,1-4.86-1.88,6.4,6.4,0,0,1-1.93-4.76V61.72H48a6.43,6.43,0,0,1-6.64-6.64,6.6,6.6,0,0,1,1.88-4.88A6.4,6.4,0,0,1,48,48.29H63.13V33.15a6.46,6.46,0,0,1,1.93-4.78,6.65,6.65,0,0,1,4.86-1.91,6.4,6.4,0,0,1,4.76,1.91,6.5,6.5,0,0,1,1.88,4.78V48.29H91.7a6.47,6.47,0,0,1,4.81,1.91,6.64,6.64,0,0,1,1.88,4.88A6.4,6.4,0,0,1,96.48,59.84Z"
        />
      </Svg>
    </View>
  );
}

export default ChatPlus;
