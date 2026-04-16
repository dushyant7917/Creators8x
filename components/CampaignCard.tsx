import { Colors } from "@/constants/Colors";
import { Campaign } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

interface CampaignCardProps {
  campaign: Campaign;
  onPress: () => void;
}

export function CampaignCard({ campaign, onPress }: CampaignCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const daysUntilDeadline = () => {
    const today = new Date();
    const deadline = new Date(campaign.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = daysUntilDeadline();
  const isUrgent = daysLeft < 7 && daysLeft > 0;
  const isExpired = daysLeft <= 0;

  // Map brand name to local image file
  const getBrandImage = (brandName: string) => {
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
    return brandImages[brandKey] || { uri: campaign.brandImage };
  };

  const getStatusColor = () => {
    if (isExpired) return Colors.status.rejected;
    if (isUrgent) return Colors.status.rejected;
    return Colors.status.approved;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mx-4 mb-4 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: Colors.white,
        shadowColor: Colors.darkBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
      {/* Top Section with Brand and Payout */}
      <View className="p-4 pb-3">
        <View className="flex-row items-center">
          <View
            className="w-14 h-14 rounded-xl overflow-hidden items-center justify-center"
            style={{ backgroundColor: `${Colors.lightBlue}15` }}
          >
            <Image
              source={getBrandImage(campaign.brandName)}
              style={{ width: 56, height: 56 }}
              contentFit="cover"
            />
          </View>
          <View className="ml-3 flex-1">
            <Text
              className="text-xl font-bold"
              style={{ color: Colors.darkBlue }}
            >
              {campaign.brandName}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons
                name={isExpired ? "time-outline" : "flash-outline"}
                size={14}
                color={getStatusColor()}
              />
              <Text
                className="text-xs ml-1 font-medium"
                style={{ color: getStatusColor() }}
              >
                {isExpired
                  ? "Expired"
                  : isUrgent
                    ? `${daysLeft} days left`
                    : `${daysLeft} days left`}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text
              className="text-2xl font-bold"
              style={{ color: Colors.lightBlue }}
            >
              ${campaign.payoutPerVideo}
            </Text>
            <Text className="text-xs" style={{ color: Colors.gray[500] }}>
              per video
            </Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: Colors.gray[100] }} />

      {/* Bottom Section with Details */}
      <View className="p-4 pt-3">
        <View className="flex-row justify-between">
          {/* Deadline */}
          <View className="flex-row items-center flex-1">
            <Ionicons
              name="calendar-outline"
              size={18}
              color={Colors.lightBlue}
            />
            <View className="ml-2">
              <Text
                className="text-xs font-medium"
                style={{ color: Colors.gray[500] }}
              >
                Deadline
              </Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: Colors.gray[800] }}
              >
                {formatDate(campaign.deadline)}
              </Text>
            </View>
          </View>

          {/* Max Videos - Aligned to RHS */}
          <View className="flex-row items-center justify-end flex-1">
            <Ionicons
              name="videocam-outline"
              size={18}
              color={Colors.lightBlue}
            />
            <View className="ml-2 items-start">
              <Text
                className="text-xs font-medium"
                style={{ color: Colors.gray[500] }}
              >
                Max Videos
              </Text>
              <Text
                className="text-sm font-semibold"
                style={{ color: Colors.gray[800] }}
              >
                {campaign.maxVideos} videos
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Urgency Indicator Bar */}
      {(isUrgent || isExpired) && (
        <View
          style={{
            height: 4,
            backgroundColor: getStatusColor(),
          }}
        />
      )}
    </TouchableOpacity>
  );
}
