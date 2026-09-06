import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { api, setAuthToken } from "../../lib/api";

const DEFAULT_TEACHER_SCHEDULE = [
  { period: 1, time: "09:00 - 09:45", class: "Class 5-A", subject: "Mathematics", topic: "Fractions & Decimals", room: "Room 102", status: "completed", attendanceDone: true },
  { period: 2, time: "09:50 - 10:35", class: "Class 6-B", subject: "Mathematics", topic: "Linear Equations", room: "Room 204", status: "ongoing", attendanceDone: true },
  { period: 4, time: "11:40 - 12:25", class: "Class 5-B", subject: "Mathematics", topic: "Geometry Basics", room: "Room 104", status: "upcoming", attendanceDone: false },
  { period: 5, time: "01:15 - 02:00", class: "Class 6-A", subject: "Mathematics", topic: "Algebra Exercises", room: "Room 202", status: "upcoming", attendanceDone: false },
];

const DEFAULT_PENDING_GRADING = [
  { id: "g1", class: "Class 5-A", title: "Fractions Chapter 4 Worksheet", submitted: 24, total: 28, due: "Yesterday" },
  { id: "g2", class: "Class 6-B", title: "Algebra Mid-Term Practice Test", submitted: 21, total: 25, due: "Today, 5:00 PM" },
];

