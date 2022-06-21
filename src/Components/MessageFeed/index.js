import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from "react";
import {
  View,
  Animated,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import styled from "styled-components";
import Media from "components/Media";
import {
  windowHeight,
  windowWidth,
  PrimaryTextColor,
  PrimaryPink,
} from "constants";
import { useStateValue } from "context";
import MessageItem from "components/MessageItem";
import GET_CHAT from "gql/getChat";
import GET_MORE_MESSAGES from "gql/getMoreMessages";
import { useApolloClient, useQuery } from "@apollo/client";
import CameraComponent from "components/Camera";
import Modal from "react-native-modal";
import Learn from "views/Learn";
import * as Animatable from "react-native-animatable";

const feedWidthMultiplier = 1.8;
const centerCamera = windowHeight * 0.44;

const InitialMessageContainer = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0 15px 0;
`;

const Wigi = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${windowWidth / feedWidthMultiplier + "px"};
  border-radius: 32px;
`;
const WigiText = styled(Text)`
  font-family: P-Medium;
  color: ${PrimaryTextColor};
  text-align: center;
`;
const WigiButton = styled(TouchableOpacity)`
  background-color: ${PrimaryPink};
  width: 100%;
  padding: 14px 0;
  border-radius: 100px;
`;
const WigiButtonText = styled(Text)`
  color: white;
  font-family: P-Bold;
  text-align: center;
`;
function MessageFeed() {
  const [{ users, selectedUser, messages, isKeyboardVisible }, dispatch] =
    useStateValue();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const client = useApolloClient();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const heightAnim = useRef(new Animated.Value(450)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const [LastEvaluatedKey, setLastEvaluatedKey] = useState(null);
  const [animation, setAnimation] = useState(null);

  const messageListRef = useRef();

  const { data } = useQuery(GET_CHAT, {
    variables: {
      friendId: selectedUser?.friendId,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-only",
  });

  const allMessages = useMemo(
    () => [...messages, ...(data?.getChat?.chatData?.messages || [])],
    [messages, data]
  );

  useEffect(() => {
    if (data && !LastEvaluatedKey) {
      setLastEvaluatedKey(data.getChat?.chatData?.LastEvaluatedKey);
    }
  }, [data]);

  const BOUNCE = {
    0: {
      translateY: 10,
    },

    0.5: {
      translateY: 0,
    },

    1: {
      translateY: 10,
    },
  };

  useEffect(() => {
    if (allMessages.length === 0) {
      growCamera();
    }
  }, [isKeyboardVisible]);

  useEffect(() => {
    if (animation === "shrink") {
      shrinkCamera();
    } else if (animation === "grow") {
      growCamera();
    }
  }, [animation]);

  const onScroll = ({ nativeEvent }) => {
    if (nativeEvent.contentOffset.y > 100 && isKeyboardVisible) {
      Keyboard.dismiss();
    }

    if (nativeEvent.contentOffset.y > 1) {
      setAnimation(null);
    }
    if (nativeEvent.contentOffset.y < 1) {
      setAnimation("grow");
    }
  };

  useEffect(() => {
    if (isKeyboardVisible) {
      shrinkCamera();
    } else if (!isKeyboardVisible && animation === "grow") {
      growCamera();
    }
  }, [isKeyboardVisible]);

  useEffect(() => {
    growCamera();
  }, []);

  useEffect(() => {
    dispatch({
      type: "SET_MESSAGES",
      payload: [],
    });
    setLastEvaluatedKey(null);
    if (selectedUser?.friendId) {
      dispatch({
        type: "REMOVE_NEW_MESSAGES_AVAILABLE",
        payload: selectedUser.friendId,
      });
      let timer = setTimeout(() => {
        if (messageListRef.current) {
          messageListRef.current.scrollToOffset({
            offset: 0,
            animated: true,
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedUser]);

  const shrinkCamera = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
    Animated.timing(heightAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  const growCamera = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 220,
      useNativeDriver: false,
    }).start();
    Animated.timing(heightAnim, {
      toValue: centerCamera,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  const renderItem = ({ item, index }) => {
    if (item.message) {
      return (
        <MessageItem
          key={index}
          message={item.message}
          sender={item.sender}
          spacing={
            item.sender !== allMessages[index - 1]?.sender ? true : false
          }
          bubbles={index === 0}
          animate={false}
        />
      );
    }
    return (
      <Media
        key={index}
        media={item}
        length={allMessages.length}
        animate={index === 0}
        index={index}
        sender={item.sender}
      />
    );
  };
  const HeaderComponent = useCallback(() => {
    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          height: heightAnim,
        }}
      >
        <CameraComponent />
      </Animated.View>
    );
  }, [scaleAnim, translateYAnim, heightAnim, fadeAnim]);

  const FooterComponent = useCallback(() => {
    if (isLoadingMore) {
      return <ActivityIndicator color={PrimaryTextColor} size="small" />;
    }
    if (selectedUser && allMessages.length === 0) {
      return (
        <InitialMessageContainer>
          <Wigi>
            <WigiText>
              Add{" "}
              <Text style={{ fontFamily: "P-Bold" }}>
                {selectedUser?.profile?.displayName === null
                  ? selectedUser?.profile?.username
                  : selectedUser?.profile?.displayName}
              </Text>{" "}
              to your home screen
            </WigiText>
            <View
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 6,
                paddingBottom: 22,
              }}
            >
              <Animatable.Text
                animation={BOUNCE}
                iterationCount="infinite"
                style={{
                  fontSize: 25,
                  textAlign: "center",
                }}
              >
                👇
              </Animatable.Text>
            </View>
            <WigiButton
              activeOpacity={1}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <WigiButtonText>Learn how</WigiButtonText>
            </WigiButton>
          </Wigi>
        </InitialMessageContainer>
      );
    }
    if (!selectedUser && allMessages.length === 0) {
      return (
        <InitialMessageContainer>
          {users.length < 1 && (
            <MessageItem
              message={"Hey! Press the blue button to message someone"}
              sender={"WIGI"}
              bubbles={true}
            />
          )}
        </InitialMessageContainer>
      );
    }
    return null;
  }, [isLoadingMore, selectedUser, allMessages, users]);

  const onEndReached = async () => {
    if (
      !isLoadingMore &&
      LastEvaluatedKey &&
      selectedUser?.chatId === LastEvaluatedKey?.chatId
    ) {
      setIsLoadingMore(true);
      const { data } = await client.query({
        query: GET_MORE_MESSAGES,
        variables: {
          friendId: selectedUser?.friendId,
          chatId: LastEvaluatedKey.chatId,
          messageId: LastEvaluatedKey.messageId,
        },
        fetchPolicy: "cache-first",
      });

      setLastEvaluatedKey(data?.getMoreMessages?.LastEvaluatedKey || "empty");
      dispatch({
        type: "SET_MESSAGES",
        payload: messages.concat(data?.getMoreMessages?.messages),
      });
      setIsLoadingMore(false);
    }
  };

  return (
    <>
      <FlatList
        scrollEnabled={allMessages.length !== 0 ? true : false}
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom: 150,
        }}
        style={{ overflow: "visible", paddingLeft: 15, paddingRight: 15 }}
        data={allMessages.sort((a, b) => a.createdAt < b.createdAt)}
        ref={messageListRef}
        renderItem={renderItem}
        onEndReached={onEndReached}
        onEndReachedThreshold={5}
        keyExtractor={(item) => item.messageId}
        showsVerticalScrollIndicator={false}
        windowSize={8}
        inverted
        ListHeaderComponent={HeaderComponent}
        ListFooterComponent={FooterComponent}
        onScroll={onScroll}
      />
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
export default memo(MessageFeed);
