import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Switch,
} from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

interface MenuItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  url?: string;
  hasSwitch?: boolean;
  onValueChange?: (value: boolean) => void;
  initialValue?: boolean;
}

const Settings = () => {
  const router = useRouter();

  const handleBack = () => router.back();

  const MenuItem = ({
    icon,
    title,
    description,
    url,
    hasSwitch = false,
    onValueChange,
    initialValue = false,
  }: MenuItemProps) => {
    const [switchValue, setSwitchValue] = useState(initialValue);

    const handleToggle = () => {
      setSwitchValue((prev) => {
        const newValue = !prev;
        if (onValueChange) {
          onValueChange(newValue);
        }
        return newValue;
      });
    };

    return (
      <TouchableOpacity
        onPress={() =>
          router.push(hasSwitch ? "" : `/(screens)/settings/${url}`)
        }
      >
        <View className="flex-row items-center justify-start mt-5 gap-x-4">
          <View className="bg-gray-100 rounded-full p-4 w-14 h-14 justify-center items-center">
            {icon}
          </View>
          <View className="flex-1 flex-col items-start justify-center">
            <Text className="text-md font-psemibold text-black text-center">
              {title}
            </Text>
            <Text className="text-sm font-pregular text-gray text-center">
              {description}
            </Text>
          </View>
          {hasSwitch && (
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={switchValue ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={handleToggle}
              value={switchValue}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const MenuTitle = ({ title }) => {
    return (
      <Text className="text-sm font-plight text-gray-500 text-start mt-5">
        {title}
      </Text>
    );
  };

  return (
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
              <View className="text-2xl font-pbold text-primary items-center mt-5">
                <View className="flex-1">
                  <Image
                    source={{
                      uri: "https://reactnative.dev/img/tiny_logo.png",
                    }}
                    className="w-32 h-32 rounded-full"
                    resizeMode="cover"
                  />
                  <View className="absolute bottom-3 right-0 bg-white rounded-full p-2">
                    <Ionicons name="camera" size={24} color="#00CDDB" />
                  </View>
                </View>
              </View>
              <Text className="text-2xl font-pbold text-primary text-center mt-2">
                Antoh Shadrack
              </Text>
              <Text className="text-sm font-psemibold text-gray-500 text-center">
                CY 400
              </Text>
              <MenuTitle title={"Account"} />
              <MenuItem
                title={"Edit Profile"}
                description={"Update your name, bio, and profile picture"}
                icon={<Ionicons name="person" size={24} color={"#00CDDB"} />}
                url={"profilesettings"}
              />
              <MenuItem
                title={"Change Password"}
                description={"Set a new password for security"}
                icon={
                  <Ionicons name="lock-closed" size={24} color={"#00CDDB"} />
                }
                url={"changepassword"}
              />
              <MenuTitle title={"Notifications"} />
              <MenuItem
                title={"Announcements"}
                description={"Get alerts for new posts from lecturers"}
                icon={
                  <Ionicons name="notifications" size={24} color={"#00CDDB"} />
                }
                hasSwitch={true}
                initialValue={false}
                onValueChange={(value) => console.log("Announcements:", value)}
              />
              <MenuTitle title={"App Preference"} />
              <MenuItem
                title="Darkmode"
                description="Switch between light and dark themes"
                icon={<Ionicons name="moon" size={24} color={"#00CDDB"} />}
                hasSwitch={true}
                initialValue={false}
                onValueChange={(value) => console.log("Darkmode:", value)}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Settings;

