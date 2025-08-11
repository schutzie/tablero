import { StyleSheet } from "react-native";

export const GlobalStyle = StyleSheet.create({
  fullSize: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  allCenter: {
    alignItems: "center",
    justifyContent: "center",    
    alignContent: "center",
  },
  debug: {
    borderWidth: 5,
    borderStyle: "dashed",
    borderColor: "red",
    backgroundColor: "yellow",
  },
});
