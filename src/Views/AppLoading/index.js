import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import styled from "styled-components";
import { PrimaryBlue } from "constants";
const Container = styled(View)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: ${PrimaryBlue};
`;
const Status = styled(Text)`
  color: white;
  margin: 15px 0 0 0;
  font-size: 15px;
  font-family: P-Bold;
`;
function AppLoading() {
  const [status, setStatus] = useState("Aligning the stars");
  useEffect(() => {
    let timer1 = setTimeout(() => {
      setStatus("Turning up the heat");
    }, 2000);
    let timer2 = setTimeout(() => {
      setStatus("Ummmmm.....something's up");
    }, 4000);
    let timer3 = setTimeout(() => {
      setStatus("Can you check your connection?");
    }, 6000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  return (
    <Container>
      <ActivityIndicator color="white" />
      <Status>{status}</Status>
    </Container>
  );
}
export default AppLoading;
