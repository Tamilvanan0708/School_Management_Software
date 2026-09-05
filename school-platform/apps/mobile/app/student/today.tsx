import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function StudentTodayScreen() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.dashboard.today().then(setData).catch(() => {}); }, []);
  if (!data) return <View style={styles.container}><ActivityIndicator /></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{data.name}</Text>
      <Text style={styles.sub}>{data.className}-{data.section} · Today</Text>

      <Text style={styles.section}>📚 Today&apos;s Classes ({data.todayClasses?.length || 0})</Text>
      {data.todayClasses?.length ? data.todayClasses.map((c: any, i: number) => (
        <View key={i} style={styles.card}><Text>P{c.period} · {c.subject}{c.time ? ` · ${c.time}` : ""}</Text><Text style={styles.muted}>{c.teacher}</Text></View>
      )) : <Text style={styles.muted}>No classes today</Text>}

      <Text style={styles.section}>📝 Pending Homework ({data.pendingHomework?.length || 0})</Text>
      {data.pendingHomework?.map((h: any) => (
        <View key={h.id} style={styles.warnCard}><Text>{h.title} — {h.subject}</Text><Text style={styles.due}>Due {new Date(h.dueDate).toLocaleDateString()}</Text></View>
      ))}
      {data.pendingHomework?.length ? null : <Text style={styles.muted}>All done ✓</Text>}

      <Text style={styles.section}>📅 Upcoming Exams</Text>
      {data.upcomingExams?.map((e: any, i: number) => (
        <View key={i} style={styles.card}><Text>{e.exam} · {e.subject}</Text><Text style={styles.muted}>{new Date(e.date).toLocaleDateString()}</Text></View>
      ))}
      {data.upcomingExams?.length ? null : <Text style={styles.muted}>None scheduled</Text>}

      <Text style={styles.section}>✅ Attendance</Text>
      <View style={styles.card}><Text style={styles.big}>{data.attendancePercentage ?? '—'}%</Text></View>
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
  big: { fontSize: 28, fontWeight: "800" },
});