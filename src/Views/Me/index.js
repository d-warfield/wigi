import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
} from "react-native";
import Clipboard from "@react-native-community/clipboard";
import styled from "styled-components";
import { useStateValue } from "context";
import { useNavigation } from "@react-navigation/native";
import Upload from "react-native-background-upload";
import {
  PrimaryTextColor,
  SecondaryText,
  windowWidth,
  PrimaryLightGrey,
  colorScheme,
  PrimaryPink,
  PrimaryPurple,
  PrimaryRed,
  SecondaryBackgroundColor,
  PrimaryBorderWidth,
  PrimaryDividerColor,
  PrimaryYellow,
  PrimaryGreen,
  PrimaryBlue,
  PrimaryOrange,
} from "constants";
import SmallArrowIcon from "icons/solid/smallarrow";
import { deleteKey, customFetch, moveCacheItem } from "helpers";
import { PUBLIC_CONTENT_URL, API_URL } from "@env";
import ProfilePicture from "components/ProfilePicture";
import Modal from "react-native-modal";
import Learn from "views/Learn";
import BugIcon from "icons/outline/bug";
import LogoutIcon from "icons/outline/logout";
import ProfileIcon from "icons/solid/profile";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useApolloClient } from "@apollo/client";
import EyeGlasses from "icons/solid/eyeglasses";
import WandIcon from "icons/solid/wand";
import Constants from "expo-constants";
import ChatIcon from "icons/outline/chat";
import CopyIcon from "icons/outline/copy";

const Container = styled(View)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
  max-width: 100%;
  padding: ${Constants.statusBarHeight + 10}px 18px 0 18px;
  background-color: ${SecondaryBackgroundColor};
  min-height: 120%;
`;
const Section = styled(Animated.View)`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  margin: 0 0 20px 0;
  border-radius: 12px;
  box-shadow: 0px 1px 10px rgba(1, 1, 1, 0.02);
`;
const ProfileContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  max-width: 100%;
  height: 100%;
`;
const ProfileImage = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
`;

const OptionsContainer = styled(TouchableOpacity)`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: space-between;
  width: 100%;
  background-color: ${colorScheme === "light" ? "white" : "#2C2C2E"};
  border-radius: 12px;
  padding: 4px 0 4px 10px;
`;
const OptionsContainerLeft = styled(View)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-direction: row;
  padding: 5px 0;
`;
const OptionsContainerRight = styled(View)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  flex: 1;
  border-bottom-width: ${PrimaryBorderWidth};
  border-color: ${PrimaryDividerColor};
  padding: 4px 15px 4px 0;
`;
const OptionsContainerText = styled(Text)`
  color: ${colorScheme === "light" ? "black" : "white"};
  font-family: P-Medium;
  font-size: 16.5px;
`;
const OptionsIconWrapper = styled(View)`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  margin: 0 12px 0 0;
`;
const BackArrowContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-90deg);
`;
const CustomProfileIcon = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 100px;
  max-height: 36px;
  min-height: 36px;
  width: 36px;
  overflow: hidden;
`;
const CustomProfileIconContainer = styled(View)`
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;
const LoadingNewProfileImage = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${PrimaryLightGrey};
  border-radius: 40px;
  height: ${windowWidth * 0.25};
  width: ${windowWidth * 0.25};
`;

const CloseBottomSheet = styled(TouchableOpacity)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  right: 15px;
  top: ${Constants.statusBarHeight + 10}px;
  z-index: 1000;
`;

const PrimaryOptionsDescription = styled(Text)`
  font-family: P-Regular;
  color: #b0b0b4;
  margin: 4px 0 0 2px;
`;

const PrimaryOptionsButton = styled(TouchableOpacity)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: red;
  border-radius: 100px;
  padding: 8px 16px;
`;

const PrimaryOptionsButtonText = styled(Text)`
  font-family: P-Bold;
  color: white;
  font-size: 15px;
`;

const ProfileName = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 12px 0 0 0;
`;
const DisplayName = styled(Text)`
  font-size: 19px;
  font-family: P-Bold;
  color: ${PrimaryTextColor};
`;
const Username = styled(Text)`
  font-size: 15px;
  font-family: P-Medium;
  color: ${SecondaryText};
  margin: 1px 0 0 0;
`;

