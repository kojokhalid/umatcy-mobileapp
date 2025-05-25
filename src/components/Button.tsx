import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { navigate } from "expo-router/build/global-state/routing";

interface ButtonProps {
  title: string;
  additionalStyles?: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}
const CustomButton = ({
  title,
  additionalStyles,
  onPress,
  disabled,
  loading,
  icon,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      className={`${disabled ? "bg-gray-100" : "bg-primary"} rounded-xl h-[56px] mt-10 flex justify-center items-center ${additionalStyles}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <Text className="text-white font-pbold text-[16px]">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
