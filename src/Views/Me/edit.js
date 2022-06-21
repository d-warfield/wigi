import React, { useState, useRef } from "react";
import {
  View,
  Keyboard,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components";
import { useStateValue } from "context";
import { useNavigation } from "@react-navigation/native";
import {
  SecondaryText,
  PrimaryTextColor,
  PrimaryBlue,
  PrimaryLightGrey,
  PrimaryRed,
  colorScheme,
  SecondaryWhite,
  PrimaryBorderColor,
  PrimaryBorderWidth,
  SecondaryBackgroundColor,
} from "constants";
import { useHeaderHeight } from "@react-navigation/stack";
import { useApolloClient } from "@apollo/client";
import EDIT_PROFILE from "gql/editProfile";

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
`;
const Form = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 25px 0 0 0;
  display: flex;
`;

const EditDescription = styled(Text)`
  font-family: P-Regular;
  font-size: 12px;
  margin: 4px 0 0 4px;
  color: ${SecondaryText};
`;

const EditContainer = styled(View)`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 100%;
`;

const EditWrapper = styled(View)`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
  min-width: 100%;
  padding: 0 15px;
`;

const EditTextContainer = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  min-height: 55px;
  max-height: 55px;
  min-width: 100%;
  border-radius: 12px;
  background-color: ${colorScheme === "light" ? "white" : SecondaryWhite};
`;
const EditInput = styled(TextInput)`
  display: flex;
  height: 100%;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  font-size: 15px;
  font-family: P-Medium;
  color: ${colorScheme === "light" ? "black" : "white"};
  min-width: 100%;
  padding: 0 15px;
`;
const SaveButton = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: ${PrimaryBlue};
  border-radius: 100px;
  min-width: 90%;
  height: 55px;
`;
const SaveText = styled(Text)`
  color: white;
  font-family: P-Bold;
  font-size: 17px;
`;
const AlreadyTaken = styled(Text)`
  color: ${PrimaryRed};
  font-family: P-Regular;
  font-size: 14px;
  margin: 15px 0 0 0;
`;
export default function ProfilePage() {
  const [{ profile }, dispatch] = useStateValue();
  const [username, setUsername] = useState(profile?.username || "");
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [exist, setExist] = useState();
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const ref = useRef();
  const refLast = useRef();
  const headerHeight = useHeaderHeight();
  const client = useApolloClient();

  const saveProfileDetails = async () => {
    setLoading(true);
    Keyboard.dismiss();

    try {
      const { data } = await client.mutate({
        mutation: EDIT_PROFILE,
        variables: {
          ...(username !== profile.username && { username: username }),
          ...(displayName !== profile.displayName && {
            displayName: displayName,
          }),
        },
      });
      dispatch({
        type: "SET_USER_DETAILS",
        payload: data.editProfile,
      });
    } catch (err) {
      console.error("failed to edit user detils", err);
      setExist(true);
    }

    setLoading(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView
      style={{ height: "100%", backgroundColor: SecondaryBackgroundColor }}
    >
      <Container>
        <KeyboardAvoidingView
          keyboardVerticalOffset={headerHeight}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Content activeOpacity={1}>
            <Form>
              <EditContainer>
                <EditWrapper style={{ marginBottom: 25 }}>
                  <EditTextContainer>
                    <EditInput
                      ref={refLast}
                      onChangeText={(text) => setDisplayName(text)}
                      placeholder="Display Name"
                      defaultValue={profile?.displayName}
                      placeholderTextColor={SecondaryText}
                      maxLength={25}
                      autoCorrect={false}
                      selectionColor={PrimaryBlue}
                    />
                  </EditTextContainer>
                  <EditDescription>
                    Your friends will see your display name
                  </EditDescription>
                </EditWrapper>
                <EditWrapper>
                  <EditTextContainer>
                    <EditInput
                      onChangeText={(text) => {
                        let dashedText = text.replace(/\s/g, "").toLowerCase();
                        setUsername(dashedText);
                      }}
                      returnKeyType="done"
                      placeholder="Username"
                      defaultValue={profile?.username}
                      placeholderTextColor={"#959595"}
                      maxLength={25}
                      autoCorrect={false}
                      selectionColor={PrimaryBlue}
                      ref={ref}
                    />
                  </EditTextContainer>
                </EditWrapper>
              </EditContainer>
              {exist && <AlreadyTaken>Username already taken</AlreadyTaken>}
            </Form>
            <SaveButton
              disabled={username.length < 3 || displayName.length < 1}
              onPress={saveProfileDetails}
              style={{
                marginBottom: 4,
                backgroundColor:
                  username.length < 3 || displayName.length < 1
                    ? PrimaryLightGrey
                    : PrimaryBlue,
              }}
            >
              <SaveText
                style={{
                  color: username.length < 3 ? SecondaryText : "white",
                }}
              >
                {loading ? <ActivityIndicator color="white" /> : "Save"}
              </SaveText>
            </SaveButton>
          </Content>
        </KeyboardAvoidingView>
      </Container>
    </SafeAreaView>
  );
}
