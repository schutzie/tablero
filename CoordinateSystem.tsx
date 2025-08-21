import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import {
  Canvas,
  Circle,
  Text as SkiaText,
   useFont,
  Group,
  Line,
  vec,
} from "@shopify/react-native-skia";
import {
  GestureDetector,
  Gesture,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";

interface CircleData {
  id: number;
  canvasX: number;
  canvasY: number;
  centerX: number;
  centerY: number;
  color: string;
  radius?: number;
  isDragging?: boolean;
}

const AdvancedSkiaTapScreen = () => {
  const [circles, setCircles] = useState<CircleData[]>([]);
  const [canvasLayout, setCanvasLayout] = useState({ width: 0, height: 0 });
  const [lastGesture, setLastGesture] = useState("");
  const circlesRef = useSharedValue<CircleData[]>([]);

  // Update circlesRef whenever circles change
  React.useEffect(() => {
    circlesRef.value = circles;
  }, [circles]);

  // Shared values for animations
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  // Load a font for the coordinate text
  const font = useFont(require("./assets/Roboto-Regular.ttf"), 14);

  // Handle canvas layout to get dimensions
  const onCanvasLayout = useCallback((event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setCanvasLayout({ width, height });
  }, []);

  // Functions to run on JS thread
  const addCircle = useCallback((newCircle: CircleData) => {
    setCircles((prev) => [...prev, newCircle]);
  }, []);

  const updateLastGesture = useCallback((gesture: string) => {
    setLastGesture(gesture);
  }, []);

  const clearCircles = useCallback(() => {
    setCircles([]);
  }, []);

  const updateCircle = useCallback((id: number, updates: Partial<CircleData>) => {
    setCircles((prev) => 
      prev.map((circle) => 
        circle.id === id ? { ...circle, ...updates } : circle
      )
    );
  }, []);

  // Create tap gesture
  const tapGesture = Gesture.Tap().onEnd((event) => {
    try {
      console.log('Tap event received:', JSON.stringify(event));
      console.log('Canvas layout:', canvasLayout);
      
      if (canvasLayout.width === 0 || canvasLayout.height === 0) {
        console.log('Canvas not ready, dimensions are 0');
        return;
      }

      console.log('Step 1: Event destructuring');
      const { x: locationX, y: locationY } = event;
      console.log('Location:', { locationX, locationY });
      
      console.log('Step 2: Center calculation');
      const centerX = canvasLayout.width / 2;
      const centerY = canvasLayout.height / 2;
      console.log('Center:', { centerX, centerY });
      
      console.log('Step 3: Coordinate calculation');
      const x = Math.round(((locationX - centerX) / centerX) * 47);
      const y = Math.round(((centerY - locationY) / centerY) * 25);
      console.log('Relative coords:', { x, y });

      console.log('Step 4: Circle creation');
      const newCircle = {
        id: Date.now() + Math.random(),
        canvasX: locationX,
        canvasY: locationY,
        centerX: x,
        centerY: y,
        color: "black",
      };
      console.log('New circle:', newCircle);

      console.log('Step 5: State update');
      runOnJS(addCircle)(newCircle);
      
      console.log('Step 6: Gesture state update');
      runOnJS(updateLastGesture)(`Tap at (${x}, ${y})`);
      console.log('Tap gesture completed successfully');
    } catch (error) {
      console.error('Error in tap gesture:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Error type:', typeof error);
      console.error('Error keys:', Object.keys(error));
    }
  });

  // Create double tap gesture to clear
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      runOnJS(clearCircles)();
      runOnJS(updateLastGesture)("Double tap - Cleared all");
    });

  // Create long press gesture
  const longPressGesture = Gesture.LongPress()
    .minDuration(500)
    .onEnd((event) => {
      if (canvasLayout.width === 0 || canvasLayout.height === 0) return;

      const { x: locationX, y: locationY } = event;
      const centerX = canvasLayout.width / 2;
      const centerY = canvasLayout.height / 2;
      const x = Math.round(((locationX - centerX) / centerX) * 47);
      const y = Math.round(((centerY - locationY) / centerY) * 25);

      // Add a circle for long press
      const newCircle = {
        id: Date.now() + Math.random(),
        canvasX: locationX,
        canvasY: locationY,
        centerX: x,
        centerY: y,
        color: "black",
      };

      runOnJS(addCircle)(newCircle);
      runOnJS(updateLastGesture)(`Long press at (${x}, ${y})`);
    });

  // Create pinch gesture for zoom
  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      runOnJS(updateLastGesture)(`Pinch - Scale: ${scale.value.toFixed(2)}x`);
    });

  // Helper function to find circle at position
  const findCircleAtPosition = (x: number, y: number): CircleData | null => {
    'worklet';
    try {
      console.log('findCircleAtPosition called with:', { x, y, circlesLength: circlesRef.value.length });
      for (const circle of circlesRef.value) {
        console.log('Checking circle:', circle);
        const distance = Math.sqrt(
          Math.pow(x - circle.canvasX, 2) + Math.pow(y - circle.canvasY, 2)
        );
        console.log('Distance:', distance, 'Radius:', circle.radius || 25);
        if (distance <= (circle.radius || 25)) {
          console.log('Found matching circle:', circle);
          return circle;
        }
      }
      console.log('No circle found at position');
      return null;
    } catch (error) {
      console.log('Error in findCircleAtPosition:', error);
      return null;
    }
  };

  // Create drag gesture for circles
  const circleDragGesture = Gesture.Pan()
    .activateAfterLongPress(500)
    .onStart((event) => {
      try {
        console.log('CircleDrag onStart:', event);
        const touchedCircle = findCircleAtPosition(event.x, event.y);
        console.log('TouchedCircle:', touchedCircle);
        if (touchedCircle) {
          runOnJS(updateCircle)(touchedCircle.id, { isDragging: true });
          runOnJS(updateLastGesture)(`Dragging circle at (${touchedCircle.centerX}, ${touchedCircle.centerY})`);
        }
      } catch (error) {
        console.error('Error in circleDragGesture onStart:', error);
      }
    })
    .onUpdate((event) => {
      try {
        if (canvasLayout.width === 0 || canvasLayout.height === 0) return;
        
        const draggingCircle = circlesRef.value.find(c => c.isDragging);
        if (!draggingCircle) return;
        
        const newCanvasX = event.x;
        const newCanvasY = event.y;
        
        // Calculate new coordinates
        const centerX = canvasLayout.width / 2;
        const centerY = canvasLayout.height / 2;
        const newX = Math.round(((newCanvasX - centerX) / centerX) * 47);
        const newY = Math.round(((centerY - newCanvasY) / centerY) * 25);
        
        runOnJS(updateCircle)(draggingCircle.id, {
          canvasX: newCanvasX,
          canvasY: newCanvasY,
          centerX: newX,
          centerY: newY,
        });
      } catch (error) {
        console.log('Error in circleDragGesture onUpdate:', error);
      }
    })
    .onEnd(() => {
      try {
        const draggingCircle = circlesRef.value.find(c => c.isDragging);
        if (draggingCircle) {
          runOnJS(updateCircle)(draggingCircle.id, { isDragging: false });
          runOnJS(updateLastGesture)(`Moved circle to (${draggingCircle.centerX}, ${draggingCircle.centerY})`);
        }
      } catch (error) {
        console.log('Error in circleDragGesture onEnd:', error);
      }
    });

  // Combine gestures - simplified to test crash
  const composedGesture = Gesture.Exclusive(
    doubleTapGesture,
    circleDragGesture,
    tapGesture
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(scale.value) }],
    };
  });

  return (
    <GestureHandlerRootView style={advancedStyles.container}>
      <StatusBar hidden />

      <View style={advancedStyles.header}>
        {/* <Text style={advancedStyles.headerText}>
          Tap: Add circle | Long Press: Large circle | Double Tap: Clear |
          Pinch: Zoom
        </Text>
        <Text style={advancedStyles.gestureText}>
          {lastGesture || "No gesture yet"}
        </Text> */}
      </View>

      <View style={advancedStyles.canvasContainer} onLayout={onCanvasLayout}>
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[advancedStyles.gestureArea, animatedStyle]}>
            <Canvas style={advancedStyles.canvas}>
              {/* Draw grid lines */}
              {canvasLayout.width > 0 && (
                <Group opacity={0.2}>
                  {/* Vertical grid lines */}
                  {Array.from({ length: 11 }, (_, i) => {
                    const x = (canvasLayout.width / 10) * i;
                    return (
                      <Line
                        key={`v-${i}`}
                        p1={vec(x, 0)}
                        p2={vec(x, canvasLayout.height)}
                        color="gray"
                        style="stroke"
                        strokeWidth={0.5}
                      />
                    );
                  })}
                  {/* Horizontal grid lines */}
                  {Array.from({ length: 7 }, (_, i) => {
                    const y = (canvasLayout.height / 6) * i;
                    return (
                      <Line
                        key={`h-${i}`}
                        p1={vec(0, y)}
                        p2={vec(canvasLayout.width, y)}
                        color="gray"
                        style="stroke"
                        strokeWidth={0.5}
                      />
                    );
                  })}
                </Group>
              )}

              {/* Draw circles */}
              {circles.map((circle) => {
                const opacity = circle.isDragging ? 0.5 : 1.0;
                return (
                  <Group key={circle.id} opacity={opacity}>
                    <Circle
                      cx={circle.canvasX}
                      cy={circle.canvasY}
                      r={circle.radius || 25}
                      color={circle.color}
                      style="fill"
                    />
                    <Circle
                      cx={circle.canvasX}
                      cy={circle.canvasY}
                      r={circle.radius || 25}
                      color={circle.color}
                      style="stroke"
                      strokeWidth={2}
                    />
                    {font && (
                      <SkiaText
                        x={circle.canvasX}
                        y={circle.canvasY - (circle.radius || 25) - 10}
                        text={`(${circle.centerX}, ${circle.centerY})`}
                        color="black"
                        origin={{
                          x: circle.canvasX,
                          y: circle.canvasY - (circle.radius || 25) - 10,
                        }}
                        font={font}
                      />
                    )}
                  </Group>
                );
              })}

              {/* Draw center axes */}
              {canvasLayout.width > 0 && (
                <Group>
                  <Line
                    p1={vec(0, canvasLayout.height / 2)}
                    p2={vec(canvasLayout.width, canvasLayout.height / 2)}
                    color="red"
                    style="stroke"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                  <Line
                    p1={vec(canvasLayout.width / 2, 0)}
                    p2={vec(canvasLayout.width / 2, canvasLayout.height)}
                    color="red"
                    style="stroke"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                  <Circle
                    cx={canvasLayout.width / 2}
                    cy={canvasLayout.height / 2}
                    r={5}
                    color="red"
                    style="fill"
                  />
                  {font && (
                    <SkiaText
                      x={canvasLayout.width / 2 + 10}
                      y={canvasLayout.height / 2 - 10}
                      text="(0, 0)"
                      font={font}
                      color="red"
                    />
                  )}
                </Group>
              )}
            </Canvas>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={advancedStyles.footer}>
        {/* <Text style={advancedStyles.footerText}>
          Circles: {circles.length} | Scale: {scale.value.toFixed(2)}x
        </Text> */}
      </View>
    </GestureHandlerRootView>
  );
};

const advancedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    padding: 10,
    backgroundColor: "#333",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  gestureText: {
    color: "#88ff88",
    fontSize: 12,
    marginTop: 4,
  },
  canvasContainer: {
    flex: 1,
    margin: 10,
    backgroundColor: "white",
    borderRadius: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  gestureArea: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
  footer: {
    padding: 10,
    backgroundColor: "#333",
    alignItems: "center",
  },
  footerText: {
    color: "white",
    fontSize: 14,
  },
});

export { AdvancedSkiaTapScreen };
