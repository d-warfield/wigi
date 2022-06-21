import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import styled from "styled-components";
import {
  PrimaryBlue,
  colorScheme,
  BackgroundColor,
  SecondaryText,
} from "constants";
import ArrowIcon from "icons/solid/arrow";
import ProfilePicture from "components/ProfilePicture";
import { PUBLIC_CONTENT_URL } from "@env";

const Container = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 25px;
`;
const FormTop = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 20%;
`;
const FormMiddle = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 50%;
`;
const FormBottom = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 30%;
`;
const Header = styled(Text)`
  color: ${colorScheme === "light" ? "black" : "white"};
  font-family: P-Bold;
  font-size: 22px;
  margin: 0 0 10px 0;
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
const HaveAnInviteText = styled(Text)`
  font-family: P-Medium;
  color: ${colorScheme === "light" ? "black" : "white"};
  font-size: 18px;
  margin: 0 0 20px 0;
`;
const FriendName = styled(Text)`
  font-family: P-Bold;
  color: ${colorScheme === "light" ? "black" : "white"};
  margin: 0 0 0 5px;
  font-size: 15px;
  margin: 8px 0 0 0;
`;
const SignUpButtonText = styled(Text)`
  font-family: P-Bold;
  font-size: 17px;
  color: white;
`;
export default function Welcome({ navigation, route }) {
  const {
    params: { displayName, username, userId },
  } = route;

  return (
    <SafeAreaView style={{ backgroundColor: BackgroundColor, height: "100%" }}>
      <Container>
        <FormTop>
          <Header>
            {displayName || username || "Dennis Warfield"} invited you!
          </Header>
        </FormTop>
        <FormMiddle>
          <ProfilePicture
            fill={"white"}
            height={100 + "px"}
            width={100 + "px"}
            fill={"black"}
            margin={-50}
            url={`${PUBLIC_CONTENT_URL}/${userId}/profile.jpeg`}
            cacheKey={`${userId}-profile.jpeg`}
          />
          <FriendName>
            {displayName || username || "Dennis Warfield"}
          </FriendName>
        </FormMiddle>
        <FormBottom>
          <HaveAnInviteText>Let's set up your profile</HaveAnInviteText>
          <SignUpButton onPress={() => navigation.navigate("Invites")}>
            <SignUpButtonText>Let's go</SignUpButtonText>
            <View style={{ transform: [{ rotate: "180deg" }], marginLeft: 8 }}>
              <ArrowIcon fill={"white"} height={16} width={16} />
            </View>
          </SignUpButton>
        </FormBottom>
      </Container>
    </SafeAreaView>
  );
}
