import {
  View,
  Text,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import { Video, ResizeMode } from "expo-av";
// import Pdf from "react-native-pdf";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";

interface PostProps {
  id: string;
  author: string;
  text: string;
  category?: string;
  profile: string;
  timestamp: string;
  media?: string;
  mediaType?: "image" | "video" | "pdf" | "document" | "audio";
  comments?: number;
  likes?: number;
  analytics?: number;
  showCategory?: boolean;
  showActions?: boolean;
}

const Post = ({
  id = "",
  author = "",
  text = "",
  category = "",
  profile = "",
  timestamp = "",
  media = "",
  mediaType = "image",
  comments = 0,
  likes = 0,
  analytics = 0,
  showCategory = false,
  showActions = true,
}: PostProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(media);
  const [videoStatus, setVideoStatus] = useState({});
  const [pdfPages, setPdfPages] = useState(0);

  const getFileExtension = (uri: string) => {
    return uri.split(".").pop()?.toLowerCase();
  };

  const determineMediaType = (uri: string) => {
    const extension = getFileExtension(uri);
    if (!extension) return "image";

    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
    const videoExtensions = ["mp4", "mov", "avi", "mkv"];
    const pdfExtensions = ["pdf"];
    const documentExtensions = ["doc", "docx", "txt"];

    if (imageExtensions.includes(extension)) return "image";
    if (videoExtensions.includes(extension)) return "video";
    if (pdfExtensions.includes(extension)) return "pdf";
    if (documentExtensions.includes(extension)) return "document";
    return "image"; // default
  };

  const handleDownload = async (uri: string) => {
    try {
      const fileUri = FileSystem.documentDirectory + uri.split("/").pop();
      const downloadResumable = FileSystem.createDownloadResumable(
        uri,
        fileUri,
        {},
        (downloadProgress) => {
          const progress =
            downloadProgress.totalBytesWritten /
            downloadProgress.totalBytesExpectedToWrite;
          console.log(`Download progress: ${progress * 100}%`);
        }
      );

      const { uri: localUri } = await downloadResumable.downloadAsync();

      if (Platform.OS === "ios") {
        await Sharing.shareAsync(localUri);
      } else {
        await WebBrowser.openBrowserAsync(localUri);
      }
    } catch (e) {
      console.error("Download error:", e);
    }
  };

  const renderMediaPreview = () => {
    if (!media) return null;

    const type = mediaType || determineMediaType(media);

    switch (type) {
      case "image":
        return (
          <Image
            source={{ uri: media }}
            className="w-full h-72 rounded-xl bg-gray-100"
            resizeMode="cover"
          />
        );
      case "video":
        return (
          <View className="w-full h-72 rounded-xl bg-gray-100 overflow-hidden">
            <Video
              source={{ uri: media }}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={false}
              isLooping={false}
              useNativeControls
              className="w-full h-full"
              onPlaybackStatusUpdate={(status) => setVideoStatus(() => status)}
            />
            <View className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
              <Ionicons name="play" size={16} color="white" />
            </View>
          </View>
        );
      // case "pdf":
      //   return (
      //     <View className="w-full h-72 rounded-xl bg-gray-100 items-center justify-center border border-gray-200">
      //       <Pdf
      //         source={{ uri: media }}
      //         onLoadComplete={(numberOfPages) => setPdfPages(numberOfPages)}
      //         style={{ width: "100%", height: "100%" }}
      //         enablePaging={false}
      //         enableRTL={false}
      //         fitPolicy={0}
      //         renderActivityIndicator={() => (
      //           <View className="flex-1 items-center justify-center">
      //             <ActivityIndicator size="large" color="#00CDDB" />
      //           </View>
      //         )}
      //       />
      //       <View className="absolute bottom-2 right-2 bg-black/50 rounded-full px-2 py-1">
      //         <Text className="text-white text-xs">PDF ({pdfPages} pages)</Text>
      //       </View>
      //     </View>
      //   );
      case "document":
        return (
          <View className="w-full h-72 rounded-xl bg-gray-100 items-center justify-center border border-gray-200">
            <Ionicons name="document-text" size={48} color="#00CDDB" />
            <Text className="mt-2 text-gray-500">Document File</Text>
            <Text className="text-xs text-gray-400 mt-1">
              {getFileExtension(media)?.toUpperCase()} File
            </Text>
          </View>
        );
      default:
        return (
          <Image
            source={{ uri: media }}
            className="w-full h-72 rounded-xl bg-gray-100"
            resizeMode="cover"
          />
        );
    }
  };

  const renderFullscreenMedia = () => {
    if (!selectedMedia) return null;

    const type = mediaType || determineMediaType(selectedMedia);

    switch (type) {
      case "image":
        return (
          <Image
            source={{ uri: selectedMedia }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        );
      case "video":
        return (
          <Video
            source={{ uri: selectedMedia }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isLooping
            useNativeControls
            style={{ width: "100%", height: "100%" }}
          />
        );
      // case "pdf":
      //   return (
      //     <View style={{ flex: 1 }}>
      //       <Pdf
      //         source={{ uri: selectedMedia }}
      //         style={{ flex: 1 }}
      //         onLoadComplete={(numberOfPages) => setPdfPages(numberOfPages)}
      //         enablePaging
      //         horizontal
      //         enableRTL={false}
      //         renderActivityIndicator={() => (
      //           <View className="flex-1 items-center justify-center">
      //             <ActivityIndicator size="large" color="#00CDDB" />
      //           </View>
      //         )}
      //       />
      //       <View className="absolute bottom-5 left-0 right-0 items-center">
      //         <TouchableOpacity
      //           className="bg-primary px-4 py-2 rounded-lg"
      //           onPress={() => handleDownload(selectedMedia)}
      //         >
      //           <Text className="text-white">Download PDF</Text>
      //         </TouchableOpacity>
      //       </View>
      //     </View>
      //   );
      case "document":
        return (
          <View className="flex-1 bg-white p-4">
            <Text className="text-lg font-bold mb-4">
              {selectedMedia.split("/").pop()}
            </Text>
            <View className="flex-1 items-center justify-center">
              <Ionicons name="document-text" size={72} color="#00CDDB" />
              <Text className="mt-4 text-gray-500">
                Document preview not available
              </Text>
              <TouchableOpacity
                className="mt-4 bg-primary px-4 py-2 rounded-lg"
                onPress={() => handleDownload(selectedMedia)}
              >
                <Text className="text-white">Download Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      default:
        return (
          <Image
            source={{ uri: selectedMedia }}
            style={{ width: "100%", height: "100%", resizeMode: "contain" }}
          />
        );
    }
  };

  return (
    <Pressable
      onPress={() => router.push(`/(protected)/(tabs)/(home)/post/${id}`)}
    >
      <View className="px-5 py-4 border-b border-gray-100 flex-row gap-x-3">
        {/* Avatar */}
        <View className="w-10 h-10 bg-black rounded-full">
          <Image
            source={{ uri: profile }}
            className="w-full h-full rounded-full"
            resizeMode="cover"
          />
        </View>

        {/* Post content */}
        <View className="flex-1">
          {/* Username and Timestamp */}
          <View className="flex-row items-center gap-x-2">
            <Link href={`/profile/${author}`}>
              <Text className="font-psemibold text-black">{author}</Text>
            </Link>
            <Text className="text-gray-500 text-sm">· {timestamp}</Text>
            {showCategory && (
              <View className="bg-gray-100 rounded-full px-2 py-1 absolute right-0">
                <Text className="text-primary-darker font-plight text-sm">
                  {category}
                </Text>
              </View>
            )}
          </View>

          {/* Post Text */}
          <Text className="text-gray-800 text-md font-pregular">{text}</Text>

          {/* Media Preview */}
          {media && (
            <Pressable
              onPress={() => {
                setModalVisible(true);
                setSelectedMedia(media);
              }}
              className="mt-4"
            >
              {renderMediaPreview()}
            </Pressable>
          )}

          {/* Actions */}
          {showActions && (
            <View className="flex-row justify-between px-5 items-center mt-2">
              <View className="flex-row items-center gap-x-1">
                <Ionicons name="chatbubble-outline" size={16} color="black" />
                <Text className="text-gray-500 text-sm">{comments || 0}</Text>
              </View>
              <View className="flex-row items-center gap-x-1">
                <FontAwesome name="heart-o" size={16} color="black" />
                <Text className="text-gray-500 text-sm">{likes || 0}</Text>
              </View>
              <View className="flex-row items-center gap-x-1">
                <MaterialCommunityIcons
                  name="google-analytics"
                  size={16}
                  color="black"
                />
                <Text className="text-gray-500 text-sm">{analytics}</Text>
              </View>
            </View>
          )}

          {/* Fullscreen Media Modal */}
          <Modal visible={modalVisible} transparent={true} animationType="fade">
            <View className="flex-1 bg-black justify-center items-center relative">
              {/* Close Button (X) */}
              <Pressable
                onPress={() => setModalVisible(false)}
                className="absolute top-14 right-5 z-10 p-2"
              >
                <AntDesign name="close" size={30} color="white" />
              </Pressable>

              {/* Fullscreen Media */}
              {renderFullscreenMedia()}
            </View>
          </Modal>
        </View>
      </View>
    </Pressable>
  );
};

export { Post };
