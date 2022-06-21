import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, Text, Animated, Keyboard } from "react-native";
import { useStateValue } from "context";
import styled from "styled-components";
import {
  windowWidth,
  PrimaryBorderColor,
  SecondaryText,
  PrimaryYellow,
  colorScheme,
  PrimaryBlue,
  PrimaryBorderWidth,
  PrimaryRed,
} from "constants";

import { getUnixTime } from "date-fns";
import { uploadStory } from "helpers";
import { TouchableOpacity } from "react-native-gesture-handler";
import SEND_MESSAGE from "gql/sendMessage";
import TRIGGER_TYPING from "gql/triggerTyping";
import { useApolloClient } from "@apollo/client";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ArrowIcon from "icons/solid/send";
import CameraIcon from "icons/solid/camera";
import Friends from "views/Friends";
import ImageIcon from "icons/solid/image";
import * as ImagePicker from "expo-image-picker";
import KeyboardIcon from "icons/solid/keyboard";
import SpeechBubble from "components/SpeechBubble";
import { BlurView } from "expo-blur";

const MessageInputContainer = styled(Animated.View)`
  display: flex;
  flex-direction: column;
  min-width: 100%;
  background-color: ${colorScheme === "light"
    ? "rgba(247, 247, 247, .3)"
    : "#00000010"};
  overflow: visible;
  z-index: 0;
`;

const MessageInputTop = styled(View)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-direction: row;
  width: 100%;
  padding: 6px 0px 6px 15px;
  background-color: transparent;
`;

const MessageInputWrapper = styled(Animated.View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  margin: 0px 12px 0 0px;
  border-radius: 100px;
  min-height: 35px;
  padding: 0 4px 0 15px;
  background-color: ${colorScheme === "light"
    ? " rgba(255, 255, 255, 0.5)"
    : "rgba(1,1,1, 0.1)"};
  border: ${colorScheme === "light" ? PrimaryBorderWidth : PrimaryBorderWidth}
    solid ${colorScheme === "light" ? "#CBCBCB" : PrimaryBorderColor};
`;
const MessageInput = styled(TextInput)`
  font-family: P-Medium;
  color: ${colorScheme === "light" ? "black" : "white"};
  font-size: 16px;
  flex: 1;
  margin: -4px 0 0 0;
`;
const MessageOption = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  max-height: 40px;
  min-width: 40px;
  min-height: 40px;
  min-width: 40px;
  border-radius: 22.5px;
`;
const TextCountContainer = styled(Text)`
  font-family: P-Bold;
  position: absolute;
  color: ${colorScheme === "light" ? SecondaryText : PrimaryBlue};
  font-size: 10px;
