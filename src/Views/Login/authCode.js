import React, { useState, useEffect, useMemo, createRef } from "react";
import { View, Text, ActivityIndicator, TextInput } from "react-native";
import {
  SecondaryWhite,
  BackgroundColor,
  colorScheme,
  SecondaryText,
  PrimaryBlue,
  PrimaryTextColor,
} from "constants";
import { initAuth, verifyCode, storeKey } from "helpers";
import { useStateValue } from "context";
import { MaskedText } from "react-native-mask-text";
import styled from "styled-components";

const Container = styled(View)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  background-color: ${BackgroundColor};
  width: 100%;
  height: 100%;
`;

const HeaderContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin: 0 0 10px 0;
`;
const Header = styled(Text)`
  color: ${colorScheme === "light" ? "black" : "white"};
  font-family: P-Bold;
  font-size: 22px;
  margin: 0 45px 0 0;
`;
const Content = styled(View)`
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding: 30px 25px 10px 25px;
`;
const CodeInputWrapper = styled(View)`
  width: 100%;
  margin: 20px 0 0 0;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
`;
const CodeInput = styled(TextInput)`
  width: 14%;
  height: 50px;
  color: ${PrimaryTextColor}
  text-align: center;
  padding: 0;
  font-family: P-Semi;
  font-size: 20px;

`;
const AttemptsLeftText = styled(Text)`
  margin: 18px 0 0 0;
  color: ${colorScheme === "light" ? SecondaryText : "white"};
  font-family: P-Light;
`;
const MaskedPhoneNumber = styled(Text)`
  color: ${colorScheme === "light" ? SecondaryText : "white"};
  font-family: P-Regular;
`;
export default function AuthCodeView({ route, navigation }) {
  const [state, setState] = useState({
    secret: "",
    session: "",
    attempt: 1,
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [mask, setMask] = useState("+9 999-999-9999");
  const [sending, setSending] = useState(false);
  const [{}, dispatch] = useStateValue();
  const inputsRefs = useMemo(
    () => Array.from({ length: 7 }).map(() => createRef()),
    []
  );
  useEffect(() => {
    (async () => {
      try {
        const auth = await initAuth(route.params.username);
        setState({
          ...state,
          session: auth.Session,
          username: auth.ChallengeParameters.USERNAME,
        });
      } catch (err) {
        console.error("failed to init auth", err);
      }
    })();
  }, []);
  useEffect(() => {
    if (sending) {
      inputsRefs[1].current.focus();
    }
  }, [sending]);
  const autoFocusInput = async (nativeEvent, number) => {
    if (nativeEvent.key === "Backspace") {
      setState({
        ...state,
        secret: state.secret.slice(0, -1),
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
      secret: state.secret + nativeEvent.key,
    });
  };
  useEffect(() => {
    (async () => {
      const { secret, session, username } = state;
      if (state.secret.length >= 6) {
        setIsLoading(true);
        const res = await verifyCode(session, username, secret);
        if (res.code === "NotAuthorizedException") {
          return navigation.navigate("Enter Phone Number");
        }
        if (res.Session) {
          if (state.attempt + 1 > 3) {
            return navigation.navigate("Enter Phone Number");
          }
          inputsRefs[1].current.focus();

          return setState({
            ...state,
            secret: "",
            error: true,
            attempt: state.attempt + 1,
            session: res.Session,
          });
        } else if (res.AuthenticationResult) {
          const {
            AuthenticationResult: { AccessToken, IdToken, RefreshToken },
          } = res;
          try {
            await storeKey("access_token", AccessToken);
            await storeKey("id_token", IdToken);
            await storeKey("refresh_token", RefreshToken);
            dispatch({
              type: "TOGGLE_AUTH",
              payload: true,
            });
            return;
          } catch (err) {
            console.error("Failed to login.", err);
          }
        }
      }
      setIsLoading(false);
    })();
  }, [state]);

  const generateInputs = () => {
    const array = [1, 2, 3, 4, 5, 6];

    return array.map((number, index) => {
      return (
        <CodeInput
          textContentType="oneTimeCode"
          style={{
            borderBottomWidth: 2,
            borderBottomColor:
              state.secret.charAt(index) === ""
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
          keyboardType="numeric"
          onKeyPress={({ nativeEvent }) => autoFocusInput(nativeEvent, number)}
          blurOnSubmit={false}
          returnKeyType="next"
          maxLength={1}
          value={state.secret.charAt(index)}
        />
      );
    });
  };
  useEffect(() => {
    if (route.params.countryName === "United States of America") {
      setMask("+9 999-999-9999");
    } else {
      setMask("+999999999999");
    }
  }, [route]);
  useEffect(() => {
    setTimeout(() => {
      setSending(!sending);
    }, 3100);
  }, []);
  return (
    <Container>
      <Content>
        {isLoading ? (
          <>
            <HeaderContainer>
              <Header>Confirming your code</Header>
              {isLoading && (
                <ActivityIndicator
                  color={colorScheme === "light" ? SecondaryText : "white"}
                />
              )}
            </HeaderContainer>
            <MaskedPhoneNumber>Verifying your code</MaskedPhoneNumber>
          </>
        ) : (
          <>
            {!sending ? (
              <HeaderContainer>
                <Header>Sending you a code</Header>
                {!sending && (
                  <ActivityIndicator
                    color={colorScheme === "light" ? SecondaryText : "white"}
                  />
                )}
              </HeaderContainer>
            ) : (
              <HeaderContainer>
                <Header>Enter your 6-digit code </Header>
              </HeaderContainer>
            )}
            <MaskedPhoneNumber>
              Your code was sent to:{" "}
              <MaskedText
                style={{
                  color: colorScheme === "light" ? SecondaryText : "white",
                  fontFamily: "P-Bold",
                }}
                mask={mask}
              >
                {route.params.phoneNumber}
              </MaskedText>
            </MaskedPhoneNumber>
          </>
        )}
        {sending && <CodeInputWrapper>{generateInputs()}</CodeInputWrapper>}
        {state.attempt !== 1 && (
          <AttemptsLeftText>Attempt {state.attempt}/3</AttemptsLeftText>
        )}
      </Content>
    </Container>
  );
}
