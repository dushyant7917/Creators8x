import { Colors } from "@/constants/Colors";
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = () => {
    switch (submission.status) {
      case "approved":
        return Colors.status.approved;
      case "rejected":
        return Colors.status.rejected;
      default:
        return Colors.status.pending;
    }
  };

  const getStatusIcon = () => {
    switch (submission.status) {
      case "approved":
        return "checkmark-circle";
      case "rejected":
        return "close-circle";
      default:
        return "time";
    }
  };

  return (
    <View
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
              style={{ backgroundColor: `${getStatusColor()}15` }}
            >
              <Ionicons
                name={getStatusIcon()}
                size={12}
                color={getStatusColor()}
              />
              <Text
                className="text-xs font-semibold ml-1 capitalize"
                style={{ color: getStatusColor() }}
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
              {formatDate(submission.submittedAt)}
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
