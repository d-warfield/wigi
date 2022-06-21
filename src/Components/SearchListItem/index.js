import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import styled from "styled-components";
import {
  PrimaryTextColor,
  appGroupIdentifier,
  SecondaryText,
  PrimaryBlue,
  PrimaryBorderColor,
  PrimaryBorderWidth,
} from "constants";
import SharedGroupPreferences from "react-native-shared-group-preferences";
import * as Haptics from "expo-haptics";
import * as Animatable from "react-native-animatable";
import ProfilePicture from "components/ProfilePicture";
import { PUBLIC_CONTENT_URL } from "@env";
import { useStateValue } from "context";
import XmarkIcon from "icons/solid/xmark";
import CREATE_CHAT from "gql/createChat";
import GET_FRIENDS from "gql/getFriends";
import { useApolloClient } from "@apollo/client";
import ChatIcon from "icons/outline/alternativechat";

const windowWidth = Dimensions.get("window").width;
const circleDimensionMultiplier = 0.125;

const Container = styled(View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 0 0 9px 0;
  min-width: 100%;
  max-width: 100%;
`;
const ContainerLeft = styled(View)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
`;
const ContainerRight = styled(View)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
`;
const ChatDetails = styled(View)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  padding: 0 0 0 5px;
  height: 100%;
`;
const DisplayName = styled(Text)`
  color: ${PrimaryTextColor};
  font-family: P-Medium;
  font-size: 17px;
  margin: 0 0 0 5px;
`;
const Username = styled(Text)`
  font-family: P-Regular;
  font-size: 14px;
  margin: 0 0 0 5px;
  color: ${SecondaryText};
`;

const AddButton = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  border-radius: 100px;
  padding: 10px 18px;
  min-width: 100px;
`;
const AddButtonText = styled(Text)`
  font-family: P-Bold;
  color: white;
  font-size: 14px;
`;

const ChatIconContainer = styled(TouchableOpacity)`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin: 0 5px 0 0;
  padding: 0 0 0 20px;
  border-left-width: 1.2px;
  border-color: ${PrimaryBorderColor};
`;

function SearchListItem({ displayName, username, userId }) {
  const [added, setAdded] = useState(false);
  const [{ profile, users }, dispatch] = useStateValue();
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);

  const selectUser = () => {
    const user = users.find((user) => user.friendId === userId);
    dispatch({
      type: "SET_SELECTED_USER",
      payload: user,
    });
  };

  const storeNewFriend = async () => {
    const { data } = await client.mutate({
      mutation: CREATE_CHAT,
      variables: {
        friendId: userId,
      },
    });

    const newUser = {
      chatId: data.createChat.chatId,
      friendId: data.createChat.friendId,
      profile: {
        username,
        displayName,
      },
    };

    client.writeQuery({
      query: GET_FRIENDS,
      data: {
        getAllFriends: [newUser, ...users],
      },
    });

    const friends = [newUser, ...users].map((friend) => {
      return {
        identifier: friend.friendId,
        name: friend.profile?.username || friend.profile?.displayName,
      };
    });
    await SharedGroupPreferences.setItem(
      "availableUsers",
      friends,
      appGroupIdentifier
    );
    dispatch({ type: "ADD_NEW_USER", payload: newUser });
    dispatch({ type: "SET_SELECTED_USER", payload: newUser });
  };

  useEffect(() => {
    const index = users.findIndex((user) => user.friendId === userId);
    if (index !== -1) {
      setAdded(true);
    }
  }, []);

  const addAnimation = () => {
    setAdded(true);
    bounce();
  };

  const handleViewRef = useRef();

  const bounce = () => {
    handleViewRef.current.bounceIn(800);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <Container>
      <ContainerLeft>
        <ProfilePicture
          borderRadius={100}
          margin={-30}
          height={parseInt(windowWidth * circleDimensionMultiplier) + "px"}
          width={parseInt(windowWidth * circleDimensionMultiplier) + "px"}
          url={`${PUBLIC_CONTENT_URL}/${userId}/profile.jpeg`}
          cacheKey={`${userId}-profile.jpeg`}
        />
        <ChatDetails>
          <DisplayName>{displayName}</DisplayName>
          <Username>@{username}</Username>
        </ChatDetails>
      </ContainerLeft>
      {profile.userId !== userId && (
        <ContainerRight>
          <Animatable.View ref={handleViewRef}>
            {!added ? (
              <AddButton
                activeOpacity={1}
                style={{
                  backgroundColor: PrimaryBlue,
                }}
                onPress={async () => {
                  if (added) {
                    selectUser();
                  } else {
                    setLoading(true);
                    await storeNewFriend();
                    addAnimation();
                    setLoading(false);
                  }
                }}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <XmarkIcon
                      fill={added ? SecondaryText : "white"}
                      height={12}
                    />
                    <AddButtonText>Add</AddButtonText>
                  </>
                )}
              </AddButton>
            ) : (
              <ChatIconContainer onPress={selectUser}>
                <ChatIcon fill={SecondaryText} height={22} width={22} />
              </ChatIconContainer>
            )}
          </Animatable.View>
        </ContainerRight>
      )}
    </Container>
  );
}
export default SearchListItem;
