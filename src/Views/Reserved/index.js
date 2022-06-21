import React, { useState, useEffect, useRef, useMemo, createRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components";
import {
  PrimaryBlue,
  SecondaryWhite,
  BackgroundColor,
  colorScheme,
  SecondaryText,
  PrimaryTextColor,
} from "constants";
import { useStateValue } from "context";
import { useHeaderHeight } from "@react-navigation/stack";
import ArrowIcon from "icons/solid/arrow";
import { useApolloClient } from "@apollo/client";
import APPLY_INVITE_CODE from "gql/applyInviteCode";
import { useNavigation } from "@react-navigation/native";
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
  padding: 30px 25px 0 25px;
`;
const Form = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;

  display: flex;
`;
const FormTop = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const FormBottom = styled(View)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
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

const Or = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
`;
const OrBreaker = styled(View)`
  width: 40%;
  height: 0.5px;
  background-color: ${colorScheme === "light" ? SecondaryText : "white"};
`;
const OrText = styled(Text)`
  font-family: P-Medium;
  padding: 0 10px;
  color: ${colorScheme === "light" ? SecondaryText : "white"};
`;
const KeyboardAvoidView = styled(KeyboardAvoidingView)`
  width: 100%;
`;
const CodeInput = styled(TextInput)`
  width: 50px;
  height: 50px;
  color: ${PrimaryTextColor}
  text-align: center;
  padding: 0;
  font-family: P-Semi;
  font-size: 20px;
  margin: 0 4px;
`;

const ContinueButton = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: ${PrimaryBlue};
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
const InvalidCode = styled(Text)`
  font-family: P-Medium;
  font-size: 12px;
  color: ${colorScheme === "light" ? "black" : "white"};
  margin: 10px 0 0 0;
`;

const CodeInputWrapper = styled(View)`
  width: 100%;
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
export default function Reserved({ route }) {
  const [{ profile }, dispatch] = useStateValue();
  const headerHeight = useHeaderHeight();
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState(null);
  const navigation = useNavigation();
  const client = useApolloClient();
  const [state, setState] = useState({ code: "" });

  useEffect(() => {
    inputsRefs[1].current.focus();
  }, []);

  const inputsRefs = useMemo(
    () => Array.from({ length: 7 }).map(() => createRef()),
    []
  );

  const applyInviteCode = async () => {
    setLoading(true);
    const { data } = await client.mutate({
      mutation: APPLY_INVITE_CODE,
      variables: {
        inviteCode: state.code.toUpperCase(),
      },
    });
    const res = data.applyInviteCode;
    if (res.valid) {
      if (res.expired) {
        setStatus("Sorry, this code is expired.");
      } else {
        dispatch({
          type: "EDIT_USER_DETAILS",
          payload: {
            pending: null,
            inviterId: res.inviterId,
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
              pending: null,
              inviterId: res.inviterId,
            },
          },
        });
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }],
        });
      }
    } else {
      setStatus("Sorry, this code is invalid.");
    }
    setLoading(false);
  };

  const autoFocusInput = async (nativeEvent, number) => {
    if (nativeEvent.key === "Backspace") {
      setState({
        ...state,
        code: state.code.slice(0, -1),
      });
      if ([2, 3, 4, 5, 6].includes(number)) {
        inputsRefs[number - 1].current.focus();
      }
      return;
    } else if (number < 6) {
      inputsRefs[number + 1].current.focus();
    } else if (number === 6) {
      inputsRefs[number].current.focus();
    }
    setState({
      ...state,
      code: state.code + nativeEvent.key,
    });
  };

  const generateInputs = () => {
    const array = [1, 2, 3, 4, 5, 6];

    return array.map((number, index) => {
      return (
        <CodeInput
          textContentType="oneTimeCode"
          style={{
            borderBottomWidth: 2,
            borderColor:
              state.code.charAt(index) === ""
                ? colorScheme === "light"
                  ? "#D1D2D4"
                  : SecondaryWhite
                : colorScheme === "light"
                ? "black"
                : "white",
          }}
          selectionColor={PrimaryBlue}
          key={`codeinput_${number}`}
          ref={inputsRefs[number]}
          onKeyPress={({ nativeEvent }) => autoFocusInput(nativeEvent, number)}
          blurOnSubmit={false}
          returnKeyType="next"
          maxLength={1}
          value={state.code.charAt(index)}
        />
      );
    });
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
              <Header>We reserved your username </Header>
              <Description>
                We've reserved @
                <Text style={{ fontFamily: "P-Bold" }}>
                  {route?.params?.username || profile.username}{" "}
                </Text>
                for you. We'll send you a push notification when your account is
                ready!
              </Description>
              <Or>
                <OrBreaker />
                <OrText>or</OrText>
                <OrBreaker />
              </Or>
              <Form>
                <Header>Have an invite code?</Header>

                <CodeInputWrapper>{generateInputs()}</CodeInputWrapper>

                {/* <CodeInput
                  ref={ref}
                  autoCorrect={false}
                  placeholderTextColor={
                    colorScheme === "light"
                      ? "rgba(1,1, 1, 0.50)"
                      : "rgba(255, 255, 255, 0.55)"
                  }
                  selectionColor={colorScheme === "light" ? "black" : "white"}
                  value={code}
                  onChangeText={(text) => setCode(text.toUpperCase())}
                  autoCapitalize="characters"
                  placeholder="Enter code"
                  maxLength={6}
                  style={{
                    color:
                      code?.length > 0 && colorScheme === "light"
                        ? "black"
                        : "white",
                    fontFamily: code?.length > 0 ? "P-Bold" : "P-Medium",
                  }}
                /> */}
                {status && <InvalidCode>{status}</InvalidCode>}
              </Form>
            </FormTop>
            <FormBottom>
              <ContinueButton
                disabled={state.code.length < 5}
                onPress={applyInviteCode}
                style={{
                  backgroundColor:
                    state.code.length > 5 ? PrimaryBlue : SecondaryWhite,
                }}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color={"white"} />
                ) : (
                  <>
                    <ContinueText
                      style={{
                        color:
                          state.code.length > 5
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
                          state.code.length > 5
                            ? "white"
                            : "rgba(1, 1, 1, 0.20)"
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
