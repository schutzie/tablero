import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { GlobalStyle } from "../../styles/globalStyle";
import { Player } from "../../_archive/model_old/player";
import { PlayerSquare } from "./PlayerSquare";
import { hawks, hawksPlayers } from "../../_test/testData/sampleData";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { ColorScheme } from "../../assets/ColorScheme";
import { Position, SkillLevel } from "../../model/enums";

// const teamData: Team[] = sampleTeams;
const playerData: Player[] = hawksPlayers.slice(0, 5);

const PLAYER_SQUARE_SIZE = 120;

export default function PlayerStack() {
  playerData.push({
    playerId: "0",
    firstName: "",
    lastName: "",
    displayName: "",
    jerseyNumber: "",
    position: [Position.O],
    height: 1, // in cm
    weight: 1, // in kg
    // Add missing properties with default or placeholder values
    country: "USA",
    yearsOfExperience: 0,
    skillLevel: SkillLevel.BEGINNER,
    dominantHand: "right",
    currentTeams: [],
    careerStats: {
      gamesPlayed: 0,
      totalPoints: 0,
      totalRebounds: 0,
      totalAssists: 0,
      avgPointsPerGame: 0,
      avgReboundsPerGame: 0,
      avgAssistsPerGame: 0,
      fieldGoalPercentage: 0,
      threePointPercentage: 0,
      freeThrowPercentage: 0,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  });

  return (
    <View
      style={[
        GlobalStyle.allCenter,
        {
          width: PLAYER_SQUARE_SIZE + 10,
          height: "100%",
          backgroundColor: "red",
          flex: 1,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    >
      <FlatList
        data={playerData}
        keyExtractor={(player) => player.playerId}
        renderItem={(player) => {
          return (
            <View
              style={{
                backgroundColor: "lightgreen",
                borderColor: "black",
                borderWidth: 1,
                width: PLAYER_SQUARE_SIZE,
                height: player.item.playerId == "0" ? PLAYER_SQUARE_SIZE / 3: PLAYER_SQUARE_SIZE,
                marginTop: 5,
                alignItems: "center",
                justifyContent: "center",
                flex: (player.item.playerId == "0" ? 1 : 2),
              }}
            >
              <MaterialIcons
                name={player.item.playerId === "0" ? "groups" : "sports-basketball"}
                size={player.item.playerId === "0" ? 32 : 48}
                color={ColorScheme.secondary}
              />
              {player.item.playerId === "0" ? <></> : (<Text style={{ fontSize: 24, textAlign: "center" }}>
                {player.item.jerseyNumber}
              </Text>)}
              
            </View>
          );
        }}
      />
    </View>
  );
}
