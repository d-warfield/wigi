import React from "react";
import { View } from "react-native";
import { Svg, Ellipse, G, Defs, Path, ClipPath } from "react-native-svg";

function ProfileAlternative(props) {
  return (
    <Svg
      fill={props.fill || "black"}
      height={props.height || 200}
      width={props.width || 200}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 263.19 391.38"
    >
      <Defs>
        <ClipPath id="clip-path" transform="translate(-58.86 -17.8)">
          <Ellipse
            class="cls-1"
            cx="190.45"
            cy="175.17"
            rx="190.45"
            ry="175.17"
          />
        </ClipPath>
      </Defs>
      <G id="Layer_2" data-name="Layer 2">
        <G id="Capa_1" data-name="Capa 1">
          <G class="clip-path:url(#clip-path)">
            <Path
              d="M309.44,308.21a59.73,59.73,0,0,0-5-14.82H76.51a59.73,59.73,0,0,0-5,14.82L64,345.93l-4.44,22.3a34.28,34.28,0,0,0,33.6,41H287.79a34.28,34.28,0,0,0,33.6-41Z"
              transform="translate(-58.86 -17.8)"
            />
            <Path
              d="M262.32,261.17,246.17,258a23.58,23.58,0,0,1-18.52-18.33l-3.09-14.86A13.16,13.16,0,0,1,229.05,212a121.53,121.53,0,0,0,35.7-50.88c10.75-1.93,20.53-12.25,23.7-26.45,3.9-17.61-3.85-34.3-17.32-37.3-.15,0-.29,0-.48,0-4-45.72-21.65-79.56-80.21-79.56-57.56,0-75.82,33.84-80.12,79.53-.21,0-.4,0-.54,0-13.48,3-21.22,19.69-17.32,37.3,3.14,14.2,12.93,24.52,23.67,26.45A122,122,0,0,0,151.84,212a13.1,13.1,0,0,1,4.48,12.76l-3.08,14.85A23.56,23.56,0,0,1,134.73,258l-16.14,3.19a59.88,59.88,0,0,0-42.08,32.22H304.4A59.88,59.88,0,0,0,262.32,261.17Z"
              transform="translate(-58.86 -17.8)"
            />
            <Path
              d="M190.45,218.49c-60.93,0-111.8,32.13-123.85,74.9H314.31C302.26,250.62,251.39,218.49,190.45,218.49Z"
              transform="translate(-58.86 -17.8)"
            />
            <Path
              d="M66.6,293.39a71.91,71.91,0,0,0-2.71,19.51c0,52.13,56.67,94.4,126.56,94.4S317,365,317,312.9a71.91,71.91,0,0,0-2.71-19.51Z"
              transform="translate(-58.86 -17.8)"
            />
          </G>
        </G>
      </G>
    </Svg>
  );
}

export default ProfileAlternative;
