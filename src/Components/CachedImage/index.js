import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator, Image, ImageBackground } from "react-native";
import * as FileSystem from "expo-file-system";
import { fromUnixTime, differenceInDays } from "date-fns";

export default CachedImage = (props) => {
  const {
    source: { uri },
    cacheKey,
    hideLoading,
  } = props;
  const filesystemURI = `${FileSystem.cacheDirectory}${cacheKey}`;
  const [imgURI, setImgURI] = useState(filesystemURI);
  const [loading, setLoading] = useState(true);
  const componentIsMounted = useRef(true);

  useEffect(() => {
    (async () => {
      await loadImage({ fileURI: filesystemURI });
      if (componentIsMounted.current) {
        setLoading(false);
      }
    })();
    return () => (componentIsMounted.current = false);
  }, []);

  const loadImage = async ({ fileURI }) => {
    try {
      const metadata = await FileSystem.getInfoAsync(fileURI);
      if (metadata.modificationTime) {
        const time = fromUnixTime(metadata.modificationTime);
        const diff = differenceInDays(new Date(), new Date(time));
        if (diff > 0) {
          await FileSystem.deleteAsync(fileURI, {
            idempotent: true,
          });
          metadata.exists = false;
        }
      }
      if (!metadata.exists) {
        if (componentIsMounted.current) {
          setImgURI(null);
        }
        const cache = await FileSystem.downloadAsync(uri, fileURI);
        if (cache.status === 200) {
          if (componentIsMounted.current) {
            setImgURI(fileURI);
          }
        } else {
          await FileSystem.deleteAsync(filesystemURI);
          if (componentIsMounted.current) {
            setImgURI(uri);
          }
        }
      }
    } catch (err) {
      if (componentIsMounted.current) {
        setImgURI(uri);
      }
    }
  };

  if (loading || imgURI === null) {
    if (!hideLoading) {
      return <ActivityIndicator />;
    }
  }

  if (props.isBackground) {
    return (
      <ImageBackground
        {...props}
        source={{
          uri: imgURI,
        }}
      />
    );
  }
  return (
    <Image
      {...props}
      source={{
        uri: imgURI,
      }}
    />
  );
};
