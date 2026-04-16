import { Colors } from "@/constants/Colors";
import { SortBy, SortOrder } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface CampaignFilterProps {
  sortBy: SortBy;
  order: SortOrder;
  onChange: (sortBy: SortBy, order: SortOrder) => void;
}

type FilterOption = {
  label: string;
  sortBy: SortBy;
  order: SortOrder;
};

const filterOptions: FilterOption[] = [
  { label: "Deadline (Soonest)", sortBy: "deadline", order: "asc" },
  { label: "Deadline (Latest)", sortBy: "deadline", order: "desc" },
  { label: "Payout (High → Low)", sortBy: "payout", order: "desc" },
  { label: "Payout (Low → High)", sortBy: "payout", order: "asc" },
];

export function CampaignFilter({
  sortBy,
  order,
  onChange,
}: CampaignFilterProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const getCurrentLabel = () => {
    const option = filterOptions.find(
      (o) => o.sortBy === sortBy && o.order === order,
    );
    return option?.label || "Deadline (Soonest)";
  };

  const handleSelect = (option: FilterOption) => {
    onChange(option.sortBy, option.order);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center justify-between mx-4 mb-4 px-4 py-3 rounded-lg"
        style={{ backgroundColor: Colors.darkBlue }}
      >
        <Text className="text-sm font-medium" style={{ color: Colors.white }}>
          Sort By: {getCurrentLabel()}
        </Text>
        <Ionicons name="chevron-down" size={20} color={Colors.white} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <View
            className="rounded-t-3xl p-6"
            style={{ backgroundColor: Colors.white }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text
                className="text-xl font-bold"
                style={{ color: Colors.darkBlue }}
              >
                Sort Campaigns
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.gray[500]} />
              </TouchableOpacity>
            </View>

            {filterOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(option)}
                className="py-4 border-b"
                style={{ borderBottomColor: Colors.gray[200] }}
              >
                <View className="flex-row justify-between items-center">
                  <Text
                    className="text-base"
                    style={{
                      color:
                        sortBy === option.sortBy && order === option.order
                          ? Colors.lightBlue
                          : Colors.gray[700],
                      fontWeight:
                        sortBy === option.sortBy && order === option.order
                          ? "700"
                          : "400",
                    }}
                  >
                    {option.label}
                  </Text>
                  {sortBy === option.sortBy && order === option.order && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={Colors.lightBlue}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
}
