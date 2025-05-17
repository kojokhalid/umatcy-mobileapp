import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { Image } from "react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants/index";
import { replace } from "expo-router/build/global-state/routing";
export default function Page() {
  const [loaded, setloaded] = React.useState(false);
  useEffect(() => {
    setTimeout(() => {
      setloaded(true);
    }, 400);
    if (loaded) {
      replace("/(auth)/additionalinfo");
      // replace("/(auth)/signin");
    }
  }, [loaded]);
  return (
    <>
      <SafeAreaView className="h-screen w-full bg-white">
        <View className="flex justify-center items-center h-full">
          <View>
            <Image
              source={images.chatting}
              resizeMode="contain"
              className="h-[300px]"
            ></Image>
          </View>
          <Text className="text-[27px] font-pbold text-primary">
            Connect. Learn. Succeed
          </Text>
        </View>
      </SafeAreaView>
      <StatusBar style="auto" backgroundColor="transparent" />
    </>
  );
}
