import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { Player } from "../../_archive/model_old/player";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { ColorScheme } from "../../assets/ColorScheme";

export interface BadgeConfig {
  /** Text or number to display in badge */
  value: string | number;
  /** Background color of badge */
  backgroundColor?: string;
  /** Text color of badge */
  textColor?: string;
  /** Optional custom size multiplier (default: 0.35 of avatar size) */
  sizeMultiplier?: number;
}

interface PlayerAvatarProps {
  player: Player;
  size?: number;
  /** Badge in top-left corner */
  topLeftBadge?: BadgeConfig | null;
  /** Badge in top-right corner */
  topRightBadge?: BadgeConfig | null;
  /** Badge in bottom-left corner */
  bottomLeftBadge?: BadgeConfig | null;
  /** Badge in bottom-right corner */
  bottomRightBadge?: BadgeConfig | null;
  /** Badge in center */
  centerBadge?: BadgeConfig | null;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  size = 80,
  topLeftBadge,
  topRightBadge,
  bottomLeftBadge,
  bottomRightBadge,
  centerBadge,
}) => {
  // Helper function to render a badge
  const renderBadge = (badge: BadgeConfig | null | undefined, position: string) => {
    if (!badge) return null;

    const sizeMultiplier = badge.sizeMultiplier ?? 0.35;
    const badgeSize = size * sizeMultiplier;
    const backgroundColor = badge.backgroundColor ?? ColorScheme.secondary;
    const textColor = badge.textColor ?? 'white';

    // Determine position styles
    let positionStyle = {};
    const offset = -4;

    switch (position) {
      case 'topLeft':
        positionStyle = { top: offset, left: offset };
        break;
      case 'topRight':
        positionStyle = { top: offset, right: offset };
        break;
      case 'bottomLeft':
        positionStyle = { bottom: offset, left: offset };
        break;
      case 'bottomRight':
        positionStyle = { bottom: offset, right: offset };
        break;
      case 'center':
        positionStyle = {
          top: '50%',
          left: '50%',
          transform: [
            { translateX: -badgeSize / 2 },
            { translateY: -badgeSize / 2 }
          ],
        };
        break;
    }

    return (
      <View
        key={position}
        style={[
          styles.badge,
          positionStyle,
          {
            backgroundColor,
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 2,
            borderWidth: size * 0.04,
          },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            {
              color: textColor,
              fontSize: size * 0.2,
            },
          ]}
        >
          {badge.value}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Profile photo or default icon */}
      {player.photoURL ? (
        <Image
          source={{ uri: player.photoURL }}
          style={[styles.photo, { width: size, height: size, borderRadius: size / 8 }]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.defaultIcon,
            {
              width: size,
              height: size,
              borderRadius: size / 8,
              backgroundColor: '#e0e0e0',
            },
          ]}
        >
          <MaterialIcons
            name="person"
            size={size * 0.6}
            color="#999"
          />
        </View>
      )}

      {/* Render badges at all 5 positions */}
      {renderBadge(topLeftBadge, 'topLeft')}
      {renderBadge(topRightBadge, 'topRight')}
      {renderBadge(bottomLeftBadge, 'bottomLeft')}
      {renderBadge(bottomRightBadge, 'bottomRight')}
      {renderBadge(centerBadge, 'center')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    backgroundColor: '#f0f0f0',
  },
  defaultIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  badgeText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default PlayerAvatar;