import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Dimensions,
  Image,
  SafeAreaView,
} from "react-native";
import styled from "styled-components";
import { useNavigation } from "@react-navigation/native";
import {
  PrimaryBlue,
  SecondaryText,
  BackgroundColor,
  colorScheme,
} from "constants";
import ArrowIcon from "icons/solid/arrow";

const Container = styled(View)`
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
  padding: 0 25px;
`;
const ActionContainer = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const HaveAnInviteText = styled(Text)`
  font-family: P-Regular;
  color: ${colorScheme === "light" ? "black" : "white"};
  font-size: 15px;
`;
const HaveAnInviteTextSignIn = styled(Text)`
  font-family: P-Bold;
  color: ${colorScheme === "light" ? "black" : "white"};
  margin: 0 0 0 5px;
  font-size: 15px;
`;
const SignUpButton = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: ${PrimaryBlue};
  border-radius: 100px;
  min-width: 100%;
  height: 55px;
`;
const SignUpButtonText = styled(Text)`
  font-family: P-Bold;
  font-size: 17px;
  color: white;
`;

const Header = styled(Text)`
  color: ${colorScheme === "light" ? "black" : "white"};
  font-family: P-Bold;
  font-size: 24px;
  line-height: 0px;
  width: 200px;
  padding: 0 0 40px 0;
`;
const DescriptionContainer = styled(View)`
  padding: 0 0 25px 0;
`;
const Description = styled(Text)`
  color: ${colorScheme === "light" ? "black" : "white"};
  font-family: P-Medium;
  font-size: 17px;
  line-height: 35px;
`;
export default function Intro() {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ backgroundColor: BackgroundColor }}>
      <Container>
        <Header>
          <Text style={{ fontSize: 35, paddingRight: 30 }}>👋</Text> Welcome!
        </Header>
        <DescriptionContainer>
          <Description>
            We're working super hard to get Wigi ready for everyone, so we're
            gradually adding people to ensure that nothing breaks.
          </Description>
        </DescriptionContainer>
        <DescriptionContainer>
          <Description>
            If you don't have an invite from someone, you can reserve your
            username now. Just be sure not to delete the app because then you'll
            lose it. We'll send you a text when your account is ready 😜
          </Description>
        </DescriptionContainer>
        <DescriptionContainer>
          <Description>Dennis & the Wigi Team</Description>
        </DescriptionContainer>
        <ActionContainer>
          <SignUpButton
            onPress={() =>
              navigation.navigate("Enter Phone Number", {
                status: "sign up",
              })
            }
          >
            <SignUpButtonText>Get your username</SignUpButtonText>
            <View style={{ transform: [{ rotate: "180deg" }], marginLeft: 8 }}>
              <ArrowIcon fill={"white"} height={16} width={16} />
            </View>
          </SignUpButton>
          <SignUpButton
            onPress={() =>
              navigation.navigate("Enter Phone Number", {
                status: "sign up",
              })
            }
            style={{ backgroundColor: "transparent" }}
          >
            <HaveAnInviteText>Have an invite text? </HaveAnInviteText>
            <HaveAnInviteTextSignIn>Sign In</HaveAnInviteTextSignIn>
            <View style={{ transform: [{ rotate: "180deg" }], marginLeft: 5 }}>
              <ArrowIcon
                fill={colorScheme === "light" ? "black" : "white"}
                height={14}
                width={14}
              />
            </View>
          </SignUpButton>
        </ActionContainer>
      </Container>
    </SafeAreaView>
  );
}
