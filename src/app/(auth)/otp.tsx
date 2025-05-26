import {
  Alert,
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
import { navigate } from "expo-router/build/global-state/routing";
import { useRouter } from "expo-router";
import { authClient } from "@/lib/auth-client";
const OTP = () => {
  const [code, setCode] = React.useState("");
  const router = useRouter();
  // Handle submission of verification form
  const onVerifyPress = async () => {
    try {
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert(
        "Verification failed",
        "Please check the code and try again.",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
    }
  };
  const handleBack = () => {};
  const animation = useRef<LottieView>(null);
  const handleConfirm = async () => {
    if (code.length < 6) {
      Alert.alert("Invalid OTP", "Please enter a valid 6-digit OTP.");
      return;
    }
    await authClient.emailOtp.verifyEmail({
      email: "",
      otp: code,
    });

    navigate("/(auth)/additionalinfo");
  };
  const onOTPChange = (otp) => {
    setCode(otp);
  };
  const handleResendOTP = () => {};
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
                <OTPInput onOTPChange={onOTPChange} />
              </View>
              <View className="flex-col items-center justify-center mt-5">
                <Text>00:30</Text>
                <View className="flex-row">
                  <Text className="text-[15px] font-pregular text-gray">
                    Didn't receive the code?<Text> </Text>
                  </Text>
                  <TouchableOpacity onPress={handleResendOTP}>
                    <Text className="text-[15px] font-pbold text-primary">
                      Resend
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <CustomButton
                title={"Verify"}
                onPress={onVerifyPress}
                additionalStyles="w-full"
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <StatusBar style="dark" backgroundColor="transparent" />
    </>
  );
};

export default OTP;
