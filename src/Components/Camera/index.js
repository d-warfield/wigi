import React, { useState, useRef } from "react";
import { View, TouchableOpacity, Dimensions, Animated } from "react-native";
import styled from "styled-components";
import { Camera } from "expo-camera";
import { uploadStory } from "helpers";
import { useStateValue } from "context";
import * as Haptics from "expo-haptics";
import { getUnixTime } from "date-fns";
import { colorScheme, windowWidth } from "constants";
import RotateIcon from "icons/solid/rotate";
import * as ImageManipulator from "expo-image-manipulator";
import { useApolloClient } from "@apollo/client";

const feedWidthMultiplier = 1.8;
const MessageList = styled(Animated.View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  flex: 1;
`;
const CameraComponent = styled(Camera)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${windowWidth * 0.085}px;
  overflow: hidden;
`;
const CircleContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 2;
  padding: 0 0 10px 0;
`;
const CameraWrapper = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${windowWidth * 0.085}px;
  box-shadow: 0px 0px 10px rgba(1, 1, 1, 0.05);
`;
const Circle = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 85px;
  width: 85px;
  border-radius: 100px;
  border: 10px solid ${colorScheme === "light" ? "#d6d7dc" : "#777777"};
  z-index: 200;
`;
const ControlWrapper = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  background-color: rgba(1, 1, 1, 0.1);
  position: absolute;
  right: 10px;
  top: 10px;
  z-index: 1;
  border-radius: 100px;
`;
function Cam() {
  const [{ profile, selectedUser }] = useStateValue();
  const [type, setType] = useState(Camera.Constants.Type.back);
  const client = useApolloClient();
  const cameraRef = useRef();

  let lastTap = null;

  const uploadCallback = (event) => {};

  const handlePhoto = async () => {
    if (cameraRef.current) {
      let photo = await cameraRef.current.takePictureAsync({
        exif: false,
      });
      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        type === 2
          ? [{ rotate: 180 }, { flip: ImageManipulator.FlipType.Vertical }]
          : [],
        {
          compress: 0,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const newMessage = {
        __typename: "Message",
        chatId: selectedUser.chatId,
        createdAt: getUnixTime(new Date()),
        image: null,
        message: null,
        messageId: parseInt(Date.now()).toString(),
        recipientId: selectedUser.friendId,
        sender: profile.userId,
        url: manipResult.uri,
      };

      client.cache.modify({
        id: client.cache.identify({
          __typename: "Chat",
          chatId: selectedUser.chatId,
        }),
        fields: {
          chatData(existing) {
            return {
              ...existing,
              messages: [...existing.messages, newMessage],
            };
          },
        },
      });
      await uploadStory(
        manipResult.uri,
        selectedUser.friendId,
        uploadCallback,
        type
      );
    }
  };
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 250;
    if (lastTap && now - lastTap < DOUBLE_PRESS_DELAY) {
      setType(
        type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
      );
    } else {
      lastTap = now;
    }
  };
  const handleRotate = () => {
    setType(
      type === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };
  return (
    <MessageList>
      <CameraWrapper activeOpacity={1} onPress={handleDoubleTap}>
        <ControlWrapper onPress={handleRotate}>
          <RotateIcon fill={"white"} />
        </ControlWrapper>

        <CameraComponent
          style={{
            width: windowWidth / feedWidthMultiplier,
            height: windowWidth / feedWidthMultiplier,
          }}
          type={type}
          ref={cameraRef}
        />
      </CameraWrapper>
      <CircleContainer
        style={{
          zIndex: 2,
        }}
      >
        <Circle
          onPressIn={() =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
          }
          activeOpacity={1}
          onPress={handlePhoto}
          delayLongPress={200}
          disabled={!selectedUser?.friendId}
        ></Circle>
      </CircleContainer>
    </MessageList>
  );
}
export default Cam;
