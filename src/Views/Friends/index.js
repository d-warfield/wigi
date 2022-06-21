import React, { useState, useEffect, useRef } from "react";
import { View, TouchableOpacity, FlatList, Animated } from "react-native";
import styled from "styled-components";
import {
  PrimaryTextColor,
  circleDimensionMultiplier,
  PrimaryBlue,
  windowWidth,
  PrimaryRed,
  PrimaryBorderColor,
  PrimaryBorderWidth,
  PrimaryLightGrey,
} from "constants";
import { useStateValue } from "context";
import ProfilePicture from "components/ProfilePicture";
import { PUBLIC_CONTENT_URL } from "@env";
import * as Contacts from "expo-contacts";
import { STAGE } from "@env";
import * as Animatable from "react-native-animatable";
import DottedCircleIcon from "icons/outline/dottedcircle";

const Container = styled(Animated.View)`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: row;
  overflow: visible;
`;

const FriendContainer = styled(TouchableOpacity)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 8px 0 0 10px;
`;
const ProfilePictureContainer = styled(Animated.View)`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
`;

const DisplayName = styled(Animated.Text)`
  font-family: P-Regular;
  margin: 4px 0 0 0;
  color: ${PrimaryTextColor};
  text-transform: capitalize;
  font-size: 12px;
  position: absolute;
  bottom: -18px;
  right: 0px;
  width: 100%;
  text-align: center;
`;

const CreateChatButtonContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 15px 0 0;
`;

const Divider = styled(Animated.View)`
  position: absolute;
  right: 0px;
  bottom: 4px;
  width: ${PrimaryBorderWidth};
  background-color: ${PrimaryBorderColor};
  height: 40px;
`;

const CreateChatButton = styled(Animated.View)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${circleDimensionMultiplier * windowWidth}px;
  width: ${circleDimensionMultiplier * windowWidth}px;
  background-color: #d7ebff;
  border-radius: 100px;
  margin: 8px 0 0 15px;
  box-shadow: 0 2px 5px rgba(0, 56, 116, 0.06);
`;

const ChatButton = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: ${PrimaryBlue};
  border-radius: 100px;
`;

const XMarkLeft = styled(View)`
  height: 36%;
  width: 5.5px;
  background-color: white;
  border-radius: 100px;
`;

const XMarkRight = styled(View)`
  position: absolute;
  height: 36%;
  width: 5.5px;
  background-color: white;
  transform: rotate(90deg);
  border-radius: 100px;
`;

