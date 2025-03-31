import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { database } from "../../firebaseConfig";
import { ref, get } from "firebase/database";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

let lastNotificationTime = 0; // Prevents duplicate notifications

// Configure Notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Request Permission for Notifications
async function registerForPushNotifications() {
  if (Platform.OS === "web") {
    console.log("🚫 Web push notifications are disabled.");
    return;
  }

  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") {
      console.log("Notification permission denied");
      return;
    }
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log("Expo Push Token:", token);
}

const HomeScreen = () => {
  const [latestConsumption, setLatestConsumption] = useState(null);
  const [dailyTotal, setDailyTotal] = useState(0);
  const dailyGoal = 500; // Daily goal in mL

  useEffect(() => {
    registerForPushNotifications();

    console.log("Syncing data every 5 seconds...");

    const fetchLatestConsumption = async () => {
      const bottleRef = ref(database, "bottle");
      const snapshot = await get(bottleRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        const entries = Object.values(data);
        const latestEntry = entries[entries.length - 1];

        console.log("Latest Consumption:", latestEntry);
        setLatestConsumption(latestEntry);

        calculateDailyTotal(entries);
        checkLowWaterIntake(entries);
      } else {
        console.log("No data found in Firebase.");
      }
    };

    const interval = setInterval(() => {
      fetchLatestConsumption();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Calculate total water intake for today
  async function calculateDailyTotal(entries) {
    const today = new Date().toDateString();
    let total = 0;

    entries.forEach((entry) => {
      const entryDate = new Date(entry.timestamp).toDateString();
      if (entryDate === today) {
        total += entry.volume_drank;
      }
    });

    setDailyTotal(total);
  }

  // Check low water intake in the past 3 hours
  async function checkLowWaterIntake(entries) {
    const threeHoursAgo = Date.now() - 3 * 60 * 60 * 1000;
    let totalWater = 0;

    entries.forEach(entry => {
      const entryTime = new Date(entry.timestamp).getTime();
      if (entryTime > threeHoursAgo) {
        totalWater += entry.volume_drank;
      }
    });

    if (totalWater < 500) {
      sendLowWaterNotification();
    }
  }

  // Prevent duplicate notifications
  async function sendLowWaterNotification() {
    if (Platform.OS === "web") {
      console.log("🚫 Notifications not supported on web. Skipping.");
      return;
    }

    const currentTime = Date.now();

    if (currentTime - lastNotificationTime > 60 * 60 * 1000) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🚰 Drink More Water!",
          body: "You haven’t reached your daily hydration goal yet. Time to drink some water! 💧",
        },
        trigger: null,
      });

      console.log("📢 Notification Sent!");
      lastNotificationTime = currentTime;
    } else {
      console.log("⏳ Skipping notification (already sent recently).");
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Aurora!</Text>
      <Text style={styles.description}>
        Aurora is a smart water bottle that helps you track your hydration in real-time.
        Stay hydrated and monitor your water consumption effortlessly!
      </Text>

      {/* Hydration Goal Status */}
      <View style={styles.goalContainer}>
        <Text style={styles.sectionTitle}>Daily Hydration Status</Text>
        <Text
          style={[
            styles.goalStatus,
            {
              color:
                dailyTotal >= 500
                  ? "green"
                  : dailyTotal >= 250
                  ? "#1E90FF" // blue
                  : "red",
            },
          ]}
        >
          {dailyTotal >= 500
            ? "✅ Goal Reached!"
            : dailyTotal >= 250
            ? "🔵 You're getting there, you've met half of your goal!"
            : "⚠️ Keep Drinking!"}
        </Text>
        <Text style={styles.trackingText}>{dailyTotal.toFixed(2)} mL / 500 mL</Text>
      </View>

      {/* Add Spacing */}
      <View style={styles.spacer} />

      {/* Latest Water Consumption */}
      <Text style={styles.sectionTitle}>Live Tracking</Text>
      <View style={styles.trackingBox}>
        {latestConsumption ? (
          <>
            <Text style={styles.trackingText}>Last Drink: {latestConsumption.volume_drank} mL</Text>
            <Text style={styles.timestamp}>Time: {latestConsumption.timestamp}</Text>
          </>
        ) : (
          <Text style={styles.trackingText}>Fetching data...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#6A5ACD",
    marginBottom: 20,
  },
  goalContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 15,
    backgroundColor: "#D8BFD8",
    borderRadius: 10,
    width: "80%",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 10,
  },
  goalStatus: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  trackingText: {
    fontSize: 18,
    color: "#4B0082",
  },
  trackingBox: {
    backgroundColor: "#D8BFD8",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  timestamp: {
    fontSize: 14,
    color: "#6A5ACD",
    marginTop: 5,
  },
  spacer: {
    height: 40,
  },
});

export default HomeScreen;
