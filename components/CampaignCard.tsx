import { Colors } from "@/constants/Colors";
import {
  cardShadowStyle,
  formatDate,
  getBrandImage,
  getDaysUntilDeadline,
} from "@/lib/utils";
import { Campaign } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text, TouchableOpacity, View } from "react-native";

interface CampaignCardProps {
  campaign: Campaign;
  onPress: () => void;
}

export function CampaignCard({ campaign, onPress }: CampaignCardProps) {
  const daysLeft = getDaysUntilDeadline(campaign.deadline);
  const isUrgent = daysLeft < 7 && daysLeft > 0;
  const isExpired = daysLeft <= 0;

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
        ...cardShadowStyle,
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
