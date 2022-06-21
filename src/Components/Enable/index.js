import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  Image,
  Dimensions,
  Keyboard,
  Animated,
} from "react-native";
import styled from "styled-components";
import {
  PrimaryBorderColor,
  PrimaryBorderWidth,
  SecondaryText,
  PrimaryBlue,
  NotificiationsBoxShadow,
} from "constants";
import { Camera } from "expo-camera";
import * as Notifications from "expo-notifications";
import * as Contacts from "expo-contacts";
import * as Haptics from "expo-haptics";
import * as Animatable from "react-native-animatable";
import { useStateValue } from "context";

const windowWidth = Dimensions.get("window").width;
const enableContainerWidth = 1.44;
const Container = styled(Animated.View)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const EnableContainer = styled(View)`
  display: flex;
  flex-direction: column;
  width: ${windowWidth / enableContainerWidth}px;
  background-color: white;
  border-radius: ${windowWidth / 28}px;
  box-shadow: ${NotificiationsBoxShadow};
`;
const EnableContainerTop = styled(View)`
  text-align: center;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 10px;
`;
const EnableContainerBottom = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  border-top-width: ${PrimaryBorderWidth};
  border-color: rgba(1, 1, 1, 0.1);
  height: 55px;
`;
const EnableContainerBottomLeft = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  border-right-width: ${PrimaryBorderWidth};
  border-color: rgba(1, 1, 1, 0.1);
  height: 100%;
`;
const EnableContainerBottomRight = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
`;
const EnableButtonText = styled(Text)`
  color: ${PrimaryBlue};
  font-size: 19px;
  font-family: P-Medium;
`;
const IncorrectContainer = styled(View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 15px 15px;
`;
const EnableType = styled(Text)`
  font-family: P-Bold;
  color: black;
  font-size: 18px;
  font-family: SF-Pro-Semibold;
  text-align: center;
`;
const EnableDescription = styled(Text)`
  text-align: center;
  font-family: SF-Pro-Regular;
  color: black;
  width: 85%;
  margin: 6px 0 0 0;
  font-size: 14px;
`;
const Circle = styled(View)`
  background-color: transparent;
  border-radius: 100px;
  height: ${windowWidth / 5}px;
  width: ${windowWidth / 5}px;
  border: 6px solid ${PrimaryBlue};
`;
const EmojiAnimation = styled(Image)`
  height: ${windowWidth / 4}px;
  width: ${windowWidth / 4}px;
  margin: 1px 0 0 0;
`;
const TryAgainButton = styled(TouchableOpacity)`
  background-color: ${PrimaryBlue};
  padding: 18px 0;
  width: 100%;
  border-radius: 100px;
`;
const TryAgainButtonText = styled(Text)`
  font-family: P-Bold;
  color: white;
  text-align: center;
  font-size: 17px;
`;
const TryAgainDescription = styled(Text)`
  font-family: P-Medium;
  color: black;
  text-align: center;
  font-size: 15px;
  margin: 0 0 15px 0;
  line-height: 20px;
`;
const HandEmojiContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  margin: 30px 0 0 0;
  width: 100%;
  width: ${windowWidth / enableContainerWidth}px;
`;
const HandEmojiLeft = styled(View)`
  width: ${windowWidth / (enableContainerWidth * 2)}px;
`;
const HandEmojiRight = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${windowWidth / (enableContainerWidth * 2)}px;
`;
export default function Enable({
  title,
  errorDescription,
  description,
  type,
  finger,
  circle,
}) {
  const [{ isKeyboardVisible }] = useStateValue();
  const [incorrect, setIncorrect] = useState(false);
  const [state, setState] = useState({
    notifications: false,
    camera: false,
    contacts: false,
  });
  const ref = useRef();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isKeyboardVisible) {
      Animated.spring(scaleAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      Animated.timing(fadeAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [isKeyboardVisible]);
  const PULSE = {
    from: { scale: 1.1 },
    to: { scale: 0.82 },
  };
  const SCALE = {
    from: { scale: 0.1, opacity: 0 },
    to: { scale: 1, opacity: 1 },
  };
  const askPermissions = async (type) => {
    if (type === "Camera") {
      const { status } = await Camera.requestPermissionsAsync();
      if (status === "granted") {
        setState({
          ...state,
          camera: true,
        });
      } else {
        Linking.openURL("app-settings:");
      }
    } else if (type === "Notifications") {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        setState({
          ...state,
          notifications: true,
        });
      } else {
        Linking.openURL("app-settings:");
      }
    } else if (type === "Contacts") {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        setState({
          ...state,
          contacts: true,
        });
      } else {
        Linking.openURL("app-settings:");
      }
    }
  };
  const triggerAlert = () => {
    ref.current.jello();
    setTimeout(() => {
      setIncorrect(!incorrect);
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };
  const triggerTryAgain = () => {
    ref.current.jello();
    setTimeout(() => {
      setIncorrect(!incorrect);
    }, 100);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };
  return (
    <Container style={{ transform: [{ scale: scaleAnim }], opacity: fadeAnim }}>
      <Animatable.View ref={ref}>
        <EnableContainer>
          {incorrect ? (
            <Animatable.View animation={SCALE} duration={200}>
              <IncorrectContainer>
                <TryAgainDescription>{errorDescription}</TryAgainDescription>
                <TryAgainButton onPress={triggerTryAgain}>
                  <TryAgainButtonText>Try Again</TryAgainButtonText>
                </TryAgainButton>
              </IncorrectContainer>
            </Animatable.View>
          ) : (
            <>
              <EnableContainerTop>
                <EnableType>{title}</EnableType>
                <EnableDescription>{description}</EnableDescription>
              </EnableContainerTop>
              <EnableContainerBottom>
                <EnableContainerBottomLeft onPress={triggerAlert}>
                  <EnableButtonText style={{ color: SecondaryText }}>
                    Don't Allow
                  </EnableButtonText>
                </EnableContainerBottomLeft>
                <EnableContainerBottomRight
                  onPress={() => askPermissions(type)}
                >
                  {circle && (
                    <Animatable.View
                      duration={650}
                      animation={PULSE}
                      iterationCount="infinite"
                      direction="alternate"
                      ease="linear"
                      style={{ position: "absolute" }}
                    >
                      <Circle />
                    </Animatable.View>
                  )}
                  <EnableButtonText>OK</EnableButtonText>
                </EnableContainerBottomRight>
              </EnableContainerBottom>
            </>
          )}
        </EnableContainer>
      </Animatable.View>
      {finger && (
        <>
          {!incorrect && (
            <HandEmojiContainer>
              <HandEmojiLeft />
              <HandEmojiRight>
                <Text style={{ fontSize: 65, marginLeft: -12 }}>☝</Text>
              </HandEmojiRight>
            </HandEmojiContainer>
          )}
        </>
      )}
    </Container>
  );
}
