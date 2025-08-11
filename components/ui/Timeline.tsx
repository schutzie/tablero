import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { GlobalStyle } from "../../styles/globalStyle";

export default function Timeline() {
  const data = [
    { time: 10, name: "test" },
    { time: 20, name: "second" },
    { time: 35, name: "fourth" },
    { time: 30, name: "third" },
  ];

  return (
    <View style={[GlobalStyle.fullSize, {backgroundColor: "purple"}]}>
      <ScrollView
        horizontal={true}
        style={[{ backgroundColor: "blue" }]}
        contentContainerStyle={[
          GlobalStyle.fullSize,
          {
            backgroundColor: "none",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
          },
        ]}
      >
        
        {data.map((item, index) => {
          return (
            <>
              <View
                key={index}
                style={[
                  GlobalStyle.allCenter,
                  {
                    backgroundColor: "green",
                    padding: 2,
                    width: 80,
                    height: 120,
                  },
                ]}
              >
                <Text>{item.name}</Text>
                <Text>{item.time}</Text>
              </View>
            </>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  timelineItem: {
    flexDirection: "row",
    width: 100,
    height: 100,
  },
});
