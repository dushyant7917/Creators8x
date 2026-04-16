import { Logo } from "@/components/Logo";
import { MenuItem } from "@/components/MenuItem";
import { Colors } from "@/constants/Colors";
import { useCreatorStore } from "@/stores/creatorStore";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    Modal,
    SafeAreaView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function MenuScreen() {
  const [bankModalVisible, setBankModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [profileName, setProfileName] = useState("");
  const [profileEmail, setProfileEmail] = useState("");
  const [profilePhone, setProfilePhone] = useState("");

  const user = useCreatorStore((state) => state.user);
  const connectInstagram = useCreatorStore((state) => state.connectInstagram);
  const connectTikTok = useCreatorStore((state) => state.connectTikTok);
  const updateBankDetails = useCreatorStore((state) => state.updateBankDetails);
  const updateUser = useCreatorStore((state) => state.updateUser);
  const logout = useCreatorStore((state) => state.logout);

  const handleConnectInstagram = () => {
    if (user.instagramConnected) {
      Alert.alert("Instagram", "Your Instagram account is already connected!");
    } else {
      connectInstagram();
      Alert.alert("Success", "Instagram account connected successfully!");
    }
  };

  const handleConnectTikTok = () => {
    if (user.tiktokConnected) {
      Alert.alert("TikTok", "Your TikTok account is already connected!");
    } else {
      connectTikTok();
      Alert.alert("Success", "TikTok account connected successfully!");
    }
  };

  const handleUpdateProfile = () => {
    setProfileName(user.name);
    setProfileEmail(user.email);
    setProfilePhone(user.phone);
    setProfileModalVisible(true);
  };

  const handleSaveProfile = () => {
    if (profileName.trim() && profileEmail.trim() && profilePhone.trim()) {
      updateUser({
        name: profileName.trim(),
        email: profileEmail.trim(),
        phone: profilePhone.trim(),
      });
      setProfileModalVisible(false);
      Alert.alert("Success", "Profile updated successfully!");
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  const handleUpdateBankDetails = () => {
    if (user.bankDetails) {
      setAccountNumber(user.bankDetails.accountNumber);
      setRoutingNumber(user.bankDetails.routingNumber);
      setAccountName(user.bankDetails.accountName);
    }
    setBankModalVisible(true);
  };

  const handleSaveBankDetails = () => {
    if (accountNumber.trim() && routingNumber.trim() && accountName.trim()) {
      updateBankDetails({
        accountNumber: accountNumber.trim(),
        routingNumber: routingNumber.trim(),
        accountName: accountName.trim(),
      });
      setBankModalVisible(false);
      Alert.alert("Success", "Bank details updated successfully!");
    } else {
      Alert.alert("Error", "Please fill in all fields");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          Alert.alert("Logged Out", "You have been logged out successfully");
        },
      },
    ]);
  };

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
          Manage your account
        </Text>
      </View>

      {/* Content */}
      <View
        className="flex-1 rounded-t-3xl pt-6"
        style={{ backgroundColor: Colors.gray[100] }}
      >
        {/* Menu Items */}
        <MenuItem
          icon="logo-instagram"
          label="Connect Instagram"
          onPress={handleConnectInstagram}
          completed={user.instagramConnected}
        />
        <MenuItem
          icon="logo-tiktok"
          label="Connect TikTok"
          onPress={handleConnectTikTok}
          completed={user.tiktokConnected}
        />
        <MenuItem
          icon="person"
          label="Update Profile"
          onPress={handleUpdateProfile}
          completed={!!user.name && !!user.email && !!user.phone}
        />
        <MenuItem
          icon="card"
          label="Update Bank Details"
          onPress={handleUpdateBankDetails}
          completed={!!user.bankDetails}
        />
        <MenuItem
          icon="log-out"
          label="Logout"
          onPress={handleLogout}
          destructive
        />
      </View>

      {/* Bank Details Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={bankModalVisible}
        onRequestClose={() => setBankModalVisible(false)}
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
                Bank Details
              </Text>
              <TouchableOpacity onPress={() => setBankModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <Text className="text-sm mb-2" style={{ color: Colors.gray[600] }}>
              Account Holder Name
            </Text>
            <TextInput
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Enter account holder name"
              className="p-4 rounded-xl mb-4"
              style={{
                backgroundColor: Colors.gray[100],
                color: Colors.gray[800],
              }}
            />

            <Text className="text-sm mb-2" style={{ color: Colors.gray[600] }}>
              Account Number
            </Text>
            <TextInput
              value={accountNumber}
              onChangeText={setAccountNumber}
              placeholder="Enter account number"
              className="p-4 rounded-xl mb-4"
              style={{
                backgroundColor: Colors.gray[100],
                color: Colors.gray[800],
              }}
              keyboardType="number-pad"
            />

            <Text className="text-sm mb-2" style={{ color: Colors.gray[600] }}>
              Routing Number
            </Text>
            <TextInput
              value={routingNumber}
              onChangeText={setRoutingNumber}
              placeholder="Enter routing number"
              className="p-4 rounded-xl mb-6"
              style={{
                backgroundColor: Colors.gray[100],
                color: Colors.gray[800],
              }}
              keyboardType="number-pad"
            />

            <TouchableOpacity
              onPress={handleSaveBankDetails}
              className="p-4 rounded-xl"
              style={{ backgroundColor: Colors.lightBlue }}
            >
              <Text className="text-center font-bold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={profileModalVisible}
        onRequestClose={() => setProfileModalVisible(false)}
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
                Update Profile
              </Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.gray[500]} />
              </TouchableOpacity>
            </View>

            <Text className="text-sm mb-2" style={{ color: Colors.gray[600] }}>
              Display Name
            </Text>
            <TextInput
              value={profileName}
              onChangeText={setProfileName}
              placeholder="Enter your name"
              className="p-4 rounded-xl mb-4"
              style={{
                backgroundColor: Colors.gray[100],
                color: Colors.gray[800],
              }}
            />

            <Text className="text-sm mb-2" style={{ color: Colors.gray[600] }}>
              Email
            </Text>
            <TextInput
              value={profileEmail}
              onChangeText={setProfileEmail}
              placeholder="Enter your email"
              className="p-4 rounded-xl mb-4"
              style={{
                backgroundColor: Colors.gray[100],
                color: Colors.gray[800],
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text className="text-sm mb-2" style={{ color: Colors.gray[600] }}>
              Phone Number
            </Text>
            <TextInput
              value={profilePhone}
              onChangeText={setProfilePhone}
              placeholder="Enter your phone number"
              className="p-4 rounded-xl mb-6"
              style={{
                backgroundColor: Colors.gray[100],
                color: Colors.gray[800],
              }}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              onPress={handleSaveProfile}
              className="p-4 rounded-xl"
              style={{ backgroundColor: Colors.lightBlue }}
            >
              <Text className="text-center font-bold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
