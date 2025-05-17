import React, { useState } from "react";
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
import InputField from "../components/InputField";
import Dropdown from "../components/Dropdown";
import CustomButton from "../components/Button";

const AdditionalInfo = () => {
  const [studentId, setStudentId] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const levels = ["CY 100", "CY 200", "CY 300", "CY 400"];
  const handleBack = () => {};
  const handleSubmit = () => {
    console.log("Student ID: ", studentId);
    console.log("Selected Level: ", selectedLevel);
  };
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
                  Additional Info
                </Text>
              </View>

              {/* Description and Inputs */}
              <View className="gap-y-6 mt-6">
                <Text className="text-[15px] font-pregular text-gray">
                  To get you started, please select your class level and enter
                  your reference number. This helps us tailor your experience
                  and ensure you are in the right place.
                </Text>

                <View className="gap-y-2">
                  <Text className="text-md font-pmedium text-gray-700">
                    Student ID (Reference number)
                  </Text>
                  <InputField
                    placeholder="Enter your Reference Number"
                    value={studentId}
                    onChangeText={setStudentId}
                    error="Please enter a valid student ID"
                    accessibilityLabel="Student ID"
                  />
                </View>

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
            <CustomButton title="Continue" onPress={handleSubmit} />
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default AdditionalInfo;