export default function TeacherTodayScreen() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    api.dashboard.today()
      .then(setData)
      .catch((err) => console.error("Error fetching teacher dashboard:", err));
  }, []);

  const handleLogout = () => {
    setAuthToken(null);
    router.replace("/login");
  };

  if (!data) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading Faculty Dashboard...</Text>
      </View>
    );
  }

  const teacherName = data.name || "Priya Sharma";
  const schedule = (data.todaySchedule && data.todaySchedule.length > 0) ? data.todaySchedule : DEFAULT_TEACHER_SCHEDULE;
  const pendingGrading = (data.pendingReview && data.pendingReview.length > 0) ? data.pendingReview : DEFAULT_PENDING_GRADING;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Bar with Logout */}
      <View style={styles.topBar}>
        <View style={styles.profileSnippet}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>🧑‍🏫</Text>
          </View>
          <View>
            <Text style={styles.teacherName}>{teacherName}</Text>
            <Text style={styles.teacherRole}>Senior Mathematics Faculty · Staff ID #T-104</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Log Out ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Teacher Action Greeting */}
      <View style={styles.greetingBanner}>
        <View style={styles.greetingIconBox}>
          <Text style={styles.greetingEmoji}>📋</Text>
        </View>
        <View style={styles.greetingContent}>
          <Text style={styles.greetingTitle}>Faculty Briefing · Today</Text>
          <Text style={styles.greetingSubtitle}>4 teaching periods scheduled · 2 classes attendance marked</Text>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>4</Text>
          <Text style={styles.metricLabel}>Periods Today</Text>
          <Text style={styles.metricSub}>2 Completed</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>85</Text>
          <Text style={styles.metricLabel}>Total Students</Text>
          <Text style={styles.metricSub}>3 Sections</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>45</Text>
          <Text style={styles.metricLabel}>Submissions</Text>
          <Text style={styles.metricSubUrgent}>To Grade</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={[styles.metricVal, { color: "#34d399" }]}>96%</Text>
          <Text style={styles.metricLabel}>Avg Attend.</Text>
          <Text style={styles.metricSub}>This Week</Text>
        </View>
      </View>

      {/* Quick Teacher Actions */}
      <View style={styles.quickNav}>
        <TouchableOpacity style={styles.quickNavBtn}>
          <Text style={styles.quickNavIcon}>✅</Text>
          <Text style={styles.quickNavText}>Take Attendance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickNavBtn}>
          <Text style={styles.quickNavIcon}>📝</Text>
          <Text style={styles.quickNavText}>Add Homework</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickNavBtn}>
          <Text style={styles.quickNavIcon}>📊</Text>
          <Text style={styles.quickNavText}>Enter Marks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickNavBtn}>
          <Text style={styles.quickNavIcon}>📢</Text>
          <Text style={styles.quickNavText}>Circular</Text>
        </TouchableOpacity>
      </View>

      {/* Section: Today's Teaching Schedule */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>⏱️ Today&apos;s Teaching Schedule</Text>
        <Text style={styles.sectionBadge}>4 Assigned</Text>
      </View>

      <View style={styles.timelineList}>
        {schedule.map((slot: any, idx: number) => {
          const isDone = slot.status === "completed" || idx === 0;
          const isCurrent = slot.status === "ongoing" || idx === 1;

          return (
            <View key={idx} style={[styles.slotCard, isCurrent && styles.slotCardActive]}>
              <View style={styles.slotPeriodCol}>
                <Text style={[styles.slotPeriodNumber, isCurrent && styles.slotPeriodNumberActive]}>
                  P{slot.period || idx + 1}
                </Text>
                <Text style={styles.slotPeriodTime}>{slot.time || "09:00 AM"}</Text>
              </View>

              <View style={styles.slotInfo}>
                <View style={styles.slotHeaderRow}>
                  <Text style={styles.slotClass}>{slot.class} — {slot.subject}</Text>
                  {isDone ? (
                    <View style={styles.statusDone}>
                      <Text style={styles.statusDoneText}>Completed ✓</Text>
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

                <Text style={styles.slotTopic}>{slot.topic || "Core Subject Lecture"}</Text>
                <View style={styles.slotFooter}>
                  <Text style={styles.slotRoom}>📍 {slot.room || "Classroom"}</Text>
                  <TouchableOpacity style={styles.attendBtn}>
                    <Text style={styles.attendBtnText}>
                      {slot.attendanceDone ? "Attendance Done ✓" : "Mark Attendance ➔"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Section: Pending Grading & Homework */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📝 Homework Submissions to Grade</Text>
        <Text style={styles.sectionBadge}>{pendingGrading.length} Pending</Text>
      </View>

      {pendingGrading.map((item: any, idx: number) => (
        <View key={item.id || idx} style={styles.gradeCard}>
          <View style={styles.gradeHeader}>
            <View style={styles.gradeClassBadge}>
              <Text style={styles.gradeClassText}>{item.class}</Text>
            </View>
            <Text style={styles.gradeDue}>{item.due}</Text>
          </View>

          <Text style={styles.gradeTitle}>{item.title}</Text>

          <View style={styles.gradeProgressRow}>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>
                {item.submitted}/{item.total} Students Submitted ({Math.round((item.submitted / item.total) * 100)}%)
              </Text>
            </View>
            <TouchableOpacity style={styles.gradeBtn}>
              <Text style={styles.gradeBtnText}>Grade Submissions ➔</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
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
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1e293b",
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
    backgroundColor: "#059669",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#34d399",
  },
  avatarText: {
    fontSize: 22,
  },
  teacherName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  teacherRole: {
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
  greetingBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  greetingIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#05966925",
    alignItems: "center",
    justifyContent: "center",
  },
  greetingEmoji: {
    fontSize: 20,
  },
  greetingContent: {
    flex: 1,
  },
  greetingTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
  greetingSubtitle: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: "#334155",
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
    marginTop: 4,
  },
  metricSubUrgent: {
    fontSize: 9,
    color: "#f87171",
    fontWeight: "700",
    marginTop: 4,
  },
  quickNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  quickNavBtn: {
    flex: 1,
    backgroundColor: "#064e3b40",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#047857",
  },
  quickNavIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  quickNavText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#6ee7b7",
    textAlign: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#ffffff",
  },
  sectionBadge: {
    fontSize: 11,
    color: "#34d399",
    fontWeight: "700",
  },
  timelineList: {
    marginBottom: 16,
    gap: 8,
  },
  slotCard: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  slotCardActive: {
    borderColor: "#10b981",
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  slotPeriodCol: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#334155",
    width: 60,
  },
  slotPeriodNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: "#94a3b8",
  },
  slotPeriodNumberActive: {
    color: "#34d399",
  },
  slotPeriodTime: {
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
  slotClass: {
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
    backgroundColor: "#064e3b",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusCurrentText: {
    color: "#34d399",
    fontSize: 9,
    fontWeight: "800",
  },
  statusUpcoming: {
    backgroundColor: "#334155",
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
    marginBottom: 6,
  },
  slotFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  slotRoom: {
    fontSize: 10,
    color: "#94a3b8",
  },
  attendBtn: {
    backgroundColor: "#05966920",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#05966950",
  },
  attendBtnText: {
    color: "#34d399",
    fontSize: 10,
    fontWeight: "700",
  },
  gradeCard: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 10,
  },
  gradeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  gradeClassBadge: {
    backgroundColor: "#05966920",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  gradeClassText: {
    color: "#34d399",
    fontSize: 10,
    fontWeight: "800",
  },
  gradeDue: {
    fontSize: 10,
    color: "#f87171",
    fontWeight: "700",
  },
  gradeTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: 18,
    marginBottom: 12,
  },
  gradeProgressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressTextContainer: {
    flex: 1,
  },
  progressText: {
    fontSize: 11,
    color: "#94a3b8",
  },
  gradeBtn: {
    backgroundColor: "#059669",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },
  gradeBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
});