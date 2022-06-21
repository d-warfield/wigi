import React, { useRef, useEffect } from "react";
import { View, Text, Animated } from "react-native";
import styled from "styled-components";
import { useStateValue } from "context";
import {
  PrimaryLightGrey,
  windowWidth,
  colorScheme,
  PrimaryBlue,
} from "constants";
import * as Animatable from "react-native-animatable";

const Container = styled(Animated.View)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: red;
  margin: -25px 15px 0 15px;
  max-width: 100%;
  min-width: 100%;
  z-index: 10;
  position: absolute;
  background-color: red;
`;

const SpeechBubbleWrapper = styled(Animated.View)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: green;
`;

const DotContainer = styled(Animated.View)`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  z-index: 1;
  background-color: ${PrimaryLightGrey};
  padding: 17px 13px;
  border-radius: 100px;
`;
const Dot = styled(Animated.View)`
  height: 10px;
  width: 10px;
  border-radius: 100px;
  margin: 0 2.5px;
  background-color: #99999c;
`;

const MessageBarDotsContainer = styled(View)`
  position: absolute;
  bottom: 0px;
  left: 0px
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%
`;
const MediumDot = styled(Animated.View)`
  position: absolute;
  right: -25px;
  top: 4px;
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
  bottom: -27.5px;
  left: 1px;
`;

function SpeechBubble({ animate }) {
  const [{ profile }] = useStateValue();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const scaleMediumAnim = useRef(new Animated.Value(0)).current;
  const scaleSmallAnim = useRef(new Animated.Value(0)).current;

  const scaleMediumDotAnim = useRef(new Animated.Value(0)).current;
  const scaleSmallDotAnim = useRef(new Animated.Value(0)).current;

  const LARGE_PULSE = {
    0: {
      scale: 1,
    },
    0.5: {
      scale: 1.02,
    },
    1: {
      scale: 1,
    },
  };

  const MEDIUM_PULSE = {
    0: {
      scale: 1,
    },
    0.5: {
      scale: 1.05,
    },
    1: {
      scale: 1,
    },
  };

  const SMALL_PULSE = {
    0: {
      scale: 1,
    },
    0.5: {
      scale: 1.05,
    },
    1: {
      scale: 1,
    },
  };

  const OPACITY = {
    0: {
      opacity: 0.4,
    },

    1: {
      opacity: 1,
    },
  };

  useEffect(() => {
    if (animate === true) {
      setTimeout(() => {
        Animated.spring(fadeAnim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: false,
        }).start();

        Animated.spring(scaleAnim, {
          toValue: 1,

          useNativeDriver: false,
        }).start();

        setTimeout(() => {
          Animated.spring(scaleMediumAnim, {
            toValue: 1,
            mass: 1.1,
            useNativeDriver: true,
          }).start();
        }, 50);
        setTimeout(() => {
          Animated.spring(scaleSmallAnim, {
            toValue: 1,
            mass: 1.1,
            useNativeDriver: true,
          }).start();
        }, 100);
      }, 50);
    } else {
      setTimeout(() => {
        Animated.spring(fadeAnim, {
          toValue: 0,
          duration: 120,
          useNativeDriver: false,
        }).start();

        Animated.spring(scaleAnim, {
          toValue: 0,

          useNativeDriver: false,
        }).start();

        setTimeout(() => {
          Animated.spring(scaleMediumAnim, {
            toValue: 0,
            mass: 1.1,
            useNativeDriver: true,
          }).start();
        }, 10);
        setTimeout(() => {
          Animated.spring(scaleSmallAnim, {
            toValue: 0,
            mass: 1.1,
            useNativeDriver: true,
          }).start();
        }, 50);
      }, 1000);
    }
  }, [animate]);

  return (
    <Container style={{ opacity: fadeAnim }}>
      <Animatable.View
        style={{
          backgroundColor: "pink",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "20%",
        }}
        animation={LARGE_PULSE}
        easing="ease-out"
        iterationCount="infinite"
        delay={200}
        duration={1500}
      >
        <DotContainer style={{ transform: [{ scale: scaleAnim }] }}>
          <Animatable.View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            animation={OPACITY}
            direction="alternate"
            iterationCount="infinite"
          >
            <Dot />
          </Animatable.View>
          <Animatable.View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            animation={OPACITY}
            direction="alternate"
            iterationCount="infinite"
            delay={50}
          >
            <Dot />
          </Animatable.View>
          <Animatable.View
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            animation={OPACITY}
            direction="alternate"
            iterationCount="infinite"
            delay={100}
          >
            <Dot />
          </Animatable.View>
        </DotContainer>
      </Animatable.View>
      <MessageBarDotsContainer>
        <Animatable.View
          animation={MEDIUM_PULSE}
          easing="ease-out"
          iterationCount="infinite"
          delay={100}
          duration={1500}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MediumDot style={{ transform: [{ scale: scaleMediumAnim }] }} />
        </Animatable.View>
        <Animatable.View
          animation={SMALL_PULSE}
          easing="ease-out"
          iterationCount="infinite"
          duration={1500}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LittleDot style={{ transform: [{ scale: scaleSmallAnim }] }} />
        </Animatable.View>
      </MessageBarDotsContainer>
    </Container>
  );
}
export default SpeechBubble;
