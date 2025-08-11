// ====================================
// ESSENTIAL REACT NATIVE CODE SNIPPETS
// ====================================

// 1. BASIC COMPONENT SETUP
// ====================================

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";

const BasicComponent = () => {
  const [count, setCount] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Hello React Native</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>Count: {count}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// 2. NAVIGATION SETUP
// ====================================

// Install: npm install @react-navigation/native @react-navigation/stack
// For Expo: expo install react-native-screens react-native-safe-area-context

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => (
  <View style={styles.screen}>
    <Text>Home Screen</Text>
    <TouchableOpacity
      style={styles.navButton}
      onPress={() => navigation.navigate("Details", { itemId: 42 })}
    >
      <Text>Go to Details</Text>
    </TouchableOpacity>
  </View>
);

const DetailsScreen = ({ route, navigation }) => {
  const { itemId } = route.params;

  return (
    <View style={styles.screen}>
      <Text>Details Screen</Text>
      <Text>Item ID: {itemId}</Text>
      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.goBack()}
      >
        <Text>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

// 3. API CALLS & DATA HANDLING
// ====================================

const DataComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://api.example.com/data");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const postData = async (newItem) => {
    try {
      const response = await fetch("https://api.example.com/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      const result = await response.json();
      setData((prev) => [...prev, result]);
    } catch (err) {
      console.error("Post error:", err);
    }
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <ScrollView>
      {data.map((item) => (
        <View key={item.id} style={styles.item}>
          <Text>{item.title}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

// 4. COMMON UI COMPONENTS
// ====================================

// Custom Button Component
const CustomButton = ({
  title,
  onPress,
  variant = "primary",
  disabled = false,
}) => (
  <TouchableOpacity
    style={[
      styles.customButton,
      variant === "secondary" && styles.secondaryButton,
      disabled && styles.disabledButton,
    ]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text
      style={[
        styles.customButtonText,
        variant === "secondary" && styles.secondaryButtonText,
        disabled && styles.disabledButtonText,
      ]}
    >
      {title}
    </Text>
  </TouchableOpacity>
);

// Input Component
import { TextInput } from "react-native";

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
}) => (
  <View style={styles.inputContainer}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <TextInput
      style={styles.textInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#999"
    />
  </View>
);

// Modal Component
import { Modal } from "react-native";

const CustomModal = ({ visible, onClose, children }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
        {children}
      </View>
    </View>
  </Modal>
);

// 5. ANIMATIONS
// ====================================

// Install: npm install react-native-reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

const AnimatedComponent = () => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const fadeIn = () => {
    opacity.value = withTiming(1, { duration: 500 });
  };

  const fadeOut = () => {
    opacity.value = withTiming(0, { duration: 500 });
  };

  const bounce = () => {
    scale.value = withSpring(1.2, {}, () => {
      scale.value = withSpring(1);
    });
  };

  const spin = () => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.animationContainer}>
      <Animated.View style={[styles.animatedBox, animatedStyle]}>
        <Text>Animated!</Text>
      </Animated.View>

      <View style={styles.animationButtons}>
        <TouchableOpacity style={styles.animButton} onPress={fadeIn}>
          <Text>Fade In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.animButton} onPress={fadeOut}>
          <Text>Fade Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.animButton} onPress={bounce}>
          <Text>Bounce</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.animButton} onPress={spin}>
          <Text>Spin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// 6. FLATLIST PATTERNS
// ====================================

import { FlatList, RefreshControl } from "react-native";

const ListComponent = () => {
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity style={styles.listItem}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
    </TouchableOpacity>
  );

  const onRefresh = async () => {
    setRefreshing(true);
    // Refresh data logic
    await fetchData();
    setRefreshing(false);
  };

  const loadMore = () => {
    if (!loading) {
      setLoading(true);
      // Load more data logic
      setLoading(false);
    }
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.headerText}>My List</Text>
    </View>
  );

  const ListFooter = () =>
    loading ? (
      <View style={styles.listFooter}>
        <Text>Loading more...</Text>
      </View>
    ) : null;

  const EmptyState = () => (
    <View style={styles.emptyState}>
      <Text>No items found</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReached={loadMore}
      onEndReachedThreshold={0.1}
      ListHeaderComponent={ListHeader}
      ListFooterComponent={ListFooter}
      ListEmptyComponent={EmptyState}
      showsVerticalScrollIndicator={false}
    />
  );
};

