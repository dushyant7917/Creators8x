import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  showBadge?: boolean;
  badgeText?: string;
  destructive?: boolean;
  completed?: boolean;
}

export function MenuItem({
  icon,
  label,
  onPress,
  showBadge,
  badgeText,
  destructive = false,
  completed = false,
}: MenuItemProps) {
  const getIconColor = () => {
    if (destructive) return Colors.status.rejected;
    if (completed) return Colors.status.approved;
    return Colors.lightBlue;
  };

  const getBgColor = () => {
    if (destructive) return `${Colors.status.rejected}20`;
    if (completed) return `${Colors.status.approved}20`;
    return `${Colors.lightBlue}20`;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between mx-4 mb-3 p-4 rounded-xl"
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
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: getBgColor() }}
        >
          <Ionicons name={icon} size={20} color={getIconColor()} />
        </View>
        <Text
          className="text-base font-medium ml-3"
          style={{
            color: destructive ? Colors.status.rejected : Colors.gray[800],
          }}
        >
          {label}
        </Text>
      </View>
      <View className="flex-row items-center">
        {showBadge && badgeText && (
          <View
            className="px-2 py-1 rounded-full mr-2"
            style={{ backgroundColor: Colors.status.approved }}
          >
            <Text
              className="text-xs font-medium"
              style={{ color: Colors.white }}
            >
              {badgeText}
            </Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
      </View>
    </TouchableOpacity>
  );
}
