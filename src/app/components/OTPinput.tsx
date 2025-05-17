import React, { useState, useRef } from "react";
import { View, TextInput, Platform } from "react-native";

interface OTPInputProps {
  onOTPChange: (otp: string) => void;
}
const OTPInput = ({ onOTPChange }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleChange = (text, index) => {
    if (text.length > 1) return; // Accept only single digit
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onOTPChange(newOtp.join("")); // Pass OTP to parent

    // Move to next input
    if (text && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <View className="flex-row justify-between mt-5 px-5">
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          className={`
            w-12 h-12 border border-primary rounded-full text-center text-2xl font-semibold text-primary-darker bg-white
            ${Platform.OS === "ios" ? "shadow-sm" : "elevation-2"}
          `}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="numeric"
          maxLength={1}
          autoFocus={index === 0}
          selectionColor="#00cddb"
        />
      ))}
    </View>
  );
};

export default OTPInput;
