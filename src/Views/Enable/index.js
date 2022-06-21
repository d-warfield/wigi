import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Linking,
  Switch,
} from "react-native";
import styled from "styled-components";
import {
  BackgroundColor,
  PrimaryBlue,
  colorScheme,
  SecondaryText,
} from "constants";
import { useHeaderHeight } from "@react-navigation/stack";
import ArrowIcon from "icons/solid/arrow";
import CheckMarkIcon from "icons/solid/checkmark";
import { Camera } from "expo-camera";
import * as Notifications from "expo-notifications";
import * as Contacts from "expo-contacts";
import { useStateValue } from "context";

const Container = styled(View)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;
const Content = styled(TouchableOpacity)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 30px 25px 0 25px;
`;
const FormTop = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;
const EnableWrapper = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const EnableContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 15px 0;
`;
const EnableContainerLeft = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;
const EnableContainerRight = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
const EnableContainerHeader = styled(Text)`
  font-family: P-Bold;
  color: ${colorScheme === "light" ? "black" : "white"};
  font-size: 17px;
`;
const EnableContainerDescription = styled(Text)`
  color: ${colorScheme === "light" ? SecondaryText : "white"};
  font-family: P-Regular;
`;
const Header = styled(Text)`
  color: ${colorScheme === "light" ? "black" : "white"};
  font-family: P-Bold;
  font-size: 22px;
  margin: 0 0 10px 0;
`;

const Description = styled(Text)`
  color: ${colorScheme === "light" ? SecondaryText : "white"};
  font-family: P-Regular;
`;

const KeyboardAvoidView = styled(KeyboardAvoidingView)`
  width: 100%;
`;
const ContinueButton = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: white;
  border-radius: 100px;
  min-width: 100%;
  height: 55px;
  margin: 0 0 5px 0;
`;
const ContinueText = styled(Text)`
  font-family: P-Bold;
  font-size: 17px;
  color: white;
`;

export default function Enable({ navigation }) {
  const [{ profile, permissions }, dispatch] = useStateValue();
  const headerHeight = useHeaderHeight();
  const [state, setState] = useState({
    notifications: permissions.notifications === "granted" ? true : false,
    camera: permissions.camera === "granted" ? true : false,
    contacts: permissions.contacts === "granted" ? true : false,
  });

  const askPermissions = async (type) => {
    if (type === "Camera") {
      const { status } = await Camera.requestPermissionsAsync();
      if (status === "granted") {
        setState({
          ...state,
          camera: true,
        });
        dispatch({
          type: "SET_PERMISSIONS",
          payload: {
            camera: true,
          },
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
        dispatch({
          type: "SET_PERMISSIONS",
          payload: {
            notifications: true,
          },
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
        dispatch({
          type: "SET_PERMISSIONS",
          payload: {
            contacts: true,
          },
        });
      } else {
        Linking.openURL("app-settings:");
      }
    }
  };

  const getNextRoute = () => {
    if (!profile.username) {
      return "Username";
    }
    if (profile.pending) {
      return "Reserved";
    }
    return "Home";
  };

  return (
    <SafeAreaView style={{ backgroundColor: BackgroundColor, height: "100%" }}>
      <KeyboardAvoidView
        keyboardVerticalOffset={headerHeight}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Container>
          <Content activeOpacity={1}>
            <FormTop>
              <Header>Please enable</Header>
              <Description>
                To ensure the app works as smoothly as possible, please be sure
                to enable each permission.
              </Description>
            </FormTop>
            <EnableWrapper>
              <EnableContainer>
                <EnableContainerLeft>
                  <EnableContainerHeader>Camera</EnableContainerHeader>
                  <EnableContainerDescription>
                    So you can take photos
                  </EnableContainerDescription>
                </EnableContainerLeft>
                <EnableContainerRight>
                  <Switch
                    onValueChange={(value) => value && askPermissions("Camera")}
                    trackColor={{
                      false: "gray",
                      true: PrimaryBlue,
                    }}
                    value={state.camera}
                  />
                </EnableContainerRight>
              </EnableContainer>
              <EnableContainer>
                <EnableContainerLeft>
                  <EnableContainerHeader>Notifications</EnableContainerHeader>
                  <EnableContainerDescription>
                    So you can receive messages
                  </EnableContainerDescription>
                </EnableContainerLeft>
                <EnableContainerRight>
                  <Switch
                    onValueChange={(value) =>
                      value && askPermissions("Notifications")
                    }
                    trackColor={{
                      false: "gray",
                      true: PrimaryBlue,
                    }}
                    value={state.notifications}
                  />
                </EnableContainerRight>
              </EnableContainer>
              <EnableContainer>
                <EnableContainerLeft>
                  <EnableContainerHeader>Contacts</EnableContainerHeader>
                  <EnableContainerDescription>
                    So you can easily add friends
                  </EnableContainerDescription>
                </EnableContainerLeft>
                <EnableContainerRight>
                  <Switch
                    onValueChange={(value) =>
                      value && askPermissions("Contacts")
                    }
                    trackColor={{
                      false: "gray",
                      true: PrimaryBlue,
                    }}
                    value={state.contacts}
                  />
                </EnableContainerRight>
              </EnableContainer>
            </EnableWrapper>
            <ContinueButton
              style={{
                backgroundColor: PrimaryBlue,
              }}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: getNextRoute() }],
                })
              }
            >
              <ContinueText>Continue</ContinueText>
              <View
                style={{ transform: [{ rotate: "180deg" }], marginLeft: 8 }}
              >
                <ArrowIcon fill={"white"} height={16} width={16} />
              </View>
            </ContinueButton>
          </Content>
        </Container>
      </KeyboardAvoidView>
    </SafeAreaView>
  );
}
