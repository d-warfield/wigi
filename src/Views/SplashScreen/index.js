import React, { useEffect, useState, useMemo } from "react";
import { Animated, View } from "react-native";
import WigiIcon from "icons/solid/wigi";
import { PrimaryBlue } from "constants";

export default SplashScreen = ({ children, loading }) => {
  const grow = useMemo(() => new Animated.Value(0.12), []);
  const animation = useMemo(() => new Animated.Value(1), []);

  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!loading) {
      (async () => {
        setTimeout(() => {
          Animated.timing(grow, {
            toValue: 0.1,
            duration: 400,
            useNativeDriver: true,
          }).start();
        }, 0);

        setTimeout(() => {
          Animated.spring(grow, {
            toValue: 7,
            tension: 20,
            useNativeDriver: true,
          }).start();
        }, 600);

        setTimeout(() => {
          Animated.timing(animation, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }).start();
        }, 810);
        setAppReady(true);
      })();
    }
  }, [loading]);

  return (
    <View style={{ flex: 1, minHeight: "100%", backgroundColor: PrimaryBlue }}>
      {isAppReady && !loading && children}

      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          display: "flex",
          backgroundColor: PrimaryBlue,
          opacity: animation,
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1,
          minHeight: "100%",
        }}
      >
        <Animated.View
          style={{
            transform: [{ scale: grow }],
          }}
        >
          <WigiIcon fill={"white"} />
        </Animated.View>
      </Animated.View>
    </View>
  );
};
