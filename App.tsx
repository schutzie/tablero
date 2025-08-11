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

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const CIRC_SIZE = 100;
const CIRC_RADIUS = 40;

const DraggableCircle = ({ circle, onUpdate }) => {
  const translateX = useSharedValue(circle.x);
  const translateY = useSharedValue(circle.y);
  const scale = useSharedValue(circle.scale || 1);
  const rotation = useSharedValue(circle.rotation || 0);
  const isPressed = useSharedValue(false);

  // ***** gestures ***********************************************
  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
    .onStart(() => {
      isPressed.value = true;
    })
    .onEnd(() => {
      isPressed.value = false;
    });

  const panGesture = Gesture.Pan()
    .activateAfterLongPress(300)
    .minPointers(1)
    .maxPointers(1)
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

  const combinedGesture = Gesture.Simultaneous(
    Gesture.Race(
      Gesture.Simultaneous(longPressGesture, panGesture),
      // pinchGesture,
      // rotationGesture
    )
  );
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

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View style={[styles.circleContainer, animatedStyle]}>
        <Canvas
          style={[styles.circleCanvas, { width: CIRC_SIZE, height: CIRC_SIZE }]}
        >
          <Circle
            cx={CIRC_SIZE / 2} // Center X
            cy={CIRC_SIZE / 2} // Center Y
            r={CIRC_RADIUS}
            color={circle.color}
          >
            <Paint color="lightblue" />
            {image && (
              <ImageShader
                image={image}
                fit="cover"
                x={CIRC_SIZE / 2 - CIRC_RADIUS}
                y={CIRC_SIZE / 2 - CIRC_RADIUS}
                width={CIRC_RADIUS * 2}
                height={CIRC_RADIUS * 2}
              />
            )}
          </Circle>
        </Canvas>
        <Animated.View
          style={[StyleSheet.absoluteFill, strokeOpacity]}
          pointerEvents="none"
        >
          <Canvas
            style={[
              styles.circleCanvas,
              { width: CIRC_SIZE, height: CIRC_SIZE },
            ]}
          >
            <Circle
              cx={CIRC_SIZE / 2} // Center X
              cy={CIRC_SIZE / 2} // Center Y
              r={CIRC_RADIUS}
              color="transparent"
              style="stroke"
              strokeWidth={3}
            >
              <Paint color="#333" />
            </Circle>
          </Canvas>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
};

export default function App() {
  const [circles, setCircles] = useState([]);

  // Clear canvas on app start
  React.useEffect(() => {
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

  const addCircle = (x, y) => {
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

  const updateCirclePosition = (id, updates) => {
    setCircles((prev) =>
      prev.map((circle) =>
        circle.id === id ? { ...circle, ...updates } : circle
      )
    );
  };

  const clearCanvas = () => {
    setCircles([]);
  };

  const tapGesture = Gesture.Tap().onEnd((event) => {
    runOnJS(addCircle)(event.x, event.y);
  });

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

          <TouchableOpacity style={styles.clearButton} onPress={clearCanvas}>
            <Text style={styles.clearButtonText}>Clear Canvas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
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
    backgroundColor: "white",
  },
  circleContainer: {
    position: "absolute",
  },
  circleCanvas: {
    width: CIRC_SIZE,
    height: CIRC_SIZE,
  },
  instructions: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    pointerEvents: "none",
    gap: 10,
  },
  instructionText: {
    backgroundColor: "rgba(0,0,0,0.7)",
    color: "white",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    fontSize: 16,
    textAlign: "center",
  },
  clearButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    pointerEvents: "auto",
  },
  clearButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
