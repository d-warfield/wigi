import React from "react";
import { View, TextInput, Text } from "react-native";
import styled from "styled-components";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  PrimaryLightGrey,
  PrimaryBlue,
  SecondaryBackgroundColor,
  PrimaryTextColor,
} from "constants";

const Container = styled(View)`
  flex: 1;
  background-color: ${SecondaryBackgroundColor};
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: 0 15px;
`;
const EditTextContainer = styled(View)`
  width: 100%;
  background-color: white;
  border-radius: 15px;
  margin: 25px 0 0 0;
`;
const EditInput = styled(TextInput)`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  background-color: white;
  margin: 0 20px;

  height: 60px;
  font-size: 16px;
  font-family: P-Medium;
  color: ${PrimaryTextColor};
  border-radius: 18px;
`;
const SubmitButton = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${PrimaryBlue};
  min-width: 90%;
  padding: 18px 0;
  margin: 25px 0 0 0;
  border-radius: 100px;
  min-width: 100%;
`;
const SubmitButtonText = styled(Text)`
  text-align: center;
  color: white;
  font-family: P-Bold;
  font-size: 17px;
`;
export default function Contact() {
  const [text, onChangeText] = React.useState("Start Typing");
  return (
    <Container>
      <EditTextContainer>
        <EditInput
          placeholder="Enter Text"
          placeholderTextColor={"#8C8C8C"}
          maxLength={200}
          autoCorrect={false}
          selectionColor="black"
          multiline={true}
          style={{ height: 150, paddingTop: 15 }}
        />
      </EditTextContainer>
      <SubmitButton>
        <SubmitButtonText>Submit</SubmitButtonText>
      </SubmitButton>
    </Container>
  );
}
