import React, { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { ColorScheme } from '../../assets/ColorScheme';

export interface GamePeriod {
  /** Period name (e.g., "Q1", "1st Half", "OT") */
  name: string;
  /** Duration of the period in minutes */
  durationMinutes: number;
}

interface GameTimelineProps {
  /** Array of game periods (e.g., 4 quarters of 12 min, or 2 halves of 20 min) */
  periods?: GamePeriod[];
  /** Seconds per interval (default: 5) */
  intervalSeconds?: number;
  /** Current time in seconds */
  currentTime?: number;
  /** Callback when time changes (real-time during drag) */
  onTimeChange?: (timeInSeconds: number, periodIndex: number, periodName: string) => void;
  /** Callback when time is finalized (on release) */
  onTimeCommit?: (timeInSeconds: number, periodIndex: number, periodName: string) => void;
  /** Primary color for the timeline */
  primaryColor?: string;
  /** Secondary color for accents */
  secondaryColor?: string;
  /** Height of the timeline component */
  height?: number;
}

export const GameTimeline: React.FC<GameTimelineProps> = ({
  periods = [
    { name: 'Q1', durationMinutes: 12 },
    { name: 'Q2', durationMinutes: 12 },
    { name: 'Q3', durationMinutes: 12 },
    { name: 'Q4', durationMinutes: 12 },
  ],
  intervalSeconds = 5,
  currentTime = 0,
  onTimeChange,
  onTimeCommit,
  primaryColor = ColorScheme.primary,
  secondaryColor = ColorScheme.secondary,
  height = 80,
}) => {
  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollX = useSharedValue(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Calculate total minutes from periods
  const totalMinutes = periods.reduce((sum, period) => sum + period.durationMinutes, 0);

  // Calculate period boundaries (cumulative minutes)
  const periodBoundaries = periods.reduce((acc, period, index) => {
    const previousEnd = index > 0 ? acc[index - 1] : 0;
    acc.push(previousEnd + period.durationMinutes);
    return acc;
  }, [] as number[]);

  // Calculate which period the current time is in
  const getCurrentPeriod = useCallback((timeInSeconds: number) => {
    const timeInMinutes = timeInSeconds / 60;
    for (let i = 0; i < periodBoundaries.length; i++) {
      if (timeInMinutes <= periodBoundaries[i]) {
        return { index: i, name: periods[i].name };
      }
    }
    return { index: periods.length - 1, name: periods[periods.length - 1].name };
  }, [periodBoundaries, periods]);

  // Calculate timeline dimensions
  const intervalsPerMinute = 60 / intervalSeconds;
  const totalIntervals = totalMinutes * intervalsPerMinute;
  const baseIntervalWidth = 40; // Base width of each 5-second interval
  const zoomFactor = 3; // Zoom multiplier for final minute (3x = ~1 min visible vs ~2.5 min)

  // Calculate interval widths - zoom in for final 60s of each period
  const getIntervalWidth = (absoluteTimeInSeconds: number): number => {
    const absoluteMinutes = absoluteTimeInSeconds / 60;

    // Find which period this belongs to
    let periodIndex = 0;
    let periodStartMinutes = 0;
    for (let j = 0; j < periodBoundaries.length; j++) {
      if (absoluteMinutes <= periodBoundaries[j]) {
        periodIndex = j;
        periodStartMinutes = j > 0 ? periodBoundaries[j - 1] : 0;
        break;
      }
    }

    // Calculate remaining time in this period
    const periodDurationMinutes = periods[periodIndex].durationMinutes;
    const minutesIntoPeriod = absoluteMinutes - periodStartMinutes;
    const secondsIntoPeriod = minutesIntoPeriod * 60;
    const remainingSeconds = (periodDurationMinutes * 60) - secondsIntoPeriod;

    // Zoom if under 60 seconds
    return remainingSeconds < 60 ? baseIntervalWidth * zoomFactor : baseIntervalWidth;
  };

  // Calculate total timeline width with variable spacing
  let totalTimelineWidth = 0;
  for (let i = 0; i <= totalIntervals; i++) {
    const timeInSeconds = i * intervalSeconds;
    totalTimelineWidth += getIntervalWidth(timeInSeconds);
  }

  const intervalWidth = baseIntervalWidth; // Default for calculations
  const paddingWidth = containerWidth / 2; // Center the timeline

  // Convert scroll position to time (accounting for variable widths)
  // This function needs to be a worklet for UI thread execution
  function scrollPosToTime(scrollPos: number): number {
    'worklet';
    let currentScrollPos = 0;
    let timeInSeconds = 0;

    // Inline getIntervalWidth logic for worklet compatibility
    for (let i = 0; i <= totalIntervals; i++) {
      const intervalTime = i * intervalSeconds;

      // Calculate width inline (duplicate logic from getIntervalWidth)
      const absoluteMinutes = intervalTime / 60;
      let periodIndex = 0;
      let periodStartMinutes = 0;
      for (let j = 0; j < periodBoundaries.length; j++) {
        if (absoluteMinutes <= periodBoundaries[j]) {
          periodIndex = j;
          periodStartMinutes = j > 0 ? periodBoundaries[j - 1] : 0;
          break;
        }
      }
      const periodDurationMinutes = periods[periodIndex].durationMinutes;
      const minutesIntoPeriod = absoluteMinutes - periodStartMinutes;
      const secondsIntoPeriod = minutesIntoPeriod * 60;
      const remainingSeconds = (periodDurationMinutes * 60) - secondsIntoPeriod;
      const width = remainingSeconds < 60 ? baseIntervalWidth * zoomFactor : baseIntervalWidth;

      if (currentScrollPos + width > scrollPos) {
        // We're in this interval
        const pixelIntoInterval = scrollPos - currentScrollPos;
        const percentIntoInterval = pixelIntoInterval / width;
        const secondsIntoInterval = percentIntoInterval * intervalSeconds;
        timeInSeconds = intervalTime + secondsIntoInterval;
        break;
      }

      currentScrollPos += width;
      timeInSeconds = intervalTime + intervalSeconds;
    }

    return Math.max(0, Math.min(timeInSeconds, totalMinutes * 60));
  }

  // Derived value for current time in seconds (runs on UI thread)
  // Calculate with sub-second precision (tenths of a second)
  const currentTimeSeconds = useDerivedValue(() => {
    'worklet';
    const time = scrollPosToTime(scrollX.value);
    const roundedTime = Math.round(time * 10) / 10;
    return roundedTime;
  });

  // Callbacks for JS thread
  const notifyTimeChange = useCallback((time: number) => {
    const period = getCurrentPeriod(time);
    onTimeChange?.(time, period.index, period.name);
  }, [getCurrentPeriod, onTimeChange]);

  const notifyTimeCommit = useCallback((time: number) => {
    const period = getCurrentPeriod(time);
    onTimeCommit?.(time, period.index, period.name);
  }, [getCurrentPeriod, onTimeCommit]);

  // Animated scroll handler
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      const time = scrollPosToTime(event.contentOffset.x);
      const roundedTime = Math.round(time * 10) / 10;
      runOnJS(notifyTimeChange)(roundedTime);
    },
    onBeginDrag: () => {
      runOnJS(setIsScrolling)(true);
    },
    onEndDrag: (event) => {
      runOnJS(setIsScrolling)(false);
      const time = scrollPosToTime(event.contentOffset.x);
      const roundedTime = Math.round(time * 10) / 10;
      runOnJS(notifyTimeCommit)(roundedTime);
    },
  });

  // Handle layout
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  }, []);

  // Render timeline markers - memoize to avoid re-renders
  const timelineMarkers = React.useMemo(() => {
    const markers = [];

    for (let i = 0; i <= totalIntervals; i++) {
      const absoluteTimeInSeconds = i * intervalSeconds;
      const absoluteMinutes = Math.floor(absoluteTimeInSeconds / 60);
      const seconds = absoluteTimeInSeconds % 60;
      const isMinuteMark = seconds === 0;

      // Get the width for this specific interval (zoomed or normal)
      const currentIntervalWidth = getIntervalWidth(absoluteTimeInSeconds);

      // Find which period this time belongs to
      let periodIndex = 0;
      let periodStartMinutes = 0;
      for (let j = 0; j < periodBoundaries.length; j++) {
        if (absoluteMinutes <= periodBoundaries[j]) {
          periodIndex = j;
          periodStartMinutes = j > 0 ? periodBoundaries[j - 1] : 0;
          break;
        }
      }

      // Calculate countdown time within the period
      const periodDurationMinutes = periods[periodIndex].durationMinutes;
      const minutesIntoPeriod = absoluteMinutes - periodStartMinutes;
      const secondsIntoPeriod = (minutesIntoPeriod * 60) + seconds;
      const remainingSeconds = (periodDurationMinutes * 60) - secondsIntoPeriod;
      const displayMinutes = Math.floor(remainingSeconds / 60);
      const displaySeconds = Math.floor(remainingSeconds % 60);

      // Check if this is a period boundary
      const isPeriodBoundary = periodBoundaries.some(
        boundary => absoluteMinutes === boundary && seconds === 0
      );

      markers.push(
        <View
          key={i}
          style={[
            styles.markerContainer,
            { width: currentIntervalWidth },
          ]}
        >
          {/* Period divider */}
          {isPeriodBoundary && (
            <View style={styles.periodDividerContainer}>
              <View
                style={[
                  styles.periodDivider,
                  { backgroundColor: secondaryColor },
                ]}
              />
              {/* Period label */}
              {absoluteMinutes > 0 && (
                <Text
                  style={[
                    styles.periodLabel,
                    { color: secondaryColor },
                  ]}
                >
                  {periods[periodBoundaries.indexOf(absoluteMinutes)]?.name}
                </Text>
              )}
            </View>
          )}

          {/* Tick mark */}
          <View
            style={[
              styles.tickMark,
              isMinuteMark ? styles.minuteTick : styles.secondTick,
              { backgroundColor: isMinuteMark ? primaryColor : `${primaryColor}80` },
            ]}
          />

          {/* Label - show countdown time */}
          {isMinuteMark && !isPeriodBoundary ? (
            <Text
              style={[
                styles.minuteLabel,
                { color: primaryColor },
              ]}
            >
              {displayMinutes}'
            </Text>
          ) : displaySeconds % 10 === 0 && !isPeriodBoundary ? (
            <Text
              style={[
                styles.secondLabel,
                { color: `${primaryColor}99` },
              ]}
            >
              {displaySeconds}
            </Text>
          ) : null}

          {/* Add 1-second sub-markers when under 60 seconds */}
          {remainingSeconds < 60 && remainingSeconds > 0 && !isMinuteMark && (
            <View style={styles.subMarkerContainer}>
              {[1, 2, 3, 4].map((offset) => {
                const subSeconds = absoluteTimeInSeconds + offset;
                const subMinutesIntoPeriod = Math.floor(subSeconds / 60) - periodStartMinutes;
                const subSecondsIntoPeriod = (subMinutesIntoPeriod * 60) + (subSeconds % 60);
                const subRemainingSeconds = (periodDurationMinutes * 60) - subSecondsIntoPeriod;

                // Only show if still under 60 seconds
                if (subRemainingSeconds < 60 && subRemainingSeconds > 0) {
                  return (
                    <View
                      key={offset}
                      style={[
                        styles.subMarker,
                        {
                          left: (currentIntervalWidth / intervalSeconds) * offset,
                          backgroundColor: `${primaryColor}50`,
                        },
                      ]}
                    />
                  );
                }
                return null;
              })}
            </View>
          )}
        </View>
      );
    }

    return markers;
  }, [totalIntervals, intervalSeconds, primaryColor, secondaryColor, periodBoundaries, periods, baseIntervalWidth, zoomFactor]);

  return (
    <View style={[styles.container, { height }]} onLayout={handleLayout}>
      {containerWidth > 0 && (
        <>
          {/* Scrollable Timeline */}
          <Animated.ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={scrollHandler}
            scrollEventThrottle={1}
            decelerationRate="normal"
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingLeft: paddingWidth,
                paddingRight: paddingWidth,
              },
            ]}
          >
            <View style={styles.timelineTrack}>
              {timelineMarkers}
            </View>
          </Animated.ScrollView>

          {/* Blur effect on left edge */}
          <BlurView
            intensity={10}
            tint="light"
            style={styles.blurContainerLeft}
            pointerEvents="none"
          />

          {/* Blur effect on right edge */}
          <BlurView
            intensity={10}
            tint="light"
            style={styles.blurContainerRight}
            pointerEvents="none"
          />

          {/* Gradient overlay - darker on edges, lighter in center */}
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.1)']}
            locations={[0, 0.5, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientOverlay}
            pointerEvents="none"
          />

          {/* Fixed Playhead/Zoom Lens - stays centered */}
          <PlayheadDisplay
            currentTimeSeconds={currentTimeSeconds}
            secondaryColor={secondaryColor}
            periodBoundaries={periodBoundaries}
            periods={periods}
          />
        </>
      )}
    </View>
  );
};

