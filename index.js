import "react-native-gesture-handler";
import React, { useState, useEffect } from "react";
import App from "./App";
import { registerRootComponent } from "expo";
import { ContextProvider } from "context";
import { StatusBar } from "expo-status-bar";
import { Appearance } from "react-native";
import { ApolloClient, ApolloLink, InMemoryCache } from "@apollo/client";
import { createAuthLink } from "aws-appsync-auth-link";
import { createSubscriptionHandshakeLink } from "aws-appsync-subscription-link";
import { GRAPHQL_ENDPOINT, GRAPHQL_REGION } from "@env";
import { refreshAccessToken, getKey } from "helpers";
import { CachePersistor, AsyncStorageWrapper } from "apollo3-cache-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setContext } from "@apollo/client/link/context";
import jwt_decode from "jwt-decode";
import { ApolloProvider } from "@apollo/client";
import AppLoading from "expo-app-loading";
import { STAGE } from "@env";
import { init as SentryInit } from "@sentry/react-native";
import { CaptureConsole } from "@sentry/integrations";

SentryInit({
  dsn: "https://f0986a1465554635a87bd63b41338dd9@o966857.ingest.sentry.io/5917926",
  environment: STAGE,
  integrations: [
    new CaptureConsole({
      levels: ["error"],
    }),
  ],
  beforeSend: (e) => {
    if (STAGE === "dev") {
      // console.log(e);
      return null;
    }
    return e;
  },
});

const colorScheme = Appearance.getColorScheme();

const cache = new InMemoryCache({
  typePolicies: {
    Chat: {
      keyFields: ["chatId"],
    },
    Friend: {
      keyFields: ["friendId"],
    },
    MoreMessages: {
      keyFields: ["LastEvaluatedKey"],
      fields: {
        messages: {
          merge: false,
        },
      },
    },
    Message: {
      keyFields: ["messageId"],
    },
    Query: {
      fields: {
        getChat: {
          merge: true,
        },
        sendMessage: {
          merge: false,
        },
        getAllFriends: {
          merge: false,
        },
      },
    },
  },
});

const linkParams = {
  url: GRAPHQL_ENDPOINT,
  region: GRAPHQL_REGION,
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () => await getToken(),
  },
};

const httpLink = createAuthLink(linkParams);

const withToken = setContext(async () => {
  const token = await getToken();
  return { token };
});

const getToken = async () => {
  const jwtoken = await getKey("access_token");
  const decoded = jwt_decode(jwtoken);
  if (decoded.exp < Date.now() / 1000) {
    const token = await refreshAccessToken();
    return token;
  } else {
    return jwtoken;
  }
};

const authMiddleware = new ApolloLink((operation, forward) => {
  const { token } = operation.getContext();
  operation.setContext(() => ({
    headers: {
      Authorization: token ? token : "",
    },
  }));
  return forward(operation);
});

const link = ApolloLink.from([withToken, authMiddleware.concat(httpLink)]);

const httpAndWSCompositeLink = ApolloLink.from([
  link,
  createSubscriptionHandshakeLink(linkParams),
]);

const APOLLO_SCHEMA_VERSION = "9"; // Modify only if there will be breaking changest to schema
const APOLLO_SCHEMA_VERSION_KEY = "apollo-schema-key"; // DO NOT MODIFY

const Root = () => {
  const [client, setClient] = useState();

  useEffect(() => {
    const setupApollo = async () => {
      const persistor = new CachePersistor({
        cache,
        storage: new AsyncStorageWrapper(AsyncStorage),
        trigger: "write",
      });

      const currentVersion = await AsyncStorage.getItem(
        APOLLO_SCHEMA_VERSION_KEY
      );

      if (currentVersion === APOLLO_SCHEMA_VERSION) {
        await persistor.restore();
      } else {
        await persistor.purge();
        await AsyncStorage.setItem(
          APOLLO_SCHEMA_VERSION_KEY,
          APOLLO_SCHEMA_VERSION
        );
      }
      setClient(
        new ApolloClient({
          assumeImmutableResults: true,
          link: httpAndWSCompositeLink,
          cache,
        })
      );
    };

    setupApollo();
  }, []);

  if (!client) {
    return <AppLoading />;
  }

  return (
    <>
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
      <ApolloProvider client={client}>
        <ContextProvider>
          <App />
        </ContextProvider>
      </ApolloProvider>
    </>
  );
};
registerRootComponent(Root);
