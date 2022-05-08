import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Tabs from "./navigation/tabs";
import { SafeAreaView, Text } from "react-native";


import { Quiz } from "./screens";



const App = () => {
  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>

  );
}

export default App;