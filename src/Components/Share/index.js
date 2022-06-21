import React from "react";
import { TouchableOpacity, Linking, Dimensions } from "react-native";
import styled from "styled-components";
import { PrimaryBlue } from "constants";
import Share from "react-native-share";
import * as Animatable from "react-native-animatable";

const windowWidth = Dimensions.get("window").width;
const circleDimensionMultiplier = 0.145;

const Circle = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${PrimaryBlue};
  min-width: ${windowWidth * circleDimensionMultiplier}px;
  max-width: ${windowWidth * circleDimensionMultiplier}px;
  min-height: ${windowWidth * circleDimensionMultiplier}px;
  max-height: ${windowWidth * circleDimensionMultiplier}px;
  border-radius: 100px;
  z-index: 10;
  margin: 0 0 0 10px;
`;
export default function ShareComponent({ icon, platform, index, color }) {
  const zoomIn = {
    0: {
      opacity: 0,
      scale: 0.3,
    },
    0.5: {
      opacity: 0.5,
      scale: 0.6,
    },
    1: {
      opacity: 1,
      scale: 1,
    },
  };
  const handleShare = async (socialType) => {
    let socialOptions = {};
    switch (socialType) {
      case "INSTAGRAM_STORIES":
        socialOptions = {
          stickerImage: uri,
          social: Share.Social.INSTAGRAM_STORIES,
          backgroundBottomColor: "#FF0000",
          backgroundTopColor: "#FF0000",
        };
        break;
      case "INSTAGRAM":
        socialOptions = {
          stickerImage: uri,
          social: Share.Social.INSTAGRAM,
          backgroundBottomColor: "#FF0000",
          backgroundTopColor: "#FF0000",
        };
        break;
      case "SMS":
        const message = `Will you Wigi me? I wanna photo message with you on our home screens.`;
        const separator = Platform.OS === "ios" ? "&" : "?";
        const url = `sms:${""}${separator}body=${message}`;
        await Linking.openURL(url);
        break;
      case "FACEBOOK":
        socialOptions = {
          title: "Share via",
          message: "some message",
          url: "some share url",
          social: Share.Social.FACEBOOK,
        };
        break;
      case "WHATSAPP":
        socialOptions = {
          title: "Share via",
          message: "some message",
          url: "some share url",
          social: Share.Social.WHATSAPP,
        };
        break;
      default:
        break;
    }
  };
  return (
    <Animatable.View
      key={index}
      animation={zoomIn}
      duration={200}
      delay={index * 50}
    >
      <Circle
        style={{ backgroundColor: color }}
        onPress={() => handleShare(platform)}
      >
        {icon}
      </Circle>
    </Animatable.View>
  );
}
