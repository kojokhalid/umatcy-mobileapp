import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import InputField from "@/components/InputField";
import CustomButton from "@/components/Button";
import { StatusBar } from "expo-status-bar";

interface MenuTitleProps {
  title: string;
  className?: string;
}

const ChangePassword = () => {
  const router = useRouter();
  const handleBack = () => router.back();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "currentPassword":
        return value ? "" : "Current password is required";
      case "newPassword":
        if (!value) return "New password is required";
        if (value.length < 8) return "Must be at least 8 characters";
        if (!/[A-Z]/.test(value))
          return "Include at least one uppercase letter";
        if (!/[0-9]/.test(value)) return "Include at least one number";
        return "";
      case "confirmPassword":
        if (!value) return "Please confirm your password";
        if (value !== newPassword) return "Passwords don't match";
        return "";
      default:
        return "";
    }
  };

  const handleBlur = (field: string) => {
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(
        field,
        field === "currentPassword"
          ? currentPassword
          : field === "newPassword"
          ? newPassword
          : confirmPassword
      ),
    }));
  };

  const handlePress = () => {
    const newErrors = {
      currentPassword: validateField("currentPassword", currentPassword),
      newPassword: validateField("newPassword", newPassword),
      confirmPassword: validateField("confirmPassword", confirmPassword),
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).some((error) => error)) {
      console.log("Password change successful");
      // Add your password change logic here
    }
  };

  const MenuTitle = ({ title, className }: MenuTitleProps) => {
    return (
      <View className={`${className}`}>
        <Text className="text-sm font-plight text-gray-500 text-start mt-5">
          {title}
        </Text>
      </View>
    );
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
        className="flex-1 bg-white"
      >
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5">
            <TouchableOpacity
              onPress={handleBack}
              className="flex-row items-center"
            >
              <Ionicons name="chevron-back" size={24} color="#00CDDB" />
              <Text className="font-pregular text-primary">Back</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Content */}
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: 100,
            }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="px-5 py-10">
              <Text className="text-2xl font-pbold text-primary text-center mt-2">
                Change Password
              </Text>
              <Text className="text-sm font-psemibold text-gray-500 text-center mb-6">
                Secure your account with a new password. Ensure it's at least 8
                characters long with uppercase, numbers, and symbols.
              </Text>

              <MenuTitle title="Current Password" className="mb-2" />
              <InputField
                placeholder="Enter your current password"
                secureTextEntry
                onChangeText={setCurrentPassword}
                onBlur={() => handleBlur("currentPassword")}
                value={currentPassword}
                error={errors.currentPassword}
              />

              <MenuTitle title="New Password" className="mb-2" />
              <InputField
                placeholder="Create a new password"
                secureTextEntry
                onChangeText={(text) => {
                  setNewPassword(text);
                  setErrors((prev) => ({
                    ...prev,
                    newPassword: "",
                  }));
                }}
                onBlur={() => handleBlur("newPassword")}
                value={newPassword}
                error={errors.newPassword}
              />

              <MenuTitle title="Confirm New Password" className="mb-2" />
              <InputField
                placeholder="Re-enter your new password"
                secureTextEntry
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword:
                      text !== newPassword ? "Passwords don't match" : "",
                  }));
                }}
                onBlur={() => handleBlur("confirmPassword")}
                value={confirmPassword}
                error={errors.confirmPassword}
              />
            </View>

            <View className="px-5 pb-5">
              <CustomButton
                title="Update Password"
                onPress={handlePress}
                disabled={
                  Object.values(errors).some(Boolean) ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </>
  );
};

export default ChangePassword;
