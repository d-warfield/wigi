import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  Linking,
} from "react-native";
import styled from "styled-components";
import PhoneNumber from "awesome-phonenumber";
import SearchIcon from "icons/outline/search";
import {
  PrimaryBlue,
  SecondaryWhite,
  BackgroundColor,
  colorScheme,
  SecondaryText,
  PrimaryTextInput,
  PrimaryBorderColor,
  PrimaryBorderWidth,
  PrimaryTextColor,
} from "constants";
import { flag } from "country-emoji";
import { useHeaderHeight } from "@react-navigation/stack";
import { MaskedTextInput } from "react-native-mask-text";
import * as Haptics from "expo-haptics";
import XmarkIcon from "icons/solid/xmark";
import ArrowIcon from "icons/solid/arrow";
import Triangle from "react-native-triangle";

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
  align-items: flex-start;
  width: 100%;
  margin: 10px 0 0 0;
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
const CountryCodeBottom = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 50px;
  margin: 0 0 0 -2px;
  border-radius: 100px;
`;
const CountryName = styled(Text)`
  font-family: P-Regular;
  color: white;
  font-size: 25px;
  line-height: 0px;
`;
const PhoneNumberInput = styled(MaskedTextInput)`
  border-width: 0px;
  font-size: 20px;
  color: ${colorScheme === "light" ? "black" : "white"};
  margin: 0 0 0 10px;
`;
const CountryCodeTextPlaceHolder = styled(Text)`
  font-size: 20px;
  color: ${colorScheme === "light" ? "black" : "white"};
  font-family: P-Semi;
  margin: 0 10px 0px 0;
`;
const Note = styled(Text)`
  margin: 10px 0 5px 0;
  color: ${colorScheme === "light" ? "black" : "white"};
  font-family: P-Regular;
  font-size: 12px;
`;
const ContinueButton = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  background-color: white;
  min-width: 100%;
  border-radius: 100px;
  height: 55px;
`;
const ContinueText = styled(Text)`
  color: black;
  font-family: P-Bold;
  font-size: 17px;
`;
const CountryContainer = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  height: 100%;
  background-color: ${colorScheme === "light" ? "white" : "black"};
`;
const BackArrowContainer = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  transform: rotate(-90deg);
  position: absolute;
  right: 20px;
`;
const CountryView = styled(TouchableOpacity)`
  padding: 15px 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom-width: 0.3px;
  border-bottom-color: #f0f0f0;
  max-width: 100%;
  min-width: 100%;
  background-color: ${colorScheme === "light" ? "white" : "black"};
`;
const CountryContainerHeader = styled(View)`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  padding: 5px 0 5px 0;
`;
const CountryHeaderText = styled(Text)`
  font-family: P-Bold;
  color: black;
  font-size: 18px;
`;
const CountryFlagContainer = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;
const CountryText = styled(Text)`
  font-family: P-Medium;
  font-size: 16px;
  color: ${colorScheme === "light" ? "black" : "white"};
  margin: 0 0 0 8px;
`;

const CountryCodeWrapper = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  min-width: 300px;
`;

const CountryCodeWrapperLeft = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const CountryCodePlaceHolder = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 0 0 0px 10px;
  border-right-width: ${PrimaryBorderWidth};
  border-color: ${PrimaryBorderColor};
  padding: 0 12px 0 0;
`;
const SearchBar = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  background-color: ${colorScheme === "light"
    ? PrimaryTextInput
    : SecondaryWhite};
  border-radius: 100px;
  height: 45px;

  padding: 0 12px;
`;
const CountrySearch = styled(TextInput)`
  width: 100%;
  height: 50px;
  color: #fff;
  margin: 0 0 0 6px;
  color: ${colorScheme === "light" ? "black" : "white"};
  border-radius: 6px;
  font-family: P-Medium;
  font-size: 16px;
`;
const Header = styled(Text)`
  color: ${colorScheme === "light" ? "black" : "white"};
  font-family: P-Bold;
  font-size: 22px;
  margin: 0 0 10px 0;
