import { Colors } from "@/constants/Colors";
import {
  cardShadowStyle,
  formatDateTime,
  getStatusColor,
  getStatusIcon,
} from "@/lib/utils";
import { useCreatorStore } from "@/stores/creatorStore";
import { Submission } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface SubmissionItemProps {
  submission: Submission;
  onEdit: (submission: Submission) => void;
}

export function SubmissionItem({ submission, onEdit }: SubmissionItemProps) {
  const campaign = useCreatorStore((state) =>
    state.campaigns.find((c) => c.id === submission.campaignId),
  );

  return (
    <View
      className="mx-4 mb-3 p-4 rounded-xl"
      style={{
        backgroundColor: Colors.white,
        ...cardShadowStyle,
      }}
    >
      <View className="flex-row items-center justify-between">
        {/* Left: Brand, Status, Platform & Date */}
        <View className="flex-1">
          <Text
            className="text-base font-bold mb-2"
            style={{ color: Colors.darkBlue }}
            numberOfLines={1}
          >
            {campaign?.brandName || "Unknown Brand"}
          </Text>
          <View className="flex-row items-center">
            <View
              className="flex-row items-center px-2 py-0.5 rounded-full mr-2"
              style={{
                backgroundColor: `${getStatusColor(submission.status)}15`,
              }}
            >
              <Ionicons
                name={getStatusIcon(submission.status)}
                size={12}
                color={getStatusColor(submission.status)}
              />
              <Text
                className="text-xs font-semibold ml-1 capitalize"
                style={{ color: getStatusColor(submission.status) }}
              >
                {submission.status}
              </Text>
            </View>
            <Ionicons
              name={
                submission.platform === "instagram"
                  ? "logo-instagram"
                  : "logo-tiktok"
              }
              size={14}
              color={Colors.lightBlue}
            />
            <Text
              className="text-xs ml-1 capitalize mr-2"
              style={{ color: Colors.gray[500] }}
            >
              {submission.platform}
            </Text>
            <Text className="text-xs" style={{ color: Colors.gray[400] }}>
              {formatDateTime(submission.submittedAt)}
            </Text>
          </View>
        </View>

        {/* Right: Edit Button */}
        <TouchableOpacity
          onPress={() => onEdit(submission)}
          className="ml-3 w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: Colors.lightBlue }}
        >
          <Ionicons name="pencil" size={18} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
