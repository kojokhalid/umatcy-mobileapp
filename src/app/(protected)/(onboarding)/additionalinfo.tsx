import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Dropdown from "../../../components/Dropdown";
import CustomButton from "../../../components/Button";
import LottieView from "lottie-react-native";
import { animations } from "@/constants";
import { useRouter } from "expo-router";
import { useCustomAlert } from "../../../contexts/CustomAlertContext";
const AdditionalInfo = () => {
  const { showAlert, dismissAlert } = useCustomAlert();
  const [selectedLevel, setSelectedLevel] = useState("");
  const levels = ["CY 100", "CY 200", "CY 300", "CY 400"];
  const navigate = useRouter();
  const handleBack = () => {
    navigate.back();
  };
  const handleContinue = () => {
    try {
      if (!selectedLevel) {
        throw new Error("Please select a class level.");
      }
      console.log("Selected Class Level:", selectedLevel);
      navigate.replace("(onboarding)/onboarding1");
    } catch (error) {
      showAlert({
        title: "Error",
        message: error.message,
        type: "error",
        onDismiss: dismissAlert,
      });
    }
  };
  useEffect(() => {}, []);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      className="flex-1 bg-white"
    >
      <SafeAreaView className="flex-1">
        <View className="flex-1 justify-between">
          <ScrollView
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-10">
              {/* Back Button */}
              <View className="flex-row items-center justify-between py-5">
                <TouchableOpacity
                  onPress={handleBack}
                  className="flex-row items-center"
                >
                  <Ionicons name="chevron-back" size={24} color="#00CDDB" />
                  <Text className="font-pregular text-primary">Back</Text>
                </TouchableOpacity>
              </View>

              {/* Title */}
              <View className="flex items-center justify-center">
                <Text className="text-[24px] font-pbold text-primary">
                  Getting Started
                </Text>
              </View>
              <LottieView
                source={animations.classes}
                autoPlay
                loop={false}
                style={{ width: 300, height: 300 }}
              />

              {/* Description and Class Picker */}
              <View className="gap-y-6">
                <Text className="text-[15px] font-pregular text-gray">
                  Please select your class level. This helps us place you in the
                  right environment.
                </Text>

                <View className="gap-y-2">
                  <Text className="text-md font-pmedium text-gray-700">
                    Select Your Class
                  </Text>
                  <Dropdown
                    options={levels}
                    placeholder="Select Class"
                    selectedValue={selectedLevel}
                    onValueChange={setSelectedLevel}
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Button at Bottom */}
          <View className="px-10 pb-5">
            <CustomButton title="Continue" onPress={handleContinue} />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default AdditionalInfo;
