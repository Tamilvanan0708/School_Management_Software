import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function ParentTodayScreen() {
  const [data, setData] = useState<any>(null);
  useEffect(() => { api.dashboard.today().then(setData).catch(() => {}); }, []);
  if (!data) return <View style={styles.container}><ActivityIndicator /></View>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Children</Text>
      {data.children?.map((c: any) => (
        <View key={c.studentId} style={styles.childCard}>
          <Text style={styles.childName}>{c.childName} — {c.className}-{c.section}</Text>
          <View style={styles.row}>
            <View style={styles.stat}><Text style={styles.statVal}>{c.todayClasses?.length || 0}</Text><Text style={styles.statLbl}>classes</Text></View>
            <View style={styles.stat}><Text style={styles.statVal}>{c.pendingHomework?.length || 0}</Text><Text style={styles.statLbl}>homework</Text></View>
            <View style={styles.stat}><Text style={styles.statVal}>{c.attendancePercentage ?? '—'}%</Text><Text style={styles.statLbl}>attend.</Text></View>
            <View style={styles.stat}><Text style={[styles.statVal, c.pendingFees > 0 ? styles.danger : styles.safe]}>{c.pendingFees > 0 ? `₹${c.pendingFees}` : '✓'}</Text><Text style={styles.statLbl}>fees</Text></View>
          </View>
          {c.upcomingExams?.length > 0 && (
            <Text style={styles.muted}>Next exam: {c.upcomingExams[0].subject} · {new Date(c.upcomingExams[0].date).toLocaleDateString()}</Text>
          )}
          {c.pendingHomework?.map((h: any) => (
            <View key={h.id} style={styles.warn}><Text style={styles.due}>{h.subject}: {h.title}</Text></View>
          ))}
        </View>
      ))}
      {!data.children?.length && <Text style={styles.muted}>No linked children.</Text>}
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  childCard: { backgroundColor: "#fff", padding: 14, borderRadius: 12, marginBottom: 12, elevation: 2 },
  childName: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  stat: { alignItems: "center", flex: 1 },
  statVal: { fontSize: 18, fontWeight: "800" },
  statLbl: { fontSize: 11, color: "#888" },
  safe: { color: "#2e7d32" },
  danger: { color: "#c62828" },
  warn: { padding: 8, backgroundColor: "#fff3e0", borderRadius: 8, marginTop: 6 },
  due: { fontSize: 12 },
  muted: { color: "#888", marginTop: 4 },
});