const AddButton = styled(TouchableOpacity)`
  height: 16px;
  width: 16px;
  background-color: ${PrimaryRed};
  z-index: 1;
  border-radius: 100px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

const PlaceHolderFillerContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

function Friends({ handleOpenSearchBottomSheet, handleOpenBottomSheet }) {
  const [
    { newMessagesAvailable, users, selectedUser, isKeyboardVisible, profile },
    dispatch,
  ] = useStateValue();
  const bottomBarHeight = 10;
  const animationDuration = 100;
  const [contacts, setContacts] = useState([]);

  const PULSE = {
    0: {
      scale: 0.9,
    },

    0.5: {
      scale: 1.2,
    },

    1: {
      scale: 0.9,
    },
  };

  const PULSE_CHAT = {
    0: {
      scale: 0.9,
    },

    0.5: {
      scale: 1.1,
    },

    1: {
      scale: 0.9,
    },
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
        setContacts(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (isKeyboardVisible) {
      handleToZeroShrink();
    } else {
      handleShrink();
    }
  }, [isKeyboardVisible]);

  const handleUserSwitch = (item) => {
    dispatch({
      type: "SET_SELECTED_USER",
      payload: item,
    });
    handleShrink();
  };

  const widthAnim = useRef(
    new Animated.Value(windowWidth * circleDimensionMultiplier)
  ).current;

  const heightAnim = useRef(
    new Animated.Value(windowWidth * circleDimensionMultiplier)
  ).current;

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeOutAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: windowWidth * circleDimensionMultiplier,
      duration: animationDuration,

      useNativeDriver: false,
    }).start();
    Animated.timing(heightAnim, {
      toValue: windowWidth * circleDimensionMultiplier,
      duration: animationDuration,

      useNativeDriver: false,
    }).start();
    Animated.timing(scaleAnim, {
      toValue: windowWidth * circleDimensionMultiplier + bottomBarHeight,
      duration: animationDuration,

      useNativeDriver: false,
    }).start();
  }, []);

  const handleGrow = () => {
    Animated.timing(widthAnim, {
      toValue: windowWidth * circleDimensionMultiplier + 30,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
    Animated.timing(heightAnim, {
      toValue: windowWidth * circleDimensionMultiplier + 30,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
    Animated.timing(scaleAnim, {
      toValue: windowWidth * circleDimensionMultiplier + bottomBarHeight + 35,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

  const handleShrink = () => {
    Animated.timing(widthAnim, {
      toValue: windowWidth * circleDimensionMultiplier,
      duration: 400,
      useNativeDriver: false,
    }).start();
    Animated.timing(heightAnim, {
      toValue: windowWidth * circleDimensionMultiplier,
      duration: 400,
      useNativeDriver: false,
    }).start();
    Animated.timing(scaleAnim, {
      toValue: windowWidth * circleDimensionMultiplier + bottomBarHeight,
      duration: 400,
      useNativeDriver: false,
    }).start();
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
    Animated.timing(fadeOutAnim, {
      toValue: 1,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

  const handleToZeroShrink = () => {
    Animated.timing(widthAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
    Animated.timing(heightAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
    Animated.timing(fadeOutAnim, {
      toValue: 0,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();
  };

  const renderItem = ({ item, index }) => {
    return (
      <FriendContainer
        activeOpacity={0.5}
        key={index}
        onPress={() => handleUserSwitch(item)}
        style={{
          paddingLeft: selectedUser?.friendId === item?.friendId ? 0 : 15,
          paddingTop: 8,
        }}
      >
        <ProfilePictureContainer
          style={{
            height: selectedUser?.friendId === item?.friendId ? 0 : heightAnim,
            width: selectedUser?.friendId === item?.friendId ? 0 : widthAnim,
          }}
        >
          <ProfilePicture
            borderRadius={100}
            margin={-25}
            isBackground={true}
            height={"100%"}
            width={"100%"}
            url={`${PUBLIC_CONTENT_URL}/${item.friendId}/profile.jpeg`}
            cacheKey={`${item.friendId}-profile.jpeg`}
            fill={"red"}
            index={index}
            showDot={newMessagesAvailable.includes(item.friendId)}
            placeholderText={item?.profile?.displayName}
          />
        </ProfilePictureContainer>

        {selectedUser?.friendId !== item?.friendId && (
          <DisplayName style={{ opacity: fadeAnim }}>
            {item?.profile?.displayName
              ? item?.profile?.displayName.substring(0, 8)
              : item?.profile?.username.substring(0, 8)}
          </DisplayName>
        )}
      </FriendContainer>
    );
  };

  const [mergedContacts, setMergedContacts] = useState([]);

  useEffect(() => {
    const withImage = contacts.filter(
      (contacts) => contacts?.imageAvailable === true
    );

    const withoutImage = contacts.filter(
      (contacts) => contacts?.imageAvailable === false
    );

    setMergedContacts([...withImage, ...withoutImage]);
  }, [contacts]);

  const renderPlaceholderItem = ({ item, index }) => {
    return (
      <FriendContainer
        key={index}
        activeOpacity={1}
        onPress={handleOpenBottomSheet}
      >
        <ProfilePictureContainer>
          {profile?.invites === 3 && (
            <Animatable.View
              animation={PULSE}
              easing="ease-out"
              iterationCount="infinite"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1,
                position: "absolute",
                right: 0,
                top: -4,
              }}
            >
              <AddButton />
            </Animatable.View>
          )}
          <ProfilePicture
            borderRadius={100}
            margin={-30}
            isBackground={true}
            height={parseInt(windowWidth * circleDimensionMultiplier) + "px"}
            width={parseInt(windowWidth * circleDimensionMultiplier) + "px"}
            cacheKey={`${item.identifier}-profile.jpeg`}
            url={item?.imageAvailable && item?.image?.uri}
            fill={"#999999"}
          />
        </ProfilePictureContainer>
      </FriendContainer>
    );
  };

  const CreateChatComponent = () => {
    return (
      <CreateChatButtonContainer>
        <Animatable.View
          animation={
            users.length === 0 && profile.invites < 3 ? PULSE_CHAT : null
          }
          easing="ease-out"
          iterationCount="infinite"
        >
          <CreateChatButton
            style={{
              height: heightAnim,
              width: widthAnim,
            }}
          >
            <ChatButton onPress={handleOpenSearchBottomSheet}>
              <XMarkLeft />

              <XMarkRight />
            </ChatButton>
          </CreateChatButton>
        </Animatable.View>

        <Divider style={{ opacity: fadeOutAnim }} />
      </CreateChatButtonContainer>
    );
  };

  const n = 4 - users.length;

  const placeHolderFiller = [...Array(n)].map((e, i) => (
    <FriendContainer key={i} activeOpacity={1} onPress={handleOpenBottomSheet}>
      <ProfilePictureContainer style={{ paddingLeft: 4 }}>
        <Animatable.View
          easing="ease-out"
          iterationCount="infinite"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1,
            position: "absolute",
            right: 0,
            top: -4,
          }}
        >
          <AddButton />
        </Animatable.View>

        <ProfilePicture
          borderRadius={100}
          margin={-30}
          isBackground={true}
          height={parseInt(windowWidth * circleDimensionMultiplier) + "px"}
          width={parseInt(windowWidth * circleDimensionMultiplier) + "px"}
          fill={"#999999"}
        />
      </ProfilePictureContainer>
    </FriendContainer>
  ));

  const placeHolderFillerRow = () => {
    return (
      <>
        {!isKeyboardVisible && (
          <PlaceHolderFillerContainer>
            {placeHolderFiller}
          </PlaceHolderFillerContainer>
        )}
      </>
    );
  };

  return (
    <Container
      activeOpacity={1}
      onPress={() => handleToRightPanel && handleToRightPanel()}
      style={{ height: scaleAnim }}
    >
      {users.length === 0 ? (
        <FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          data={mergedContacts}
          renderItem={renderPlaceholderItem}
          keyExtractor={(item, index) => index.toString()}
          keyboardShouldPersistTaps="always"
          horizontal={true}
          ListHeaderComponent={CreateChatComponent}
          style={{
            overflow: "visible",
            maxHeight: windowWidth * circleDimensionMultiplier,
          }}
        />
      ) : (
        <>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            scrollEnabled={users.length > 1 ? true : false}
            data={users}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            keyboardShouldPersistTaps="always"
            horizontal={true}
            ListHeaderComponent={CreateChatComponent}
            ListFooterComponent={
              users.length <= 2 ? placeHolderFillerRow : null
            }
            onScrollBeginDrag={handleGrow}
            deceleration="fast"
            style={{
              overflow: "visible",
              minWidth: "100%",
            }}
          />
        </>
      )}
    </Container>
  );
}
export default Friends;
