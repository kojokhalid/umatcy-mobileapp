import { Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { animations } from "../../../constants/index";
import CustomButton from "../../../components/Button";
import { navigate } from "expo-router/build/global-state/routing";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";
const onboardingData = [
  {
    title: "Track your progress",
    description:
      "View your results, download lecture notes, and stay ahead in your courses.",
    animation: animations.tracking,
  },
  {
    title: "Never Miss an Update",
    description:
      "Receive announcements, messages, and important updates from your lecturers.",
    animation: animations.announcement,
  },
  {
    title: "Connect Seamlessly",
    description:
      "Sign in and explore personalized resources to boost your academic success.",
    animation: animations.connect,
  },
];

const OnboardingScreen = () => {
  const animation = useRef<LottieView>(null);
  const [step, setStep] = useState(0);

  useEffect(() => {
    animation.current?.play();
  }, [step]);

  const handleNext = () => {
    if (step < onboardingData.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      navigate("/(tabs)/(home)");
    }
  };

  const handleSkip = () => {
    navigate("/(tabs)/(home)");
  };
  const handleBack = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  return (
    <>
      <SafeAreaView className="h-screen w-full bg-white">
        <View className="mx-10">
          <View className="flex-row items-center justify-between py-5">
            {step > 0 && (
              <TouchableOpacity
                onPress={handleBack}
                className="flex-row items-center"
              >
                <Ionicons name="chevron-back" size={24} color="#00CDDB" />
                <Text className="font-pregular text-primary">Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSkip}
              className="absolute right-2 z-10"
            >
              <Text className="font-pregular text-primary">Skip</Text>
            </TouchableOpacity>
          </View>

          <View className="justify-center items-center mt-40">
            <LottieView
              autoPlay
              ref={animation}
              style={{ width: 319.01, height: 300 }}
              source={onboardingData[step].animation}
            />
          </View>

          <View className="mt-10">
            <Text className="text-[32px] font-pbold text-primary text-center">
              {onboardingData[step].title}
            </Text>
            <Text className="text-[15px] font-pregular text-gray mt-2 text-center">
              {onboardingData[step].description}
            </Text>
          </View>
        </View>

        <View className="absolute w-full bottom-20 px-10">
          <View className="flex-row w-full items-center">
            {/* Progress dots */}
            <View className="flex-row gap-x-1 items-center mt-10">
              {onboardingData.map((_, index) => (
                <View
                  key={index}
                  className={`h-2 rounded-full ${
                    index === step ? "w-6 bg-primary" : "w-3 bg-gray-100"
                  }`}
                />
              ))}
            </View>

            {/* Next / Get Started button */}
            <View className="absolute right-0">
              <CustomButton
                title={step === onboardingData.length - 1 ? "Finish" : "Next"}
                onPress={handleNext}
                additionalStyles="w-[150px]"
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
      <StatusBar style="dark" backgroundColor="transparent" />
    </>
  );
};

export default OnboardingScreen;
