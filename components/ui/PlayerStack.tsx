// import { StyleSheet, Text, View } from "react-native";
// import React from "react";
// import { GlobalStyle } from "../../styles/globalStyle";
// import { FlatList } from "react-native-gesture-handler";
// import { Player } from "../../model/player";
// import { samplePlayers } from "../../_test/testData/samplePlayers";

// // const teamData: Team[] = sampleTeams;
// const playerData: Player[] = samplePlayers;

// export default function PlayerStack()
// {
//     return
//   <View style={[GlobalStyle.allCenter, { width: 200, height: "100%" }]}>
//     <FlatList
//       data={playerData}
//       keyExtractor={(player) => player.playerId}
//       renderItem={(player) => {
//         return <PlayerSquare player={player} />;
//       }}
//     ></FlatList>
//   </View>;
// }