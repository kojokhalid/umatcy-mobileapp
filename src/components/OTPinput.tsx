import React, { useState, useRef, useEffect } from "react";
import { View, TextInput, Platform } from "react-native";

interface OTPInputProps {
  onOTPChange: (otp: string) => void;
}

const OTPInput = ({ onOTPChange }: OTPInputProps) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, otp.length);
  }, [otp]);

  const handleChange = (text: string, index: number) => {
    // Handle paste operation
    if (text.length === otp.length) {
      const newOtp = text.split("").slice(0, otp.length);
      setOtp(newOtp);
      onOTPChange(newOtp.join(""));

      // Focus the last input after paste
      if (inputRefs.current[newOtp.length - 1]) {
        inputRefs.current[newOtp.length - 1]?.focus();
      }
      return;
    }

    // Handle single character input
    if (text.length > 1) {
      // If user types more than one character, take the last one
      const lastChar = text[text.length - 1];
      const newOtp = [...otp];
      newOtp[index] = lastChar;
      setOtp(newOtp);
      onOTPChange(newOtp.join(""));

      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    onOTPChange(newOtp.join(""));

    // Move to next input if there's text and not the last input
    if (text && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current input is empty and not the first one, move focus to previous input
        inputRefs.current[index - 1]?.focus();
      }

      // Clear current input on backspace
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      onOTPChange(newOtp.join(""));
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
            w-14 h-14 border border-primary rounded-full text-center items-center text-2xl font-semibold text-primary-darker bg-white
            ${Platform.OS === "ios" ? "shadow-sm" : "elevation-2"}
          `}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="numeric"
          maxLength={index === 0 ? otp.length : 1} // Allow pasting only in the first field
          autoFocus={index === 0}
          selectionColor="#00cddb"
        />
      ))}
    </View>
  );
};

export default OTPInput;
