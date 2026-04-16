import { SubmissionItem } from "@/components/SubmissionItem";
import { Colors } from "@/constants/Colors";
import {
  cardShadowStyle,
  formatDate,
  getBrandImage,
  getDaysUntilDeadline,
} from "@/lib/utils";
import { useCreatorStore } from "@/stores/creatorStore";
import { Submission } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useVideoPlayer, VideoView } from "expo-video";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [videoUrl, setVideoUrl] = useState("");
  const [platform, setPlatform] = useState<"instagram" | "tiktok">("instagram");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(
    null,
  );
  const [editUrl, setEditUrl] = useState("");
  const [videoModalVisible, setVideoModalVisible] = useState(false);

  const allCampaigns = useCreatorStore((state) => state.campaigns);
  const allSubmissions = useCreatorStore((state) => state.submissions);
  const submitVideo = useCreatorStore((state) => state.submitVideo);
  const editSubmission = useCreatorStore((state) => state.editSubmission);

  // Video player setup - must be called before any early returns
  const videoSource = require("@/assets/videos/example-video.mp4");
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
  });

  // Memoize derived data to prevent infinite loops
  const campaign = useMemo(() => {
    return allCampaigns.find((c) => c.id === id);
  }, [allCampaigns, id]);

  const submissions = useMemo(() => {
    return allSubmissions.filter((s) => s.campaignId === id);
  }, [allSubmissions, id]);

  if (!campaign) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: Colors.lightBlue }}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={Colors.lightBlue}
        />
        <View className="flex-1 items-center justify-center">
          <Text className="text-white text-lg">Campaign not found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-4 px-6 py-3 rounded-full"
            style={{ backgroundColor: Colors.darkBlue }}
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const daysLeft = getDaysUntilDeadline(campaign.deadline);

  const handlePlayVideo = () => {
    setVideoModalVisible(true);
    player.play();
  };

  const handleCloseVideo = () => {
    setVideoModalVisible(false);
    player.pause();
  };

  const handleSubmit = () => {
    if (!videoUrl.trim()) {
      Alert.alert("Error", "Please enter a video URL");
      return;
    }

    // Simple URL validation
    const isValidUrl =
      videoUrl.startsWith("http://") || videoUrl.startsWith("https://");
    if (!isValidUrl) {
      Alert.alert(
        "Error",
        "Please enter a valid URL starting with http:// or https://",
      );
      return;
    }

    submitVideo(campaign.id, videoUrl.trim(), platform);
    setVideoUrl("");
    Alert.alert("Success", "Your video has been submitted for review!");
  };

  const handleEditSubmission = (submission: Submission) => {
    setEditingSubmission(submission);
    setEditUrl(submission.videoUrl);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (editingSubmission && editUrl.trim()) {
      editSubmission(editingSubmission.id, editUrl.trim());
      setEditModalVisible(false);
      setEditingSubmission(null);
      setEditUrl("");
      Alert.alert("Success", "Submission updated successfully!");
    }
  };

  const isSubmitDisabled = !videoUrl.trim();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors.lightBlue }}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.lightBlue} />

      {/* Header */}
      <View className="flex-row items-center px-4 py-4 pt-8 mt-5">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold ml-4">
          Campaign Details
        </Text>
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1 rounded-t-3xl"
          style={{ backgroundColor: Colors.gray[100] }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Brand Info */}
          <View className="p-6">
            <View className="flex-row items-center mb-6">
              <View
                className="w-16 h-16 rounded-xl overflow-hidden items-center justify-center"
                style={{ backgroundColor: `${Colors.lightBlue}15` }}
              >
                <Image
                  source={getBrandImage(
                    campaign.brandName,
                    campaign.brandImage,
                  )}
                  style={{ width: 64, height: 64 }}
                  contentFit="cover"
                />
              </View>
              <View className="ml-4 flex-1">
                <Text
                  className="text-2xl font-bold"
                  style={{ color: Colors.darkBlue }}
                >
                  {campaign.brandName}
                </Text>
              </View>
            </View>

            {/* Deadline Info */}
            <View
              className="p-4 rounded-xl mb-6"
              style={{ backgroundColor: Colors.white, ...cardShadowStyle }}
            >
              <View className="flex-row justify-between items-center">
                <View>
                  <Text
                    className="text-sm mb-1"
                    style={{ color: Colors.gray[500] }}
                  >
                    Deadline
                  </Text>
                  <Text
                    className="text-lg font-semibold"
                    style={{ color: Colors.gray[800] }}
                  >
                    {formatDate(campaign.deadline)}
                  </Text>
                </View>
                <View
                  className="px-4 py-2 rounded-full"
                  style={{
                    backgroundColor:
                      daysLeft < 7
                        ? `${Colors.status.rejected}20`
                        : `${Colors.status.approved}20`,
                  }}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      color:
                        daysLeft < 7
                          ? Colors.status.rejected
                          : Colors.status.approved,
                    }}
                  >
                    {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                  </Text>
                </View>
              </View>
              <View
                className="mt-4 pt-4 border-t flex-row justify-between items-center"
                style={{ borderTopColor: Colors.gray[200] }}
              >
                <View>
                  <Text
                    className="text-sm mb-1"
                    style={{ color: Colors.gray[500] }}
                  >
                    Max Videos Allowed
                  </Text>
                  <Text
                    className="text-lg font-semibold"
                    style={{ color: Colors.gray[800] }}
                  >
                    {campaign.maxVideos} videos
                  </Text>
                </View>
                <View className="items-end">
                  <Text
                    className="text-sm mb-1"
                    style={{ color: Colors.gray[500] }}
                  >
                    Per Video
                  </Text>
                  <Text
                    className="text-lg font-bold"
                    style={{ color: Colors.lightBlue }}
                  >
                    ${campaign.payoutPerVideo}
                  </Text>
                </View>
              </View>
            </View>

            {/* Brief */}
            <View className="mb-6">
              <Text
                className="text-lg font-bold mb-3"
                style={{ color: Colors.darkBlue }}
              >
                Campaign Brief
              </Text>
              <View
                className="p-4 rounded-xl"
                style={{ backgroundColor: Colors.white, ...cardShadowStyle }}
              >
                <Text
                  className="text-base leading-6"
                  style={{ color: Colors.gray[700] }}
                >
                  {campaign.brief}
                </Text>
              </View>
            </View>

            {/* Requirements */}
            <View className="mb-6">
              <Text
                className="text-lg font-bold mb-3"
                style={{ color: Colors.darkBlue }}
              >
                Requirements
              </Text>
              <View
                className="p-4 rounded-xl"
                style={{ backgroundColor: Colors.white, ...cardShadowStyle }}
              >
                {campaign.requirements.map((req, index) => (
                  <View key={index} className="flex-row items-center mb-2">
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={Colors.lightBlue}
                    />
                    <Text
                      className="text-base ml-2"
                      style={{ color: Colors.gray[700] }}
                    >
                      {req}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Example Videos */}
            <View className="mb-6">
              <Text
                className="text-lg font-bold mb-3"
                style={{ color: Colors.darkBlue }}
              >
                Example Videos
              </Text>
              <Text
                className="text-sm mb-3"
                style={{ color: Colors.gray[500] }}
              >
                Watch these examples to understand what kind of content
                we&apos;re looking for:
              </Text>
              {campaign.exampleVideos.map((video, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={handlePlayVideo}
                  className="p-4 rounded-xl mb-2"
                  style={{ backgroundColor: Colors.white, ...cardShadowStyle }}
                >
                  <View className="flex-row items-center">
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center"
                      style={{ backgroundColor: `${Colors.lightBlue}20` }}
                    >
                      <Ionicons
                        name="play"
                        size={20}
                        color={Colors.lightBlue}
                      />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text
                        className="text-base font-medium"
                        style={{ color: Colors.gray[800] }}
                      >
                        Example Video {index + 1}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={Colors.gray[400]}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Your Submissions */}
            {submissions.length > 0 && (
              <View className="mb-6">
                <Text
                  className="text-lg font-bold mb-3"
                  style={{ color: Colors.darkBlue }}
                >
                  Your Submissions ({submissions.length}/{campaign.maxVideos})
                </Text>
                <View className="-mx-4">
                  {submissions.map((submission) => (
                    <SubmissionItem
                      key={submission.id}
                      submission={submission}
                      onEdit={handleEditSubmission}
                    />
                  ))}
                </View>
              </View>
            )}

            {/* Submit Video */}
            {submissions.length < campaign.maxVideos && daysLeft > 0 && (
              <View className="mb-6">
                <Text
                  className="text-lg font-bold mb-3"
                  style={{ color: Colors.darkBlue }}
                >
                  Submit Your Video
                </Text>
                <View
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: Colors.white, ...cardShadowStyle }}
                >
                  {/* Platform Selection */}
                  <Text
                    className="text-sm mb-2"
                    style={{ color: Colors.gray[600] }}
                  >
                    Select Platform
                  </Text>
                  <View className="flex-row mb-4">
                    <TouchableOpacity
                      onPress={() => setPlatform("instagram")}
                      className="flex-1 mr-2 p-3 rounded-xl flex-row items-center justify-center"
                      style={{
                        backgroundColor:
                          platform === "instagram"
                            ? Colors.lightBlue
                            : Colors.gray[100],
                      }}
                    >
                      <Ionicons
                        name="logo-instagram"
                        size={20}
                        color={
                          platform === "instagram"
                            ? Colors.white
                            : Colors.gray[600]
                        }
                      />
                      <Text
                        className="ml-2 font-medium"
                        style={{
                          color:
                            platform === "instagram"
                              ? Colors.white
                              : Colors.gray[600],
                        }}
                      >
                        Instagram
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setPlatform("tiktok")}
                      className="flex-1 ml-2 p-3 rounded-xl flex-row items-center justify-center"
                      style={{
                        backgroundColor:
                          platform === "tiktok"
                            ? Colors.lightBlue
                            : Colors.gray[100],
                      }}
                    >
                      <Ionicons
                        name="logo-tiktok"
                        size={20}
                        color={
                          platform === "tiktok"
                            ? Colors.white
                            : Colors.gray[600]
                        }
                      />
                      <Text
                        className="ml-2 font-medium"
                        style={{
                          color:
                            platform === "tiktok"
                              ? Colors.white
                              : Colors.gray[600],
                        }}
                      >
                        TikTok
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Video URL Input */}
                  <Text
                    className="text-sm mb-2"
                    style={{ color: Colors.gray[600] }}
                  >
                    Video URL
                  </Text>
                  <View className="relative mb-4">
                    <TextInput
                      value={videoUrl}
                      onChangeText={setVideoUrl}
                      placeholder={`Paste your ${platform} video URL here`}
                      className="p-4 pr-12 rounded-xl"
                      style={{
                        backgroundColor: Colors.gray[100],
                        color: Colors.gray[800],
                      }}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                    {videoUrl.length > 0 && (
                      <TouchableOpacity
                        onPress={() => setVideoUrl("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
                      >
                        <Ionicons
                          name="close-circle"
                          size={20}
                          color={Colors.gray[400]}
                        />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSubmitDisabled}
                    className="p-4 rounded-xl"
                    style={{
                      backgroundColor: isSubmitDisabled
                        ? Colors.gray[400]
                        : Colors.lightBlue,
                    }}
                  >
                    <Text className="text-center font-bold text-white text-lg">
                      Submit Video
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {submissions.length >= campaign.maxVideos && (
              <View
                className="p-4 rounded-xl mb-6"
                style={{ backgroundColor: `${Colors.status.approved}20` }}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color={Colors.status.approved}
                  />
                  <Text
                    className="ml-3 font-medium"
                    style={{ color: Colors.status.approved }}
                  >
                    You&apos;ve submitted the maximum number of videos for this
                    campaign
                  </Text>
                </View>
              </View>
            )}

            {daysLeft <= 0 && (
              <View
                className="p-4 rounded-xl mb-6"
                style={{ backgroundColor: `${Colors.status.rejected}20` }}
              >
                <View className="flex-row items-center">
                  <Ionicons
                    name="time"
                    size={24}
                    color={Colors.status.rejected}
                  />
                  <Text
                    className="ml-3 font-medium"
                    style={{ color: Colors.status.rejected }}
                  >
                    This campaign has ended
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className="rounded-t-3xl p-6"
            style={{ backgroundColor: Colors.white }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text
                className="text-xl font-bold"
                style={{ color: Colors.darkBlue }}
              >
                Edit Submission
              </Text>
              <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <Text className="text-sm mb-2" style={{ color: Colors.gray[600] }}>
              Video URL
            </Text>
            <View className="relative mb-6">
              <TextInput
                value={editUrl}
                onChangeText={setEditUrl}
                placeholder="Enter video URL"
                className="p-4 pr-12 rounded-xl"
                style={{
                  backgroundColor: Colors.gray[100],
                  color: Colors.gray[800],
                }}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {editUrl.length > 0 && (
                <TouchableOpacity
                  onPress={() => setEditUrl("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={Colors.gray[400]}
                  />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSaveEdit}
              className="p-4 rounded-xl"
              style={{ backgroundColor: Colors.lightBlue }}
            >
              <Text className="text-center font-bold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Video Player Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={videoModalVisible}
        onRequestClose={handleCloseVideo}
      >
        <View className="flex-1" style={{ backgroundColor: Colors.black }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 pt-12">
            <Text className="text-white text-lg font-semibold">
              Example Video
            </Text>
            <TouchableOpacity
              onPress={handleCloseVideo}
              className="w-10 h-10 rounded-full items-center justify-center"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              <Ionicons name="close" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Video Player - Full Screen */}
          <View className="flex-1">
            <VideoView
              player={player}
              style={{ width: "100%", height: "100%" }}
              contentFit="contain"
              nativeControls
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
