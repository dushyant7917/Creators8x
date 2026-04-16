import { Colors } from "@/constants/Colors";
import { SubmissionStatus } from "@/types";

/**
 * Map brand name to local image file
 */
export const getBrandImage = (brandName: string, fallbackUri?: string) => {
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
  return brandImages[brandKey] || { uri: fallbackUri };
};

/**
 * Get color for submission status
 */
export const getStatusColor = (status: SubmissionStatus | string) => {
  switch (status) {
    case "approved":
      return Colors.status.approved;
    case "rejected":
      return Colors.status.rejected;
    default:
      return Colors.status.pending;
  }
};

/**
 * Get icon name for submission status
 */
export const getStatusIcon = (status: SubmissionStatus | string) => {
  switch (status) {
    case "approved":
      return "checkmark-circle";
    case "rejected":
      return "close-circle";
    default:
      return "time";
  }
};

/**
 * Standard card shadow style
 */
export const cardShadowStyle = {
  shadowColor: Colors.darkBlue,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 8,
  elevation: 4,
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Format date with time for display
 */
export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Calculate days until deadline
 */
export const getDaysUntilDeadline = (deadline: string) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
