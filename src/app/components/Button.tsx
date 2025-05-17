import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { navigate } from "expo-router/build/global-state/routing";

interface ButtonProps {
  title: string;
  additionalStyles?: string;
  onPress: () => void;
}
const CustomButton = ({ title, additionalStyles, onPress }: ButtonProps) => {
  return (
    
      <TouchableOpacity
        className={`bg-primary rounded-xl h-[56px] mt-10 flex justify-center items-center ${additionalStyles}`}
        onPress={onPress}
      >
        <Text className="text-white font-pbold text-[16px]">{title}</Text>
      </TouchableOpacity>
    
  );
};

export default CustomButton;

