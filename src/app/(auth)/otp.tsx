import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "../../components/Button";
import LottieView from "lottie-react-native";
import { animations } from "../../constants/index";
import OTPInput from "../../components/OTPinput";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { useAuth } from "@/contexts/AuthContext";
import { useCustomAlert } from "@/contexts/CustomAlertContext";
const OTP = () => {
  const { setUser, setIsEmailVerified, setIsLoggedIn, user } = useAuth();
  const { showAlert, dismissAlert } = useCustomAlert();
  const [code, setCode] = React.useState("");
  const [timer, setTimer] = React.useState(30);
  const [disableresend, setDisableResend] = React.useState(true);
  const [isloading, setloading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);
  const [isResending, setIsResending] = React.useState(false);

  const router = useRouter();
  React.useEffect(() => {
    // Start a countdown timer for 30 seconds
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
      setDisableResend(timer == 0 ? false : true);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer]);
  React.useEffect(() => {
    if (code.length === 6) {
      // Automatically trigger verification when code is complete
      onVerifyPress();
      setDisabled(false);
    }
  }, [code]);
  // Handle submission of verification form
  const handleResendOTP = () => {
    try {
      setIsResending(true);
      setDisableResend(true);
      setTimer(60);
      authClient.emailOtp.sendVerificationOtp({
        type: "email-verification",
        email: user.email,
        fetchOptions: {
          onSuccess: () => {
            showAlert({
              type: "success",
              title: "OTP Resent",
              message: `An OTP has been resent to ${user.email}. Please enter it to verify your email.`,
              onDismiss: dismissAlert,
            });
          },
        },
      });
    } catch (error) {
      showAlert({
        type: "error",
        title: "Resend Failed",
        message: "Failed to resend OTP. Please try again later.",
      });
    }
  };

  const onVerifyPress = async () => {
    setloading(true);

    try {
      const { data, error } = await authClient.emailOtp.verifyEmail({
        email: user.email,
        otp: code,
        fetchOptions: {
          onSuccess: () => {
            setIsEmailVerified(true);
            setIsLoggedIn(true);
            setUser(data.user);
            showAlert({
              type: "success",
              title: "Verification Successful",
              message: "Your email has been successfully verified.",
              onDismiss: dismissAlert,
            });
            router.replace("(protected)/(tabs)/(home)");
          },
        },
      });
      if (error) {
        showAlert({
          type: "error",
          title: "Verification Failed",
          message: error.message || "An error occurred during verification.",
          onDismiss: dismissAlert,
        });
      }
    } catch (err) {
    } finally {
      setloading(false);
    }
  };
  const handleBack = () => {
    router.back();
  };
  const animation = useRef<LottieView>(null);

  return (
    <>
      <SafeAreaView className="h-screen w-full bg-white">
        <KeyboardAvoidingView
          behavior={"padding"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 10}
          className="flex-1"
        >
          <ScrollView>
            <View className="px-10">
              <View className="justify-center items-center">
                <LottieView
                  autoPlay
                  loop={false}
                  ref={animation}
                  style={{ width: "80%", height: 300 }}
                  source={animations.otpsuccess}
                />
              </View>

              <Text className="text-[32px] font-pbold text-primary text-center">
                Verify OTP
              </Text>
              <Text className="text-[15px] font-pregular text-gray mt-2 text-center">
                Enter the OTP sent to your email address
              </Text>
              <View className="mb-4">
                <OTPInput
                  onOTPChange={(otp) => {
                    setCode(otp);
                  }}
                />
              </View>
              <View className="flex-col items-center justify-center mt-5">
                <Text>{timer}</Text>
                <View className="flex-row">
                  <Text className="text-[15px] font-pregular text-gray">
                    Didn't receive the code?<Text> </Text>
                  </Text>
                  <TouchableOpacity
                    onPress={handleResendOTP}
                    disabled={disableresend}
                  >
                    <Text
                      className={`text-[15px] font-pbold ${
                        disableresend ? "text-gray" : "text-primary"
                      }`}
                    >
                      Resend
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <CustomButton
                title={"Verify"}
                onPress={onVerifyPress}
                additionalStyles="w-full"
                loading={isloading}
                disabled={disabled}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <StatusBar style="dark" />
    </>
  );
};

export default OTP;
