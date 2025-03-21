import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { database } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

const HomeScreen = () => {
  const [waterLevel, setWaterLevel] = useState("--");

  useEffect(() => {
    console.log(" Listening for Firebase changes...");

    const waterLevelRef = ref(database, "bottle/waterLevel");

    // Debugging logs
    onValue(waterLevelRef, (snapshot) => {
      if (snapshot.exists()) {
        console.log("✅ Water Level Updated: ", snapshot.val());
        setWaterLevel(snapshot.val());
      } else {
        console.log("No data found in Firebase.");
      }
    }, (error) => {
      console.error("Firebase Read Error: ", error);
    });

    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Aurora!</Text>
      <Text style={styles.description}>
        Aurora is a smart water bottle that helps you track your hydration in real-time.
        Stay hydrated and monitor your water consumption effortlessly!
      </Text>
      <Text style={styles.sectionTitle}>Live Tracking</Text>
      <View style={styles.trackingBox}>
        <Text style={styles.trackingText}>Water Level: {waterLevel}%</Text>
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4B0082",
    marginTop: 20,
  },
  trackingBox: {
    backgroundColor: "#D8BFD8",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  trackingText: {
    fontSize: 18,
    color: "#4B0082",
  },
});

export default HomeScreen;
