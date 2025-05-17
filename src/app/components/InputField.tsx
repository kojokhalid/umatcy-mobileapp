import React, { useState } from "react";
import { View, TextInput, Image, TouchableOpacity, Text } from "react-native";

const eyeIcon = require("../../assets/icons/eye.png");
const eyeIconHide = require("../../assets/icons/eye-hide.png");

interface InputFieldProps {
  placeholder: string;
  additionalStyles?: string;
  secureTextEntry?: boolean;
  accessibilityLabel?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  keyboardType?:
    | "default"
    | "email-address"
    | "numeric"
    | "phone-pad"
    | "url"
    | "number-pad"
    | "decimal-pad";
  onBlur?: () => void;
  onFocus?: () => void;
  onSubmitEditing?: () => void;
  error?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  placeholder,
  additionalStyles = "",
  secureTextEntry = false,
  accessibilityLabel,
  value,
  onChangeText,
  keyboardType = "default",
  onBlur,
  onFocus,
  onSubmitEditing,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`mb-4 ${additionalStyles}`}>
      <View
        className={`w-full h-16 px-4 border rounded-xl flex-row items-center bg-white flex ${
          error ? "border-red-500" : "border-gray-100"
        } focus:border-primary`}
      >
        <TextInput
          className="flex-1 text-base text-gray-900 font-normal h-full"
          placeholder={placeholder}
          placeholderTextColor="#B7B7B7"
          secureTextEntry={secureTextEntry && !showPassword}
          accessibilityLabel={accessibilityLabel}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          onBlur={onBlur}
          onFocus={onFocus}
          onSubmitEditing={onSubmitEditing}
          autoCapitalize={
            keyboardType === "email-address" ? "none" : "sentences"
          }
          returnKeyType="next"
          autoCorrect={keyboardType !== "email-address"}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            accessible
            accessibilityLabel={
              showPassword ? "Hide password" : "Show password"
            }
            className="p-2"
          >
            <Image
              source={showPassword ? eyeIconHide : eyeIcon}
              resizeMode="contain"
              className="w-6 h-6"
            />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-red-500 text-sm mt-1 ml-4">{error}</Text>}
    </View>
  );
};

export default InputField;
