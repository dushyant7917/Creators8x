import { CampaignCard } from "@/components/CampaignCard";
import { CampaignFilter } from "@/components/CampaignFilter";
import { Logo } from "@/components/Logo";
import { Colors } from "@/constants/Colors";
import { useCreatorStore } from "@/stores/creatorStore";
import { Campaign } from "@/types";
import { router } from "expo-router";
import { useMemo } from "react";
import { FlatList, SafeAreaView, StatusBar, Text, View } from "react-native";

export default function HomeScreen() {
  const allCampaigns = useCreatorStore((state) => state.campaigns);
  const filters = useCreatorStore((state) => state.filters);
  const setFilters = useCreatorStore((state) => state.setFilters);

  // Memoize filtered campaigns to prevent infinite loop
  const campaigns = useMemo(() => {
    const sorted = [...allCampaigns];
    sorted.sort((a, b) => {
      if (filters.sortBy === "deadline") {
        const dateA = new Date(a.deadline).getTime();
        const dateB = new Date(b.deadline).getTime();
        return filters.order === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        return filters.order === "asc"
          ? a.payoutPerVideo - b.payoutPerVideo
          : b.payoutPerVideo - a.payoutPerVideo;
      }
    });
    return sorted;
  }, [allCampaigns, filters.sortBy, filters.order]);

  const handleCampaignPress = (campaign: Campaign) => {
    router.push(`/campaign/${campaign.id}` as any);
  };

  const renderCampaign = ({ item }: { item: Campaign }) => (
    <CampaignCard campaign={item} onPress={() => handleCampaignPress(item)} />
  );

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
          Find campaigns and start earning
        </Text>
      </View>

      {/* Content */}
      <View
        className="flex-1 rounded-t-3xl pt-6"
        style={{ backgroundColor: Colors.gray[100] }}
      >
        <CampaignFilter
          sortBy={filters.sortBy}
          order={filters.order}
          onChange={(sortBy, order) => setFilters({ sortBy, order })}
        />

        <FlatList
          data={campaigns}
          renderItem={renderCampaign}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20">
              <Text style={{ color: Colors.gray[500] }}>
                No campaigns available
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}
