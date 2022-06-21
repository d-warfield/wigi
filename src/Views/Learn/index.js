import React, { useEffect, useState, useRef } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import styled from "styled-components";
import { SafeAreaView } from "react-native-safe-area-context";
import { Video } from "expo-av";
const Container = styled(SafeAreaView)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  padding: 0 15px;
  height: 100%;
  background-color: black;
  padding: 20px 0 0 0;
`;
const ProgressBarContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
`;
const CloseButton = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 90%;
  background-color: white;
  border-radius: 100px;
  margin: 0 0 5px 0;
`;
const CloseButtonText = styled(Text)`
  font-family: P-Bold;
  font-size: 17px;
  color: black;
`;
const TapContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  flex: 1;
  width: 100%;
  position: absolute;
`;
const Tap = styled(TouchableOpacity)`
  height: 100%;
  width: 50%;
`;
const HeaderContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 50px 0 0 0;
  min-height: 50px;
`;
const Header = styled(Text)`
  font-family: P-Bold;
  font-size: 22px;
  color: white;
  text-align: center;
`;
const ActivityIndicatorContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: absolute;
`;
function Learn({ closeModal }) {
  const [step, setStep] = useState("  ");
  const video = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [status, setStatus] = useState({});

  useEffect(() => {
    video.current.playAsync();
  }, []);

  useEffect(() => {
    if (!isPlaying) return;
    triggerText();
  }, [isPlaying]);

  const triggerText = () => {
    setStep("Long press your home screen");
    let timer1 = setTimeout(() => {
      setStep("Click on the plus button");
    }, 3000);
    let timer2 = setTimeout(() => {
      setStep("Search for Wigi");
    }, 5200);
    let timer3 = setTimeout(() => {
      setStep("Click on Wigi");
    }, 7600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  useEffect(() => {
    if (status.didJustFinish) {
      triggerText();
    }
  }, [status]);

  return (
    <Container>
      <HeaderContainer>
        <Header>{step}</Header>
      </HeaderContainer>
      <ActivityIndicatorContainer>
        <ActivityIndicator color="white" />
      </ActivityIndicatorContainer>
      <Video
        ref={video}
        style={{ height: "75%", width: "100%" }}
        source={require("assets/Learn.mp4")}
        useNativeControls
        resizeMode="contain"
        isLooping
        onLoad={() => setIsPlaying(true)}
        useNativeControls={false}
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
      <CloseButton onPress={closeModal}>
        <CloseButtonText>Got it</CloseButtonText>
      </CloseButton>
    </Container>
  );
}
export default Learn;
