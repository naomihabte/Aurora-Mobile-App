import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { database } from "../../firebaseConfig";
import { ref, onValue } from "firebase/database";

const HistoryScreen = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    console.log("Fetching history...");

    const historyRef = ref(database, "bottle");

    onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const historyData = Object.values(snapshot.val()).reverse();
        setTableData(historyData);
        console.log("Fetched history data:", historyData);
      } else {
        console.log("No history data found.");
        setTableData([]);
      }
    });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Water Consumption History</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>Timestamp</Text>
        <Text style={styles.headerText}>Volume (mL)</Text>
      </View>

      {tableData.length > 0 ? (
        tableData.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.cell}>{item.timestamp}</Text>
            <Text style={styles.cell}>{item.volume_drank} mL</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>No history available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E6E6FA",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4B0082",
    marginBottom: 20,
    textAlign: "center",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#D8BFD8",
    padding: 10,
    width: "100%",
    borderRadius: 5,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B0082",
    flex: 1,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 10,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#D8BFD8",
  },
  cell: {
    fontSize: 16,
    color: "#4B0082",
    flex: 1,
    textAlign: "center",
  },
  noDataText: {
    fontSize: 18,
    color: "#6A5ACD",
    marginTop: 20,
    textAlign: "center",
  },
});

export default HistoryScreen;
