import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomDropdown from "./CustomDropdown";

interface CustomHeaderProps {
  dropdownData?: Array<{ key: string; value: string }>;
  selected?: string;
  onSelect?: (selected: string) => void;
  title?: string;
}

const CustomHeader = ({
  dropdownData,
  selected,
  onSelect,
  title = "CyConnect",
}: CustomHeaderProps) => {
  return (
    <View>
      <StatusBar backgroundColor="transparent" translucent />
      <LinearGradient
        colors={["#00CDDB", "#0096c7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientHeader, { overflow: "visible" }]}
      >
        <SafeAreaView edges={["top"]} style={styles.safeArea}>
          <View className="flex-row items-center justify-between px-5 pb-4">
            {/* Left: Profile */}
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-black rounded-full">
                <Image
                  source={{
                    uri: "https://reactnative.dev/img/tiny_logo.png",
                  }}
                  className="w-full h-full rounded-full"
                  resizeMode="cover"
                />
              </View>
              <View className="relative" style={{ zIndex: 1000 }}>
                {dropdownData && (
                  <CustomDropdown
                    options={dropdownData}
                    onSelect={onSelect}
                    placeholder={selected || "All"}
                  />
                )}
              </View>
            </View>

            <Text className="-translate-x-1/2 text-white text-lg font-pbold">
              {title}
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  gradientHeader: {
    paddingTop: Platform.OS === "android" ? StatusBar.length : 0,
  },
  safeArea: {
    width: "100%",
  },
});

export default CustomHeader;