`;
const ArrowIconContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

function MessageBar({ handleOpenSearchBottomSheet, handleOpenBottomSheet }) {
  const [{ profile, selectedUser, isKeyboardVisible, typingUsers }, dispatch] =
    useStateValue();
  const messageRef = useRef();
  const [text, onChangeText] = useState("");
  const client = useApolloClient();
  const [color, setColor] = useState("#999999");
  const [progressBackgroundColor, setProgressBackgroundColor] = useState(
    "rgba(0, 122, 255, 0.4)"
  );
  const [textCount, setTextCount] = useState(text.length);
  const [height, setHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const inputHeightAnim = useRef(new Animated.Value(40)).current;
  const timeoutRef = useRef(null);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const defaultInputHeight = 36;

  useEffect(() => {
    if (!text.length) return;
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    } else {
      console.log("trigger");
      client.mutate({
        mutation: TRIGGER_TYPING,
        variables: {
          recipientId: selectedUser.friendId,
          typing: true,
        },
      });
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      console.log("end trig");
      client.mutate({
        mutation: TRIGGER_TYPING,
        variables: {
          recipientId: selectedUser.friendId,
          typing: false,
        },
      });
    }, 1000);
  }, [text]);

  useEffect(() => {
    if (textCount < 60) {
      setColor(
        colorScheme === "light"
          ? "rgba(153, 153, 153, 0.50)"
          : "rgba(153, 153, 153, 0.50)"
      );
      setProgressBackgroundColor("rgba(153, 153, 153, 0.50)");
    } else if (textCount < 85 && textCount > 60) {
      setColor(PrimaryYellow);
      setProgressBackgroundColor("rgba(255, 214, 10, 0.47)");
    } else if (textCount > 85) {
      setColor(PrimaryRed);
      setProgressBackgroundColor("rgba(255, 45, 85, 0.4)");
    }
  }, [textCount]);

  useEffect(() => {
    if (text.length === 0 || !isKeyboardVisible) {
      Animated.timing(inputHeightAnim, {
        toValue: defaultInputHeight,
        duration: 140,
        useNativeDriver: false,
      }).start();
    } else {
      if (height.height > 25 && height.height < 47) {
        Animated.timing(inputHeightAnim, {
          toValue: 60,
          duration: 100,
          useNativeDriver: false,
        }).start();
      }
      if (height.height > 47 && height.height < 66) {
        Animated.timing(inputHeightAnim, {
          toValue: 85,
          duration: 100,
          useNativeDriver: false,
        }).start();
      }
      if (height.height > 67 && height.height < 92) {
        Animated.timing(inputHeightAnim, {
          toValue: 110,
          duration: 100,
          useNativeDriver: false,
        }).start();
      }
      if (height.height > 92) {
        Animated.timing(inputHeightAnim, {
          toValue: 130,
          duration: 100,
          useNativeDriver: false,
        }).start();
      }
      if (height.height < 25) {
        Animated.timing(inputHeightAnim, {
          toValue: defaultInputHeight,
          duration: 50,
          useNativeDriver: false,
        }).start();
      }
    }
  }, [height, isKeyboardVisible]);

  useEffect(() => {
    setTextCount((text.length / 100) * 100);
  }, [text]);

  const closeKeyboard = () => {
    setColor("black");
    Animated.timing(inputHeightAnim, {
      toValue: defaultInputHeight,
      duration: 50,
      useNativeDriver: false,
    }).start();
  };
  const handleBlur = () => {
    if (isKeyboardVisible) {
      closeKeyboard();
      Keyboard.dismiss();
    }
  };

  const handleFocus = () => {
    messageRef.current.focus();
  };
  const sendMessage = async () => {
    if (text.length >= 1) {
      onChangeText("");
      await client.mutate({
        mutation: SEND_MESSAGE,
        variables: {
          chatId: selectedUser.chatId,
          message: text,
        },
        optimisticResponse: {
          sendMessage: {
            __typename: "Message",
            chatId: selectedUser.chatId,
            createdAt: getUnixTime(new Date()),
            image: null,
            message: text,
            messageId: parseInt(Date.now()).toString(),
            recipientId: selectedUser.friendId,
            sender: profile.userId,
            url: null,
            optimistic: true,
          },
        },
        update(cache, { data }) {
          const message = data?.sendMessage;

          const newMessage = {
            ...message,
            disableAnimation: message.optimistic ? false : true,
          };

          const id = cache.identify({
            __typename: "Chat",
            chatId: data?.sendMessage.chatId,
          });

          cache.modify({
            id: id,
            fields: {
              chatData(existing) {
                return {
                  ...existing,
                  messages: [...existing.messages, newMessage],
                };
              },
            },
          });
        },
      });
    }
  };

  const uploadCallback = (event) => {};

  const pickImage = async () => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Enable camera roll permissions to pick a photo");
        }
      }
    })();

    let photo = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (photo.cancelled) return;

    const newMessage = {
      __typename: "Message",
      chatId: selectedUser.chatId,
      createdAt: getUnixTime(new Date()),
      image: null,
      message: null,
      messageId: parseInt(Date.now()).toString(),
      recipientId: selectedUser.friendId,
      sender: profile.userId,
      url: photo.uri,
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

    await uploadStory(photo.uri, selectedUser.friendId, uploadCallback);
  };

  return (
    <BlurView
      intensity={100}
      tint={colorScheme === "light" ? "default" : "dark"}
    >
      <MessageInputContainer
        style={{
          paddingBottom: !isKeyboardVisible ? insets.bottom : 0,
          transform: [{ translateY: slideAnim }],
        }}
      >
        <SpeechBubble animate={typingUsers.includes(selectedUser?.friendId)} />

        <MessageInputTop>
          <MessageOption activeOpacity={1}>
            {!isKeyboardVisible ? (
              <TouchableOpacity onPress={pickImage}>
                <ImageIcon fill={"#999999"} />
              </TouchableOpacity>
            ) : (
              <>
                {textCount > 60 && (
                  <TextCountContainer style={{ color: color }}>
                    {textCount.toFixed(0)}
                  </TextCountContainer>
                )}

                <AnimatedCircularProgress
                  size={textCount > 60 ? 30 : 25}
                  width={2}
                  backgroundWidth={2}
                  fill={textCount}
                  tintColor={`${color}`}
                  backgroundColor={`${progressBackgroundColor}`}
                  padding={1}
                  lineCap="round"
                  rotation={0}
                />
              </>
            )}
          </MessageOption>

          <MessageOption onPress={isKeyboardVisible ? handleBlur : handleFocus}>
            {!isKeyboardVisible ? (
              <KeyboardIcon fill={"#999999"} />
            ) : (
              <CameraIcon fill="#999999" />
            )}
          </MessageOption>

          <MessageInputWrapper
            style={{
              height: inputHeightAnim,
              width: windowWidth * 0.65,
              borderRadius: height?.height > 30 ? 19 : 100,
            }}
          >
            <MessageInput
              onContentSizeChange={(event) => {
                setHeight({ height: event.nativeEvent.contentSize.height });
              }}
              onChangeText={async (inputText) => {
                if (inputText[inputText.length - 1] === "\n") {
                  onChangeText("");
                } else {
                  onChangeText(inputText);
                }
              }}
              value={text}
              ref={messageRef}
              onBlur={handleBlur}
              showsVerticalScrollIndicator={false}
              autoCorrect={true}
              spellCheck={true}
              selectionColor={PrimaryBlue}
              multiline={true}
              editable={selectedUser?.friendId ? true : false}
              placeholder={`Message ${
                (selectedUser?.profile?.displayName ||
                  selectedUser?.profile?.username ||
                  "someone") + "..."
              }`}
              placeholderTextColor={"#C2C2C2"}
              maxLength={100}
            />
            <ArrowIconContainer
              onTouchEnd={sendMessage}
              style={{
                justifyContent: height?.height > 30 ? "flex-end" : "center",
                paddingBottom: height?.height > 30 && 4,
              }}
            >
              <ArrowIcon
                fill={textCount === 0 ? "#999999" : PrimaryBlue}
                fillArrow={
                  colorScheme === "light"
                    ? textCount > 0
                      ? "white"
                      : "white"
                    : "black"
                }
              />
            </ArrowIconContainer>
          </MessageInputWrapper>
        </MessageInputTop>

        <Friends
          handleOpenSearchBottomSheet={handleOpenSearchBottomSheet}
          handleOpenBottomSheet={handleOpenBottomSheet}
        />
      </MessageInputContainer>
    </BlurView>
  );
}
export default MessageBar;
