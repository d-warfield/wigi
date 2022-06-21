import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components";
import {
  SecondaryWhite,
  BackgroundColor,
  PrimaryBlue,
  colorScheme,
  SecondaryText,
  PrimaryBorderColor,
  PrimaryBorderWidth,
} from "constants";
import { useHeaderHeight } from "@react-navigation/stack";
import { useStateValue } from "context";
import ArrowIcon from "icons/solid/arrow";
import { useApolloClient } from "@apollo/client";
import EDIT_PROFILE from "gql/editProfile";
import ME from "gql/me";

const Container = styled(View)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 100%;
`;
const Content = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 30px 20px 0 20px;
`;
const Form = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  margin: 50px 0 0 0;
  padding: 0 0 10px 0;
  display: flex;
  border-bottom-width: ${PrimaryBorderWidth};
  border-color: ${PrimaryBorderColor};
`;
const FormTop = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
`;
const FormBottom = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const UsernameInput = styled(TextInput)`
  font-family: P-Bold;
  border-width: 0px;
  font-size: 20px;
  color: ${colorScheme === "light" ? "black" : "white"};
  margin: 0 0 0 8px;
  min-width: 150px;
`;
const UsernameTextPlaceHolder = styled(Text)`
  font-size: 20px;
  color: ${colorScheme === "light" ? "black" : "white"};
  font-family: P-Medium;
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
  color: black;
`;
const UsernameWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-width: 100px;
`;
const UsernamePlaceHolder = styled(View)``;

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
const UsernameTaken = styled(Text)`
  margin: 20px 0 0 0;
  font-family: P-Medium;
  color: ${colorScheme === "light" ? "black" : "white"};
`;
export default function Username({ navigation }) {
  const [{ profile }, dispatch] = useStateValue();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [exist, setExist] = useState(false);
  const headerHeight = useHeaderHeight();
  const client = useApolloClient();
  const ref = useRef();

  useEffect(() => {
    let timer1 = setTimeout(() => {
      ref.current.focus();
    }, 1000);

    return () => clearTimeout(timer1);
  }, []);

  const saveUsername = async () => {
    setLoading(true);
    try {
      await client.mutate({
        mutation: EDIT_PROFILE,
        variables: {
          username: username,
        },
      });
      dispatch({
        type: "EDIT_USER_DETAILS",
        payload: {
          username: username,
          displayName: username,
        },
      });

      const cachedData = client.readQuery({
        query: ME,
      });

      client.writeQuery({
        query: ME,
        data: {
          me: {
            ...cachedData.me,
            username: username,
            displayName: username,
          },
        },
      });

      if (profile.pending) {
        navigation.reset({
          index: 0,
          routes: [{ name: "Reserved" }],
        });
      } else {
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    } catch (err) {
      console.error("failed to save username", err);
      setExist(true);
      setLoading(false);
    }
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
              <Header>Create a username</Header>
              <Description>You can always change this later</Description>
              <Form>
                <UsernameWrapper>
                  <UsernamePlaceHolder>
                    <UsernameTextPlaceHolder>@</UsernameTextPlaceHolder>
                  </UsernamePlaceHolder>
                  <UsernameInput
                    ref={ref}
                    autoCorrect={false}
                    placeholderTextColor={
                      colorScheme === "light"
                        ? SecondaryText
                        : "rgba(255, 255, 255, 0.55)"
                    }
                    selectionColor={PrimaryBlue}
                    value={username}
                    onChangeText={(text) =>
                      setUsername(text.replace(/\s/g, "").toLowerCase())
                    }
                    placeholder="Your username"
                    maxLength={25}
                    style={{
                      color: colorScheme === "light" ? "black" : "white",

                      fontFamily: username?.length > 0 ? "P-Semi" : "P-Medium",
                    }}
                  />
                </UsernameWrapper>
              </Form>
              {exist && <UsernameTaken>Username taken</UsernameTaken>}
            </FormTop>
            <FormBottom>
              <ContinueButton
                style={{
                  backgroundColor:
                    username?.length < 1 ? SecondaryWhite : PrimaryBlue,
                }}
                activeOpacity={1}
                disabled={username?.length < 1}
                onPress={saveUsername}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <ContinueText
                      style={{
                        color:
                          username.length >= 1
                            ? "white"
                            : "rgba(1, 1, 1, 0.20)",
                      }}
                    >
                      Continue
                    </ContinueText>
                    <View
                      style={{
                        transform: [{ rotate: "180deg" }],
                        marginLeft: 8,
                      }}
                    >
                      <ArrowIcon
                        fill={
                          username.length >= 1 ? "white" : "rgba(1, 1, 1, 0.20)"
                        }
                        height={16}
                        width={16}
                      />
                    </View>
                  </>
                )}
              </ContinueButton>
            </FormBottom>
          </Content>
        </Container>
      </KeyboardAvoidView>
    </SafeAreaView>
  );
}
