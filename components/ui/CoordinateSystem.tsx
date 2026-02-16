import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, ScrollView } from "react-native";
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
import { Sortable, SortableItem, SortableRenderItemProps } from "react-native-reanimated-dnd";
import { GlobalStyle } from "../../styles/globalStyle";
import { GameSessionManager } from "./GameSessionManager";
import { courtDefaultSvg } from "../../assets/court/courtSvg";
import { GameEvent } from "../../model/core/gameEvent";
import { EventType, ShotType, Position, SkillLevel } from "../../model/helpers/enums";
import { ColorScheme } from "../../assets/ColorScheme";
import { PlayerAvatar } from "./PlayerAvatar";
import { Player } from "../../_archive/model_old/player";

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
  isThreePointer?: boolean; // Track if shot is from three-point range
}

// Sample home team players (left side)
const homeTeamPlayers: Player[] = Array.from({ length: 5 }, (_, i) => ({
  playerId: `home${i + 1}`,
  firstName: ['James', 'Marcus', 'David', 'Chris', 'Robert'][i],
  lastName: ['Anderson', 'Williams', 'Johnson', 'Taylor', 'Davis'][i],
  jerseyNumber: ['5', '12', '23', '34', '45'][i],
  position: [Position.PG, Position.SG, Position.SF, Position.PF, Position.C][i] as any,
  height: 188 + i * 5,
  weight: 84 + i * 8,
  photoURL: null,
  country: 'USA',
  yearsOfExperience: 5 + i,
  skillLevel: i < 2 ? SkillLevel.Advanced : SkillLevel.Professional,
  dominantHand: 'right' as const,
  currentTeams: [],
  careerStats: {
    gamesPlayed: 200 + i * 20,
    totalPoints: 3200 + i * 400,
    totalRebounds: 800 + i * 200,
    totalAssists: 1200 - i * 200,
    avgPointsPerGame: 16 - i,
    avgReboundsPerGame: 4 + i * 2,
    avgAssistsPerGame: 6 - i,
    fieldGoalPercentage: 0.45 + i * 0.02,
    threePointPercentage: 0.38 - i * 0.03,
    freeThrowPercentage: 0.85 - i * 0.03,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
}));

// Sample away team players (right side)
const awayTeamPlayers: Player[] = Array.from({ length: 5 }, (_, i) => ({
  playerId: `away${i + 1}`,
  firstName: ['Tyler', 'Jake', 'Brandon', 'Kevin', 'Anthony'][i],
  lastName: ['Martinez', 'Thompson', 'Garcia', 'Rodriguez', 'Wilson'][i],
  jerseyNumber: ['7', '14', '21', '33', '50'][i],
  position: [Position.PG, Position.SG, Position.SF, Position.PF, Position.C][i] as any,
  height: 185 + i * 7,
  weight: 82 + i * 9,
  photoURL: null,
  country: 'USA',
  yearsOfExperience: 4 + i,
  skillLevel: i < 2 ? SkillLevel.Advanced : SkillLevel.Professional,
  dominantHand: i === 0 || i === 3 ? 'left' as const : 'right' as const,
  currentTeams: [],
  careerStats: {
    gamesPlayed: 190 + i * 26,
    totalPoints: 2850 + i * 580,
    totalRebounds: 570 + i * 310,
    totalAssists: 1140 - i * 210,
    avgPointsPerGame: 15 + i,
    avgReboundsPerGame: 3 + i * 2,
    avgAssistsPerGame: 6 - i,
    fieldGoalPercentage: 0.44 + i * 0.03,
    threePointPercentage: 0.37 - i * 0.04,
    freeThrowPercentage: 0.88 - i * 0.04,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
}));

const CoordinateSystem = () => {
  const [circles, setCircles] = useState<CircleData[]>([]);
  const [canvasLayout, setCanvasLayout] = useState({ width: 0, height: 0 });
  const [svgBounds, setSvgBounds] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [lastGesture, setLastGesture] = useState("");
  const circlesRef = useSharedValue<CircleData[]>([]);

  // State for draggable player lists
  const [homeTeam, setHomeTeam] = useState(homeTeamPlayers);
  const [awayTeam, setAwayTeam] = useState(awayTeamPlayers);

  // Shared values for SVG bounds (for use in worklets)
  const svgBoundsShared = useSharedValue({ x: 0, y: 0, width: 0, height: 0 });

  // Update circlesRef whenever circles change
  useEffect(() => {
    circlesRef.value = circles;
  }, [circles]);

  // Update shared SVG bounds whenever they change
  useEffect(() => {
    svgBoundsShared.value = svgBounds;
  }, [svgBounds]);

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

  // Handle SVG layout to get its actual rendered bounds
  const onSvgLayout = useCallback((event: any) => {
    const { x, y, width, height } = event.nativeEvent.layout;

    // Account for padding (10px on all sides)
    const padding = 10;
    const paddedWidth = width - (padding * 2);
    const paddedHeight = height - (padding * 2);

    // Calculate actual SVG content bounds based on aspect ratio
    // SVG viewBox is "0 0 940 500", so aspect ratio is 940/500 = 1.88
    const svgAspectRatio = 940 / 500;
    const containerAspectRatio = paddedWidth / paddedHeight;

    let actualWidth, actualHeight, actualX, actualY;

    if (containerAspectRatio > svgAspectRatio) {
      // Container is wider - SVG is constrained by height
      actualHeight = paddedHeight;
      actualWidth = paddedHeight * svgAspectRatio;
      actualX = x + padding + (paddedWidth - actualWidth) / 2;
      actualY = y + padding;
    } else {
      // Container is taller - SVG is constrained by width
      actualWidth = paddedWidth;
      actualHeight = paddedWidth / svgAspectRatio;
      actualX = x + padding;
      actualY = y + padding + (paddedHeight - actualHeight) / 2;
    }

    setSvgBounds({
      x: actualX,
      y: actualY,
      width: actualWidth,
      height: actualHeight
    });
    console.log("SVG actual bounds:", {
      x: actualX,
      y: actualY,
      width: actualWidth,
      height: actualHeight
    });
  }, []);

  // Helper function to convert canvas coordinates to SVG coordinates
  const canvasToSvgCoordinates = useCallback((canvasX: number, canvasY: number) => {
    if (svgBounds.width === 0 || svgBounds.height === 0) {
      return { svgX: 0, svgY: 0 };
    }

    // Convert canvas position to position within SVG bounds
    const relativeX = canvasX - svgBounds.x;
    const relativeY = canvasY - svgBounds.y;

    // Convert to SVG viewBox coordinates (940x500)
    const svgX = (relativeX / svgBounds.width) * 940;
    const svgY = (relativeY / svgBounds.height) * 500;

    return { svgX, svgY };
  }, [svgBounds]);

  // Helper function to check if point is inside three-point arc
  // Returns true if inside arc (2-pointer), false if outside (3-pointer)
  const isInsideThreePointArc = useCallback((svgX: number, svgY: number): boolean => {
    // SVG viewBox is 940x500
    // Court is split into two halves (left and right), each rotated 90 degrees
    // Half court is 470 units tall in SVG
    const halfCourtLine = 470;

    // Determine which half of the court we're on
    const isLeftHalf = svgY < halfCourtLine;

    // NBA three-point arc parameters (scaled to SVG coordinates)
    // Basket is at approximately (250, 50) for each half before rotation
    // Three-point arc radius is approximately 237.5 units in SVG
    const threePointRadius = 237.5;
    const basketDistance = 50; // Distance from baseline to basket

    let basketX: number, basketY: number;

    if (isLeftHalf) {
      // Left half - basket is rotated -90 degrees
      // Original basket at (250, 50), after rotation and translation
      basketX = basketDistance;
      basketY = 250;
    } else {
      // Right half - basket is rotated 90 degrees
      // Original basket at (250, 50), after rotation and translation
      basketX = 940 - basketDistance;
      basketY = 250;
    }

    // Calculate distance from basket
    const distance = Math.sqrt(
      Math.pow(svgX - basketX, 2) + Math.pow(svgY - basketY, 2)
    );

    // Inside the arc if distance is less than three-point radius
    return distance < threePointRadius;
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

        // Create the game event object matching the GameEvent schema
        const gameEvent: Partial<GameEvent> = {
          eventId,
          eventType: enumEventType,
          timestamp: new Date().toISOString(),
          period: 1, // Default to first period
          gameMinutes: 0,
          gameSeconds: 0,
          teamId: "team_placeholder", // This should come from game context
          locationX: x,
          locationY: y,
          shotType: ShotType.JUMP_SHOT,
          shotDistance: Math.sqrt(x * x + y * y), // Calculate distance from center
          shotMade: false,
          points: 0,
          homeScore: 0,
          awayScore: 0,
          description: `${eventType} at court position (${x}, ${y})`,
          isHighlight: false,
          ...metadata
        };

        console.log("Game event created:", eventId);
        console.log(`Game Event: ${eventType} at (${x}, ${y})`, metadata);
      } catch (error) {
        console.error("Error creating game event:", error);
      }
    },
    []
  );

  // Create tap gesture
  const tapGesture = Gesture.Tap().onEnd((event) => {
    'worklet';
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

      // Check if tap is within SVG bounds
      const bounds = svgBoundsShared.value;
      const isInSvg = (
        locationX >= bounds.x &&
        locationX <= bounds.x + bounds.width &&
        locationY >= bounds.y &&
        locationY <= bounds.y + bounds.height
      );

      console.log("SVG bounds check:", { bounds, isInSvg });

      if (!isInSvg) {
        console.log("Tap outside SVG area, ignoring");
        return;
      }

      console.log("Step 2: Center calculation");
      const centerX = canvasLayout.width / 2;
      const centerY = canvasLayout.height / 2;
      console.log("Center:", { centerX, centerY });

      console.log("Step 3: Coordinate calculation");
      const x = Math.round(((locationX - centerX) / centerX) * 47);
      const y = Math.round(((centerY - locationY) / centerY) * 25);
      console.log("Relative coords:", { x, y });

      console.log("Step 4: Circle creation");

      // Convert canvas coordinates to SVG coordinates
      const relativeX = locationX - bounds.x;
      const relativeY = locationY - bounds.y;
      const svgX = (relativeX / bounds.width) * 940;
      const svgY = (relativeY / bounds.height) * 500;

      // Check if inside three-point arc
      const halfCourtLine = 470;
      const isLeftHalf = svgY < halfCourtLine;
      const threePointRadius = 237.5;
      const basketDistance = 50;

      let basketX: number, basketY: number;
      if (isLeftHalf) {
        basketX = basketDistance;
        basketY = 250;
      } else {
        basketX = 940 - basketDistance;
        basketY = 250;
      }

      const distance = Math.sqrt(
        Math.pow(svgX - basketX, 2) + Math.pow(svgY - basketY, 2)
      );

      const insideArc = distance < threePointRadius;
      const circleColor = insideArc ? '#0066ff' : '#ff0000'; // Blue inside, red outside

      const newCircle = {
        id: Date.now() + Math.random(),
        canvasX: locationX,
        canvasY: locationY,
        centerX: x,
        centerY: y,
        color: circleColor,
        isThreePointer: !insideArc,
      };
      console.log("New circle:", newCircle, "Inside arc:", insideArc);

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
      'worklet';
      if (canvasLayout.width === 0 || canvasLayout.height === 0) return;

      const { x: locationX, y: locationY } = event;

      // Check if long press is within SVG bounds
      const bounds = svgBoundsShared.value;
      const isInSvg = (
        locationX >= bounds.x &&
        locationX <= bounds.x + bounds.width &&
        locationY >= bounds.y &&
        locationY <= bounds.y + bounds.height
      );

      if (!isInSvg) {
        console.log("Long press outside SVG area, ignoring");
        return;
      }

      const centerX = canvasLayout.width / 2;
      const centerY = canvasLayout.height / 2;
      const x = Math.round(((locationX - centerX) / centerX) * 47);
      const y = Math.round(((centerY - locationY) / centerY) * 25);

      // Convert canvas coordinates to SVG coordinates
      const relativeX = locationX - bounds.x;
      const relativeY = locationY - bounds.y;
      const svgX = (relativeX / bounds.width) * 940;
      const svgY = (relativeY / bounds.height) * 500;

      // Check if inside three-point arc
      const halfCourtLine = 470;
      const isLeftHalf = svgY < halfCourtLine;
      const threePointRadius = 237.5;
      const basketDistance = 50;

      let basketX: number, basketY: number;
      if (isLeftHalf) {
        basketX = basketDistance;
        basketY = 250;
      } else {
        basketX = 940 - basketDistance;
        basketY = 250;
      }

      const distance = Math.sqrt(
        Math.pow(svgX - basketX, 2) + Math.pow(svgY - basketY, 2)
      );

      const insideArc = distance < threePointRadius;
      const circleColor = insideArc ? '#0066ff' : '#ff0000'; // Blue inside, red outside

      // Add a circle for long press
      const newCircle = {
        id: Date.now() + Math.random(),
        canvasX: locationX,
        canvasY: locationY,
        centerX: x,
        centerY: y,
        color: circleColor,
        isThreePointer: !insideArc,
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
      'worklet';
      try {
        if (canvasLayout.width === 0 || canvasLayout.height === 0) return;

        const draggingCircle = circlesRef.value.find((c) => c.isDragging);
        if (!draggingCircle) return;

        const newCanvasX = event.x;
        const newCanvasY = event.y;

        // Check if new position is within SVG bounds
        const bounds = svgBoundsShared.value;
        const isInSvg = (
          newCanvasX >= bounds.x &&
          newCanvasX <= bounds.x + bounds.width &&
          newCanvasY >= bounds.y &&
          newCanvasY <= bounds.y + bounds.height
        );

        // Only update position if within bounds
        if (!isInSvg) {
          return;
        }

        // Calculate new coordinates
        const centerX = canvasLayout.width / 2;
        const centerY = canvasLayout.height / 2;
        const newX = Math.round(((newCanvasX - centerX) / centerX) * 47);
        const newY = Math.round(((centerY - newCanvasY) / centerY) * 25);

        // Convert canvas coordinates to SVG coordinates
        const relativeX = newCanvasX - bounds.x;
        const relativeY = newCanvasY - bounds.y;
        const svgX = (relativeX / bounds.width) * 940;
        const svgY = (relativeY / bounds.height) * 500;

        // Check if inside three-point arc
        const halfCourtLine = 470;
        const isLeftHalf = svgY < halfCourtLine;
        const threePointRadius = 237.5;
        const basketDistance = 50;

        let basketX: number, basketY: number;
        if (isLeftHalf) {
          basketX = basketDistance;
          basketY = 250;
        } else {
          basketX = 940 - basketDistance;
          basketY = 250;
        }

        const distance = Math.sqrt(
          Math.pow(svgX - basketX, 2) + Math.pow(svgY - basketY, 2)
        );

        const insideArc = distance < threePointRadius;
        const circleColor = insideArc ? '#0066ff' : '#ff0000'; // Blue inside, red outside

        runOnJS(updateCircle)(draggingCircle.id, {
          canvasX: newCanvasX,
          canvasY: newCanvasY,
          centerX: newX,
          centerY: newY,
          color: circleColor,
          isThreePointer: !insideArc,
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

      {/* Top bar - App and game components */}
      <View style={advancedStyles.header}>
        <GameSessionManager />
      </View>

      {/* Middle - Basketball Court with Player Stacks */}
      <View style={advancedStyles.courtRowContainer}>
        {/* Left side - Home Team Players */}
        <View style={advancedStyles.playerStackContainer}>
          <Sortable
            data={homeTeam}
            renderItem={(props: SortableRenderItemProps<Player>) => {
              const { item, id, positions, lowerBound, autoScrollDirection, itemsCount, itemHeight } = props;
              return (
                <SortableItem
                  key={id}
                  data={item}
                  id={id}
                  positions={positions}
                  lowerBound={lowerBound}
                  autoScrollDirection={autoScrollDirection}
                  itemsCount={itemsCount}
                  itemHeight={itemHeight}
                  onMove={(itemId, from, to) => {
                    const newTeam = [...homeTeam];
                    const [movedPlayer] = newTeam.splice(from, 1);
                    newTeam.splice(to, 0, movedPlayer);
                    setHomeTeam(newTeam);
                  }}
                  style={advancedStyles.playerStackItem}
                >
                  <PlayerAvatar
                    player={item}
                    size={70}
                    bottomRightBadge={{
                      value: item.jerseyNumber,
                      backgroundColor: '#1e90ff',
                    }}
                  />
                </SortableItem>
              );
            }}
            itemHeight={90}
            style={advancedStyles.playerStackContent}
          />
        </View>

        {/* Center - Basketball Court */}
        <View style={advancedStyles.canvasContainer} onLayout={onCanvasLayout}>
          {/* SVG Basketball Court Background */}
          {canvasLayout.width > 0 && canvasLayout.height > 0 && (
            <View style={advancedStyles.courtBackground} onLayout={onSvgLayout}>
              <SvgXml
                xml={courtSVG}
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                style={{ width: "100%", height: "100%" }}
              />
            </View>
          )}

          <GestureDetector gesture={composedGesture}>
            <Animated.View style={[advancedStyles.gestureArea, animatedStyle]}>
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
                      color={circle.color}
                    />
                    {font && (
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

        {/* Right side - Away Team Players */}
        <View style={advancedStyles.playerStackContainer}>
          <Sortable
            data={awayTeam}
            renderItem={(props: SortableRenderItemProps<Player>) => {
              const { item, id, positions, lowerBound, autoScrollDirection, itemsCount, itemHeight } = props;
              return (
                <SortableItem
                  key={id}
                  data={item}
                  id={id}
                  positions={positions}
                  lowerBound={lowerBound}
                  autoScrollDirection={autoScrollDirection}
                  itemsCount={itemsCount}
                  itemHeight={itemHeight}
                  onMove={(itemId, from, to) => {
                    const newTeam = [...awayTeam];
                    const [movedPlayer] = newTeam.splice(from, 1);
                    newTeam.splice(to, 0, movedPlayer);
                    setAwayTeam(newTeam);
                  }}
                  style={advancedStyles.playerStackItem}
                >
                  <PlayerAvatar
                    player={item}
                    size={70}
                    bottomRightBadge={{
                      value: item.jerseyNumber,
                      backgroundColor: '#ff6347',
                    }}
                  />
                </SortableItem>
              );
            }}
            itemHeight={90}
            style={advancedStyles.playerStackContent}
          />
        </View>
      </View>

      {/* Bottom bar - Scoreboard */}
      <View style={advancedStyles.footer}>
        <Text style={advancedStyles.footerText}>
          SCOREBOARD - Home: 0 | Away: 0
        </Text>
      </View>
    </GestureHandlerRootView>
  );
};

const advancedStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#1a1a1a",
  },
  header: {
    flex: 1,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
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
  courtRowContainer: {
    flex: 9,
    flexDirection: "row",
    backgroundColor: "white",
  },
  playerStackContainer: {
    width: 100,
  },
  playerStackContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 20,
  },
  playerStackItem: {
    alignItems: "center",
  },
  canvasContainer: {
    flex: 1,
    backgroundColor: "white",
    position: "relative",
  },
  courtBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    padding: 10,
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
    flex: 2,
    backgroundColor: "#333",
    alignItems: "center",
    justifyContent: "center",
  },
  footerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
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
