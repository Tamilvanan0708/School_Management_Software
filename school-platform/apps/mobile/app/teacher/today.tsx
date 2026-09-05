import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function TeacherTodayScreen() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.dashboard.today().then(setData).catch(() => {}); }, []);
  if (!data) return <View style={styles.container}><ActivityIndicator /></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{data.name}</Text>
      <Text style={styles.sub}>My Day</Text>

      <Text style={styles.section}>{"Schedule"} ({data.todaySchedule?.length || 0} periods)</Text>
      {data.todaySchedule?.length ? data.todaySchedule.map((s: any, i: number) => (
        <View key={i} style={styles.card}><Text>P{s.period} {"-"} {s.subject}</Text><Text style={styles.muted}>{s.class}</Text></View>
      )) : <Text style={styles.muted}>No periods today</Text>}

      <Text style={styles.section}>{"Pending Review"} ({data.pendingReview?.length || 0})</Text>
      {data.pendingReview?.map((r: any, i: number) => (
        <View key={i} style={styles.warnCard}><Text>{r.assignment}</Text><Text style={styles.due}>{r.submissions} submissions {"-"} {r.subject}</Text></View>
      ))}
      {data.pendingReview?.length ? null : <Text style={styles.muted}>Nothing pending</Text>}

      <Text style={styles.section}>{"Recent Homework"}</Text>
      {data.recentHomework?.length ? data.recentHomework.map((h: any, i: number) => (
        <View key={i} style={styles.card}><Text>{h.title}</Text><Text style={styles.muted}>{h.subject} {"-"} due {new Date(h.dueDate).toLocaleDateString()}</Text></View>
      )) : <Text style={styles.muted}>No recent homework</Text>}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold" },
  sub: { color: "#666", marginBottom: 12 },
  section: { fontSize: 16, fontWeight: "700", marginTop: 18, marginBottom: 6 },
  card: { backgroundColor: "#fff", padding: 12, borderRadius: 10, marginBottom: 6, elevation: 1 },
  warnCard: { backgroundColor: "#fff3e0", padding: 12, borderRadius: 10, marginBottom: 6, borderLeftWidth: 4, borderLeftColor: "#ff9800" },
  due: { color: "#c62828", fontSize: 12 },
  muted: { color: "#888", marginVertical: 4 },
});