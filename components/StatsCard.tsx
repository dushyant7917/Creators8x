import { Colors } from "@/constants/Colors";
import { Text, View } from "react-native";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "earnings";
}

export function StatsCard({
  title,
  value,
  subtitle,
  variant = "default",
}: StatsCardProps) {
  const isEarnings = variant === "earnings";

  return (
    <View
      className="p-4 rounded-xl flex-1"
      style={{
        backgroundColor: isEarnings ? Colors.lightBlue : Colors.white,
        minHeight: 100,
        shadowColor: Colors.darkBlue,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isEarnings ? 0 : 0.1,
        shadowRadius: 8,
        elevation: isEarnings ? 0 : 4,
      }}
    >
      <Text
        className="text-xs mb-2"
        style={{
          color: isEarnings ? "rgba(255,255,255,0.8)" : Colors.gray[500],
        }}
      >
        {title}
      </Text>
      <Text
        className="text-2xl font-bold"
        style={{ color: isEarnings ? Colors.white : Colors.darkBlue }}
      >
        {value}
      </Text>
      {subtitle && (
        <Text
          className="text-xs mt-1"
          style={{
            color: isEarnings ? "rgba(255,255,255,0.6)" : Colors.gray[400],
          }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );
}
