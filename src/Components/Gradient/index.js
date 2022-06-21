import React from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styled from "styled-components";
import { windowHeight } from "constants";

const Header = styled(LinearGradient)`
  height: 16px;
`;

function Gradient({ children, primaryColor, secondaryColor }) {
  const styles = StyleSheet.create({
    gradient: {
      display: "flex",
      alignItems: "center",
      zIndex: 0,
      minHeight: windowHeight,
    },
  });

  return (
    <View
      style={{
        borderRadius: 100,

        minHeight: windowHeight,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <LinearGradient
        colors={[secondaryColor, primaryColor]}
        style={styles.gradient}
      >
        {children}
      </LinearGradient>
    </View>
  );
}
export default Gradient;
