import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import styled from "styled-components";
import { SecondaryText, PrimaryBlue } from "constants";
const Invite = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;
const InviteTop = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const InviteBottom = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const InviteHeader = styled(Text)`
  font-family: P-Bold;
  color: black;
`;
const InviteDescription = styled(Text)`
  font-family: P-Bold;
  color: ${SecondaryText};
`;
const InviteButton = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${PrimaryBlue};
  border-radius: 100px;
`;
const InviteButtonText = styled(Text)`
  font-family: P-Bold;
  color: white;
`;
function InviteContacts() {
  return (
    <Invite>
      <InviteTop></InviteTop>
      <InviteBottom>
        <InviteHeader>Invite Friends to Wigi</InviteHeader>
        <InviteDescription>
          Add friends and family so you can wigi
        </InviteDescription>
        <InviteButton>
          <InviteButtonText>Invite</InviteButtonText>
        </InviteButton>
      </InviteBottom>
    </Invite>
  );
}
export default InviteContacts;