export default function ProfilePage({ handleCloseBottomSheet }) {
  const [{ profile, profilePictureUpdatedAt, users }, dispatch] =
    useStateValue();
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();
  const client = useApolloClient();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    Clipboard.setString(profile.inviteCode);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const pickProfilePicture = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.6,
    });
    setIsLoading(true);
    if (!result.cancelled) {
      const url = result.uri;
      try {
        const manipResult = await ImageManipulator.manipulateAsync(url, [], {
          compress: 0,
          format: ImageManipulator.SaveFormat.JPEG,
        });
        const req = await customFetch(`${API_URL}/profile/picture`, {
          method: "POST",
          body: JSON.stringify({
            fileExtension: ImageManipulator.SaveFormat.JPEG,
          }),
        });
        await Upload.startUpload({
          url: req.url,
          path: manipResult.uri,
          method: "PUT",
          type: "raw",
        });
        await moveCacheItem(manipResult.uri, `${profile.userId}-profile.jpeg`);
        dispatch({
          type: "UPDATE_SETTINGS",
          payload: {
            profilePictureUpdatedAt: Date.now(),
          },
        });
      } catch (err) {
        console.error("failed to pick profile picture", err);
      }
    }
    setIsLoading(false);
  };
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "OK", onPress: async () => await logout() },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: false }
    );
  };
  const logout = async () => {
    try {
      await customFetch(`${API_URL}/users/logout`, {
        method: "GET",
      });
      await deleteKey("access_token");
      await deleteKey("id_token");
      await deleteKey("refresh_token");
      await deleteKey("availableUsers");
      await AsyncStorage.removeItem("apollo-schema-key");
      await client.clearStore();
      dispatch({
        type: "SET_USER_DETAILS",
        payload: {
          userId: "",
        },
      });
      dispatch({
        type: "TOGGLE_AUTH",
        payload: false,
      });
    } catch (err) {
      console.error("failed to logout", err);
    }
  };

  return (
    <>
      <Container activeOpacity={1}>
        <CloseBottomSheet onPress={handleCloseBottomSheet}>
          <SmallArrowIcon
            height={20}
            width={20}
            fill={colorScheme === "light" ? "black" : "white"}
          />
        </CloseBottomSheet>
        <ScrollView>
          <ProfileContainer
            contentContainerStyle={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <ProfileImage onPress={pickProfilePicture}>
              {isLoading ? (
                <LoadingNewProfileImage>
                  <ActivityIndicator color={"black"} />
                </LoadingNewProfileImage>
              ) : (
                <ProfilePicture
                  borderRadius={100}
                  key={profilePictureUpdatedAt}
                  height={windowWidth * 0.25 + "px"}
                  width={windowWidth * 0.25 + "px"}
                  fill={"#999999"}
                  margin={-50}
                  url={`${PUBLIC_CONTENT_URL}/${profile.userId}/profile.jpeg`}
                  cacheKey={`${profile.userId}-profile.jpeg`}
                  mePage={true}
                />
              )}
            </ProfileImage>
            <ProfileName>
              <DisplayName>{profile.displayName || "Display Name"}</DisplayName>
              <Username>@{profile.username}</Username>
            </ProfileName>

            <Section style={{ marginTop: 15 }}>
              <OptionsContainer onPress={() => navigation.navigate("Edit")}>
                <OptionsContainerLeft>
                  <OptionsIconWrapper>
                    <CustomProfileIcon style={{ backgroundColor: PrimaryBlue }}>
                      <CustomProfileIconContainer>
                        <ProfileIcon height={17} fill={"white"} />
                      </CustomProfileIconContainer>
                    </CustomProfileIcon>
                  </OptionsIconWrapper>
                </OptionsContainerLeft>
                <OptionsContainerRight style={{ borderBottomWidth: 0 }}>
                  <OptionsContainerText>Username</OptionsContainerText>
                  <BackArrowContainer>
                    <SmallArrowIcon fill={"#D1D1D6"} height={14} />
                  </BackArrowContainer>
                </OptionsContainerRight>
              </OptionsContainer>
            </Section>

            <Section>
              <OptionsContainer disabled={true}>
                <OptionsContainerLeft>
                  <OptionsIconWrapper>
                    <CustomProfileIcon
                      style={{ backgroundColor: PrimaryOrange }}
                    >
                      <CustomProfileIconContainer>
                        <EyeGlasses height={24} width={24} fill={"white"} />
                      </CustomProfileIconContainer>
                    </CustomProfileIcon>
                  </OptionsIconWrapper>
                </OptionsContainerLeft>
                <OptionsContainerRight style={{ borderBottomWidth: 0 }}>
                  <OptionsContainerText>Learn</OptionsContainerText>
                  <PrimaryOptionsButton
                    onPress={() => setModalVisible(!modalVisible)}
                    style={{ backgroundColor: PrimaryOrange }}
                  >
                    <PrimaryOptionsButtonText>Learn</PrimaryOptionsButtonText>
                  </PrimaryOptionsButton>
                </OptionsContainerRight>
              </OptionsContainer>
              <PrimaryOptionsDescription>
                Add someone to your home screen
              </PrimaryOptionsDescription>
            </Section>

            <Section>
              <OptionsContainer disabled={true}>
                <OptionsContainerLeft>
                  <OptionsIconWrapper>
                    <CustomProfileIcon style={{ backgroundColor: PrimaryPink }}>
                      <CustomProfileIconContainer>
                        <CopyIcon height={19} fill={"white"} />
                      </CustomProfileIconContainer>
                    </CustomProfileIcon>
                  </OptionsIconWrapper>
                </OptionsContainerLeft>
                <OptionsContainerRight style={{ borderBottomWidth: 0 }}>
                  <OptionsContainerText>
                    {profile.inviteCode}
                  </OptionsContainerText>
                  <PrimaryOptionsButton
                    onPress={copyToClipboard}
                    style={{ backgroundColor: PrimaryGreen }}
                  >
                    <PrimaryOptionsButtonText>
                      {!copied ? "Copy" : "Copied"}
                    </PrimaryOptionsButtonText>
                  </PrimaryOptionsButton>
                </OptionsContainerRight>
              </OptionsContainer>
              <PrimaryOptionsDescription>
                Use your code to invite anyone
              </PrimaryOptionsDescription>
            </Section>

            <Section
              style={{
                backgroundColor: colorScheme === "light" ? "white" : "#2C2C2E",
              }}
            >
              <OptionsContainer
                onPress={() => navigation.navigate("Contact Us")}
              >
                <OptionsContainerLeft>
                  <OptionsIconWrapper>
                    <CustomProfileIcon
                      style={{ backgroundColor: PrimaryYellow }}
                    >
                      <CustomProfileIconContainer>
                        <ChatIcon fill={"white"} height={17} width={17} />
                      </CustomProfileIconContainer>
                    </CustomProfileIcon>
                  </OptionsIconWrapper>
                </OptionsContainerLeft>
                <OptionsContainerRight>
                  <OptionsContainerText>Message us</OptionsContainerText>
                  <BackArrowContainer>
                    <SmallArrowIcon fill={"#D1D1D6"} height={14} />
                  </BackArrowContainer>
                </OptionsContainerRight>
              </OptionsContainer>

              <OptionsContainer
                onPress={() => navigation.navigate("Contact Us")}
              >
                <OptionsContainerLeft>
                  <OptionsIconWrapper>
                    <CustomProfileIcon
                      style={{ backgroundColor: PrimaryPurple }}
                    >
                      <CustomProfileIconContainer>
                        <BugIcon fill={"white"} height={18} width={18} />
                      </CustomProfileIconContainer>
                    </CustomProfileIcon>
                  </OptionsIconWrapper>
                </OptionsContainerLeft>
                <OptionsContainerRight style={{ borderBottomWidth: 0 }}>
                  <OptionsContainerText>Report a bug</OptionsContainerText>
                  <BackArrowContainer>
                    <SmallArrowIcon fill={"#D1D1D6"} height={14} />
                  </BackArrowContainer>
                </OptionsContainerRight>
              </OptionsContainer>
            </Section>
            <Section>
              <OptionsContainer onPress={handleLogout}>
                <OptionsContainerLeft>
                  <OptionsIconWrapper>
                    <CustomProfileIcon style={{ backgroundColor: PrimaryRed }}>
                      <CustomProfileIconContainer>
                        <LogoutIcon fill={"white"} height={16} width={16} />
                      </CustomProfileIconContainer>
                    </CustomProfileIcon>
                  </OptionsIconWrapper>
                </OptionsContainerLeft>
                <OptionsContainerRight style={{ borderBottomWidth: 0 }}>
                  <OptionsContainerText>Logout</OptionsContainerText>
                  <BackArrowContainer>
                    <SmallArrowIcon fill={"#D1D1D6"} height={14} />
                  </BackArrowContainer>
                </OptionsContainerRight>
              </OptionsContainer>
            </Section>
          </ProfileContainer>
        </ScrollView>
      </Container>

      <Modal
        style={{ margin: 0 }}
        animationInTiming={200}
        animationOutTiming={200}
        backdropColor="white"
        backdropOpacity={1}
        animationIn={users <= 0 ? "fadeIn" : "slideInUp"}
        isVisible={modalVisible}
      >
        <Learn closeModal={() => setModalVisible(!modalVisible)} />
      </Modal>
    </>
  );
}
