import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import LottieView from "lottie-react-native";
import { animations } from "../constants/index"; // Ensure this includes success & error animations

// Types
type AlertType = "error" | "success";

interface Alert {
  title: string;
  message: string;
  type?: AlertType; // default to "error"
  onDismiss?: () => void;
}

interface AlertContextType {
  showAlert: (alert: Alert) => void;
  dismissAlert: () => void;
}

interface CustomAlertProviderProps {
  children: React.ReactNode;
}

// Context
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Hook
export const useCustomAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useCustomAlert must be used within a CustomAlertProvider");
  }
  return context;
};

// Modal Component
const CustomAlertModal: React.FC<{
  visible: boolean;
  alert: Alert | null;
  onDismiss: () => void;
}> = ({ visible, alert, onDismiss }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const animation = useRef<LottieView>(null);

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 50,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!alert) return null;

  const isSuccess = alert.type === "success";

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onDismiss}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-10">
        <Animated.View
          className="bg-white rounded-2xl w-full max-w-[340px] shadow-lg"
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View className="p-4 min-h-[80px] justify-center items-center">
            <LottieView
              source={isSuccess ? animations.check : animations.error}
              autoPlay
              loop={false}
              ref={animation}
              style={{ width: "80%", height: 200 }}
            />
            <Text className="text-gray-800 text-base text-center font-semibold mb-2">
              {alert.title}
            </Text>
            <Text className="text-gray-600 text-center">{alert.message}</Text>
          </View>
          <View className="justify-center items-center">
            <TouchableOpacity
              className="bg-primary p-4 rounded-xl w-1/3 mb-4"
              onPress={() => {
                alert.onDismiss?.();
                onDismiss();
              }}
              accessible
              accessibilityLabel="Dismiss alert"
            >
              <Text className="text-white text-base font-semibold text-center">
                OK
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

// Provider
export const CustomAlertProvider: React.FC<CustomAlertProviderProps> = ({
  children,
}) => {
  const [alert, setAlert] = useState<Alert | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showAlert = useCallback((newAlert: Alert) => {
    setAlert({ ...newAlert, type: newAlert.type || "error" });
    setIsVisible(true);
  }, []);

  const dismissAlert = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setAlert(null), 200); // Wait for fade-out
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, dismissAlert }}>
      <CustomAlertModal
        visible={isVisible}
        alert={alert}
        onDismiss={dismissAlert}
      />
      {children}
    </AlertContext.Provider>
  );
};

export default CustomAlertProvider;
