import React, { useState, useEffect, useCallback } from "react";
import {
  Linking,
  Keyboard,
  Platform,
  View,
  ActivityIndicator,
  AppState,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import { ConcertOne_400Regular } from "@expo-google-fonts/concert-one";
import EditProfile from "views/Me/edit";
import {
  PrimaryBorderColor,
  BackgroundColor,
  PrimaryTextColor,
  appGroupIdentifier,
  PrimaryBlue,
  colorScheme,
  SecondaryBackgroundColor,
} from "constants";
import Intro from "views/Login/intro";
import EnterPhone from "views/Login/enterPhone";
import AuthCode from "views/Login/authCode";
import Username from "views/Username";
import Contact from "views/Settings/contact";
import Welcome from "views/Welcome";
import Reserved from "views/Reserved";
import Contacts from "views/Contacts";
import Enable from "views/Enable";
import { useStateValue } from "context";
import { getKey, deleteKey } from "helpers";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import SharedGroupPreferences from "react-native-shared-group-preferences";
import Home from "views/Home";
import ME from "gql/me";
import MESSAGE_RECEIVED from "gql/messageReceived";
import GET_FRIENDS from "gql/getFriends";
import EDIT_PROFILE from "gql/editProfile";
import GET_CHAT from "gql/getChat";
import TYPING_SUBSCRIPTION from "gql/typingSubscription";
import { useApolloClient } from "@apollo/client";
import { Camera } from "expo-camera";
import * as Notifications from "expo-notifications";
import * as ExpoContacts from "expo-contacts";
import { reloadAllTimelines } from "react-native-widgetkit";
import SplashScreen from "views/SplashScreen";
import AppLoadingView from "views/AppLoading";
import Me from "views/Me";

export default function App() {
  const Stack = createStackNavigator();
  const [loading, setLoading] = useState(true);
  const [{ users, permissions, profile, auth }, dispatch] = useStateValue();
  const client = useApolloClient();

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { status: cameraPermission } =
        await Camera.getCameraPermissionsAsync();
      const { status: notificationPermission } =
        await Notifications.getPermissionsAsync();
      const { status: contactsPermission } =
        await ExpoContacts.getPermissionsAsync();
      dispatch({
        type: "SET_PERMISSIONS",
        payload: {
          camera: cameraPermission,
          notifications: notificationPermission,
          contacts: contactsPermission,
        },
      });
      const accessToken = await getKey("access_token");
      if (accessToken) {
        dispatch({
          type: "TOGGLE_AUTH",
          payload: true,
        });
      }
      if (auth) {
        try {
          const { data } = await client.query({
            query: ME,
            fetchPolicy: "cache-first",
          });
          dispatch({
            type: "SET_USER_DETAILS",
            payload: data.me,
          });
        } catch (err) {
          console.error("authentication failed", err);
          await deleteKey("access_token");
          await deleteKey("id_token");
          await deleteKey("availableUsers");
          await deleteKey("hideInviteModal");
          await deleteKey("apollo-schema-key");
          dispatch({
            type: "TOGGLE_AUTH",
            payload: false,
          });
          setLoading(false);
        }
        const { data } = await client.query({
          query: GET_FRIENDS,
          fetchPolicy: "cache-first",
        });
        if (data.getAllFriends) {
          const users = data.getAllFriends;
          dispatch({
            type: "SET_USERS",
            payload: users,
          });
          const friends = users.map((friend) => {
            return {
              identifier: friend.friendId,
              name: friend.profile?.displayName || friend.profile?.username,
            };
          });
          await SharedGroupPreferences.setItem(
            "availableUsers",
            friends,
            appGroupIdentifier
          );
        }
        setLoading(false);
        await reloadDataFromServer();
        try {
          const newMessages = await SharedGroupPreferences.getItem(
            "newMessages",
            appGroupIdentifier
          );
          dispatch({
            type: "SET_NEW_MESSAGES_AVAILABLE",
            payload: newMessages || [],
          });
          await SharedGroupPreferences.setItem(
            "newMessages",
            [],
            appGroupIdentifier
          );
          for (const i in newMessages) {
            await client.query({
              query: GET_CHAT,
              variables: {
                friendId: newMessages[i],
              },
              fetchPolicy: "network-only",
            });
          }
          await SharedGroupPreferences.setItem("count", 0, appGroupIdentifier);
        } catch (err) {
          await SharedGroupPreferences.setItem(
            "newMessages",
            [],
            appGroupIdentifier
          );
          console.error("failed to get new message bubbles", err);
        }
      }
      setLoading(false);
    })();

    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardWillShow",
      () => {
        dispatch({
          type: "SET_KEYBOARD_VISIBLE",
          payload: true,
        });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardWillHide",
      () => {
        dispatch({
          type: "SET_KEYBOARD_VISIBLE",
          payload: false,
        });
      }
    );

    reloadAllTimelines();

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [auth]);

  const selectUserFromURL = async () => {
    Platform.OS === "ios" &&
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
    if (AppState.currentState !== "active") return;

    const deep = await Linking.getInitialURL();
    const userId = deep?.split("com.widgetsapp://user/")[1];
    if (userId) {
      const user = users.find((user) => user.friendId === userId);
      if (user) {
        dispatch({
          type: "SET_SELECTED_USER",
          payload: user,
        });
      }
    } else {
      dispatch({
        type: "SET_SELECTED_USER",
        payload: users[0],
      });
    }
  };

  useEffect(() => {
    AppState.addEventListener("change", selectUserFromURL);

    selectUserFromURL();

    return () => AppState.removeEventListener("change", selectUserFromURL);
  }, [users]);

  useEffect(() => {
    if (permissions.notifications !== "granted" || !profile.userId) return;

    PushNotification.configure({
      onRegister: async function (details) {
        if (profile?.notificationToken !== details.token) {
          try {
            await client.mutate({
              mutation: EDIT_PROFILE,
              variables: {
                notificationToken: details.token,
              },
            });
          } catch {
            console.error("Failed to update notification token");
          }
        }
      },
      onNotification: function (notification) {
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function () {},
      onRegistrationError: function (err) {},
      popInitialNotification: false,
    });
  }, [profile, permissions]);

  const reloadDataFromServer = async () => {
    try {
      const { data } = await client.query({
        query: ME,
        fetchPolicy: "network-only",
      });
      dispatch({
        type: "SET_USER_DETAILS",
        payload: data.me,
      });
      client
        .subscribe({
          query: MESSAGE_RECEIVED,
          variables: {
            recipientId: data.me.userId,
          },
        })
        .subscribe({
          next({ data }) {
            (async () => {
              dispatch({
                type: "ADD_NEW_MESSAGES_AVAILABLE",
                payload: data.messageReceived,
              });
              client.cache.modify({
                id: client.cache.identify({
                  __typename: "Chat",
                  chatId: data?.messageReceived.chatId,
                }),
                fields: {
                  chatData(existing) {
                    return {
                      ...existing,
                      messages: [...existing.messages, data.messageReceived],
                    };
                  },
                },
              });
            })();
          },
          error(err) {
            console.error(
              "Message subscription error: CRITICAL",
              JSON.stringify(err)
            );
          },
        });

      client
        .subscribe({
          query: TYPING_SUBSCRIPTION,
          variables: {
            recipientId: data.me.userId,
          },
        })
        .subscribe({
          next({ data }) {
            dispatch({
              type: "SET_TYPING",
              payload: data.isUserTyping,
            });
          },
          error(err) {
            console.error(
              "Set typing subscription failed: CRITICAL",
              JSON.stringify(err)
            );
          },
        });
    } catch (err) {
      console.error("failed to reload user data from server", err);
      await deleteKey("access_token");
      await deleteKey("id_token");
      await deleteKey("availableUsers");
      await deleteKey("hideInviteModal");
      await deleteKey("apollo-schema-key");
      dispatch({
        type: "TOGGLE_AUTH",
        payload: false,
      });
      setLoading(false);
    }
    await fetchFriends();
  };

  const fetchFriends = async () => {
    try {
      const { data } = await client.query({
        query: GET_FRIENDS,
        fetchPolicy: "network-only",
      });
      if (data?.getAllFriends) {
        dispatch({
          type: "SET_USERS",
          payload: data.getAllFriends,
        });
      }
    } catch (err) {
      console.error("Failed to reload friends data data from server", err);
    }
  };

  let [fontsLoaded] = useFonts({
    "Concert-One": ConcertOne_400Regular,
    "P-Heavy": require("assets/fonts/Prox-Black.otf"),
    "P-Bold": require("assets/fonts/Prox-Bold.otf"),
    "P-Semi": require("assets/fonts/Prox-Semi.otf"),
    "P-Medium": require("assets/fonts/Prox-Medium.otf"),
    "P-Regular": require("assets/fonts/Prox-Regular.otf"),
    "P-Light": require("assets/fonts/Prox-Light.otf"),
    "Ahkio-Bold": require("assets/fonts/Ahkio-Bold.ttf"),
    "SF-Pro-Semibold": require("assets/fonts/SF-Pro-Display-Semibold.otf"),
    "SF-Pro-Regular": require("assets/fonts/SF-Pro-Text-Regular.otf"),
  });

  const headerStyle = {
    headerShown: true,
    headerBackTitleVisible: false,
    headerTintColor: PrimaryTextColor,
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      borderBottomColor: PrimaryBorderColor,
      backgroundColor:
        colorScheme === "light" ? SecondaryBackgroundColor : "black",
    },
    headerTitleStyle: {
      fontFamily: "P-Bold",
      fontSize: 17,
      color: PrimaryTextColor,
    },
    transitionSpec: {
      open: {
        animation: "timing",
        config: {
          duration: 70,
        },
      },
      close: {
        animation: "timing",
        config: {
          duration: 70,
        },
      },
    },
  };

  const noHeaderBottomBorder = {
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 5,
      borderBottomColor: "white",
    },
  };

  const loginHeaderStyle = {
    headerShown: true,
    headerBackTitleVisible: false,
    headerTintColor: colorScheme === "light" ? "black" : PrimaryBlue,
    title: "",
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      backgroundColor: colorScheme === "light" ? "white" : "black",
    },
    headerTitleStyle: {
      fontFamily: "P-Bold",
      fontSize: 18,
      color: "black",
    },
    transitionSpec: {
      open: {
        animation: "timing",
        config: {
          duration: 70,
        },
      },
      close: {
        animation: "timing",
        config: {
          duration: 70,
        },
      },
    },
  };

  if (!fontsLoaded) {
    return (
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: PrimaryBlue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="white" />
      </View>
    );
  }

  if (loading) {
    return <AppLoadingView />;
  }

  const getInitialRoute = () => {
    if (!Object.values(permissions).every((e) => e === "granted")) {
      return "Enable";
    }
    if (!profile.username) {
      return "Username";
    }
    if (profile.pending) {
      return "Reserved";
    }
    return "Home";
  };

  return (
    <NavigationContainer>
      {auth ? (
        <SplashScreen loading={loading}>
          <Stack.Navigator
            initialRouteName={getInitialRoute()}
            screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: BackgroundColor },
            }}
          >
            <Stack.Screen
              options={{ headerShown: false }}
              name="Enable"
              component={Enable}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Home"
              component={Home}
            />
            <Stack.Screen
              options={noHeaderBottomBorder}
              name="Username"
              component={Username}
            />
            <Stack.Screen
              options={{ ...headerStyle, title: "Edit Profile" }}
              name="Edit"
              component={EditProfile}
            />
            <Stack.Screen
              options={noHeaderBottomBorder}
              name="Reserved"
              component={Reserved}
            />
            <Stack.Screen
              options={headerStyle}
              name="Contact Us"
              component={Contact}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Invites"
              children={() => <Contacts intro={true} />}
            />
            <Stack.Screen
              options={noHeaderBottomBorder}
              name="Welcome"
              component={Welcome}
            />
            <Stack.Screen options={headerStyle} name="Me" component={Me} />
          </Stack.Navigator>
        </SplashScreen>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Intro"
            component={Intro}
          />
          <Stack.Screen
            options={loginHeaderStyle}
            name="Enter Phone Number"
            component={EnterPhone}
          />
          <Stack.Screen
            options={loginHeaderStyle}
            name="Auth Code"
            component={AuthCode}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
