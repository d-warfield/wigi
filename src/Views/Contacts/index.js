import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import styled from "styled-components";
import {
  SecondaryText,
  SecondaryWhite,
  colorScheme,
  PrimaryTextInput,
  PrimaryYellow,
  PrimaryTextColor,
  SecondaryBackgroundColor,
  PrimaryBlue,
} from "constants";
import Enable from "components/Enable";
import ContactsList from "components/Contacts";
import SearchIcon from "icons/outline/search";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { useStateValue } from "context";
import WandIcon from "icons/solid/wand";
import ArrowIcon from "icons/solid/smallarrow";

const Container = styled(View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  min-height: 120%;
  background-color: ${colorScheme === "light"
    ? SecondaryBackgroundColor
    : "black"};
  padding: 0 15px;
`;

const FormTop = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const FormBottom = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: -25px 0 0 0;
`;
const Header = styled(Text)`
  color: ${colorScheme === "light" ? "black" : "white"};
  font-family: P-Medium;
  font-size: 25px;
  margin: 0 0 25px 0;
  padding: 0 40px;
  text-align: center;
`;
const InviteFriendsContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
`;
const ContactsContainer = styled(View)`
  flex: 1;
  height: 100%;
  width: 100%;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
  padding: 15px;
  background-color: ${colorScheme === "light" ? "white" : "#2C2C2E"};
`;
const SearchBar = styled(View)`
  display: flex;
  justify-content: space-between;
  flex: 1;
  flex-direction: row;
  background-color: ${colorScheme === "light"
    ? PrimaryTextInput
    : SecondaryWhite};
  border-radius: 100px;
  min-height: 45px;
  align-items: center;
  justify-content: flex-start;
  padding: 0 0 0 13px;
`;
const SearchInput = styled(TextInput)`
  font-size: 18px;
  height: 100%;
  width: 100%;
  font-family: P-Bold;
  font-family: P-Medium;
  font-size: 16px;
  color: ${PrimaryTextColor};
  margin: 0 0 0 8px;
`;
const SkipButton = styled(TouchableOpacity)`
  position: absolute;
  right: 15px;
  top: 0px;
`;
const SkipText = styled(Text)`
  font-family: P-Bold;
  color: ${colorScheme === "light" ? "black" : "white"};
  font-size: 16px;
`;
const DoneContainer = styled(View)`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-width: 100%;
  padding: ${Constants.statusBarHeight}px 15px 15px 0;
`;
const DoneButton = styled(TouchableOpacity)``;
const DoneText = styled(Text)`
  font-family: P-Bold;
  color: ${colorScheme === "light" ? "black" : "white"};
  font-size: 16px;
`;

const InvitesHeader = styled(View)`
  background-color: transparent;
  padding: 15px;
  border-radius: 15px;
  margin: 15px 0;
`;

const InvitesContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-radius: 100px;
  background-color: ${PrimaryBlue};
  padding: 10px 25px;
`;

const InvitesContainerText = styled(Text)`
  font-family: P-Bold;
  color: white;
  margin: 0 0 0 6px;
`;

const InvitesContainerHeaderText = styled(Text)`
  font-family: P-Medium;
  color: ${PrimaryTextColor};
  text-align: center;
  padding: 0 45px 15px 45px;
`;

const SearchContainer = styled(View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;

const CloseBottomSheet = styled(TouchableOpacity)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export default function ContactsLogin({
  route,
  disableDone,
  handleCloseBottomSheet,
  intro,
}) {
  const [{ profile, permissions }] = useStateValue();

  const [value, setValue] = useState("");
  const navigation = useNavigation();
  const ref = useRef();

  return (
    <Container
      style={{ paddingTop: disableDone ? Constants.statusBarHeight + 10 : 0 }}
    >
      {permissions.contacts ? (
        <>
          {!disableDone && (
            <DoneContainer>
              <DoneButton onPress={() => navigation.navigate("Home")}>
                <DoneText>Done</DoneText>
              </DoneButton>
            </DoneContainer>
          )}

          <SearchContainer>
            <SearchBar style={{ maxWidth: intro ? "100%" : "90%" }}>
              <SearchIcon
                stroke={colorScheme === "light" ? "black" : "white"}
              />
              <SearchInput
                ref={ref}
                placeholder="Search"
                onChangeText={setValue}
                value={value}
                autoCorrect={false}
                selectionColor={colorScheme === "light" ? "black" : "white"}
                placeholderTextColor={SecondaryText}
                keyboardShouldPersistTaps="always"
              />
            </SearchBar>
            {!intro && (
              <CloseBottomSheet onPress={handleCloseBottomSheet}>
                <ArrowIcon
                  height={20}
                  width={20}
                  fill={colorScheme === "light" ? "black" : "white"}
                />
              </CloseBottomSheet>
            )}
          </SearchContainer>
          <InvitesHeader>
            <InvitesContainer>
              <WandIcon fillStars={PrimaryYellow} />
              <InvitesContainerText>
                {profile?.invites} Invites Left
              </InvitesContainerText>
            </InvitesContainer>
          </InvitesHeader>
          <ContactsContainer>
            <ContactsList sort={value} />
          </ContactsContainer>
        </>
      ) : (
        <>
          {!route.params?.disableSkip && (
            <SkipButton onPress={() => navigation.navigate("Home")}>
              <SkipText>Skip</SkipText>
            </SkipButton>
          )}
          <FormTop>
            <Header>Invite only your favorite people</Header>
          </FormTop>
          <FormBottom>
            <InviteFriendsContainer>
              <Enable
                circle={false}
                title={"Invite your friends!"}
                description={"Be sure to only invite your very favorite people"}
                errorDescription={"Wigi is way better with friends"}
                finger={true}
                type={"Contacts"}
              />
            </InviteFriendsContainer>
          </FormBottom>
        </>
      )}
    </Container>
  );
}
