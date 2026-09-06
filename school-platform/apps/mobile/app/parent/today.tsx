import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { api, setAuthToken } from "../../lib/api";

const MOCK_CHILD_CLASSES = [
  { period: 1, time: "09:00 - 09:45", subject: "Mathematics", topic: "Fractions & Decimals", teacher: "Priya Sharma", status: "completed" },
  { period: 2, time: "09:50 - 10:35", subject: "General Science", topic: "Photosynthesis & Plant Life", teacher: "Rajesh Kumar", status: "ongoing" },
  { period: 3, time: "10:50 - 11:35", subject: "English Literature", topic: "Poetry Comprehension", teacher: "Anita Roy", status: "upcoming" },
  { period: 4, time: "11:40 - 12:25", subject: "Social Studies", topic: "Indian Heritage", teacher: "Suresh Nair", status: "upcoming" },
  { period: 5, time: "01:15 - 02:00", subject: "Computer Science", topic: "Scratch Block Coding", teacher: "Vikram Patel", status: "upcoming" },
];

export default function ParentTodayScreen() {
  const [data, setData] = useState<any>(null);
  const [selectedChildIndex, setSelectedChildIndex] = useState<number>(0);
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

  const handlePayFee = (amount: number, childName: string) => {
    Alert.alert(
      "Instant UPI Payment",
      `Redirecting to Google Pay / PhonePe for ₹${amount} fee payment for ${childName}. Official tax receipt will be sent to your registered WhatsApp.`,
      [{ text: "OK" }]
    );
  };

  const handleTeacherMessage = (teacherName: string) => {
    Alert.alert("Teacher Communication", `Opening secure messaging channel with Class Teacher ${teacherName}.`);
  };

  const handleApplyLeave = () => {
    Alert.alert("Apply Leave", "Select dates and upload doctor note for student leave application.");
  };

  if (!data) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading Parent & Student Cloud Insights...</Text>
      </View>
    );
  }

  const children = data.children || [
    { childName: "Aarav Verma", className: "5", section: "A", pendingFees: 7500, attendancePercentage: 94 },
    { childName: "Ananya Verma", className: "5", section: "A", pendingFees: 5000, attendancePercentage: 96 },
  ];

  const currentChild = children[selectedChildIndex] || children[0] || {};
  const currentName = currentChild.childName || "Aarav Verma";
  const currentClass = currentChild.className || "Class 5";
  const currentSection = currentChild.section || "A";
  const currentFee = currentChild.pendingFees || 5000;
  const currentAttendance = currentChild.attendancePercentage ?? 94;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Header with Logout */}
      <View style={styles.topHeader}>
        <View style={styles.parentProfile}>
          <View style={styles.parentAvatar}>
            <Text style={styles.parentAvatarText}>👨‍👩‍👦</Text>
          </View>
          <View>
            <Text style={styles.parentName}>Ramesh Verma</Text>
            <Text style={styles.parentSubtitle}>Parent Portal · {children.length} Enrolled Wards</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Log Out ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Child Switcher Tabs */}
      <View style={styles.childSwitcher}>
        {children.map((child: any, idx: number) => {
          const isSelected = idx === selectedChildIndex;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.childTab, isSelected && styles.childTabActive]}
              onPress={() => setSelectedChildIndex(idx)}
              activeOpacity={0.8}
            >
              <Text style={styles.childTabEmoji}>{idx === 0 ? "👦" : "👧"}</Text>
              <View>
                <Text style={[styles.childTabText, isSelected && styles.childTabTextActive]}>
                  {child.childName}
                </Text>
                <Text style={[styles.childTabSub, isSelected && styles.childTabSubActive]}>
                  Class {child.className || "5"}-{child.section || "A"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Live Campus Attendance & Location Card */}
      <View style={styles.liveStatusCard}>
        <View style={styles.liveStatusHeader}>
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>ATTENDANCE MARKED PRESENT</Text>
          </View>
          <Text style={styles.liveTime}>08:42 AM</Text>
        </View>
        <Text style={styles.liveTitle}>
          {currentName} is safely present in Classroom 102
        </Text>
        <Text style={styles.liveDesc}>
          Verified by Class Teacher Priya Sharma. Morning prayer and roll call completed.
        </Text>
      </View>

      {/* 4 Key Metrics Bar */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: "#34d399" }]}>{currentAttendance}%</Text>
          <Text style={styles.metricLabel}>Attendance</Text>
          <Text style={styles.metricSub}>42/45 Days</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>1</Text>
          <Text style={styles.metricLabel}>Homework</Text>
          <Text style={[styles.metricSub, { color: "#f87171", fontWeight: "700" }]}>Due Tomorrow</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: currentFee > 0 ? "#f87171" : "#34d399" }]}>
            ₹{currentFee}
          </Text>
          <Text style={styles.metricLabel}>Fee Due</Text>
          <Text style={styles.metricSub}>Term 2</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: "#60a5fa" }]}>A</Text>
          <Text style={styles.metricLabel}>Term Rank</Text>
          <Text style={styles.metricSub}>Top 5%</Text>
        </View>
      </View>

      {/* Quick Action Pills */}
      <View style={styles.quickActionRow}>
        <TouchableOpacity style={styles.quickActionBtn} onPress={() => handlePayFee(currentFee, currentName)}>
          <Text style={styles.quickActionIcon}>💳</Text>
          <Text style={styles.quickActionText}>Pay Fees</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn} onPress={() => handleTeacherMessage("Priya Sharma")}>
          <Text style={styles.quickActionIcon}>💬</Text>
          <Text style={styles.quickActionText}>Message Teacher</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn} onPress={handleApplyLeave}>
          <Text style={styles.quickActionIcon}>🌴</Text>
          <Text style={styles.quickActionText}>Apply Leave</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.quickActionBtn} onPress={() => Alert.alert("Report Card", "Term 1 Digital Report Card downloaded.")}>
          <Text style={styles.quickActionIcon}>📊</Text>
          <Text style={styles.quickActionText}>Report Card</Text>
        </TouchableOpacity>
      </View>

      {/* Outstanding Tuition Fee Payment Card */}
      {currentFee > 0 && (
        <View style={styles.feeCard}>
          <View style={styles.feeHeaderRow}>
            <View>
              <Text style={styles.feeTitle}>Term 2 Tuition & Transport Fee</Text>
              <Text style={styles.feeSub}>Due Date: Sept 20, 2026 · Invoice #INV-2026-089</Text>
            </View>
            <View style={styles.feeDueBadge}>
              <Text style={styles.feeDueBadgeText}>Unpaid</Text>
            </View>
          </View>

          <View style={styles.feeBreakdown}>
            <View style={styles.feeItem}>
              <Text style={styles.feeItemLabel}>Tuition & Smart Classroom Fee</Text>
              <Text style={styles.feeItemVal}>₹{currentFee - 1000}</Text>
            </View>
            <View style={styles.feeItem}>
              <Text style={styles.feeItemLabel}>Transport & Fleet GPS Fee</Text>
              <Text style={styles.feeItemVal}>₹1,000</Text>
            </View>
            <View style={styles.feeTotalRow}>
              <Text style={styles.feeTotalLabel}>Total Payable Amount</Text>
              <Text style={styles.feeTotalVal}>₹{currentFee}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.payNowBtn}
            onPress={() => handlePayFee(currentFee, currentName)}
            activeOpacity={0.8}
          >
            <Text style={styles.payNowText}>Pay ₹{currentFee} via UPI / Google Pay ➔</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* GPS Bus Transit Card */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🚌 School Bus Fleet & Transit</Text>
        <Text style={styles.sectionBadge}>GPS Active</Text>
      </View>

      <View style={styles.busCard}>
        <View style={styles.busHeader}>
          <View style={styles.busAvatar}>
            <Text style={styles.busEmoji}>🚌</Text>
          </View>
          <View style={styles.busMeta}>
            <Text style={styles.busTitle}>Bus #4 · Anna Nagar Route</Text>
            <Text style={styles.busDriver}>Driver: Murugan (+91 98400 12345)</Text>
          </View>
          <View style={styles.busStatusPill}>
            <Text style={styles.busStatusText}>On Campus</Text>
          </View>
        </View>
        <View style={styles.busInfoRow}>
          <Text style={styles.busInfoText}>Morning arrival: Safely dropped at 08:35 AM</Text>
          <Text style={styles.busInfoText}>Evening pickup: Scheduled at 03:30 PM</Text>
        </View>
      </View>

      {/* Today's Timetable for Child */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📚 {currentName}&apos;s Today Schedule</Text>
        <Text style={styles.sectionBadge}>5 Periods</Text>
      </View>

      <View style={styles.scheduleList}>
        {MOCK_CHILD_CLASSES.map((slot, idx) => {
          const isDone = slot.status === "completed";
          const isCurrent = slot.status === "ongoing";

          return (
            <View key={idx} style={[styles.slotCard, isCurrent && styles.slotCardActive]}>
              <View style={styles.slotPeriodCol}>
                <Text style={[styles.slotPeriodNum, isCurrent && styles.slotPeriodNumActive]}>P{slot.period}</Text>
                <Text style={styles.slotTime}>{slot.time}</Text>
              </View>

              <View style={styles.slotInfo}>
                <View style={styles.slotHeaderRow}>
                  <Text style={styles.slotSubject}>{slot.subject}</Text>
                  {isDone ? (
                    <View style={styles.statusDone}>
                      <Text style={styles.statusDoneText}>Attended ✓</Text>
                    </View>
                  ) : isCurrent ? (
                    <View style={styles.statusCurrent}>
                      <Text style={styles.statusCurrentText}>● In Progress</Text>
                    </View>
                  ) : (
                    <View style={styles.statusUpcoming}>
                      <Text style={styles.statusUpcomingText}>Upcoming</Text>
                    </View>
                  )}
                </View>

                <Text style={styles.slotTopic}>{slot.topic}</Text>
                <Text style={styles.slotTeacher}>Teacher: {slot.teacher}</Text>
              </View>
            </View>
          );
        })}
      </View>

      {/* Homework Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📝 Homework & Daily Diary</Text>
        <Text style={styles.sectionBadge}>1 Active</Text>
      </View>

      <View style={styles.hwCard}>
        <View style={styles.hwHeader}>
          <View style={styles.hwSubjectBadge}>
            <Text style={styles.hwSubjectText}>Mathematics</Text>
          </View>
          <Text style={styles.hwDueText}>Due Tomorrow, 8:30 AM</Text>
        </View>
        <Text style={styles.hwTitle}>Exercise 4.2: Mixed Fractions Questions 1 to 10</Text>
        <Text style={styles.hwRemark}>Teacher note: &quot;Please verify steps with parent signature.&quot;</Text>
      </View>

      {/* Teacher Contact Banner */}
      <View style={styles.teacherContactCard}>
        <View style={styles.teacherHeader}>
          <View style={styles.teacherAvatar}>
            <Text style={styles.teacherEmoji}>👩‍🏫</Text>
          </View>
          <View style={styles.teacherInfo}>
            <Text style={styles.teacherTitle}>Priya Sharma · Class Teacher</Text>
            <Text style={styles.teacherDept}>Senior Mathematics Faculty · Available 03:30 - 04:30 PM</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.teacherMessageBtn}
          onPress={() => handleTeacherMessage("Priya Sharma")}
          activeOpacity={0.8}
        >
          <Text style={styles.teacherMessageText}>💬 Direct Message Teacher</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070d1e",
    padding: 16,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 12,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
  },
  parentProfile: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  parentAvatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#1e3a8a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#3b82f6",
  },
  parentAvatarText: {
    fontSize: 22,
  },
  parentName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  parentSubtitle: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 1,
  },
  logoutBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#1e293b",
    borderWidth: 1,
    borderColor: "#334155",
  },
  logoutText: {
    color: "#f87171",
    fontSize: 12,
    fontWeight: "700",
  },
  childSwitcher: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  childTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111c38",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 8,
  },
  childTabActive: {
    backgroundColor: "#1e3a8a",
    borderColor: "#3b82f6",
    borderWidth: 2,
  },
  childTabEmoji: {
    fontSize: 20,
  },
  childTabText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#94a3b8",
  },
  childTabTextActive: {
    color: "#ffffff",
  },
  childTabSub: {
    fontSize: 10,
    color: "#64748b",
  },
  childTabSubActive: {
    color: "#93c5fd",
  },
  liveStatusCard: {
    backgroundColor: "#0f2042",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1d4ed8",
    marginBottom: 16,
  },
  liveStatusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34d399",
  },
  liveText: {
    color: "#34d399",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  liveTime: {
    color: "#93c5fd",
    fontSize: 10,
  },
  liveTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
  liveDesc: {
    fontSize: 11,
    color: "#93c5fd",
    marginTop: 2,
    lineHeight: 16,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#111c38",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#1e293b",
    alignItems: "center",
  },
  metricVal: {
    fontSize: 16,
    fontWeight: "800",
    color: "#ffffff",
  },
  metricLabel: {
    fontSize: 9,
    color: "#94a3b8",
    marginTop: 2,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  metricSub: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 3,
  },
  quickActionRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  quickActionBtn: {
    flex: 1,
    backgroundColor: "#111c38",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  quickActionIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  quickActionText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#93c5fd",
    textAlign: "center",
  },
  feeCard: {
    backgroundColor: "#3b111125",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#ef444450",
    marginBottom: 16,
  },
  feeHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  feeTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
  feeSub: {
    fontSize: 10,
    color: "#fca5a5",
    marginTop: 2,
  },
  feeDueBadge: {
    backgroundColor: "#ef444430",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  feeDueBadgeText: {
    color: "#f87171",
    fontSize: 10,
    fontWeight: "800",
  },
  feeBreakdown: {
    backgroundColor: "#070d1e",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 6,
  },
  feeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  feeItemLabel: {
    fontSize: 11,
    color: "#94a3b8",
  },
  feeItemVal: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "600",
  },
  feeTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingTop: 6,
    marginTop: 4,
  },
  feeTotalLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#ffffff",
  },
  feeTotalVal: {
    fontSize: 13,
    fontWeight: "800",
    color: "#f87171",
  },
  payNowBtn: {
    backgroundColor: "#dc2626",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  payNowText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
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
    color: "#60a5fa",
    fontWeight: "700",
  },
  busCard: {
    backgroundColor: "#111c38",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 16,
  },
  busHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  busAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#1e3a8a30",
    alignItems: "center",
    justifyContent: "center",
  },
  busEmoji: {
    fontSize: 18,
  },
  busMeta: {
    flex: 1,
  },
  busTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
  busDriver: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 1,
  },
  busStatusPill: {
    backgroundColor: "#065f46",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  busStatusText: {
    color: "#34d399",
    fontSize: 9,
    fontWeight: "800",
  },
  busInfoRow: {
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
    paddingTop: 8,
    gap: 2,
  },
  busInfoText: {
    fontSize: 11,
    color: "#cbd5e1",
  },
  scheduleList: {
    gap: 8,
    marginBottom: 16,
  },
  slotCard: {
    flexDirection: "row",
    backgroundColor: "#111c38",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
    gap: 12,
  },
  slotCardActive: {
    borderColor: "#3b82f6",
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  slotPeriodCol: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#1e293b",
    width: 60,
  },
  slotPeriodNum: {
    fontSize: 16,
    fontWeight: "800",
    color: "#94a3b8",
  },
  slotPeriodNumActive: {
    color: "#60a5fa",
  },
  slotTime: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
    textAlign: "center",
  },
  slotInfo: {
    flex: 1,
  },
  slotHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  slotSubject: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
  statusDone: {
    backgroundColor: "#065f46",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusDoneText: {
    color: "#34d399",
    fontSize: 9,
    fontWeight: "800",
  },
  statusCurrent: {
    backgroundColor: "#1e3a8a",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusCurrentText: {
    color: "#60a5fa",
    fontSize: 9,
    fontWeight: "800",
  },
  statusUpcoming: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusUpcomingText: {
    color: "#94a3b8",
    fontSize: 9,
    fontWeight: "700",
  },
  slotTopic: {
    fontSize: 11,
    color: "#cbd5e1",
    marginBottom: 4,
  },
  slotTeacher: {
    fontSize: 10,
    color: "#94a3b8",
  },
  hwCard: {
    backgroundColor: "#111c38",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 16,
  },
  hwHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  hwSubjectBadge: {
    backgroundColor: "#3b82f620",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  hwSubjectText: {
    color: "#60a5fa",
    fontSize: 10,
    fontWeight: "800",
  },
  hwDueText: {
    fontSize: 10,
    color: "#f87171",
    fontWeight: "700",
  },
  hwTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 4,
  },
  hwRemark: {
    fontSize: 11,
    color: "#94a3b8",
    fontStyle: "italic",
  },
  teacherContactCard: {
    backgroundColor: "#111c38",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1e293b",
    marginBottom: 16,
  },
  teacherHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  teacherAvatar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#05966920",
    alignItems: "center",
    justifyContent: "center",
  },
  teacherEmoji: {
    fontSize: 20,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
  },
  teacherDept: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 1,
  },
  teacherMessageBtn: {
    backgroundColor: "#059669",
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: "center",
  },
  teacherMessageText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
});