import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import {
  Platform,
  KeyboardAvoidingView,
  View,
  Text,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import styled from "styled-components";
import Animated, { useSharedValue } from "react-native-reanimated";
import Constants from "expo-constants";
import MessageBar from "components/MessageBar";
import MessageFeed from "components/MessageFeed";
import Me from "views/Me";
import Invites from "components/Invites";
import SEARCH_PROFILE_BY_ID from "gql/searchProfileById";
import { useApolloClient } from "@apollo/client";
import {
  windowWidth,
  PrimaryBorderColor,
  colorScheme,
  PrimaryTextColor,
  PrimaryPink,
  circleDimensionMultiplier,
} from "constants";
import { useStateValue } from "context";
import { useNavigation } from "@react-navigation/native";
import { getKey, storeKey } from "helpers";
import ProfileIcon from "icons/solid/profile";
import BottomSheet from "@gorhom/bottom-sheet";
import Contacts from "views/Contacts";
import Search from "views/Search";
import HandsIcon from "icons/solid/hands";
import Wigi from "icons/solid/wigi";
import ProfilePicture from "components/ProfilePicture";
import { PUBLIC_CONTENT_URL } from "@env";
import * as Animatable from "react-native-animatable";
import { BlurView } from "expo-blur";

const Container = styled(View)`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  align-items: stretch;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
  overflow: visible;
`;

const Header = styled(View)`
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  max-width: ${windowWidth}px;
  min-width: ${windowWidth}px;
  background-color: ${colorScheme === "light"
    ? "rgba(247, 247, 247, 0.5)"
    : "#00000010"};
  border-bottom-width: 0.3px;
  border-color: ${PrimaryBorderColor};
  top: 0;
`;
const HeaderTop = styled(View)`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;
  padding: ${Constants.statusBarHeight}px 15px 5px 15px;
  max-height: 115px;

  height: 100%;
`;

const HeaderBottom = styled(Animated.View)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 100%;
`;

const HeaderLeft = styled(View)`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
  min-width: 20%;

  height: 100%;
`;

const HeaderMiddle = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex: 1;
  height: 100%;
`;

const HeaderRight = styled(View)`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-width: 20%;
`;

const HeaderButton = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex: 1;
  height: 100%;
  width: 100%;
`;

const NotificationCounter = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: ${PrimaryPink};
  z-index: 3;
  border-radius: 100px;
  min-height: 17px;
  min-width: 17px;
  right: -2px;
  top: 15px;
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.2);
`;

const NotificationCounterText = styled(Text)`
  font-family: P-Bold;
  font-size: 10px;
  color: white;
`;

const SelectedUserContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const SelectedUserText = styled(Text)`
  font-family: P-Medium;
  font-size: 13px;
  color: ${PrimaryTextColor};
`;
export default function Home() {
  const [{ profile, selectedUser, isKeyboardVisible, users }] = useStateValue();
  const [index, setIndex] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(true);

  const navigation = useNavigation();
  const backgroundColor = useSharedValue(0);
  const client = useApolloClient();
  const [type, setType] = useState(null);
  const sheetRef = useRef(null);

  const handleViewRef = useRef();
  const handleTextRef = useRef();

  useEffect(() => {
    Keyboard.dismiss();
    sheetRef.current?.snapTo(0);
  }, [selectedUser]);

  const snapPoints = useMemo(() => [0, "100%"], []);

  const handleSheetChange = useCallback((index) => {
    setIndex(index);
    if (index === 0) {
      Keyboard.dismiss();
    }
  }, []);

  const handleOpenBottomSheet = (param) => {
    sheetRef.current?.snapTo(1);
    setType(param);
    if (isKeyboardVisible && param !== "Search") {
      Keyboard.dismiss();
    }
  };

  const handleCloseBottomSheet = () => {
    sheetRef.current?.snapTo(0);
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (index === 1) {
      backgroundColor.value = 0;
    } else {
      backgroundColor.value = 1;
    }
  }, [index]);

  useEffect(() => {
    (async () => {
      const hideInviteModal = await getKey("hideInviteModal");
      setShowInviteModal(hideInviteModal ? false : true);

      const hasVisitedBefore = await getKey("hasVisitedBefore");
      if (hasVisitedBefore !== profile?.userId) {
        await storeKey("hasVisitedBefore", profile?.userId || "yes");
        if (profile.inviterId) {
          const { data } = await client.query({
            query: SEARCH_PROFILE_BY_ID,
            variables: { id: profile.inviterId },
          });

          const { displayName, username, userId } = data.searchProfileById;

          navigation.navigate("Welcome", {
            disableSkip: false,
            displayName,
            username,
            userId,
          });
        } else {
          navigation.navigate("Welcome", {
            disableSkip: false,
          });
        }
      }
    })();
  }, []);

  const PageComponent = (type) => {
    switch (type) {
      case "Me":
        return (
          <Me
            handleCloseBottomSheet={handleCloseBottomSheet}
            handleOpenBottomSheet={() => handleOpenBottomSheet("Contacts")}
          />
        );
      case "Contacts":
        return (
          <Contacts
            disableDone={true}
            handleCloseBottomSheet={handleCloseBottomSheet}
          />
        );

      case "Search":
        return <Search handleCloseBottomSheet={handleCloseBottomSheet} />;
      default:
        return;
    }
  };

  const BottomSheetBackground = () => {
    return (
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundColor: "transparent",
        }}
      />
    );
  };

  return (
    <>
      <Container>
        <Header>
          <BlurView
            intensity={100}
            tint={colorScheme === "light" ? "default" : "dark"}
          >
            <HeaderTop>
              <HeaderLeft>
                <HeaderButton onPress={() => handleOpenBottomSheet("Me")}>
                  <ProfileIcon
                    height={24.5}
                    fill={
                      colorScheme === "light"
                        ? "#999999"
                        : "rgba(153, 153, 153, 0.50)"
                    }
                  />
                </HeaderButton>
              </HeaderLeft>

              <HeaderMiddle>
                {users.length === 0 ? (
                  <SelectedUserContainer>
                    <Wigi
                      height={30}
                      width={30}
                      fill={colorScheme === "light" ? "#999999" : "#999999"}
                    />
                  </SelectedUserContainer>
                ) : (
                  <SelectedUserContainer>
                    <Animatable.View
                      ref={handleViewRef}
                      animation="bounceIn"
                      style={{ marginBottom: 2.5 }}
                    >
                      <ProfilePicture
                        key={selectedUser?.friendId}
                        borderRadius={100}
                        margin={-25}
                        isBackground={true}
                        height={circleDimensionMultiplier * windowWidth + "px"}
                        width={circleDimensionMultiplier * windowWidth + "px"}
                        url={`${PUBLIC_CONTENT_URL}/${selectedUser?.friendId}/profile.jpeg`}
                        cacheKey={`${selectedUser?.friendId}-profile.jpeg`}
                        index={index}
                      />
                    </Animatable.View>
                    <Animatable.Text ref={handleTextRef}>
                      <SelectedUserText>
                        {selectedUser?.profile?.displayName}
                      </SelectedUserText>
                    </Animatable.Text>
                  </SelectedUserContainer>
                )}
              </HeaderMiddle>

              <HeaderRight>
                <HeaderButton
                  style={{ alignItems: "flex-end" }}
                  onPress={() => handleOpenBottomSheet("Contacts")}
                >
                  {profile.invites > 0 && (
                    <NotificationCounter>
                      <NotificationCounterText>
                        {profile?.invites}
                      </NotificationCounterText>
                    </NotificationCounter>
                  )}
                  <HandsIcon
                    fill={
                      colorScheme === "light"
                        ? "#999999"
                        : "rgba(153, 153, 153, 0.50)"
                    }
                    fillCircle={"transparent"}
                  />
                </HeaderButton>
              </HeaderRight>
            </HeaderTop>
            <HeaderBottom>
              {profile.invites > 0 && showInviteModal && (
                <Invites
                  openInvitesBottomSheet={() =>
                    handleOpenBottomSheet("Contacts")
                  }
                  amount={profile.invites}
                />
              )}
            </HeaderBottom>
          </BlurView>
        </Header>
        <KeyboardAvoidingView
          enabled={true}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ maxHeight: "100%", flex: 1 }}
        >
          <MessageFeed />
          <MessageBar
            handleOpenBottomSheet={() => handleOpenBottomSheet("Contacts")}
            handleOpenSearchBottomSheet={() => handleOpenBottomSheet("Search")}
          />
        </KeyboardAvoidingView>
      </Container>
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        backgroundComponent={(props) => <BottomSheetBackground {...props} />}
        handleComponent={() => <View />}
      >
        {PageComponent(type)}
      </BottomSheet>
    </>
  );
}
