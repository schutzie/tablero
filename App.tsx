import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";
// import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { CoordinateSystem } from "./components/ui/CoordinateSystem";
import { GlobalStyle } from "./styles/globalStyle";
import Animated from "react-native-reanimated";
// import { Provider } from "react-redux";
// import { store } from "./store";
// import { CrudDemo } from "./components/demo/CrudDemo";

import PlayerAvatar from "./components/ui/PlayerAvatar";
import { NavigationContainer } from "@react-navigation/native";
import EventListScreen from "./screens/EventListScreen";

export default function App() {
  return (
    <Provider store={store}>
      <Animated.View style={[GlobalStyle.fullSize, GlobalStyle.allCenter]}>
        {/* <CoordinateSystem /> */}
        {/* <CrudDemo /> */}
        {/* <PlayerAvatar player={samplePlayers[0]} /> */}
        {/* <NavigationContainer>
          
        </NavigationContainer> */}
        <EventListScreen />
      </Animated.View>
    </Provider>
  );
}

const styles = StyleSheet.create({});
