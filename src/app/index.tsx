import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect } from "react";
import { Image } from "react-native";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants/index";
import { AuthContext } from "@/contexts/AuthContext";
export default function Page() {
  const [loaded, setloaded] = React.useState(false);
  const authState = useContext(AuthContext);

  useEffect(() => {
    setTimeout(() => {
      setloaded(true);
    }, 400);
    if (loaded) {
      if (!authState.isReady) {
        null; // or a loading spinner
      }
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
      <StatusBar style="auto" />
    </>
  );
}
