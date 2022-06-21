import React, { useState, useEffect } from "react";
import { Image, View, TouchableOpacity } from "react-native";
import styled from "styled-components";
import Modal from "react-native-modal";
import CachedImage from "components/CachedImage";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useStateValue } from "context";
import { BlurView } from "expo-blur";
import { colorScheme } from "constants";
import { windowWidth } from "constants";

const feedWidthMultiplier = 1.8;

const Container = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;
const PressableMediaContainer = styled(Animated.View)`
  width: 100%;
  height: 100%;
  width: ${windowWidth / feedWidthMultiplier}px;
  height: ${windowWidth / feedWidthMultiplier}px;
  box-shadow: 0px 0px 10px rgba(1, 1, 1, 0.05);
`;
const StyledCachedImage = styled(CachedImage)`
  border-radius: ${parseInt(windowWidth * 0.085)}px;
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 0;
`;
const StyledImage = styled(Image)`
  border-radius: ${parseInt(windowWidth * 0.085)}px;
  width: 100%;
  aspect-ratio: 1;
  z-index: 0;
`;

const ModalContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  height: 100%;
  flex-direction: row;
  flex: 1;
`;

const ContentWrapper = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-direction: row;
  padding: 0 15px;
`;

function Media({ media, animate, index, sender }) {
  const [{ isKeyboardVisible, profile }, dispatch] = useStateValue();
  const [modalVisible, setModalVisible] = useState(false);

  const animation = useSharedValue(animate ? 200 : 0);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(animation.value, {
            duration: 200,
          }),
        },
      ],
    };
  });

  useEffect(() => {
    if (animate) {
      animation.value = 0;
    } else {
      animation.value = 0;
    }
  }, []);

  const handleFocus = () => {
    animation.value = windowWidth;
  };

  return (
    <>
      <Container
        activeOpacity={0.95}
        onPress={() => setModalVisible(!modalVisible)}
        style={{
          marginBottom: index === 0 && isKeyboardVisible ? 0 : 15,
          justifyContent: profile.userId === sender ? "flex-end" : "flex-start",
        }}
      >
        <PressableMediaContainer style={animationStyle}>
          {media.image ? (
            <StyledCachedImage
              isBackground
              source={{ uri: media.url }}
              cacheKey={media.messageId}
              borderRadius={windowWidth * 0.085}
            />
          ) : (
            <StyledImage
              isBackground
              source={{ uri: media.url }}
              borderRadius={windowWidth * 0.085}
            />
          )}
        </PressableMediaContainer>
      </Container>
      <Modal
        style={{ margin: 0 }}
        backdropColor="white"
        backdropOpacity={0.1}
        animationIn="zoomIn"
        animationOut="zoomOut"
        swipeDirection={["down", "left", "right", "up"]}
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(!modalVisible)}
        onSwipeComplete={() => setModalVisible(!modalVisible)}
        animationInTiming={100}
      >
        <ModalContainer>
          <BlurView
            intensity={100}
            tint={colorScheme === "light" ? "default" : "dark"}
          >
            <ContentWrapper>
              {media.image ? (
                <StyledCachedImage
                  isBackground
                  source={{ uri: media.url }}
                  cacheKey={media.messageId}
                  borderRadius={windowWidth * 0.085}
                />
              ) : (
                <StyledImage
                  isBackground
                  source={{ uri: media.url }}
                  borderRadius={windowWidth * 0.085}
                />
              )}
            </ContentWrapper>
          </BlurView>
        </ModalContainer>
      </Modal>
    </>
  );
}
export default Media;
