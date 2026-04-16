import { Colors } from "@/constants/Colors";
import "@/global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.lightBlue,
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="campaign/[id]"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
