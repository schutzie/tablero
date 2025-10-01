import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Player } from "../../model/player";
import JerseyIcon from "../../assets/icons/jersey-icon.svg";

interface PlayerAvatarProps {
  player: Player;
  size?: number;
  jerseyColor?: string;
  numberColor?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({ 
  player, 
  size = 100,
  jerseyColor = "#FF6B35",
  numberColor = "#FFFFFF"
}) => {
  // Calculate proportional sizes based on the avatar size
  const jerseySize = size * 0.8;
  const fontSize = size * 0.32;
  const numberTopPosition = size * 0.25;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={styles.jerseyContainer}>
        <JerseyIcon 
          width={jerseySize} 
          height={jerseySize} 
          // fill={jerseyColor} 
          fill="#0000ff"
        />
        <Text 
          style={[
            styles.jerseyNumber, 
            { 
              fontSize: fontSize, 
              color: numberColor,
              top: numberTopPosition 
            }
          ]}
        >
          {player.jerseyNumber}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  jerseyContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  jerseyNumber: {
    position: 'absolute',
    fontWeight: 'bold',
    textAlign: 'center',
  }
});

export default PlayerAvatar;