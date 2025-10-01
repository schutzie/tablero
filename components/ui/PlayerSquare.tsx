import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Player } from "../../model/player";
import JerseyIcon from "../../assets/icons/jersey-icon.svg";

const PLAYER_SQUARE_SIZE = 150;

interface PlayerSquareProps {
  player: Player;
}

export const PlayerSquare: React.FC<PlayerSquareProps> = ({ player }) => {
  return (
    <View style={styles.container}>
      <View style={styles.jerseyContainer}>
        <JerseyIcon width={80} height={100} fill="#FF6B35" color="#0000ff" />
        <Text style={styles.jerseyNumber}>{player.jerseyNumber}</Text>
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 5 }}
      >
        <JerseyIcon width={20} height={25} fill="#333" />
        <Text style={styles.playerName}>
          {player.displayName || `${player.firstName} ${player.lastName}`}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: PLAYER_SQUARE_SIZE,
    height: PLAYER_SQUARE_SIZE,
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  jerseyContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  jerseyNumber: {
    position: "absolute",
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    top: 30,
  },
  playerName: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});
