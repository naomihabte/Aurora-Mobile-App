import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Water Consumption History</Text>
      <Text style={styles.description}>
        This is where you will see your past hydration data.
      </Text>
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
    fontSize: 24,
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
});

export default HistoryScreen;
