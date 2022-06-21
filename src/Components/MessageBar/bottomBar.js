import React, { memo } from "react";
import { Text, FlatList, TouchableOpacity } from "react-native";
import { emojis } from "./emojis";
import { colorScheme } from "constants";

import styled from "styled-components";

const EmojiContainer = styled(TouchableOpacity)`
  display: flex;
  align-items: center;
  justify-content: center;
  max-height: 36px;
  min-height: 36px;
  min-width: 44px;
  min-width: 44px;
  border-radius: 22.5px;
  background-color: ${colorScheme === "light"
    ? "rgba(255,255,255,1)"
    : "black"};
  margin: 0 0 0 15px;
`;

function BottomBar({ onChangeText, text }) {
  const handleEmoji = (item) => {
    if (text.length < 100) {
      onChangeText(text + item);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <EmojiContainer onPress={() => handleEmoji(item)}>
        <Text style={{ fontSize: 18 }}>{item}</Text>
      </EmojiContainer>
    );
  };

  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      scrollEnabled={true}
      horizontal={true}
      contentContainerStyle={{
        overflow: "visible",
      }}
      contentContainerStyle={{
        display: "flex",
        alignItems: "center",
      }}
      data={emojis}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      keyboardShouldPersistTaps="always"
    />
  );
}
export default memo(BottomBar);
