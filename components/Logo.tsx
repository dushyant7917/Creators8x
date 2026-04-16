import { Colors } from "@/constants/Colors";
import { Text, View } from "react-native";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

export function Logo({ size = "medium" }: LogoProps) {
  const fontSize = size === "small" ? 20 : size === "medium" ? 28 : 36;

  return (
    <View className="flex-row items-center">
      <Text
        style={{
          fontSize,
          fontWeight: "900",
          color: Colors.white,
          letterSpacing: -1,
        }}
      >
        8x
      </Text>
    </View>
  );
}
