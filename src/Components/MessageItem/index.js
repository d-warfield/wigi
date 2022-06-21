import React, { useRef, useEffect } from "react";
import { View, Text, Animated } from "react-native";
import styled from "styled-components";
import { useStateValue } from "context";
import {
  PrimaryBlue,
  PrimaryLightGrey,
  windowWidth,
  colorScheme,
  PrimaryWhite,
} from "constants";

const feedWidthMultiplier = 1.8;

const Container = styled(Animated.View)`
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  margin: 0 0 2px 0;
`;
const MessageInputWrapper = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-radius: 22px;
  max-width: ${windowWidth / feedWidthMultiplier}px;
`;
const MessageInput = styled(Text)`
  font-family: P-Medium;
  color: black;
  font-size: 16px;
  padding: 8px 16px;
  flex-wrap: wrap;
  flex-shrink: 1;
`;
const MessageBarDotsContainer = styled(View)`
  position: absolute;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
`;
const BigDot = styled(Animated.View)`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  height: 18px;
  width: 18px;
  background-color: ${PrimaryLightGrey};
  border-radius: 100px;
`;
const LittleDot = styled(Animated.View)`
  position: absolute;
  height: 8px;
  width: 8px;
  background-color: yellow;
  border-radius: 100px;
  background-color: ${PrimaryLightGrey};
  bottom: -5.5px;
  right: -5.5px;
`;
function MessageItem({ message, sender, bubbles, spacing, animate }) {
  const [{ profile }] = useStateValue();
  const scaleAnim = useRef(new Animated.Value(0.4)).current;
  const translateXAnim = useRef(
    new Animated.Value(profile.userId === sender ? -180 : 180)
  ).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const scaleBigDotAnim = useRef(new Animated.Value(0)).current;
  const scaleSmallDotAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animate) {
      Animated.timing(translateXAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start();
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.spring(scaleAnim, {
          toValue: 1,
          stiffness: 420,
          damping: 40,
          useNativeDriver: true,
        }).start();
      }, 100);
      setTimeout(() => {
        Animated.spring(scaleBigDotAnim, {
          toValue: 1,
          mass: 1.2,
          useNativeDriver: true,
        }).start();
      }, 10);
      setTimeout(() => {
        Animated.spring(scaleSmallDotAnim, {
          toValue: 1,
          mass: 1.2,
          useNativeDriver: true,
        }).start();
      }, 210);
    }
  }, [animate]);
  return (
    <Container
      style={{
        alignItems:
          sender === "WIGI"
            ? "center"
            : profile.userId === sender
            ? "flex-end"
            : "flex-start",
        marginBottom: spacing ? 15 : 2,
        transform: animate
          ? [
              { scale: scaleAnim },
              { translateX: translateXAnim },
              { translateY: translateYAnim },
            ]
          : [{ scale: 1 }],
      }}
    >
      <MessageInputWrapper
        style={{
          backgroundColor:
            profile.userId === sender
              ? PrimaryBlue
              : colorScheme === "light"
              ? "#E9E9EB"
              : PrimaryWhite,
        }}
      >
        <MessageInput
          style={{
            color:
              profile.userId === sender
                ? colorScheme === "light"
                  ? "white"
                  : "white"
                : colorScheme === "light"
                ? "black"
                : "white",
          }}
        >
          {message}
        </MessageInput>
        {bubbles && (
          <MessageBarDotsContainer
            style={{
              right: profile.userId === sender ? 0 : null,
              left: profile.userId !== sender ? 0 : null,
              transform: [{ scaleX: profile.userId !== sender ? -1 : 1 }],
            }}
          >
            <BigDot
              style={{
                transform: animate
                  ? [{ scale: scaleBigDotAnim }]
                  : [{ scale: 1 }],
                backgroundColor:
                  profile.userId === sender
                    ? PrimaryBlue
                    : colorScheme === "light"
                    ? "#E9E9EB"
                    : PrimaryWhite,
              }}
            >
              <LittleDot
                style={{
                  transform: animate
                    ? [{ scale: scaleSmallDotAnim }]
                    : [{ scale: 1 }],
                  backgroundColor:
                    profile.userId === sender
                      ? PrimaryBlue
                      : colorScheme === "light"
                      ? "#E9E9EB"
                      : PrimaryWhite,
                }}
              />
            </BigDot>
          </MessageBarDotsContainer>
        )}
      </MessageInputWrapper>
    </Container>
  );
}
export default MessageItem;
