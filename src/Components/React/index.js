import React, { useState, useRef } from "react";
import { TextInput, View } from "react-native";
import styled from "styled-components";
import { useEffect } from "react";
import {
  PrimaryTextColor,
  SecondaryText,
  PrimaryTextInput,
  colorScheme,
  SecondaryWhite,
} from "constants";
import SearchIcon from "icons/outline/search";

const Container = styled(View)`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  height: 45px;
  align-items: center;
  justify-content: flex-start;
`;
const SearchContainer = styled(View)`
  display: flex;
  justify-content: space-between;
  flex: 1;
  flex-direction: row;
  background-color: ${colorScheme === "light"
    ? PrimaryTextInput
    : SecondaryWhite};
  border-radius: 100px;
  height: 45px;
  align-items: center;
  justify-content: flex-start;
  padding: 0 0 0 13px;
`;

const SearchInput = styled(TextInput)`
  font-size: 18px;
  height: 100%;
  width: 100%;
  font-family: P-Medium;
  font-size: 16px;
  color: ${PrimaryTextColor};
  margin: 0 0 0 8px;
`;

export default function SearchBar({
  onSearchBarChange,
  setLoading,
  focus,
  width,
}) {
  const [value, setValue] = useState("");
  const timeoutRef = useRef(null);
  const ref = useRef();
  useEffect(() => {
    if (focus) {
      ref.current.focus();
    }
  }, []);
  useEffect(() => {
    if (value.length > 0) {
      setLoading(true);
    }
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      onSearchBarChange(value);
    }, 400);
  }, [value]);
  return (
    <Container style={{ width: width || "100%" }}>
      <SearchContainer>
        <SearchIcon
          stroke={colorScheme === "light" ? SecondaryText : "white"}
        />
        <SearchInput
          ref={ref}
          placeholder="Add friends"
          onChangeText={setValue}
          value={value}
          autoCapitalize="none"
          autoCorrect={false}
          selectionColor={colorScheme === "light" ? "black" : "white"}
          placeholderTextColor={SecondaryText}
        />
      </SearchContainer>
    </Container>
  );
}
