import React, { useEffect, useState, memo } from "react";
import { View, Text, StyleSheet } from "react-native";
import styled from "styled-components";
import ProfilePicturePlaceholder from "components/ProfilePicturePlaceholder";
import { cacheImage } from "helpers";
import CachedImage from "components/CachedImage";
import { colorScheme, PrimaryBlue } from "constants";
import XmarkIcon from "icons/solid/xmark";
import { LinearGradient } from "expo-linear-gradient";

const ProfilePicture = styled(CachedImage)`
  height: 100%;
  width: 100%;
  z-index: 1;
`;
const ProfilePictureWrapper = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.borderRadius || "100"}px;
  z-index: 0;

  height: ${(props) => props.theme.height};
  width: ${(props) => props.theme.width};
  overflow: hidden;
`;
const ChangePhoto = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 28px;
  min-width: 28px;
  position: absolute;
  background-color: black;
  z-index: 1;
  bottom: 0px;
  right: 2px;
  border-radius: 100px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
`;

const NewMessageDot = styled(View)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 16px;
  width: 16px;
  position: absolute;
  background-color: ${PrimaryBlue};
  z-index: 1;
  top: -2px;
  right: 2px;
  border-radius: 100px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
`;

const PlaceholderText = styled(Text)`
  color: #fff;
  font-size: 18px;
  font-family: P-Bold;
`;

const styles = StyleSheet.create({
  gradient: {
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    minHeight: "120%",
    minWidth: "120%",
    maxHeight: "120%",
    maxWidth: "120%",
    zIndex: 1,
  },
});

const ProfilePictureComponent = ({
  url,
  width,
  height,
  cacheKey,
  active,
  borderRadius,
  mePage,
  showDot,
  placeholderText,
}) => {
  const [failed, setFailed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (!url) return;
    (async () => {
      const cached = await cacheImage(url, cacheKey);
      if (isMounted) {
        if (!cached) {
          setFailed(true);
        }
        setLoading(false);
      }
    })();

    return () => (isMounted = false);
  }, []);

  if (loading || failed || !url) {
    return (
      <>
        {mePage && (
          <ChangePhoto>
            <XmarkIcon fill={"white"} height={10} width={10} />
          </ChangePhoto>
        )}
        {showDot && <NewMessageDot />}
        {placeholderText ? (
          <ProfilePictureWrapper
            theme={{
              width,
              height,
              active,
              borderRadius,
            }}
          >
            <LinearGradient
              colors={["#A3A8B5", "#84888F"]}
              style={styles.gradient}
            >
              <PlaceholderText>
                {placeholderText.substring(0, 2).toUpperCase()}
              </PlaceholderText>
            </LinearGradient>
          </ProfilePictureWrapper>
        ) : (
          <ProfilePicturePlaceholder
            width={width}
            height={height}
            borderRadius={borderRadius}
          />
        )}
      </>
    );
  }
  return (
    <>
      {mePage && (
        <ChangePhoto>
          <XmarkIcon fill={"white"} height={10} width={10} />
        </ChangePhoto>
      )}
      {showDot && <NewMessageDot />}
      <ProfilePictureWrapper
        theme={{
          width,
          height,
          active,
          borderRadius,
        }}
      >
        <ProfilePicture
          source={{
            uri: url,
          }}
          cacheKey={cacheKey}
          hideLoading={true}
          onError={() => setFailed(true)}
        />
      </ProfilePictureWrapper>
    </>
  );
};
export default memo(ProfilePictureComponent);
