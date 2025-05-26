import {
  FlatList,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from "react-native";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Post } from "@/components/Post";
import CustomDropdown from "@/components/CustomDropdown";
import { useAuth } from "@/contexts/AuthContext";
const data = [
  {
    id: "1",
    author: "Jeremy Apeke",
    profile: "https://reactnative.dev/img/tiny_logo.png",
    timestamp: "2h",
    text: "The first NEST online Meeting will take place on 20th May 2025, on Zoom. Kindly take note.",
    media:
      "https://www.cyber-nest.com/wp-content/uploads/2021/04/Pag-5-Cybersecurity-1024x576.jpg",
    mediaType: "image",
    comments: 4,
    likes: 22,
    analytics: 2300,
    category: "Announcement",
  },
  {
    id: "2",
    author: "Cyber Security Dept",
    profile: "https://reactnative.dev/img/tiny_logo.png",
    timestamp: "4h",
    text: "New cybersecurity workshop materials have been uploaded. Please review before next class.",
    media: "https://example.com/path/to/document.pdf",
    mediaType: "pdf",
    comments: 7,
    likes: 35,
    analytics: 1800,
    category: "Course",
  },
  {
    id: "3",
    author: "Event Coordinator",
    profile: "https://reactnative.dev/img/tiny_logo.png",
    timestamp: "1d",
    text: "Check out this video from our last cybersecurity conference!",
    media: "https://example.com/path/to/video.mp4",
    mediaType: "video",
    comments: 12,
    likes: 54,
    analytics: 4200,
    category: "Event",
  },
];

export const SignOutButton = () => {
  const handleSignOut = async () => {
    try {
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Text>Sign out</Text>
    </TouchableOpacity>
  );
};

const Announcement = () => {
  const { user } = useAuth();

  const coursedata = [
    { key: "1", value: "All" },
    { key: "2", value: "Course" },
    { key: "3", value: "Event" },
    { key: "4", value: "Announcement" },
  ];
  const [selected, setSelected] = useState("");
  const router = useRouter();

  const filteredData = selected
    ? data.filter((item) => item.category === selected)
    : data;

  return (
    <View style={styles.container}>
      {/* <LinearGradient
        colors={["#00CDDB", "#0096c7"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradientBackground}
      /> */}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 20}
        style={styles.keyboardAvoidingView}
      >
        <SafeAreaView
          style={styles.safeAreaContent}
          edges={["bottom", "left", "right"]}
        >
          <View style={styles.content}>
            <View>
              <StatusBar backgroundColor="transparent" translucent />
              <LinearGradient
                colors={["#00CDDB", "#0096c7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.gradientHeader, { overflow: "visible" }]}
              >
                <SafeAreaView edges={["top"]} style={styles.safeArea}>
                  <View style={styles.headerContainer}>
                    <View style={styles.profileContainer}>
                      <View style={styles.profileImage}>
                        <Image
                          source={{ uri: "imageUrl" }}
                          style={styles.profileImageStyle}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.dropdownContainer}>
                        <CustomDropdown
                          options={coursedata}
                          onSelect={(value) => setSelected(value)}
                          placeholder={selected || "All"}
                        />
                      </View>
                    </View>

                    <Text style={styles.headerText}>CyConnect</Text>
                  </View>
                </SafeAreaView>
              </LinearGradient>
            </View>

            <FlatList
              data={filteredData}
              renderItem={({ item }) => (
                <Post
                  id={item.id}
                  author={item.author}
                  profile={item.profile}
                  timestamp={item.timestamp}
                  text={item.text}
                  media={item.media}
                  mediaType={
                    item.mediaType as
                      | "image"
                      | "video"
                      | "pdf"
                      | "document"
                      | "audio"
                  }
                  comments={item.comments}
                  likes={item.likes}
                  analytics={item.analytics}
                  category={item.category}
                  showCategory={true}
                />
              )}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 100,
              }}
              ListFooterComponent={<View style={{ height: 100 }} />}
            />

            <View></View>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Announcement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  gradientBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  safeAreaContent: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  gradientHeader: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    width: "100%",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "black",
  },
  profileImageStyle: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  dropdownContainer: {
    zIndex: 1000,
    marginLeft: 10,
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
