import React, { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import CustomButton from "../../components/Button";
import LottieView from "lottie-react-native";
import { animations } from "../../constants/index";
import OTPInput from "../../components/OTPinput";
import { Stack, useRouter } from "expo-router";
import InputField from "../../components/InputField";
import { useCustomAlert } from "../../contexts/CustomAlertContext";
import { authClient } from "@/lib/auth-client";

const SignUp = () => {
  const { showAlert, dismissAlert } = useCustomAlert();
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isloading, setloading] = React.useState(false);
  const [stepOTP, setStepOTP] = React.useState(false);
  const handleSignUp = async () => {
    // Basic validation
    if (
      !form.fullName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setError("Invalid email address");
      return;
    }
    setloading(true);
    try {
      const { data, error } = await authClient.signUp.email({
        email: form.email,
        password: form.password,
        name: form.fullName,
        fetchOptions: {
          onSuccess: async () => {
            setStepOTP(true);
            showAlert({
              type: "success",
              title: "OTP Sent",
              message: `An OTP has been sent to ${form.email}. Please enter it to verify your email.`,
              onDismiss: dismissAlert,
            });
          },
        },
      });
      console.log("Sign Up Data:", JSON.stringify(data, null, 2));
      if (error) {
        showAlert({
          title: "Error",
          message: error.message,
        });
        return;
      }
    } catch (error) {
      showAlert({ title: "Error", message: error.message });
    } finally {
      setloading(false);
    }
  };

  const OTPView = () => {
    const [code, setCode] = React.useState("");
    const [timer, setTimer] = React.useState(30);
    const [disableresend, setDisableResend] = React.useState(true);
    const [isResending, setIsResending] = React.useState(false);
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
    // Handle submission of verification form
    const onVerifyPress = async () => {
      if (code.length < 6) {
        showAlert({
          title: "Warning",
          message: "Please enter a valid 6-digit OTP.",
          type: "error",
        });
      }
      try {
        await authClient.emailOtp.verifyEmail({
          email: form.email,
          otp: code,
          fetchOptions: {
            onSuccess: () => {
              showAlert({
                type: "success",
                title: "Verification Successful",
                message: "Your email has been successfully verified.",
                onDismiss: dismissAlert,
              });
              router.replace("/(onboarding)/additionalinfo");
            },
          },
        });
      } catch (err) {
        console.error(JSON.stringify(err, null, 2));
        showAlert({
          type: "error",
          title: "Verification Failed",
          message: "Please check the code and try again.",
        });
      }
    };
    const handleBack = () => {};
    // const animation = useRef<LottieView>(null);

    const handleResendOTP = () => {
      try {
        setIsResending(true);
        setDisableResend(true);
        setTimer(60);
        authClient.emailOtp.sendVerificationOtp({
          type: "email-verification",
          email: form.email,
          fetchOptions: {
            onSuccess: () => {
              showAlert({
                type: "success",
                title: "OTP Resent",
                message: `An OTP has been resent to ${form.email}. Please enter it to verify your email.`,
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

    return (
      <View className="px-10">
        <View className="justify-center items-center">
          <LottieView
            autoPlay
            // ref={animation}
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
          loading={isResending || isloading}
        />
      </View>
    );
  };
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {stepOTP ? (
            <OTPView />
          ) : (
            <View className="flex-1 justify-center px-5">
              <Text className="text-[32px] font-pbold text-primary">
                Register
              </Text>
              <Text className="text-[15px] font-pregular text-gray-500 mt-2">
                Create an account to continue
              </Text>
              {error ? (
                <Text className="text-red-500 text-[14px] font-pregular mt-2">
                  {error}
                </Text>
              ) : null}
              <View className="mt-10 space-y-5">
                {/* Full Name */}
                <View className="gap-y-2">
                  <Text className="text-sm font-pmedium text-gray-700">
                    Full Name
                  </Text>
                  <InputField
                    placeholder="Full Name"
                    value={form.fullName}
                    onChangeText={(text) => {
                      setForm({ ...form, fullName: text });
                      setError("");
                    }}
                    accessibilityLabel="Full Name"
                  />
                </View>
                {/* Email */}
                <View className="gap-y-2">
                  <Text className="text-sm font-pmedium text-gray-700">
                    Email
                  </Text>
                  <InputField
                    placeholder="Email"
                    value={form.email}
                    onChangeText={(text) => {
                      setForm({ ...form, email: text });
                      setError("");
                    }}
                    accessibilityLabel="Email"
                    keyboardType="email-address"
                  />
                </View>
                {/* Password */}
                <View className="gap-y-2">
                  <Text className="text-sm font-pmedium text-gray-700">
                    Password
                  </Text>
                  <InputField
                    secureTextEntry={true}
                    placeholder="Password"
                    value={form.password}
                    onChangeText={(text) => {
                      setForm({ ...form, password: text });
                      setError("");
                    }}
                    accessibilityLabel="Password"
                  />
                </View>
                {/* Confirm Password */}
                <View className="gap-y-2">
                  <Text className="text-sm font-pmedium text-gray-700">
                    Confirm Password
                  </Text>
                  <InputField
                    secureTextEntry={true}
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChangeText={(text) => {
                      setForm({ ...form, confirmPassword: text });
                      setError("");
                    }}
                    accessibilityLabel="Confirm Password"
                  />
                </View>
              </View>
              <CustomButton
                title="Sign Up"
                onPress={handleSignUp}
                additionalStyles="mt-10"
                loading={isloading}
                disabled={isloading}
              />
              <View className="flex-row justify-center items-center mt-5">
                <Text className="text-[15px] font-pregular text-gray-500">
                  Already have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/(auth)/signin")}
                  accessible={true}
                  accessibilityLabel="Sign in link"
                >
                  <Text className="text-primary font-pbold"> Sign In</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;
