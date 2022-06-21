import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styled from "styled-components";
import SEARCH_PROFILE from "gql/searchProfile";
import { useApolloClient } from "@apollo/client";
import {
  PrimaryTextColor,
  colorScheme,
  SecondaryBackgroundColor,
} from "constants";
import SearchBar from "components/SearchBar";
import SearchListItem from "components/SearchListItem";
import Constants from "expo-constants";
import ArrowIcon from "icons/solid/smallarrow";

const Container = styled(View)`
  flex: 1;
  background-color: transparent;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding: ${Constants.statusBarHeight + 10}px 15px 0 15px;
  background-color: ${SecondaryBackgroundColor};
  min-height: 120%;
`;

const SearchListResults = styled(ScrollView)`
  background-color: ${colorScheme === "light" ? "white" : "#2C2C2E"};
  border-radius: 15px;
  padding: 15px;
  margin: 20px 0 0 0;
  width: 100%;
`;

const NotFoundText = styled(Text)`
  color: ${PrimaryTextColor};
  width: 100%;
  text-align: center;
  margin: 120px 0 0 0;
  font-family: P-Medium;
`;

const SearchContainer = styled(View)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  width: 100%;
`;

const CloseBottomSheet = styled(TouchableOpacity)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

export default function Search({ handleCloseBottomSheet }) {
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState([]);
  const client = useApolloClient();

  const onSearchBarChange = async (e) => {
    setSearchLoading(true);
    if (e) {
      const { data } = await client.query({
        query: SEARCH_PROFILE,
        variables: {
          search: e,
        },
      });

      if (data.searchProfile.length < 1) {
        setResults([{}]);
      } else {
        setResults(data.searchProfile);
      }
    } else {
      setResults([]);
    }
    setSearchLoading(false);
  };

  return (
    <Container>
      <SearchContainer>
        <SearchBar
          width={"90%"}
          onSearchBarChange={onSearchBarChange}
          setLoading={setSearchLoading}
          focus={true}
          to={true}
        />
        <CloseBottomSheet onPress={handleCloseBottomSheet}>
          <ArrowIcon
            height={20}
            width={20}
            fill={colorScheme === "light" ? "black" : "white"}
          />
        </CloseBottomSheet>
      </SearchContainer>
      {searchLoading ? (
        <View style={{ paddingTop: 20, paddingBottom: 19 }}>
          <ActivityIndicator
            color={colorScheme === "light" ? "black" : "white"}
          />
        </View>
      ) : (
        <>
          {results.length > 0 && (
            <SearchListResults keyboardShouldPersistTaps="always">
              {results.map((result, index) => {
                if (result.username) {
                  return (
                    <SearchListItem
                      key={index}
                      username={result.username}
                      displayName={result.displayName}
                      userId={result.userId}
                      item={result}
                    />
                  );
                }
                return <NotFoundText>User not found</NotFoundText>;
              })}
            </SearchListResults>
          )}
        </>
      )}
    </Container>
  );
}
