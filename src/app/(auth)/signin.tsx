import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import InputField from "../components/InputField";
import { images, icons } from "../../constants/index";
import { StatusBar } from "expo-status-bar";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useErrorAlert } from "../contexts/ErrorAlertContext";
import { animations } from "../../constants/index";
import LottieView from "lottie-react-native";
// Types
interface FormState {
  emailAddress: string;
  password: string;
}

interface FormErrors {
  emailAddress?: string;
  password?: string;
}

// Constants
const REDIRECT_URI = AuthSession.makeRedirectUri({
  scheme: "acme", // Configure in app.json
});

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

const SignIn = () => {
  const { showError, dismissError } = useErrorAlert();

  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
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
      if (!isLoaded) return;
      setIsLoading(true);
      try {
        const { createdSessionId, setActive } = await startSSOFlow({
          strategy,
          redirectUrl: REDIRECT_URI,
        });

        if (createdSessionId) {
          await setActive!({ session: createdSessionId });
          router.replace("/");
        } else {
          // Alert.alert("Authentication Error", "Additional steps required");
          showError({
            title: "Authentication Error",
            message: "Please complete the authentication process.",
          });
        }
      } catch (err: any) {
        // Alert.alert(
        //   "Authentication Failed",
        //   err.errors?.[0]?.message || "An error occurred during authentication"
        // );
        showError({
          title: "Authentication Failed",
          message: "An error occurred during authentication",
        });
        // console.error(JSON.stringify(err, null, 2));
      } finally {
        setIsLoading(false);
      }
    },
    [isLoaded, startSSOFlow, router]
  );

  // Email/Password sign-in
  const onSignInPress = async () => {
    if (!isLoaded || !validateForm()) return;

    setIsLoading(true);
    try {
      const signInAttempt = await signIn.create({
        identifier: form.emailAddress,
        password: form.password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(screens)/announcements");
      } else {
        // Alert.alert("Authentication Error", "Please verify your credentials");
        showError({
          title: "Authentication Error",
          message: "Please verify your credentials",
        });
      }
    } catch (err: any) {
      // Alert.alert(
      //   "Sign In Failed",
      //   err.errors?.[0]?.message || "Invalid email or password"
      // );
      showError({
        title: "Sign In Failed",
        message: "Invalid email or password",
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
