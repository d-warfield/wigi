import React, { useState, useEffect, useCallback } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Linking,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import ProfilePicturePlaceholder from "components/ProfilePicturePlaceholder";
import styled from "styled-components";
import { colorScheme, PrimaryBlue } from "constants";
import * as Contacts from "expo-contacts";
import SEND_INVITE from "gql/sendInvite";
import { useApolloClient } from "@apollo/client";
import PhoneNumber from "awesome-phonenumber";
import { useStateValue } from "context";
const windowWidth = Dimensions.get("window").width;
const circleDimensionMultiplier = 0.125;
const FriendContainer = styled(TouchableOpacity)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  max-width: 100%;
  padding: 0 0 9px 0;
`;
const ProfilePictureContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: ${windowWidth * circleDimensionMultiplier}px;
  max-width: ${windowWidth * circleDimensionMultiplier}px;
  min-height: ${windowWidth * circleDimensionMultiplier}px;
  max-height: ${windowWidth * circleDimensionMultiplier}px;
  z-index: 0;
  border-radius: 20px;
`;
const DisplayNameContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 100%;
  flex: 1;
  margin: 0 0 0 15px;
`;
const DisplayName = styled(Text)`
  font-family: P-Medium;
  font-size: 17px;
  color: ${colorScheme === "light" ? "black" : "white"};
  text-transform: capitalize;
`;
const ChatTextPreview = styled(Text)`
  font-family: P-Regular;
  font-size: 14px;
  color: #b0b0b4;
`;
const BottomText = styled(View)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
`;
const AddButton = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-radius: 100px;
  padding: 10px 18px;
  min-width: 100px;
  background-color: ${PrimaryBlue};
`;
const AddButtonText = styled(Text)`
  font-family: P-Bold;
  color: white;
  font-size: 14px;
`;

const message = `Let's Wigi! We can send photos and texts directly to each other's home screen! https://apps.apple.com/us/app/wigi/id1575747044`;

function ContactsComponent({ sort, invitesOnFriendsPage, handleToRightPanel }) {
  const [{ profile }, dispatch] = useStateValue();
  const [contacts, setContacts] = useState([]);
  const [indexLoading, setIndexLoading] = useState(null);
  const client = useApolloClient();

  const handleInvite = async (index) => {
    setIndexLoading(index);
    if (contacts[index]?.phoneNumbers.length > 1) {
      selectNumber(contacts[index]?.phoneNumbers.length, index);
    } else {
      const phoneNumber = contacts[index]?.phoneNumbers[0].number;
      const countryCode = contacts[index]?.phoneNumbers[0].countryCode;
      const pn = new PhoneNumber(phoneNumber, countryCode);
      const internationalPhoneNumber = pn.getNumber("e164");
      await client.mutate({
        mutation: SEND_INVITE,
        variables: {
          phoneNumber: internationalPhoneNumber,
        },
      });
      dispatch({
        type: "EDIT_USER_DETAILS",
        payload: { invites: profile.invites - 1 },
      });
      const separator = Platform.OS === "ios" ? "&" : "?";
      const url = `sms:${internationalPhoneNumber}${separator}body=${message}`;
      await Linking.openURL(url);
    }
    setIndexLoading(null);
  };

  const handleSelectedNumber = async (selectedNumber) => {
    const phoneNumber = selectedNumber;
    const separator = Platform.OS === "ios" ? "&" : "?";
    const url = `sms:${phoneNumber}${separator}body=${message}`;
    await Linking.openURL(url);
  };

  const selectNumber = (length, index) => {
    const arr = [...Array(length).keys()];
    const numbers = arr.map((_, i) => {
      const phone = contacts[index]?.phoneNumbers[i].number;
      const countryCode = contacts[index]?.phoneNumbers[i].countryCode;
      return {
        text: phone,
        onPress: async () => {
          const pn = new PhoneNumber(phone, countryCode);
          const internationalPhoneNumber = pn.getNumber("e164");
          await client.mutate({
            mutation: SEND_INVITE,
            variables: {
              phoneNumber: internationalPhoneNumber,
            },
          });
          dispatch({
            type: "EDIT_USER_DETAILS",
            payload: { invites: profile.invites - 1 },
          });
          handleSelectedNumber(internationalPhoneNumber);
        },
      };
    });
    Alert.alert(
      "Select a number",
      "Check first before you send!",
      [
        ...numbers,
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const { data } = await Contacts.getContactsAsync({
          fields: [
            Contacts.Fields.FirstName,
            Contacts.Fields.PhoneNumbers,
            Contacts.Fields.Image,
          ],
        });
        const sorted = data.sort((a, b) => {
          if (a.firstName < b.firstName) {
            return -1;
          }
          if (a.firstName > b.firstName) {
            return 1;
          }
          return 0;
        });
        setContacts(sorted);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const renderItem = ({ item, index }) => {
    if (item?.name?.includes(sort)) {
      const dimension = parseInt(windowWidth * circleDimensionMultiplier);
      return (
        <FriendContainer
          key={index}
          onPress={invitesOnFriendsPage ? handleToRightPanel : null}
          activeOpacity={1}
        >
          <ProfilePictureContainer>
            {item.imageAvailable ? (
              <Image
                style={{
                  borderRadius: 100,
                  height: dimension,
                  width: dimension,
                }}
                source={{
                  uri: item?.image?.uri,
                }}
              />
            ) : (
              <ProfilePicturePlaceholder
                width={dimension + "px"}
                height={dimension + "px"}
                borderRadius={100}
              />
            )}
          </ProfilePictureContainer>
          <DisplayNameContainer>
            <DisplayName>{item?.name}</DisplayName>
            <BottomText>
              <ChatTextPreview>
                {item?.phoneNumbers?.length} phone{" "}
                {item?.phoneNumbers?.length > 1 ? "numbers" : "number"}
              </ChatTextPreview>
            </BottomText>
          </DisplayNameContainer>
          <AddButton
            theme={{ disabled: profile.invites < 1 ? true : false }}
            disabled={profile.invites < 1}
            activeOpacity={1}
            onPress={() => handleInvite(index)}
          >
            {indexLoading === index ? (
              <ActivityIndicator color="white" />
            ) : (
              <AddButtonText>Invite</AddButtonText>
            )}
          </AddButton>
        </FriendContainer>
      );
    }
  };
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      contentContainerStyle={{
        maxWidth: "100%",
        overflow: "visible",
        paddingBottom: 150,
      }}
      data={contacts}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      keyboardShouldPersistTaps="always"
      maxToRenderPerBatch={4}
    />
  );
}
export default ContactsComponent;
