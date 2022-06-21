import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import styled from "styled-components";
import {
  PrimaryYellow,
  colorScheme,
  SecondaryWhite,
  windowWidth,
  PrimaryBlue,
} from "constants";
import Wand from "icons/solid/wand";
import TriangleIcon from "icons/solid/triangle";
import { useNavigation } from "@react-navigation/native";
import XMarkIcon from "icons/solid/xmark";
import { storeKey } from "helpers";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const InvitesContainer = styled(Animated.View)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  z-index: 10;
`;
const InvitesWrapper = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 15px;
  width: 95%;
  padding: 16px 0;
  margin: -8px 0 0 0;
`;
const InvitesHeaderContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;
const InvitesHeader = styled(Text)`
  font-family: P-Bold;
  color: white;
  font-size: 17px;
  margin: 0 0 0 10px;
`;
const InvitesDescription = styled(Text)`
  font-family: P-Medium;
  color: white;
  margin: 5px 0 0 0;
  text-align: center;
`;
const WandContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: -8px 0 0 0;
`;
const TriangleContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
  padding: 0 0 0 0;
  position: absolute;
  top: -18px;
  right: ${windowWidth * 0.05}px;
`;
const TriangleBuffer = styled(View)`
  position: absolute;
  height: 4px;
  width: 50px;
  background-color: ${PrimaryBlue};
  bottom: 2.8px;
`;

const XMarkContainer = styled(TouchableOpacity)`
  position: absolute;
  right: 18px;
  transform: rotate(45deg);
`;

function Invite({
  backgroundColor,
  amount,
  disable,
  swiped,
  enabledByLogin,
  openInvitesBottomSheet,
}) {
  const navigation = useNavigation();
  const [show, setShow] = useState(true);

  const animation = useSharedValue(70);
  const margin = useSharedValue(20);

  useEffect(() => {
    let timer = setTimeout(() => {
      animation.value = 0;
      margin.value = 0;
      setTimeout(() => {
        setShow(false);
      }, 100);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (swiped === "toMiddlePanel" || enabledByLogin) {
      animation.value = 70;
      margin.value = 20;
    } else {
      animation.value = 0;
      margin.value = 0;
    }
  }, [swiped]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      height: withTiming(animation.value, {
        duration: 150,
      }),
      marginTop: withTiming(margin.value, {
        duration: 150,
      }),
    };
  });

  const closeInviteModal = async () => {
    setShow(false);
    await storeKey("hideInviteModal", "true");
  };

  return (
    <>
      {show ? (
        <InvitesContainer style={animationStyle}>
          {swiped === "toMiddlePanel" && (
            <>
              {!disable && (
                <TriangleContainer>
                  <TriangleIcon
                    height={20}
                    width={20}
                    stroke={"rgba(0, 0, 0, .1)"}
                    fill={
                      backgroundColor
                        ? "white"
                        : colorScheme === "light"
                        ? "black"
                        : "#19a8fc"
                    }
                  />
                  {/* <TriangleBuffer
                    style={{
                      backgroundColor: backgroundColor
                        ? "white"
                        : colorScheme === "light"
                        ? "black"
                        : "#19a8fc",
                    }}
                  /> */}
                </TriangleContainer>
              )}
              <InvitesWrapper
                onPress={openInvitesBottomSheet}
                activeOpacity={1}
                style={{
                  backgroundColor: backgroundColor
                    ? "black"
                    : colorScheme === "light"
                    ? "black"
                    : "#19a8fc",
                }}
              >
                <InvitesHeaderContainer>
                  <WandContainer>
                    <Wand
                      fillStars={PrimaryYellow}
                      fill={backgroundColor ? "white" : "white"}
                    />
                  </WandContainer>
                  <InvitesHeader
                    style={{ color: backgroundColor ? "white" : "white" }}
                  >
                    You have {amount} invites
                  </InvitesHeader>
                </InvitesHeaderContainer>
                <InvitesDescription
                  style={{ color: backgroundColor ? "white" : "white" }}
                >
                  Only invite your favorite people!
                </InvitesDescription>
                {!disable && (
                  <XMarkContainer onPress={closeInviteModal}>
                    <XMarkIcon
                      fill={colorScheme === "light" ? SecondaryWhite : "white"}
                      height={16}
                      width={16}
                    />
                  </XMarkContainer>
                )}
              </InvitesWrapper>
            </>
          )}
        </InvitesContainer>
      ) : null}
    </>
  );
}
export default Invite;
