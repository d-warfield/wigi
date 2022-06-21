import React from "react";
import { Svg, Path } from "react-native-svg";

function Edit(props) {
  return (
    <Svg
      width={props.width || "22"}
      height={props.height || "22"}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M11.4923 2.789H7.7533C4.6783 2.789 2.75031 4.966 2.75031 8.048V16.362C2.75031 19.444 4.6693 21.621 7.7533 21.621H16.5773C19.6623 21.621 21.5813 19.444 21.5813 16.362V12.334"
        stroke={props.stroke || "black"}
        strokeWidth="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.8278 10.9209L16.3008 3.4479C17.2318 2.5179 18.7408 2.5179 19.6718 3.4479L20.8888 4.6649C21.8198 5.5959 21.8198 7.1059 20.8888 8.0359L13.3798 15.5449C12.9728 15.9519 12.4208 16.1809 11.8448 16.1809H8.0988L8.1928 12.4009C8.2068 11.8449 8.4338 11.3149 8.8278 10.9209Z"
        stroke={props.stroke || "black"}
        strokeWidth="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M15.1652 4.60251L19.7312 9.16851"
        stroke={props.stroke || "black"}
        strokeWidth="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default Edit;
