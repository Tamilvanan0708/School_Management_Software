import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { api, setAuthToken } from "../../lib/api";

export default function ParentTodayScreen() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    api.dashboard.today()
      .then(setData)
      .catch((err) => console.error("Error fetching parent dashboard:", err));
  }, []);

  const handleLogout = () => {
    setAuthToken(null);
    router.replace("/login");
  };

  if (!data) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading Child Dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with Logout */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.appTitle}>👨‍👩‍👦 Parent Portal</Text>
          <Text style={styles.appSubtitle}>Demo International School</Text>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out ➔</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionHeading}>Enrolled Children</Text>

      {data.children?.map((c: any) => (
        <View key={c.studentId} style={styles.childCard}>
          <View style={styles.childHeader}>
            <View style={styles.avatarPill}>
              <Text style={styles.avatarText}>{c.childName?.charAt(0) || "S"}</Text>
            </View>
            <View>
              <Text style={styles.childName}>{c.childName}</Text>
              <Text style={styles.childMeta}>Class {c.className || "5"} · Sec {c.section || "A"}</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>{c.todayClasses?.length || 5}</Text>
              <Text style={styles.metricLbl}>Periods</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>{c.pendingHomework?.length || 1}</Text>
              <Text style={styles.metricLbl}>Homework</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricVal}>{c.attendancePercentage ?? 94}%</Text>
              <Text style={styles.metricLbl}>Attendance</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={[styles.metricVal, c.pendingFees > 0 ? styles.dangerText : styles.safeText]}>
                {c.pendingFees > 0 ? `₹${c.pendingFees}` : "Paid"}
              </Text>
              <Text style={styles.metricLbl}>Fee Status</Text>
            </View>
          </View>

          {/* Quick Pay CTA if fees pending */}
          {c.pendingFees > 0 && (
            <View style={styles.feeBanner}>
              <View>
                <Text style={styles.feeTitle}>Term Fee Outstanding</Text>
                <Text style={styles.feeAmount}>₹{c.pendingFees} due soon</Text>
              </View>
              <TouchableOpacity style={styles.payBtn}>
                <Text style={styles.payBtnText}>Pay Online</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Homework alerts */}
          {c.pendingHomework?.length > 0 && (
            <View style={styles.hwSection}>
              <Text style={styles.hwHeader}>📝 Assigned Homework</Text>
              {c.pendingHomework.map((h: any) => (
                <View key={h.id || Math.random()} style={styles.hwCard}>
                  <Text style={styles.hwSubject}>{h.subject || "Mathematics"}</Text>
                  <Text style={styles.hwTitle}>{h.title || "Exercise 4.2"}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}

      {!data.children?.length && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No linked children found for this parent account.</Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a", padding: 16 },
  centered: { justifyContent: "center", alignItems: "center" },
  loadingText: { color: "#94a3b8", fontSize: 13, marginTop: 12 },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
    paddingBottom: 14,
  },
  appTitle: { fontSize: 20, fontWeight: "800", color: "#ffffff" },
  appSubtitle: { fontSize: 11, color: "#94a3b8", marginTop: 2 },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  logoutText: { color: "#f87171", fontSize: 12, fontWeight: "700" },
  sectionHeading: { fontSize: 15, fontWeight: "700", color: "#cbd5e1", marginBottom: 12 },
  childCard: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  childHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  avatarPill: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "800", fontSize: 18 },
  childName: { fontSize: 16, fontWeight: "700", color: "#ffffff" },
  childMeta: { fontSize: 12, color: "#94a3b8", marginTop: 1 },
  metricsRow: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 12,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  metricBox: { alignItems: "center", flex: 1 },
  metricVal: { fontSize: 16, fontWeight: "800", color: "#ffffff" },
  metricLbl: { fontSize: 10, color: "#64748b", marginTop: 2, textTransform: "uppercase", fontWeight: "600" },
  safeText: { color: "#34d399" },
  dangerText: { color: "#f87171" },
  feeBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#451a03",
    borderColor: "#78350f",
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  feeTitle: { color: "#fcd34d", fontSize: 12, fontWeight: "700" },
  feeAmount: { color: "#fef3c7", fontSize: 11, marginTop: 1 },
  payBtn: {
    backgroundColor: "#d97706",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  payBtnText: { color: "#ffffff", fontSize: 11, fontWeight: "700" },
  hwSection: { marginTop: 4 },
  hwHeader: { fontSize: 12, fontWeight: "700", color: "#94a3b8", marginBottom: 6 },
  hwCard: {
    backgroundColor: "#0f172a",
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  hwSubject: { fontSize: 10, color: "#60a5fa", fontWeight: "700" },
  hwTitle: { fontSize: 12, color: "#e2e8f0", marginTop: 1 },
  emptyState: { padding: 24, alignItems: "center" },
  emptyText: { color: "#64748b", fontSize: 13 },
});