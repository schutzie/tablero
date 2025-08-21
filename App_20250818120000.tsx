import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  Canvas,
  Circle,
  Group,
  Image,
  ImageShader,
  Paint,
  useImage,
} from "@shopify/react-native-skia";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import type { Theme } from "./contexts/ThemeContext";
import { GlobalStyle } from "./styles/globalStyle";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const CIRC_SIZE = 100;
const CIRC_RADIUS = 40;

interface Circle {
  id: number;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  color: string;
}

interface DraggableCircleProps {
  circle: Circle;
  onUpdate: (id: number, updates: Partial<Circle>) => void;
}

const DraggableCircle = ({ circle, onUpdate }: DraggableCircleProps) => {
  const { theme } = useTheme();
  const translateX = useSharedValue(circle.x);
  const translateY = useSharedValue(circle.y);
  const scale = useSharedValue(circle.scale || 1);
  const rotation = useSharedValue(circle.rotation || 0);
  const isPressed = useSharedValue(false);

  // ***** gestures ***********************************************
  const panGesture = Gesture.Pan()
    .activateAfterLongPress(300)
    .minPointers(1)
    .maxPointers(1)
    .onStart(() => {
      isPressed.value = true;
    })
    .onUpdate((event) => {
      translateX.value = event.translationX + circle.x;
      translateY.value = event.translationY + circle.y;
    })
    .onEnd(() => {
      isPressed.value = false;
      runOnJS(onUpdate)(circle.id, {
        x: translateX.value,
        y: translateY.value,
        scale: scale.value,
        rotation: rotation.value,
      });
    })
    .onFinalize(() => {
      isPressed.value = false;
    });

  // const pinchGesture = Gesture.Pinch()
  //   .onUpdate((event) => {
  //     scale.value = Math.max(
  //       0.5,
  //       Math.min(3, (circle.scale || 1) * event.scale)
  //     );
  //   })
  //   .onEnd(() => {
  //     runOnJS(onUpdate)(circle.id, {
  //       x: translateX.value,
  //       y: translateY.value,
  //       scale: scale.value,
  //       rotation: rotation.value,
  //     });
  //   });

  // const rotationGesture = Gesture.Rotation()
  //   .onUpdate((event) => {
  //     rotation.value = (circle.rotation || 0) + event.rotation;
  //   })
  //   .onEnd(() => {
  //     runOnJS(onUpdate)(circle.id, {
  //       x: translateX.value,
  //       y: translateY.value,
  //       scale: scale.value,
  //       rotation: rotation.value,
  //     });
  //   });

  const combinedGesture = panGesture;
  // ***** end gestures ***********************************************

  const animatedStyle = useAnimatedStyle(() => {
    const halfSize = CIRC_RADIUS;
    return {
      left: translateX.value - halfSize,
      top: translateY.value - halfSize,
      width: CIRC_SIZE,
      height: CIRC_SIZE,
      // transform: [{ rotate: `${rotation.value}rad` }, { scale: scale.value }],
    };
  });

  const strokeOpacity = useAnimatedStyle(() => ({
    opacity: isPressed.value ? 1 : 0,
  }));

  const image = useImage(require("./assets/icons/icon_sports_basketball.svg"));

  const circleStyles = {
    circleContainer: {
      position: "absolute" as const,
    },
    circleCanvas: {
      width: CIRC_SIZE,
      height: CIRC_SIZE,
    },
  };

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={[circleStyles.circleContainer, animatedStyle]}>
        <Canvas
          style={[
            circleStyles.circleCanvas,
            { width: CIRC_SIZE, height: CIRC_SIZE },
          ]}
        >
          <Circle
            cx={CIRC_SIZE / 2} // Center X
            cy={CIRC_SIZE / 2} // Center Y
            r={CIRC_RADIUS}
            color={circle.color}
          />

        </Canvas>
        <Animated.View
          style={[StyleSheet.absoluteFill, strokeOpacity]}
          pointerEvents="none"
        >
          <Canvas
            style={[
              circleStyles.circleCanvas,
              { width: CIRC_SIZE, height: CIRC_SIZE },
            ]}
          >
            <Circle
              cx={CIRC_SIZE / 2} // Center X
              cy={CIRC_SIZE / 2} // Center Y
              r={CIRC_RADIUS}
              color="blue"
              style="stroke"
              strokeWidth={3}
            >
              <Paint color={theme.colors.stroke} />
            </Circle>
          </Canvas>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

const AppContent = () => {
  const { theme, toggleTheme } = useTheme();
  const [circles, setCircles] = useState<Circle[]>([]);

  // Clear canvas on app start
  React.useEffect(() => {
    // console.log("setting circles blank");
    setCircles([]);
  }, []);

  const getRandomColor = () => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FFEAA7",
      "#DDA0DD",
      "#98D8C8",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const addCircle = (x: number, y: number) => {
    const newCircle = {
      id: Date.now() + Math.random(),
      x: x,
      y: y,
      scale: 1,
      rotation: 0,
      color: getRandomColor(),
    };
    setCircles((prev) => [...prev, newCircle]);
  };

  const updateCirclePosition = (id: number, updates: Partial<Circle>) => {
    setCircles((prev) =>
      prev.map((circle) =>
        circle.id === id ? { ...circle, ...updates } : circle
      )
    );
  };

  const clearCanvas = () => {
    setCircles([]);
  };

  const tapGesture = Gesture.Tap()
    .maxDistance(5) // Only trigger if finger moves less than 5 pixels
    .maxDuration(1000) // Must be completed within 1 second
    .blocksExternalGesture()
    .onEnd((event) => {
      runOnJS(addCircle)(event.x, event.y);
    });

  const styles = createStyles(theme);

  return ( 
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.canvasContainer}>
        <GestureDetector gesture={tapGesture}>
          <View style={styles.canvas}>
            <Canvas style={styles.backgroundCanvas}>
              {/* Background canvas for tapping */}
            </Canvas>

            {circles.map((circle) => (
              <DraggableCircle
                key={circle.id}
                circle={circle}
                onUpdate={updateCirclePosition}
              />
            ))}
          </View>
        </GestureDetector>

        <View style={styles.instructions}>
          {/* <Animated.Text style={styles.instructionText}>
            Tap to add circles • Long press + drag to move • Pinch to scale •
            Two fingers to rotate
          </Animated.Text> */}

          <TouchableOpacity style={styles.themeButton} onPress={toggleTheme}>
            <Text style={styles.themeButtonText}>
              {theme.mode === "light" ? "🌙" : "☀️"}{" "}
              {theme.mode === "light" ? "Dark" : "Light"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    canvasContainer: {
      flex: 1,
      position: "relative",
    },
    canvas: {
      flex: 1,
      position: "relative",
    },
    backgroundCanvas: {
      flex: 1,
      backgroundColor: theme.colors.canvas,
    },
    instructions: {
      position: "absolute",
      top: 50,
      left: 0,
      right: 0,
      alignItems: "center",
      pointerEvents: "box-none", // Allow child elements to receive events
      gap: theme.spacing.sm,
      zIndex: 1000, // Ensure it's above the canvas
      elevation: 1000, // For Android
    },
    instructionText: {
      backgroundColor: "rgba(0,0,0,0.7)",
      color: theme.colors.text,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.large,
      fontSize: theme.typography.fontSize.medium,
      textAlign: "center",
    },
    themeButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.large,
      pointerEvents: "auto",
    },
    themeButtonText: {
      color: "white",
      fontSize: theme.typography.fontSize.medium,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
    clearButton: {
      backgroundColor: theme.colors.accent,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.large,
      pointerEvents: "auto",
    },
    clearButtonText: {
      color: "white",
      fontSize: theme.typography.fontSize.medium,
      fontWeight: theme.typography.fontWeight.bold as any,
    },
  });
