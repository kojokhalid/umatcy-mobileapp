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
import { icons, animations } from "../../constants/index";
import LottieView from "lottie-react-native";
// Types
interface ErrorAlert {
  title: string;
  message: string;
  onDismiss?: () => void;
}

interface ErrorAlertContextType {
  showError: (alert: ErrorAlert) => void;
  dismissError: () => void;
}

interface ErrorAlertProviderProps {
  children: React.ReactNode;
}

// Context
const ErrorAlertContext = createContext<ErrorAlertContextType | undefined>(
  undefined
);

// Custom Hook
export const useErrorAlert = () => {
  const context = useContext(ErrorAlertContext);
  if (!context) {
    throw "useErrorAlert must be used within an ErrorAlertProvider";
  }
  return context;
};

// Animated Error Alert Component
const ErrorAlertModal: React.FC<{
  visible: boolean;
  alert: ErrorAlert | null;
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
              source={animations.error}
              autoPlay
              loop={false}
              ref={animation}
              style={{ width: "80%", height: 200 }}
            />
            <Text className="text-gray-800 text-base text-center">
              {alert.message}
            </Text>
          </View>
          <View className="justify-center items-center">
            <TouchableOpacity
              className="bg-primary p-4 rounded-xl w-1/3 mb-4"
              onPress={() => {
                alert.onDismiss?.();
                onDismiss();
              }}
              accessible
              accessibilityLabel="Dismiss error alert"
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
export const ErrorAlertProvider: React.FC<ErrorAlertProviderProps> = ({
  children,
}) => {
  const [alert, setAlert] = useState<ErrorAlert | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showError = useCallback((newAlert: ErrorAlert) => {
    setAlert(newAlert);
    setIsVisible(true);
  }, []);

  const dismissError = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setAlert(null), 200); // Wait for animation to complete
  }, []);

  return (
    <ErrorAlertContext.Provider value={{ showError, dismissError }}>
      <ErrorAlertModal
        visible={isVisible}
        alert={alert}
        onDismiss={dismissError}
      />
      {children}
    </ErrorAlertContext.Provider>
  );
};
export default ErrorAlertProvider;
