import * as SecureStore from "expo-secure-store";
import jwt from "jwt-decode";
import { API_URL } from "@env";
import { fromUnixTime, differenceInDays } from "date-fns";
import * as FileSystem from "expo-file-system";
import Upload from "react-native-background-upload";

export const deleteCachedItem = async (cacheKey) => {
  const filesystemURI = `${FileSystem.cacheDirectory}${cacheKey}`;
  try {
    await FileSystem.deleteAsync(filesystemURI, {
      idempotent: true,
    });
    return true;
  } catch {
    return false;
  }
};

export const moveCacheItem = async (from, to) => {
  const filesystemURI = `${FileSystem.cacheDirectory}${to}`;
  try {
    await FileSystem.moveAsync({
      from: from,
      to: filesystemURI,
    });
  } catch (err) {
    console.error("failed to move cached item", err);
  }
};

export const storeKey = async (key, value) => {
  await SecureStore.setItemAsync(key, value);
};

export const getKey = async (key) => {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    return result;
  }
  return null;
};

export const deleteKey = async (key) => {
  await SecureStore.deleteItemAsync(key);
};

export const customFetch = async (url, params) => {
  let accessToken = await getKey("access_token");
  const refreshToken = await getKey("refresh_token");
  if (refreshToken) {
    let token = jwt(accessToken);
    if (Date.now() / 1000 > token.exp) {
      accessToken = await refreshAccessToken();
    }
  }
  const req = await fetch(url, {
    ...params,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: accessToken,
    },
  });
  if (req.status !== 200) {
    return {
      statusCode: req.status,
    };
  }
  try {
    return await req.json();
  } catch (err) {
    console.error(err);
    return {
      statusCode: 200,
    };
  }
};

export const initAuth = async (username) => {
  const req = await fetch(`${API_URL}/users/initAuth`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  });
  return await req.json();
};

export const verifyCode = async (session, username, secret) => {
  const req = await fetch(`${API_URL}/users/verifyAuth`, {
    method: "POST",
    body: JSON.stringify({
      session,
      username,
      secret,
    }),
  });
  return await req.json();
};

export const refreshAccessToken = async () => {
  try {
    const refresh_token = await getKey("refresh_token");
    const req = await fetch(`${API_URL}/users/refresh`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token,
      }),
    });
    const res = await req.json();
    const { AuthenticationResult } = res;
    if (AuthenticationResult) {
      const { AccessToken, IdToken } = AuthenticationResult;
      await storeKey("access_token", AccessToken);
      await storeKey("id_token", IdToken);
      return AccessToken;
    }
  } catch (err) {
    console.error("failed to refresh token", err);
    throw new Error("Failed to refresh token");
  }
};

export const uploadStory = async (url, friendId, callback, type) => {
  try {
    const fileExtension = url.substr(url.lastIndexOf(".") + 1);
    const req = await customFetch(`${API_URL}/story/getUploadUrl`, {
      method: "POST",
      body: JSON.stringify({
        friendId,
        fileExtension,
      }),
    });

    await Upload.startUpload({
      url: req.url,
      path: url,
      method: "PUT",
      type: "raw",
    });
  } catch (err) {
    console.error("failed to upload image", err);
  }
};
export const formatTimestamp = (timestamp) => {
  let date1 = new Date().getTime();
  let date2 = fromUnixTime(timestamp).getTime();
  let difference = date1 - date2;
  let daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
  difference -= daysDifference * 1000 * 60 * 60 * 24;
  let hoursDifference = Math.floor(difference / 1000 / 60 / 60);
  difference -= hoursDifference * 1000 * 60 * 60;
  let minutesDifference = Math.floor(difference / 1000 / 60);
  difference -= minutesDifference * 1000 * 60;
  let secondsDifference = Math.floor(difference / 1000);
  if (daysDifference >= 1) {
    return daysDifference + "d";
  }
  if (hoursDifference < 24 && hoursDifference >= 1) {
    return hoursDifference + "h";
  }
  if (minutesDifference <= 60) {
    return minutesDifference + "m";
  }
  if (secondsDifference <= 60) {
    return secondsDifference + "s";
  }
};

export const cacheImage = async (uri, cacheKey) => {
  const fileURI = `${FileSystem.cacheDirectory}${cacheKey}`;

  try {
    const metadata = await FileSystem.getInfoAsync(fileURI);
    if (metadata.modificationTime) {
      const time = fromUnixTime(metadata.modificationTime);
      const diff = differenceInDays(new Date(), time);
      if (diff > 0) {
        await FileSystem.deleteAsync(fileURI, {
          idempotent: true,
        });
        metadata.exists = false;
      } else {
        return true;
      }
    }
    if (!metadata.exists) {
      const cache = await FileSystem.downloadAsync(uri, fileURI);
      if (cache.status === 200) {
        return true;
      } else {
        await FileSystem.deleteAsync(fileURI, {
          idempotent: true,
        });
        return false;
      }
    }
  } catch (err) {
    console.error("failed to cache image", err);
  }
};
