import { Logo } from "@/components/Logo";
import { SubmissionItem } from "@/components/SubmissionItem";
import { Colors } from "@/constants/Colors";
import { useCreatorStore } from "@/stores/creatorStore";
import { Campaign, Submission } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { BarChart } from "react-native-gifted-charts";

type TabType = "earnings" | "campaigns" | "submissions";
type TimeFilterType = "1month" | "3months" | "6months" | "1year";

export default function MeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("earnings");
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("3months");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(
    null,
  );
  const [editUrl, setEditUrl] = useState("");

  const campaigns = useCreatorStore((state) => state.campaigns);
  const submissions = useCreatorStore((state) => state.submissions);
  const editSubmission = useCreatorStore((state) => state.editSubmission);

  // Memoize derived data to prevent infinite loops
  const campaignsWithSubmissions = useMemo(() => {
    const campaignIds = [...new Set(submissions.map((s) => s.campaignId))];
    return campaignIds.map((id) => {
      const campaign = campaigns.find((c) => c.id === id)!;
      const submissionCount = submissions.filter(
        (s) => s.campaignId === id,
      ).length;
      return { campaign, submissionCount };
    });
  }, [campaigns, submissions]);

  const sortedSubmissions = useMemo(() => {
    return [...submissions].sort((a, b) => {
      return (
        new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    });
  }, [submissions]);

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
    }
  };

  const handleCampaignPress = (campaign: Campaign) => {
    router.push(`/campaign/${campaign.id}` as any);
  };

  // Dummy stats for display
  const dummyStats = {
    totalSubmissions: 24,
    totalCampaigns: 8,
    approvedSubmissions: 18,
    pendingSubmissions: 4,
    rejectedSubmissions: 2,
    totalEarnings: 1250,
  };

  // Dummy chart data based on time filter
  const getChartData = () => {
    const dataMap = {
      "1month": [
        { value: 250, label: "W1", frontColor: Colors.status.approved },
        { value: 180, label: "W2", frontColor: Colors.status.approved },
        { value: 320, label: "W3", frontColor: Colors.status.approved },
        { value: 200, label: "W4", frontColor: Colors.status.approved },
      ],
      "3months": [
        { value: 180, label: "Jan", frontColor: Colors.status.approved },
        { value: 250, label: "Feb", frontColor: Colors.status.approved },
        { value: 320, label: "Mar", frontColor: Colors.status.approved },
      ],
      "6months": [
        { value: 150, label: "Oct", frontColor: Colors.status.approved },
        { value: 200, label: "Nov", frontColor: Colors.status.approved },
        { value: 180, label: "Dec", frontColor: Colors.status.approved },
        { value: 250, label: "Jan", frontColor: Colors.status.approved },
        { value: 320, label: "Feb", frontColor: Colors.status.approved },
        { value: 150, label: "Mar", frontColor: Colors.status.approved },
      ],
      "1year": [
        { value: 80, label: "Apr", frontColor: Colors.status.approved },
        { value: 120, label: "May", frontColor: Colors.status.approved },
        { value: 150, label: "Jun", frontColor: Colors.status.approved },
        { value: 200, label: "Jul", frontColor: Colors.status.approved },
        { value: 180, label: "Aug", frontColor: Colors.status.approved },
        { value: 220, label: "Sep", frontColor: Colors.status.approved },
        { value: 150, label: "Oct", frontColor: Colors.status.approved },
        { value: 200, label: "Nov", frontColor: Colors.status.approved },
        { value: 180, label: "Dec", frontColor: Colors.status.approved },
        { value: 250, label: "Jan", frontColor: Colors.status.approved },
        { value: 320, label: "Feb", frontColor: Colors.status.approved },
        { value: 150, label: "Mar", frontColor: Colors.status.approved },
      ],
    };
    return dataMap[timeFilter];
  };

  const timeFilterOptions: { key: TimeFilterType; label: string }[] = [
    { key: "1month", label: "1M" },
    { key: "3months", label: "3M" },
    { key: "6months", label: "6M" },
    { key: "1year", label: "1Y" },
  ];

  const renderEarningsTab = () => (
    <ScrollView className="px-4 pt-4" showsVerticalScrollIndicator={false}>
      {/* Main Earnings Card */}
      <View
        className="mb-4 p-6 rounded-2xl"
        style={{
          backgroundColor: Colors.darkBlue,
          shadowColor: Colors.darkBlue,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <View className="flex-row justify-between items-start">
          <View>
            <Text
              className="text-sm mb-1"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Total Earnings
            </Text>
            <Text className="text-4xl font-bold text-white">
              ${dummyStats.totalEarnings.toLocaleString()}
            </Text>
          </View>
          <View
            className="px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
          >
            <Text className="text-xs text-white font-medium">
              {dummyStats.totalCampaigns} Campaigns
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Row */}
      <View className="flex-row mb-4">
        <View className="flex-1 mr-2">
          <View
            className="p-4 rounded-xl"
            style={{
              backgroundColor: Colors.white,
              shadowColor: Colors.darkBlue,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${Colors.status.approved}15` }}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={Colors.status.approved}
                />
              </View>
              <View>
                <Text
                  className="text-2xl font-bold"
                  style={{ color: Colors.darkBlue }}
                >
                  {dummyStats.approvedSubmissions}
                </Text>
                <Text className="text-xs" style={{ color: Colors.gray[500] }}>
                  Approved
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-1 mr-2">
          <View
            className="p-4 rounded-xl"
            style={{
              backgroundColor: Colors.white,
              shadowColor: Colors.darkBlue,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${Colors.status.pending}15` }}
              >
                <Ionicons name="time" size={20} color={Colors.status.pending} />
              </View>
              <View>
                <Text
                  className="text-2xl font-bold"
                  style={{ color: Colors.darkBlue }}
                >
                  {dummyStats.pendingSubmissions}
                </Text>
                <Text className="text-xs" style={{ color: Colors.gray[500] }}>
                  Pending
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-1">
          <View
            className="p-4 rounded-xl"
            style={{
              backgroundColor: Colors.white,
              shadowColor: Colors.darkBlue,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <View className="flex-row items-center">
              <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: `${Colors.status.rejected}15` }}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={Colors.status.rejected}
                />
              </View>
              <View>
                <Text
                  className="text-2xl font-bold"
                  style={{ color: Colors.darkBlue }}
                >
                  {dummyStats.rejectedSubmissions}
                </Text>
                <Text className="text-xs" style={{ color: Colors.gray[500] }}>
                  Rejected
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Chart Section */}
      <View
        className="p-5 rounded-2xl mb-8"
        style={{
          backgroundColor: Colors.white,
          shadowColor: Colors.darkBlue,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        {/* Chart Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text
            className="text-lg font-bold"
            style={{ color: Colors.darkBlue }}
          >
            Earnings Overview
          </Text>
          {/* Time Filter */}
          <View
            className="flex-row"
            style={{ backgroundColor: Colors.gray[100], borderRadius: 8 }}
          >
            {timeFilterOptions.map((option) => (
              <TouchableOpacity
                key={option.key}
                onPress={() => setTimeFilter(option.key)}
                className="px-3 py-1.5"
                style={{
                  backgroundColor:
                    timeFilter === option.key
                      ? Colors.lightBlue
                      : "transparent",
                  borderRadius: 8,
                }}
              >
                <Text
                  className="text-xs font-semibold"
                  style={{
                    color:
                      timeFilter === option.key
                        ? Colors.white
                        : Colors.gray[500],
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bar Chart */}
        <BarChart
          data={getChartData()}
          width={280}
          height={180}
          barWidth={timeFilter === "1year" ? 16 : 28}
          spacing={timeFilter === "1year" ? 8 : 16}
          roundedTop
          roundedBottom
          hideRules
          yAxisColor={Colors.gray[300]}
          xAxisColor={Colors.gray[300]}
          yAxisTextStyle={{ color: Colors.gray[500], fontSize: 10 }}
          xAxisLabelTextStyle={{ color: Colors.gray[500], fontSize: 10 }}
          noOfSections={4}
          maxValue={400}
          yAxisLabelPrefix="$"
        />

        {/* Legend */}
        <View
          className="flex-row justify-center mt-4 pt-4"
          style={{ borderTopWidth: 1, borderTopColor: Colors.gray[100] }}
        >
          <View className="flex-row items-center mr-6">
            <View
              className="w-3 h-3 rounded-sm mr-2"
              style={{ backgroundColor: Colors.status.approved }}
            />
            <Text className="text-xs" style={{ color: Colors.gray[500] }}>
              Earnings
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  // Map brand name to local image file (same as CampaignCard)
  const getBrandImage = (brandName: string, brandImage: string) => {
    const brandKey = brandName.toLowerCase().replace(/[^a-z0-9]/g, "");
    const brandImages: Record<string, any> = {
      nike: require("@/assets/images/brands/nike.webp"),
      sephora: require("@/assets/images/brands/sephora.webp"),
      gymshark: require("@/assets/images/brands/gymshark.webp"),
      starbucks: require("@/assets/images/brands/starbucks.webp"),
      apple: require("@/assets/images/brands/apple.webp"),
      adidas: require("@/assets/images/brands/adidas.webp"),
      loreal: require("@/assets/images/brands/loreal.webp"),
      cocacola: require("@/assets/images/brands/coca-cola.webp"),
    };
    return brandImages[brandKey] || { uri: brandImage };
  };

  const renderCampaignsTab = () => (
    <FlatList
      data={campaignsWithSubmissions}
      keyExtractor={(item) => item.campaign.id}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleCampaignPress(item.campaign)}
          className="mx-4 mb-3 p-4 rounded-xl"
          style={{
            backgroundColor: Colors.white,
            shadowColor: Colors.darkBlue,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center">
            <View
              className="w-16 h-16 rounded-xl overflow-hidden"
              style={{ backgroundColor: Colors.gray[100] }}
            >
              <Image
                source={getBrandImage(
                  item.campaign.brandName,
                  item.campaign.brandImage,
                )}
                style={{ width: "100%", height: "100%" }}
                contentFit="contain"
              />
            </View>
            <View className="ml-4 flex-1">
              <Text
                className="text-base font-bold"
                style={{ color: Colors.darkBlue }}
              >
                {item.campaign.brandName}
              </Text>
              <Text
                className="text-sm mt-1"
                style={{ color: Colors.gray[500] }}
              >
                {item.submissionCount} video
                {item.submissionCount > 1 ? "s" : ""} submitted
              </Text>
              <View className="flex-row items-center mt-2">
                <Ionicons name="videocam" size={14} color={Colors.lightBlue} />
                <Text
                  className="text-xs ml-1"
                  style={{ color: Colors.lightBlue }}
                >
                  Max {item.campaign.maxVideos} videos
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.gray[400]}
            />
          </View>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-20">
          <Text style={{ color: Colors.gray[500] }}>No campaigns yet</Text>
        </View>
      }
    />
  );

  const renderSubmissionsTab = () => (
    <FlatList
      data={sortedSubmissions}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ paddingTop: 16, paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <SubmissionItem submission={item} onEdit={handleEditSubmission} />
      )}
      ListEmptyComponent={
        <View className="flex-1 items-center justify-center py-20">
          <Text style={{ color: Colors.gray[500] }}>No submissions yet</Text>
        </View>
      }
    />
  );

  const user = useCreatorStore((state) => state.user);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors.lightBlue }}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.lightBlue} />

      {/* Header */}
      <View className="px-4 py-4 pt-8">
        <Logo size="large" />
        <Text className="text-white text-sm mt-2 opacity-80">
          Track your performance
        </Text>
      </View>

      {/* Content */}
      <View
        className="flex-1 rounded-t-3xl"
        style={{ backgroundColor: Colors.gray[100] }}
      >
        {/* User Info Card */}
        <View
          className="mx-4 mt-4 mb-2 p-4 rounded-xl"
          style={{
            backgroundColor: Colors.white,
            shadowColor: Colors.darkBlue,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center">
            {user.avatar ? (
              <Image
                source={user.avatar}
                style={{ width: 64, height: 64, borderRadius: 32 }}
                contentFit="cover"
              />
            ) : (
              <View
                className="w-16 h-16 rounded-full items-center justify-center"
                style={{ backgroundColor: Colors.lightBlue }}
              >
                <Text className="text-2xl font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View className="ml-4 flex-1">
              <Text
                className="text-lg font-bold"
                style={{ color: Colors.darkBlue }}
              >
                {user.name}
              </Text>
              <Text className="text-sm" style={{ color: Colors.gray[500] }}>
                {user.email}
              </Text>
              <Text
                className="text-sm mt-1"
                style={{ color: Colors.gray[500] }}
              >
                {user.phone}
              </Text>
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View
          className="flex-row border-b"
          style={{ borderBottomColor: Colors.gray[200] }}
        >
          <TouchableOpacity
            onPress={() => setActiveTab("earnings")}
            className="flex-1 py-4"
            style={{
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === "earnings" ? Colors.lightBlue : "transparent",
            }}
          >
            <Text
              className="text-center font-semibold"
              style={{
                color:
                  activeTab === "earnings"
                    ? Colors.lightBlue
                    : Colors.gray[500],
              }}
            >
              Earnings
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("campaigns")}
            className="flex-1 py-4"
            style={{
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === "campaigns" ? Colors.lightBlue : "transparent",
            }}
          >
            <Text
              className="text-center font-semibold"
              style={{
                color:
                  activeTab === "campaigns"
                    ? Colors.lightBlue
                    : Colors.gray[500],
              }}
            >
              Campaigns
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab("submissions")}
            className="flex-1 py-4"
            style={{
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === "submissions" ? Colors.lightBlue : "transparent",
            }}
          >
            <Text
              className="text-center font-semibold"
              style={{
                color:
                  activeTab === "submissions"
                    ? Colors.lightBlue
                    : Colors.gray[500],
              }}
            >
              Submissions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "earnings" && renderEarningsTab()}
        {activeTab === "campaigns" && renderCampaignsTab()}
        {activeTab === "submissions" && renderSubmissionsTab()}
      </View>

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
    </SafeAreaView>
  );
}
