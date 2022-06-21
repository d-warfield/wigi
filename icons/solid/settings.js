import React from "react";
import { Svg, Path, Circle } from "react-native-svg";

function Settings(props) {
  return (
    <Svg
      width={props.width || "24"}
      height={props.height || "24"}
      viewBox="0 0 24 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M22.5029 14.9751C22.95 15.2126 23.295 15.5876 23.5376 15.9626C24.0103 16.7376 23.972 17.6876 23.5121 18.5251L22.6179 20.0251C22.1453 20.8251 21.2638 21.3251 20.3569 21.3251C19.9098 21.3251 19.4115 21.2001 19.0028 20.9501C18.6706 20.7376 18.2874 20.6626 17.8786 20.6626C16.6139 20.6626 15.5536 21.7001 15.5153 22.9376C15.5153 24.3751 14.34 25.5001 12.871 25.5001H11.1336C9.65176 25.5001 8.47657 24.3751 8.47657 22.9376C8.45102 21.7001 7.39073 20.6626 6.12607 20.6626C5.70451 20.6626 5.32127 20.7376 5.00191 20.9501C4.59313 21.2001 4.08215 21.3251 3.64782 21.3251C2.72806 21.3251 1.84662 20.8251 1.37396 20.0251L0.492521 18.5251C0.0198714 17.7126 -0.00567871 16.7376 0.466971 15.9626C0.671371 15.5876 1.0546 15.2126 1.48893 14.9751C1.84662 14.8001 2.07656 14.5126 2.29372 14.1751C2.93245 13.1001 2.54921 11.6876 1.46338 11.0501C0.198709 10.3377 -0.210066 8.75015 0.518071 7.51265L1.37396 6.03765C2.11488 4.80015 3.69892 4.36265 4.97636 5.08765C6.08775 5.68765 7.53126 5.28765 8.18276 4.22515C8.38715 3.87515 8.50212 3.50015 8.47657 3.12515C8.45102 2.63765 8.59153 2.17515 8.83425 1.80015C9.30691 1.02515 10.1628 0.525153 11.0954 0.500153H12.8965C13.8419 0.500153 14.6978 1.02515 15.1704 1.80015C15.4004 2.17515 15.5536 2.63765 15.5153 3.12515C15.4898 3.50015 15.6048 3.87515 15.8091 4.22515C16.4606 5.28765 17.9041 5.68765 19.0283 5.08765C20.293 4.36265 21.8898 4.80015 22.6179 6.03765L23.4738 7.51265C24.2148 8.75015 23.8059 10.3377 22.5285 11.0501C21.4426 11.6876 21.0594 13.1001 21.7109 14.1751C21.9153 14.5126 22.1453 14.8001 22.5029 14.9751ZM8.38715 13.0126C8.38715 14.9751 10.0095 16.5376 12.0151 16.5376C14.0206 16.5376 15.6048 14.9751 15.6048 13.0126C15.6048 11.0501 14.0206 9.47515 12.0151 9.47515C10.0095 9.47515 8.38715 11.0501 8.38715 13.0126Z"
        fill={props.fill || "black"}
      />
    </Svg>
  );
}

export default Settings;