// Separate component for playhead with native-thread updates
interface PlayheadDisplayProps {
  currentTimeSeconds: Animated.SharedValue<number>;
  secondaryColor: string;
  periodBoundaries: number[];
  periods: GamePeriod[];
}

const PlayheadDisplay: React.FC<PlayheadDisplayProps> = ({
  currentTimeSeconds,
  secondaryColor,
  periodBoundaries,
  periods
}) => {
  // Derive formatted time string on UI thread (countdown within period)
  const timeText = useDerivedValue(() => {
    const totalSeconds = currentTimeSeconds.value;
    const timeInMinutes = totalSeconds / 60;

    // Find which period we're in
    let periodIndex = 0;
    let periodStartMinutes = 0;
    for (let i = 0; i < periodBoundaries.length; i++) {
      if (timeInMinutes <= periodBoundaries[i]) {
        periodIndex = i;
        periodStartMinutes = i > 0 ? periodBoundaries[i - 1] : 0;
        break;
      }
    }

    // Calculate time within the current period
    const periodDurationMinutes = periods[periodIndex].durationMinutes;
    const timeIntoCurrentPeriodMinutes = timeInMinutes - periodStartMinutes;
    const timeIntoCurrentPeriodSeconds = timeIntoCurrentPeriodMinutes * 60;

    // Countdown: period duration - elapsed time
    const remainingSeconds = (periodDurationMinutes * 60) - timeIntoCurrentPeriodSeconds;

    // Under 60 seconds: show tenths of a second
    if (remainingSeconds < 60) {
      const minutes = Math.floor(remainingSeconds / 60);
      const secs = Math.floor(remainingSeconds % 60);
      const tenths = Math.floor((remainingSeconds % 1) * 10);
      const secsStr = secs < 10 ? `0${secs}` : `${secs}`;
      return `${minutes}:${secsStr}.${tenths}`;
    }

    // Over 60 seconds: normal display
    const minutes = Math.floor(remainingSeconds / 60);
    const secs = Math.floor(remainingSeconds % 60);
    const secsStr = secs < 10 ? `0${secs}` : `${secs}`;
    return `${minutes}:${secsStr}`;
  });

  // Derive current period on UI thread
  const periodText = useDerivedValue(() => {
    const timeInMinutes = currentTimeSeconds.value / 60;
    for (let i = 0; i < periodBoundaries.length; i++) {
      if (timeInMinutes <= periodBoundaries[i]) {
        return periods[i].name;
      }
    }
    return periods[periods.length - 1].name;
  });

  return (
    <View style={styles.playheadContainer} pointerEvents="none">
      {/* Vertical indicator line - darker like minute markers */}
      <View
        style={[
          styles.playheadLine,
          { backgroundColor: secondaryColor },
        ]}
      />

      {/* Zoom lens background */}
      <View style={styles.zoomLensWrapper}>
        <View
          style={[
            styles.zoomLens,
            {
              backgroundColor: `${secondaryColor}15`,
              borderColor: secondaryColor,
            },
          ]}
        >
          {/* Period indicator */}
          <ReText
            text={periodText}
            style={[
              styles.periodIndicator,
              { color: secondaryColor },
            ]}
          />
          {/* Current time display */}
          <ReText
            text={timeText}
            style={[
              styles.zoomLensText,
              { color: secondaryColor },
            ]}
          />
        </View>
      </View>

      {/* Highlight indicator at bottom */}
      <View
        style={[
          styles.playheadTriangle,
          { borderTopColor: secondaryColor },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  blurContainerLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '35%',
    zIndex: 4,
  },
  blurContainerRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '35%',
    zIndex: 4,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineTrack: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: '100%',
    paddingBottom: 20,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  tickMark: {
    width: 2,
  },
  minuteTick: {
    height: 30,
  },
  secondTick: {
    height: 15,
  },
  minuteLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  secondLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  subMarkerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    flexDirection: 'row',
  },
  subMarker: {
    position: 'absolute',
    bottom: 20,
    width: 1,
    height: 10,
  },
  periodDividerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'flex-start',
    zIndex: 10,
  },
  periodDivider: {
    width: 3,
    height: '100%',
    opacity: 0.6,
  },
  periodLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  playheadContainer: {
    position: 'absolute',
    top: 0,
    left: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -1 }],
    zIndex: 10,
  },
  playheadLine: {
    width: 3,
    height: '100%',
    position: 'absolute',
    opacity: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  zoomLensWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10, // Offset to account for timelineTrack paddingBottom: 20
  },
  zoomLens: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 2,
    minWidth: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  periodIndicator: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
    opacity: 0.7,
  },
  zoomLensText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
  },
  playheadTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    position: 'absolute',
    bottom: 18,
  },
});
