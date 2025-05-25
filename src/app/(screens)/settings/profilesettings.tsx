import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import InputField from "@/components/InputField";
import CustomDropdown from "@/components/CustomDropdown";
import CustomButton from "@/components/Button";
import { useCustomAlert } from "@/contexts/CustomAlertContext";
import { StatusBar } from "expo-status-bar";
interface MenuTitleProps {
  title: string;
  className?: string;
}

const ProfileSettings = () => {
  const { showAlert, dismissAlert } = useCustomAlert();
  const router = useRouter();
  const [selectedValue, setSelectedValue] = useState("CY400");
  const [firstName, setFirstName] = useState("Antoh");
  const [lastName, setLastName] = useState("Shadrack");
  const [profileImage, setProfileImage] = useState(
    "https://reactnative.dev/img/tiny_logo.png"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
  });

  const handleBack = () => router.back();

  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        showAlert({
          title: "Camera Roll Permission Required",
          message:
            "Please allow access to your camera roll to select a profile image.",
          onDismiss: dismissAlert,
        });
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "livePhotos"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setIsUploading(true);
        // Here you would typically upload to your server
        // For demo, we'll just set the local URI
        setTimeout(() => {
          setProfileImage(result.assets[0].uri);
          setIsUploading(false);
        }, 1000);
      }
    } catch (error) {
      showAlert({
        title: "Image Picker Error",
        message: "An error occurred while picking the image. Please try again.",
        onDismiss: dismissAlert,
      });
      setIsUploading(false);
    }
  };

  const validateFields = () => {
    const newErrors = {
      firstName: firstName.trim() ? "" : "First name is required",
      lastName: lastName.trim() ? "" : "Last name is required",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleSave = () => {
    if (validateFields()) {
      // Save logic here
      console.log({
        firstName,
        lastName,
        class: selectedValue,
        profileImage,
      });
      router.back();
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
          <View className="flex-1 justify-between">
            <ScrollView
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View className="flex-row items-center justify-between px-5">
                <TouchableOpacity
                  onPress={handleBack}
                  className="flex-row items-center"
                >
                  <Ionicons name="chevron-back" size={24} color="#00CDDB" />
                  <Text className="font-pregular text-primary">Back</Text>
                </TouchableOpacity>
              </View>
              <View className="flex-col px-5">
                <View className="items-center mt-5">
                  <View className="relative">
                    {isUploading ? (
                      <View className="w-32 h-32 rounded-full bg-gray-100 items-center justify-center">
                        <ActivityIndicator size="large" color="#00CDDB" />
                      </View>
                    ) : (
                      <Image
                        source={{ uri: profileImage }}
                        className="w-32 h-32 rounded-full"
                        resizeMode="cover"
                      />
                    )}
                    <TouchableOpacity
                      onPress={pickImage}
                      className="absolute bottom-0 right-0 bg-white rounded-full p-2 border border-gray-200"
                    >
                      <Ionicons name="camera" size={24} color="#00CDDB" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text className="text-2xl font-pbold text-primary text-center mt-2">
                  {firstName} {lastName}
                </Text>
                <Text className="text-sm font-psemibold text-gray-500 text-center">
                  {selectedValue}
                </Text>

                <MenuTitle title={"First Name"} className="mb-2" />
                <InputField
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={setFirstName}
                  error={errors.firstName}
                />

                <MenuTitle title={"Last Name"} className="mb-2" />
                <InputField
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={setLastName}
                  error={errors.lastName}
                />

                <MenuTitle title={"Class"} className="mb-2" />
                <View
                  className="relative border bg-gray-100 border-gray-100 text-black rounded-xl"
                  style={{ zIndex: 1000 }}
                >
                  <CustomDropdown
                    placeholder={selectedValue}
                    options={[
                      { value: "CY100", key: 1 },
                      { value: "CY200", key: 2 },
                      { value: "CY300", key: 3 },
                      { value: "CY400", key: 4 },
                    ]}
                    onSelect={(selected) => setSelectedValue(selected)}
                    key={selectedValue}
                  />
                </View>
              </View>
              <View className="px-5 pb-5">
                <CustomButton
                  title="Save Changes"
                  onPress={handleSave}
                  disabled={isUploading}
                />
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <StatusBar style="dark" />
    </>
  );
};

export default ProfileSettings;
