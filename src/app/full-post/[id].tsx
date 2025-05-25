import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Link, router, useLocalSearchParams } from "expo-router";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Post } from "@/components/Post";
import { useUser } from "@clerk/clerk-expo";

// Sample data for the main post and comments
type MediaType = "image" | "pdf" | "video" | "document" | "audio";

const postData: {
  id: string;
  author: string;
  profile: string;
  timestamp: string;
  text: string;
  media: string;
  mediaType: MediaType;
  comments: number;
  likes: number;
  analytics: number;
  category: string;
} = {
  id: "1",
  author: "Jeremy Apeke",
  profile: "https://reactnative.dev/img/tiny_logo.png",
  timestamp: "2h ago",
  text: "The first NEST online Meeting will take place on 20th May 2025, on Zoom. Kindly take note.",
  media:
    "https://www.cyber-nest.com/wp-content/uploads/2021/04/Pag-5-Cybersecurity-1024x576.jpg",
  mediaType: "image",
  comments: 4,
  likes: 22,
  analytics: 2300,
  category: "Announcement",
};

const comments: Array<{
  id: string;
  author: string;
  profile: string;
  timestamp: string;
  text: string;
  media?: string;
  mediaType?: MediaType;
  likes: number;
  analytics: number;
}> = [
  {
    id: "c1",
    author: "Elijah Sarpong",
    profile: "https://reactnative.dev/img/tiny_logo.png",
    timestamp: "1h ago",
    text: "Thanks for the update! Will definitely attend.",
    likes: 5,
    analytics: 10,
  },
  {
    id: "c2",
    author: "Sarah Johnson",
    profile: "https://reactnative.dev/img/tiny_logo.png",
    timestamp: "45m ago",
    text: "Is there an agenda available for the meeting?",
    likes: 3,
    analytics: 8,
  },
  {
    id: "c3",
    author: "Mike Chen",
    profile: "https://reactnative.dev/img/tiny_logo.png",
    timestamp: "30m ago",
    text: "Looking forward to it! Here's a document with some pre-meeting materials:",
    media: "https://example.com/path/to/document.pdf",
    mediaType: "pdf",
    likes: 7,
    analytics: 15,
  },
];

export default function FullPostScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useUser();
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => router.back();
  const handlePostComment = () => {
    if (!commentText.trim()) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setCommentText("");
      // In a real app, you would add the new comment to your state/backend
    }, 1000);
  };

  useEffect(() => {
    console.log("Post ID:", id);
    // Here you would fetch the actual post data based on the ID
  }, [id]);

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
            {/* Header with back button */}
            <View className="flex-row items-center justify-between px-5">
              <TouchableOpacity
                onPress={handleBack}
                className="flex-row items-center"
              >
                <Ionicons name="chevron-back" size={24} color="#00CDDB" />
                <Text className="font-pregular text-primary">Back</Text>
              </TouchableOpacity>
            </View>

            {/* Main Post */}
            <Post
              id={postData.id}
              author={postData.author}
              profile={postData.profile}
              timestamp={postData.timestamp}
              text={postData.text}
              media={postData.media}
              mediaType={postData.mediaType}
              comments={postData.comments}
              likes={postData.likes}
              analytics={postData.analytics}
              category={postData.category}
              showCategory={true}
              showActions={true}
            />

            {/* Comments Section */}
            <View className="px-5 py-4 border-t border-gray-100">
              <Text className="font-pmedium text-lg mb-4">
                Replies ({comments.length})
              </Text>

              {/* Comments List */}
              <View className="space-y-4">
                {comments.map((comment) => (
                  <Post
                    key={comment.id}
                    id={comment.id}
                    author={comment.author}
                    profile={comment.profile}
                    timestamp={comment.timestamp}
                    text={comment.text}
                    media={comment.media}
                    mediaType={comment.mediaType}
                    likes={comment.likes}
                    analytics={comment.analytics}
                    showCategory={false}
                    showActions={true}
                  />
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Comment Input */}
          <View className="px-5 pb-5 pt-3 bg-white border-t border-gray-100">
            <View className="flex-row items-center">
              <Image
                source={{ uri: user?.imageUrl }}
                className="w-10 h-10 rounded-full mr-3"
              />
              <TextInput
                className="flex-1 border border-gray-200 rounded-full px-4 py-2"
                placeholder="Write a reply..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                className="ml-2 bg-primary p-2 rounded-full"
                onPress={handlePostComment}
                disabled={isLoading || !commentText.trim()}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Ionicons name="send" size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
