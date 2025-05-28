import {
  FlatList,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import CustomHeader from "@/components/CustomHeader";
import { Post } from "@/components/Post";
const data = [
  {
    id: "1",
    author: "Jeremy Apeke",
    course: "Jeremy Apeke",
    timestamp: "2h",
    content:
      "The first NEST online Meeting will take place on 2oth May 2025, on Zoom Kindly take note",
    image:
      "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.makeuseof.com%2Fis-your-smart-thermostat-cybersecurity-risk%2F&psig=AOvVaw3rSsRnY4UGoPc8kPYQ5nCU&ust=1747788178619000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCPjWgsDosI0DFQAAAAAdAAAAABAp",
    comments: 4,
    retweets: 7,
    likes: 22,
  },
  {
    id: "2",
    author: "Jeremy Apeke",
    timestamp: "2h",
    content:
      "The first NEST online Meeting will take place on 2oth May 2025, on Zoom Kindly take note",
    image:
      "https://i0.wp.com/nest.cybirdsecurity.com/wp-content/uploads/2022/08/CyBirdCBTT.png?fit=1792%2C1995&ssl=1",
    comments: 4,
    retweets: 7,
    likes: 22,
  },
  {
    id: "3",
    author: "Jeremy Apeke",
    timestamp: "2h",
    content:
      "The first NEST online Meeting will take place on 2oth May 2025, on Zoom Kindly take note",
    image:
      "https://www.cyber-nest.com/wp-content/uploads/2021/04/Pag-5-Cybersecurity-1024x576.jpg",
    comments: 4,
    retweets: 7,
    likes: 22,
  },
  {
    id: "4",
    author: "Jeremy Apeke",
    timestamp: "2h",
    content:
      "The first NEST online Meeting will take place on 2oth May 2025, on Zoom Kindly take note",
    image: "https://thecybernest.com/images/easy.jpg",
    comments: 4,
    retweets: 7,
    likes: 22,
  },
  // more posts...
];

const Notification = () => {
  const coursedata = [
    { key: "1", value: "All" },
    { key: "2", value: "Course" },
    { key: "3", value: "Event" },
    { key: "4", value: "Notification" },
  ];
  const [selected, setSelected] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const router = useRouter();
  // const { user } = useUser();
  return (
    <>
      <View style={styles.container}>
        <LinearGradient
          colors={["#00CDDB", "#0096c7"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        />
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
              <CustomHeader
                // dropdownData={coursedata}
                // selected={selected}
                // onSelect={setSelected}
                title="Notifications"
              />
              {/* Rest of your FlatList and other components */}
              <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Post
                    author={item.author}
                    timestamp={item.timestamp}
                    text={item.content}
                    media={item.image}
                    comments={item.comments}
                    analytics={item.retweets}
                    likes={item.likes}
                    profile="https://reactnative.dev/img/tiny_logo.png"
                    id="1"
                    showActions={false}
                    showCategory={false}
                  />
                )}
                ListEmptyComponent={
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      padding: 20,
                    }}
                  >
                    <Text>No notifications available</Text>
                  </View>
                }
                contentContainerStyle={{
                  paddingBottom: 100, // Adjust this value based on your bottom nav height
                }}
                ListFooterComponent={
                  <View style={{ height: 100 }} /> // Adjust height based on your bottom nav
                }
              />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </>
  );
};

export default Notification;
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
    height: 150, // Adjust this based on your header height
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
    paddingTop: Platform.OS === "android" ? StatusBar.length : 0,
  },
  safeArea: {
    width: "100%",
  },
});