`;
const LegalContainer = styled(View)`
  font-family: P-Regular;
  font-size: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  margin: 0 0 5px 0;
`;
const LegalLink = styled(Text)`
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: P-Regular;
  color: ${colorScheme === "light" ? "black" : "white"};
`;
const LegalText = styled(Text)`
  font-family: P-Regular;
  font-size: 12px;
  color: ${colorScheme === "light" ? "black" : "white"};
`;
const LegalLinkText = styled(Text)`
  font-family: P-Regular;
  font-size: 12px;
  color: ${colorScheme === "light" ? "black" : "white"};
`;

export default function EnterPhone({ navigation, route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");
  const [mask, setMask] = useState("999-999-9999");
  const [state, setState] = useState({
    countryCode: "+1" || route.params.data.countryCode,
    countryName: "United States of America",
  });
  const headerHeight = useHeaderHeight();
  const ref = useRef();
  useEffect(() => {
    ref.current.focus();
  }, [modalVisible]);
  useEffect(() => {
    if (modalVisible) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, [modalVisible]);
  useEffect(() => {
    (async () => {
      const res = await fetch(
        "https://restcountries.eu/rest/v2/all?fields=name;callingCodes",
        {
          method: "GET",
        }
      );
      const data = await res.json();
      const sortedData = data.filter(
        (country) => country.callingCodes[0] !== ""
      );
      setCountries(sortedData);
    })();
  }, []);
  const closeKeyboard = () => {
    ref.current.blur();
  };
  const checkSwitch = (param) => {
    switch (param) {
      case "United States of America":
        setMask("999-999-9999");
        break;
      default:
        setMask("99999999999");
        break;
    }
  };
  const styles = StyleSheet.create({
    keyboardAvoidingView: {
      width: "100%",
    },
  });
  return (
    <SafeAreaView style={{ backgroundColor: BackgroundColor, height: "100%" }}>
      <Container>
        <KeyboardAvoidingView
          keyboardVerticalOffset={headerHeight}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <Modal
            animationType="slide"
            visible={modalVisible}
            transparent={false}
          >
            <SafeAreaView
              style={{
                maxWidth: "100%",
                backgroundColor: colorScheme === "light" ? "white" : "black",
              }}
              edges={["top"]}
            >
              <CountryContainer>
                <CountryContainerHeader>
                  <CountryHeaderText
                    style={{
                      color: colorScheme === "light" ? "black" : "white",
                    }}
                  >
                    Choose A Country
                  </CountryHeaderText>
                  <BackArrowContainer
                    onPress={() => setModalVisible(!modalVisible)}
                  >
                    <XmarkIcon
                      fill={colorScheme === "light" ? "black" : "white"}
                      height={20}
                      rotate={45}
                    />
                  </BackArrowContainer>
                </CountryContainerHeader>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  styles={{
                    maxWidth: "40%",
                  }}
                >
                  <CountryView activeOpacity={1}>
                    <SearchBar>
                      <SearchIcon
                        stroke={colorScheme === "light" ? "black" : "white"}
                      />
                      <CountrySearch
                        placeholderTextColor="black"
                        placeholder="Find your country"
                        onChangeText={setFilter}
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoCompleteType="off"
                        selectionColor={
                          colorScheme === "light" ? "black" : "white"
                        }
                        placeholderTextColor={SecondaryText}
                      />
                    </SearchBar>
                  </CountryView>
                  {(filter
                    ? countries.filter((country) =>
                        country.name.toLowerCase().includes(filter)
                      )
                    : countries
                  ).map((country) =>
                    country.callingCodes.map((callingCode) => {
                      return (
                        <CountryView
                          key={country.name + callingCode}
                          onPress={() => {
                            setState({
                              ...state,
                              countryCode: `+${callingCode}`,
                              countryName: country.name,
                            });
                            setModalVisible(false);
                            checkSwitch(country.name);
                          }}
                        >
                          <CountryFlagContainer>
                            <CountryName>{flag(country.name)}</CountryName>
                            <CountryText>
                              {country.name.substring(0, 30)}
                              {country.name.length > 30 && "..."}
                            </CountryText>
                          </CountryFlagContainer>
                          <CountryText>+{callingCode}</CountryText>
                        </CountryView>
                      );
                    })
                  )}
                </ScrollView>
              </CountryContainer>
            </SafeAreaView>
          </Modal>
          <SafeAreaView />
          <Content onPress={closeKeyboard} activeOpacity={1}>
            <FormTop>
              <Header>Enter your phone number</Header>
              <Form>
                <CountryCodeWrapper>
                  <CountryCodeWrapperLeft onPress={() => setModalVisible(true)}>
                    <CountryCodeBottom>
                      <CountryName>{flag(state.countryName)}</CountryName>
                    </CountryCodeBottom>
                    <CountryCodePlaceHolder>
                      <CountryCodeTextPlaceHolder>{`${state.countryCode}`}</CountryCodeTextPlaceHolder>
                      <Triangle
                        width={9}
                        height={6}
                        color={PrimaryTextColor}
                        direction={"down"}
                      />
                    </CountryCodePlaceHolder>
                  </CountryCodeWrapperLeft>
                  <PhoneNumberInput
                    maxLength={
                      state.countryName === "United States of America" ? 12 : 20
                    }
                    ref={ref}
                    selectionColor={PrimaryBlue}
                    placeholderTextColor={
                      colorScheme === "light"
                        ? SecondaryText
                        : "rgba(255, 255, 255, 0.55)"
                    }
                    placeholder="Phone Number"
                    keyboardType="numeric"
                    mask={mask}
                    onChangeText={(text, rawText) => {
                      setState({
                        ...state,
                        phoneNumber: rawText,
                        phoneNumberFormatted: text,
                      });
                    }}
                    value={state.phoneNumberFormatted}
                    style={{
                      fontFamily: state.phoneNumber > 1 ? "P-Semi" : "P-Medium",
                    }}
                  />
                </CountryCodeWrapper>
              </Form>
            </FormTop>
            <FormBottom>
              <ContinueButton
                style={{
                  backgroundColor:
                    !state.countryCode || !state.phoneNumber
                      ? SecondaryWhite
                      : PrimaryBlue,
                }}
                disabled={!state.countryCode || !state.phoneNumber}
                onPress={() => {
                  const pn = new PhoneNumber(
                    state.countryCode + state.phoneNumber
                  );
                  const internationalPhoneNumber = pn.getNumber("e164");
                  if (internationalPhoneNumber) {
                    navigation.navigate("Auth Code", {
                      username: internationalPhoneNumber?.replace(/\s+/g, ""),
                      phoneNumber: state.countryCode + state.phoneNumber,
                      countryName: state.countryName,
                    });
                  }
                }}
              >
                <ContinueText
                  style={{
                    color:
                      state.phoneNumber >= 1 ? "white" : "rgba(1, 1, 1, 0.20)",
                  }}
                >
                  Send code
                </ContinueText>
                <View
                  style={{ transform: [{ rotate: "180deg" }], marginLeft: 8 }}
                >
                  <ArrowIcon
                    fill={
                      state.phoneNumber >= 1 ? "white" : "rgba(1, 1, 1, 0.20)"
                    }
                    height={16}
                    width={16}
                  />
                </View>
              </ContinueButton>
              <Note>Message and data rates may apply</Note>
              <LegalContainer>
                <LegalText>
                  <LegalLink
                    onPress={() =>
                      Linking.openURL("https://wigi.chat/privacy-policy")
                    }
                  >
                    <LegalLinkText>Privacy Policy | </LegalLinkText>
                  </LegalLink>
                  <LegalLink
                    onPress={() =>
                      Linking.openURL("https://wigi.chat/terms-and-conditions")
                    }
                  >
                    <LegalLinkText>Terms & Conditions</LegalLinkText>
                  </LegalLink>
                </LegalText>
              </LegalContainer>
            </FormBottom>
          </Content>
        </KeyboardAvoidingView>
      </Container>
    </SafeAreaView>
  );
}
