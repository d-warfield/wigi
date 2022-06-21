import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import ProfileIcon from "icons/solid/profilealternative";
import { colorScheme } from "constants";
import { LinearGradient } from "expo-linear-gradient";

const BoxShadow = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 10px rgba(132, 136, 143, 0.15);
  height: ${(props) => props.theme.height};
  width: ${(props) => props.theme.width};
`;

const ProfileImageWrapper = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${(props) => props.theme.height};
  width: ${(props) => props.theme.width};
  z-index: 1;
  border-radius: 100px;
  overflow: hidden;
`;

const ProfilePictureWrapper = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  z-index: 0;
  height: 80%;
  width: 80%;
  overflow: hidden;
`;
const ProfileIconPlaceholder = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  margin: 0 0 -22px 0;
`;

const profilePicturePlaceholder = ({ width, height, borderRadius }) => {
  return (
    <BoxShadow
      theme={{
        height,
        width,
        borderRadius,
      }}
    >
      <ProfileImageWrapper
        theme={{
          height,
          width,
          borderRadius,
        }}
      >
        <LinearGradient
          colors={["#A3A8B5", "#84888F"]}
          style={{
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
            minHeight: "100%",
            minWidth: "100%",
            maxHeight: "100%",
            maxWidth: "100%",
            zIndex: 1,
          }}
        >
          <ProfilePictureWrapper
            style={{ backgroundColor: "transparent" }}
            theme={{
              height,
              width,
              borderRadius,
            }}
          >
            <ProfileIconPlaceholder style={{ marginBottom: -20 }}>
              <ProfileIcon
                fill={
                  colorScheme === "light"
                    ? "rgba(255,255,255,1)"
                    : "rgba(1,1,1,.9)"
                }
                height={height}
                width={width}
              />
            </ProfileIconPlaceholder>
          </ProfilePictureWrapper>
        </LinearGradient>
      </ProfileImageWrapper>
    </BoxShadow>
  );
};
export default profilePicturePlaceholder;