// 7. DEVICE FEATURES
// ====================================

// Camera (requires expo-camera or react-native-vision-camera)
import { Camera } from "expo-camera";

const CameraComponent = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      console.log("Photo URI:", photo.uri);
    }
  };

  if (hasPermission === null) return <View />;
  if (hasPermission === false) return <Text>No camera access</Text>;

  return (
    <View style={styles.cameraContainer}>
      <Camera style={styles.camera} ref={setCameraRef} />
      <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
        <Text style={styles.captureText}>Take Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

// AsyncStorage for local data
import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageUtils = {
  // Store data
  storeData: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error("Error storing data:", error);
    }
  },

  // Get data
  getData: async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error("Error getting data:", error);
      return null;
    }
  },

  // Remove data
  removeData: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing data:", error);
    }
  },
};

// 8. CONTEXT & STATE MANAGEMENT
// ====================================

import { createContext, useContext, useReducer } from "react";

// Context setup
const AppContext = createContext();

const initialState = {
  user: null,
  theme: "light",
  loading: false,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setUser = (user) => dispatch({ type: "SET_USER", payload: user });
  const setTheme = (theme) => dispatch({ type: "SET_THEME", payload: theme });
  const setLoading = (loading) =>
    dispatch({ type: "SET_LOADING", payload: loading });

  return (
    <AppContext.Provider
      value={{
        ...state,
        setUser,
        setTheme,
        setLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use context
const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

// 9. CUSTOM HOOKS
// ====================================

// Custom hook for API calls
const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 10. RESPONSIVE DESIGN
// ====================================

import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const ResponsiveComponent = () => {
  const [screenData, setScreenData] = useState(Dimensions.get("window"));

  useEffect(() => {
    const onChange = (result) => {
      setScreenData(result.window);
    };

    const subscription = Dimensions.addEventListener("change", onChange);
    return () => subscription?.remove();
  }, []);

  const isTablet = screenData.width >= 768;
  const isLandscape = screenData.width > screenData.height;

  return (
    <View
      style={[
        styles.responsiveContainer,
        isTablet && styles.tabletContainer,
        isLandscape && styles.landscapeContainer,
      ]}
    >
      <Text>
        Screen: {screenData.width} x {screenData.height}
      </Text>
      <Text>Device: {isTablet ? "Tablet" : "Phone"}</Text>
      <Text>Orientation: {isLandscape ? "Landscape" : "Portrait"}</Text>
    </View>
  );
};

// ====================================
// STYLES
// ====================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  navButton: {
    backgroundColor: "#34C759",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  customButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  disabledButton: {
    backgroundColor: "#ccc",
    borderColor: "#ccc",
  },
  customButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#007AFF",
  },
  disabledButtonText: {
    color: "#999",
  },
  inputContainer: {
    marginVertical: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#666",
  },
  animationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animatedBox: {
    width: 100,
    height: 100,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  animationButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  animButton: {
    backgroundColor: "#34C759",
    padding: 10,
    borderRadius: 6,
  },
  listItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  listHeader: {
    padding: 15,
    backgroundColor: "#f8f8f8",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  listFooter: {
    padding: 20,
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  captureButton: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    backgroundColor: "#FF3B30",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  captureText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  responsiveContainer: {
    padding: 20,
  },
  tabletContainer: {
    padding: 40,
  },
  landscapeContainer: {
    flexDirection: "row",
  },
});

export default BasicComponent;
