import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { api, setAuthToken } from "../../lib/api";

export default function OwnerTodayScreen() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    api.dashboard.today()
      .then(setData)
      .catch((err) => console.error("Error fetching owner dashboard:", err));
  }, []);

  const handleLogout = () => {
    setAuthToken(null);
    router.replace("/login");
  };

  const handleApproveLeave = () => {
    Alert.alert("Leave Approved", "Medical leave application for Class 5 student approved successfully.");
  };

  const handleBroadcast = () => {
    Alert.alert("Broadcast Announcement", "Push notification dispatched to all Parents and Teaching Faculty.");
  };

  if (!data) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#a855f7" />
        <Text style={styles.loadingText}>Loading Executive School Overview...</Text>
      </View>
    );
  }

  const stats = data.stats || {};
  const fees = data.fees || {};

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Executive Header */}
      <View style={styles.topBar}>
        <View style={styles.profileSnippet}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👑</Text>
          </View>
          <View>
            <Text style={styles.ownerName}>School Executive Board</Text>
            <Text style={styles.ownerRole}>Owner & Management · Demo International School</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Log Out ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Daily Pulse Banner */}
      <View style={styles.pulseBanner}>
        <View style={styles.pulseHeader}>
          <View style={styles.pulseTitleRow}>
            <Text style={styles.pulseBadge}>● CAMPUS LIVE</Text>
            <Text style={styles.pulseDate}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</Text>
          </View>
        </View>
        <Text style={styles.pulseGreeting}>Institution Operational Briefing</Text>
        <Text style={styles.pulseSub}>All campus departments synchronized with cloud database.</Text>
      </View>

      {/* KPI Stats Grid */}
      <View style={styles.metricsGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiIcon}>🎓</Text>
          <Text style={styles.kpiVal}>{stats.students || 2}</Text>
          <Text style={styles.kpiLabel}>Enrolled Students</Text>
          <Text style={styles.kpiSub}>Classes 5 & 6</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiIcon}>🧑‍🏫</Text>
          <Text style={styles.kpiVal}>{stats.teachers || 1}</Text>
          <Text style={styles.kpiLabel}>Teaching Faculty</Text>
          <Text style={styles.kpiSub}>100% On Duty</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiIcon}>✅</Text>
          <Text style={styles.kpiVal}>94%</Text>
          <Text style={styles.kpiLabel}>Today Attendance</Text>
          <Text style={[styles.kpiSub, { color: "#34d399" }]}>Optimal</Text>
        </View>

        <View style={styles.kpiCard}>
          <Text style={styles.kpiIcon}>🌴</Text>
          <Text style={[styles.kpiVal, { color: "#f59e0b" }]}>{stats.pendingLeaves || 1}</Text>
          <Text style={styles.kpiLabel}>Pending Leaves</Text>
          <Text style={styles.kpiSubUrgent}>Needs Review</Text>
        </View>
      </View>

      {/* Financial Overview Card */}
      <View style={styles.financeCard}>
        <View style={styles.financeHeader}>
          <View>
            <Text style={styles.financeTitle}>💳 Term Fee Collection</Text>
            <Text style={styles.financeSubtitle}>Academic Year 2026–2027 Revenue</Text>
          </View>
          <View style={styles.financeBadge}>
            <Text style={styles.financeBadgeText}>Term 1</Text>
          </View>
        </View>

        <View style={styles.financeRow}>
          <View style={styles.financeCol}>
            <Text style={styles.financeNum}>₹{fees.expectedTotal || 12500}</Text>
            <Text style={styles.financeLbl}>Expected Dues</Text>
          </View>
          <View style={styles.financeDivider} />
          <View style={styles.financeCol}>
            <Text style={[styles.financeNum, { color: "#34d399" }]}>₹{fees.collected || 0}</Text>
            <Text style={styles.financeLbl}>Collected</Text>
          </View>
          <View style={styles.financeDivider} />
          <View style={styles.financeCol}>
            <Text style={[styles.financeNum, { color: "#f87171" }]}>₹{(fees.expectedTotal || 12500) - (fees.collected || 0)}</Text>
            <Text style={styles.financeLbl}>Outstanding</Text>
          </View>
        </View>

        <View style={styles.financeProgressBox}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${fees.percentage || 15}%` }]} />
          </View>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabelText}>Fee Collection Rate: {fees.percentage || 15}%</Text>
            <TouchableOpacity onPress={() => Alert.alert("Reminders Sent", "Automated WhatsApp & SMS reminders dispatched to fee pending parents.")}>
              <Text style={styles.reminderBtnText}>Send WhatsApp Reminder ➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Quick Executive Actions */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>⚡ Executive Control Center</Text>
      </View>

      <View style={styles.actionGrid}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleBroadcast}>
          <Text style={styles.actionIcon}>📢</Text>
          <Text style={styles.actionTitle}>Broadcast Circular</Text>
          <Text style={styles.actionSub}>Notify all parents & staff</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} onPress={() => Alert.alert("Audit Report", "Financial & Attendance audit exported to school portal.")}>
          <Text style={styles.actionIcon}>📊</Text>
          <Text style={styles.actionTitle}>Download Audit</Text>
          <Text style={styles.actionSub}>Monthly compliance report</Text>
        </TouchableOpacity>
      </View>

      {/* Pending Approvals Queue */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>⏳ Pending Administrative Approvals</Text>
        <Text style={styles.sectionBadge}>1 Pending</Text>
      </View>

      <View style={styles.approvalCard}>
        <View style={styles.approvalHeader}>
          <View style={styles.approvalAvatar}>
            <Text style={styles.approvalAvatarText}>🌴</Text>
          </View>
          <View style={styles.approvalMeta}>
            <Text style={styles.approvalName}>Medical Leave: Aarav Verma (Class 5-A)</Text>
            <Text style={styles.approvalReason}>Reason: Viral Fever & Recovery · 2 Days</Text>
          </View>
        </View>
        <View style={styles.approvalActionRow}>
          <TouchableOpacity style={styles.approveBtn} onPress={handleApproveLeave}>
            <Text style={styles.approveBtnText}>Approve Leave ✓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => Alert.alert("Leave Rejected", "Notification sent to parent.")}>
            <Text style={styles.rejectBtnText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Fleet & Safety */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🚌 Campus Fleet & Transport</Text>
        <Text style={styles.sectionBadge}>All Green</Text>
      </View>

      <View style={styles.fleetCard}>
        <View style={styles.fleetRow}>
          <Text style={styles.fleetIcon}>🚌</Text>
          <View style={styles.fleetInfo}>
            <Text style={styles.fleetTitle}>School Bus #4 · Anna Nagar Route</Text>
            <Text style={styles.fleetSub}>Driver: Murugan · 24 Students · GPS Active</Text>
          </View>
          <View style={styles.fleetBadge}>
            <Text style={styles.fleetBadgeText}>On Campus</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
    padding: 16,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#a1a1aa",
    fontSize: 13,
    marginTop: 12,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },
  profileSnippet: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#9333ea",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#c084fc",
  },
  avatarText: {
    fontSize: 22,
  },
  ownerName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#ffffff",
  },
  ownerRole: {
    fontSize: 11,
    color: "#a1a1aa",
    marginTop: 1,
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#18181b",
    borderWidth: 1,
    borderColor: "#3f3f46",
  },
  logoutText: {
    color: "#f87171",
    fontSize: 12,
    fontWeight: "700",
  },
  pulseBanner: {
    backgroundColor: "#18181b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  pulseHeader: {
    marginBottom: 8,
  },
  pulseTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pulseBadge: {
    color: "#34d399",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  pulseDate: {
    color: "#71717a",
    fontSize: 10,
  },
  pulseGreeting: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
  },
  pulseSub: {
    fontSize: 11,
    color: "#a1a1aa",
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  kpiCard: {
    width: "48%",
    backgroundColor: "#18181b",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  kpiIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  kpiVal: {
    fontSize: 22,
    fontWeight: "800",
    color: "#ffffff",
  },
  kpiLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#a1a1aa",
    marginTop: 2,
  },
  kpiSub: {
    fontSize: 10,
    color: "#71717a",
    marginTop: 2,
  },
  kpiSubUrgent: {
    fontSize: 10,
    color: "#f87171",
    fontWeight: "700",
    marginTop: 2,
  },
  financeCard: {
    backgroundColor: "#18181b",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#27272a",
    marginBottom: 16,
  },
  financeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  financeTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
  },
  financeSubtitle: {
    fontSize: 11,
    color: "#71717a",
    marginTop: 1,
  },
  financeBadge: {
    backgroundColor: "#7e22ce25",
    borderWidth: 1,
    borderColor: "#a855f750",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  financeBadgeText: {
    color: "#c084fc",
    fontSize: 10,
    fontWeight: "800",
  },
  financeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#09090b",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  financeCol: {
    alignItems: "center",
    flex: 1,
  },
  financeNum: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
  },
  financeLbl: {
    fontSize: 9,
    color: "#71717a",
    marginTop: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  financeDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#27272a",
  },
  financeProgressBox: {
    marginTop: 4,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#27272a",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#a855f7",
    borderRadius: 4,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabelText: {
    fontSize: 10,
    color: "#a1a1aa",
  },
  reminderBtnText: {
    fontSize: 10,
    color: "#c084fc",
    fontWeight: "700",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
  sectionBadge: {
    fontSize: 11,
    color: "#a855f7",
    fontWeight: "700",
  },
  actionGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: "#18181b",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#27272a",
  },
  actionIcon: {
    fontSize: 22,
    marginBottom: 6,
  },
  actionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ffffff",
  },
  actionSub: {
    fontSize: 10,
    color: "#71717a",
    marginTop: 2,
  },
  approvalCard: {
    backgroundColor: "#18181b",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#27272a",
    marginBottom: 16,
  },
  approvalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  approvalAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#f59e0b20",
    alignItems: "center",
    justifyContent: "center",
  },
  approvalAvatarText: {
    fontSize: 18,
  },
  approvalMeta: {
    flex: 1,
  },
  approvalName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
  approvalReason: {
    fontSize: 11,
    color: "#a1a1aa",
    marginTop: 1,
  },
  approvalActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  approveBtn: {
    flex: 1,
    backgroundColor: "#16a34a",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  approveBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  rejectBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#27272a",
  },
  rejectBtnText: {
    color: "#f87171",
    fontSize: 11,
    fontWeight: "700",
  },
  fleetCard: {
    backgroundColor: "#18181b",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#27272a",
    marginBottom: 16,
  },
  fleetRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  fleetIcon: {
    fontSize: 22,
  },
  fleetInfo: {
    flex: 1,
  },
  fleetTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  fleetSub: {
    fontSize: 10,
    color: "#71717a",
    marginTop: 1,
  },
  fleetBadge: {
    backgroundColor: "#065f46",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fleetBadgeText: {
    color: "#34d399",
    fontSize: 9,
    fontWeight: "800",
  },
});
