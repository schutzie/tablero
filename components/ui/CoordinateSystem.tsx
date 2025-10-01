import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SvgXml } from "react-native-svg";
import {
  Canvas,
  Circle,
  Text as SkiaText,
  useFont,
  Group,
  Line,
  vec,
  Rect,
  Path,
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
import { GlobalStyle } from "../../styles/globalStyle";
import { GameSessionManager } from "./GameSessionManager";
import { useDispatch } from "react-redux";
import { courtDefaultSvg } from "../../assets/court/courtSvg";
import { db } from "../../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { gameEventActions } from "../../store/slices/gameEventSlice";
import { GameEvent } from "../../model/gameEvent";
import { EventType, ShotType } from "../../model/enums";

const courtSVG = courtDefaultSvg;

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

const CoordinateSystem = () => {
  const [circles, setCircles] = useState<CircleData[]>([]);
  const [canvasLayout, setCanvasLayout] = useState({ width: 0, height: 0 });
  const [lastGesture, setLastGesture] = useState("");
  const circlesRef = useSharedValue<CircleData[]>([]);
  const dispatch = useDispatch();

  // Update circlesRef whenever circles change
  useEffect(() => {
    circlesRef.value = circles;
  }, [circles]);

  // Shared values for animations
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  // Load a font for the coordinate text
  const font = useFont(require("../../assets/Roboto-Regular.ttf"), 14);

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

  const updateCircle = useCallback(
    (id: number, updates: Partial<CircleData>) => {
      setCircles((prev) =>
        prev.map((circle) =>
          circle.id === id ? { ...circle, ...updates } : circle
        )
      );
    },
    []
  );

  // Function to create game events and store in Redux + Firestore
  const createGameEvent = useCallback(
    async (eventType: string, x: number, y: number, metadata?: any) => {
      try {
        // Create a unique event ID
        const eventId = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Determine the event type enum based on the string
        let enumEventType: EventType;
        switch (eventType) {
          case "BASKETBALL_PLACED":
            enumEventType = EventType.FG2_ATTEMPT; // Using as placeholder for shot attempt
            break;
          case "BASKETBALL_MOVED":
            enumEventType = EventType.ASSIST; // Using as placeholder for ball movement
            break;
          default:
            enumEventType = EventType.FG2_ATTEMPT;
        }

        // Create the game event object
        const gameEvent: Partial<GameEvent> = {
          eventId,
          eventType: enumEventType,
          timestamp: new Date().toISOString(),
          gameTime: {
            period: 1, // Default to first period
            minutes: 0,
            seconds: 0
          },
          teamId: "team_placeholder", // This should come from game context
          details: {
            shotType: ShotType.JUMP_SHOT,
            shotDistance: Math.sqrt(x * x + y * y), // Calculate distance from center
            shotMade: false,
            points: 0,
            location: { x, y }
          },
          scoreAfter: {
            home: 0,
            away: 0
          },
          description: `${eventType} at court position (${x}, ${y})`,
          isHighlight: false,
          ...metadata
        };

        // Dispatch to Redux store
        dispatch(gameEventActions.create(gameEvent as GameEvent));
        
        // Save to Firestore
        const docRef = await addDoc(collection(db, "gameEvents"), {
          ...gameEvent,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        console.log("Game event created:", eventId, "Firestore ID:", docRef.id);
        console.log(`Game Event: ${eventType} at (${x}, ${y})`, metadata);
      } catch (error) {
        console.error("Error creating game event:", error);
      }
    },
    [dispatch]
  );

  // Create tap gesture
  const tapGesture = Gesture.Tap().onEnd((event) => {
    try {
      console.log("Tap event received:", JSON.stringify(event));
      console.log("Canvas layout:", canvasLayout);

      if (canvasLayout.width === 0 || canvasLayout.height === 0) {
        console.log("Canvas not ready, dimensions are 0");
        return;
      }

      console.log("Step 1: Event destructuring");
      const { x: locationX, y: locationY } = event;
      console.log("Location:", { locationX, locationY });

      console.log("Step 2: Center calculation");
      const centerX = canvasLayout.width / 2;
      const centerY = canvasLayout.height / 2;
      console.log("Center:", { centerX, centerY });

      console.log("Step 3: Coordinate calculation");
      const x = Math.round(((locationX - centerX) / centerX) * 47);
      const y = Math.round(((centerY - locationY) / centerY) * 25);
      console.log("Relative coords:", { x, y });

      console.log("Step 4: Circle creation");
      const newCircle = {
        id: Date.now() + Math.random(),
        canvasX: locationX,
        canvasY: locationY,
        centerX: x,
        centerY: y,
        color: "black",
      };
      console.log("New circle:", newCircle);

      console.log("Step 5: State update");
      runOnJS(addCircle)(newCircle);

      console.log("Step 6: Create game event");
      runOnJS(createGameEvent)("BASKETBALL_PLACED", x, y);

      console.log("Step 7: Gesture state update");
      runOnJS(updateLastGesture)(`Tap at (${x}, ${y})`);
      console.log("Tap gesture completed successfully");
    } catch (error) {
      console.error("Error in tap gesture:", error);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      console.error("Error type:", typeof error);
      console.error("Error keys:", Object.keys(error));
    }
  });

  // Triple tap gesture to clear all circles
  const tripleTapGesture = Gesture.Tap()
    .numberOfTaps(3)
    .onEnd(() => {
      runOnJS(clearCircles)();
      runOnJS(updateLastGesture)("Triple tap - Cleared all");
    });

  // Double tap gesture to...
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      // runOnJS(clearCircles)();
      // runOnJS(updateLastGesture)("Double tap - ");
    });

  // Long press gesture to move
  const longPressGesture = Gesture.LongPress()
    .minDuration(300)
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
  // const pinchGesture = Gesture.Pinch()
  //   .onUpdate((event) => {
  //     scale.value = savedScale.value * event.scale;
  //   })
  //   .onEnd(() => {
  //     savedScale.value = scale.value;
  //     runOnJS(updateLastGesture)(`Pinch - Scale: ${scale.value.toFixed(2)}x`);
  //   });

  // Helper function to find circle at position
  const findCircleAtPosition = (x: number, y: number): CircleData | null => {
    "worklet";
    try {
      console.log("findCircleAtPosition called with:", {
        x,
        y,
        circlesLength: circlesRef.value.length,
      });
      for (const circle of circlesRef.value) {
        console.log("Checking circle:", circle);
        const iconSize = circle.radius || 25;
        const distance = Math.sqrt(
          Math.pow(x - circle.canvasX, 2) + Math.pow(y - circle.canvasY, 2)
        );
        console.log("Distance:", distance, "IconSize:", iconSize);
        // Use icon size as the hit area
        if (distance <= iconSize) {
          console.log("Found matching circle:", circle);
          return circle;
        }
      }
      console.log("No circle found at position");
      return null;
    } catch (error) {
      console.log("Error in findCircleAtPosition:", error);
      return null;
    }
  };

  // Create drag gesture for circles
  const circleDragGesture = Gesture.Pan()
    .activateAfterLongPress(500)
    .onStart((event) => {
      try {
        console.log("CircleDrag onStart:", event);
        const touchedCircle = findCircleAtPosition(event.x, event.y);
        console.log("TouchedCircle:", touchedCircle);
        if (touchedCircle) {
          runOnJS(updateCircle)(touchedCircle.id, { isDragging: true });
          runOnJS(updateLastGesture)(
            `Dragging circle at (${touchedCircle.centerX}, ${touchedCircle.centerY})`
          );
        }
      } catch (error) {
        console.error("Error in circleDragGesture onStart:", error);
      }
    })
    .onUpdate((event) => {
      try {
        if (canvasLayout.width === 0 || canvasLayout.height === 0) return;

        const draggingCircle = circlesRef.value.find((c) => c.isDragging);
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
        console.log("Error in circleDragGesture onUpdate:", error);
      }
    })
    .onEnd(() => {
      try {
        const draggingCircle = circlesRef.value.find((c) => c.isDragging);
        if (draggingCircle) {
          runOnJS(updateCircle)(draggingCircle.id, { isDragging: false });
          runOnJS(createGameEvent)(
            "BASKETBALL_MOVED",
            draggingCircle.centerX,
            draggingCircle.centerY,
            {
              notes: `Basketball moved to (${draggingCircle.centerX}, ${draggingCircle.centerY})`,
            }
          );
          runOnJS(updateLastGesture)(
            `Moved circle to (${draggingCircle.centerX}, ${draggingCircle.centerY})`
          );
        }
      } catch (error) {
        console.log("Error in circleDragGesture onEnd:", error);
      }
    });

  // Combine gestures
  const composedGesture = Gesture.Exclusive(
    tripleTapGesture,
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
        <GameSessionManager />
      </View>

      <View style={advancedStyles.canvasContainer} onLayout={onCanvasLayout}>
        {/* SVG Basketball Court Background */}
        {canvasLayout.width > 0 && canvasLayout.height > 0 && (
          <View style={advancedStyles.courtBackground}>
            <SvgXml
              xml={courtSVG}
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
        )}

        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[advancedStyles.gestureArea, animatedStyle]}>
            <Canvas style={advancedStyles.canvas}>
              {/* Draw center point reference */}
              {canvasLayout.width > 0 && (
                <Group>
                  <Circle
                    cx={canvasLayout.width / 2}
                    cy={canvasLayout.height / 2}
                    r={3}
                    color="red"
                    style="fill"
                    opacity={0.8}
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

            {/* Render basketball icons as React Native components */}
            {circles.map((circle) => {
              const iconSize = circle.radius || 25;
              const opacity = circle.isDragging ? 0.5 : 1.0;
              return (
                <View
                  key={circle.id}
                  style={[
                    advancedStyles.basketballIcon,
                    {
                      left: circle.canvasX - iconSize,
                      top: circle.canvasY - iconSize,
                      opacity: opacity,
                      width: 50,
                    },
                  ]}
                  pointerEvents="none"
                >
                  <MaterialIcons
                    name="sports-basketball"
                    size={iconSize * 2}
                    color="#FF6B35"
                  />
                  {font && (
                    // render icon
                    <Text
                      style={[
                        advancedStyles.coordinateText,
                        { top: -(iconSize + 20), width: 50 },
                      ]}
                    >
                      ({circle.centerX}, {circle.centerY})
                    </Text>
                  )}
                </View>
              );
            })}
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
    width: "100%",
    height: "100%",
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
    position: "relative",
  },
  courtBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  gestureArea: {
    flex: 1,
    position: "relative",
    zIndex: 2,
  },
  canvas: {
    flex: 1,
    backgroundColor: "transparent",
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
  basketballIcon: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  coordinateText: {
    position: "absolute",
    fontSize: 12,
    fontWeight: "bold",
    color: "black",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    textAlign: "center",
    minWidth: 50,
    left: -25, // Center the text relative to the icon
  },
});

export { CoordinateSystem };
