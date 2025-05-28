import React, { useCallback, useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import InputField from "../../components/InputField";
import { images, icons } from "../../constants/index";
import { StatusBar } from "expo-status-bar";
import { useCustomAlert } from "../../contexts/CustomAlertContext";
import { animations } from "../../constants/index";
import LottieView from "lottie-react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { authClient } from "@/lib/auth-client";
// Types
interface FormState {
  emailAddress: string;
  password: string;
}

interface FormErrors {
  emailAddress?: string;
  password?: string;
}

const SignIn = () => {
  const { showAlert, dismissAlert } = useCustomAlert();
  const { setUser, setIsEmailVerified, setIsLoggedIn } =
    useContext(AuthContext);

  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    emailAddress: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Validate form inputs
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.emailAddress) {
      newErrors.emailAddress = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.emailAddress)) {
      newErrors.emailAddress = "Invalid email format";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Generic SSO handler
  const handleSSO = useCallback(
    async (strategy: "oauth_google" | "oauth_github" | "oauth_linkedin") => {
      setIsLoading(true);
      try {
      } catch (err: any) {
        // Alert.alert(
        //   "Authentication Failed",
        //   err.errors?.[0]?.message || "An error occurred during authentication"
        // );
        showAlert({
          title: "Authentication Failed",
          message: "An error occurred during authentication",
        });
        // console.error(JSON.stringify(err, null, 2));
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // Email/Password sign-in
  const onSignInPress = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await authClient.signIn.email({
        email: form.emailAddress,
        password: form.password,
      });
      console.log("Sign in successful");
      console.log(data);
      if (data?.user) {
        if (data.user.emailVerified) {
          setIsLoggedIn(true);
          setIsEmailVerified(data.user.emailVerified);
          setUser(data.user);
        } else {
          setIsLoggedIn(false);
          const { data, error } = await authClient.emailOtp.sendVerificationOtp(
            {
              email: form.emailAddress,
              type: "email-verification",
              fetchOptions: {
                onSuccess: () => {
                  showAlert({
                    type: "success",
                    title: "OTP Resent",
                    message: `An OTP has been resent to ${form.emailAddress}. Please enter it to verify your email.`,
                    onDismiss: dismissAlert,
                  });
                  router.replace("/(auth)/otp");
                },
              },
            }
          );
          if (error) {
            console.error("Error sending verification OTP:", error);
            showAlert({
              title: "Verification Error",
              message: "Failed to send verification email. Please try again.",
            });
          }
        }
      }
    } catch (error) {
      showAlert({
        title: "Sign In Failed",
        message: error.message,
      });
      // console.error(JSON.stringify(err, null, 2));
    } finally {
      setIsLoading(false);
    }
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
          <View className="flex-1 justify-center px-5">
            <View className="items-center mb-4">
              <Image
                source={images.chatting}
                resizeMode="contain"
                className="h-[100px]"
              />
            </View>
            <Text className="text-[32px] font-pbold text-primary">
              Sign In to Your
            </Text>
            <Text className="text-[32px] font-pbold text-primary">Account</Text>
            <Text className="text-[15px] font-pregular text-gray-500 mt-2">
              Enter your email and password to log in
            </Text>
            <View className="mt-10">
              <InputField
                placeholder="Enter your email address"
                accessibilityLabel="Email address"
                onChangeText={(emailAddress) =>
                  setForm((prev) => ({ ...prev, emailAddress }))
                }
                value={form.emailAddress}
                keyboardType="email-address"
                error={errors.emailAddress}
              />
              <InputField
                secureTextEntry
                placeholder="Password"
                accessibilityLabel="Password"
                onChangeText={(password) =>
                  setForm((prev) => ({ ...prev, password }))
                }
                value={form.password}
                error={errors.password}
              />
            </View>
            <TouchableOpacity
              className={`bg-primary rounded-xl h-[56px] mt-10 justify-center items-center ${
                isLoading ? "opacity-50" : ""
              }`}
              onPress={onSignInPress}
              disabled={isLoading}
              accessible
              accessibilityLabel="Sign in button"
            >
              {isLoading ? (
                <LottieView
                  source={animations.loaderwhite}
                  autoPlay
                  loop
                  style={{ width: 200, height: 200 }}
                />
              ) : (
                <Text className="text-white font-pbold text-[16px]">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
            <View className="mt-4 flex-row items-center justify-between gap-x-3">
              <View className="h-[1px] flex-1 bg-gray-100" />
              <Text className="text-gray-500 font-pregular text-[15px]">
                or
              </Text>
              <View className="h-[1px] flex-1 bg-gray-100" />
            </View>
            <View className="flex-row items-center justify-between w-full">
              {[
                {
                  icon: icons.google,
                  strategy: "oauth_google" as const,
                  label: "Google",
                },
                {
                  icon: icons.github,
                  strategy: "oauth_github" as const,
                  label: "Github",
                },
                {
                  icon: icons.linkedin,
                  strategy: "oauth_linkedin" as const,
                  label: "LinkedIn",
                },
              ].map(({ icon, strategy, label }) => (
                <TouchableOpacity
                  key={strategy}
                  className={`bg-white border border-gray-100 rounded-xl w-[100px] h-[56px] mt-5 flex-row justify-center items-center gap-x-2 ${
                    isLoading ? "opacity-50" : ""
                  }`}
                  onPress={() => handleSSO(strategy)}
                  disabled={isLoading}
                  accessible
                  accessibilityLabel={`Continue with ${label}`}
                >
                  <Image source={icon} resizeMode="contain" className="w-6" />
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row justify-center items-center mt-5">
              <Text className="text-[15px] font-pregular text-gray-500">
                Don't have an account?
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(auth)/signup")}
                accessible
                accessibilityLabel="Sign up link"
              >
                <Text className="text-primary font-pbold"> Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
};

export default SignIn;
