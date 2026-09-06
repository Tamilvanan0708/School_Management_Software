import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { api, setAuthToken } from "../../lib/api";

const DEFAULT_CLASSES = [
  { period: 1, time: "09:00 - 09:45", subject: "Mathematics", topic: "Fractions & Decimals", teacher: "Priya Sharma", room: "Room 102", status: "completed" },
  { period: 2, time: "09:50 - 10:35", subject: "General Science", topic: "Photosynthesis & Plant Life", teacher: "Rajesh Kumar", room: "Science Lab 2", status: "ongoing" },
  { period: 3, time: "10:50 - 11:35", subject: "English Literature", topic: "Poetry Comprehension", teacher: "Anita Roy", room: "Room 102", status: "upcoming" },
  { period: 4, time: "11:40 - 12:25", subject: "Social Studies", topic: "Indian Heritage & Culture", teacher: "Suresh Nair", room: "Room 102", status: "upcoming" },
  { period: 5, time: "01:15 - 02:00", subject: "Computer Science", topic: "Algorithms & Scratch Blocks", teacher: "Vikram Patel", room: "Computer Lab 1", status: "upcoming" },
];

const DEFAULT_HOMEWORK = [
  { id: "hw1", subject: "Mathematics", title: "Exercise 4.2: Mixed Fractions Questions 1 to 10", due: "Tomorrow, 8:30 AM", urgent: true },
  { id: "hw2", subject: "General Science", title: "Label the diagram of leaf structure in practical workbook", due: "Friday, Sept 12", urgent: false },
];

export default function StudentTodayScreen() {
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    api.dashboard.today()
      .then(setData)
      .catch((err) => console.error("Error fetching student dashboard:", err));
  }, []);

  const handleLogout = () => {
    setAuthToken(null);
    router.replace("/login");
  };

  if (!data) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading Student Dashboard...</Text>
      </View>
    );
  }

  const studentName = data.name || "Aarav Verma";
  const studentClass = data.className || "Class 5";
  const studentSection = data.section || "A";
  const classesList = (data.todayClasses && data.todayClasses.length > 0) ? data.todayClasses : DEFAULT_CLASSES;
  const homeworkList = (data.pendingHomework && data.pendingHomework.length > 0) ? data.pendingHomework : DEFAULT_HOMEWORK;
  const examsList = data.upcomingExams || [
    { exam: "Mid-Term Exams 2026", subject: "Mathematics", date: "2026-10-02" },
    { exam: "Mid-Term Exams 2026", subject: "Science", date: "2026-10-04" },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Bar with Logout */}
      <View style={styles.topBar}>
        <View style={styles.profileSnippet}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{studentName.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.studentName}>{studentName}</Text>
            <Text style={styles.studentClass}>{studentClass}-{studentSection} · Roll #12 · Demo School</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Log Out ➔</Text>
        </TouchableOpacity>
      </View>

      {/* Motivational Greeting Banner */}
      <View style={styles.greetingBanner}>
        <View style={styles.greetingIconBox}>
          <Text style={styles.greetingEmoji}>🚀</Text>
        </View>
        <View style={styles.greetingContent}>
          <Text style={styles.greetingTitle}>Welcome back, {studentName.split(" ")[0]}!</Text>
          <Text style={styles.greetingSubtitle}>You have 5 periods scheduled today · Attendance verified present.</Text>
        </View>
      </View>

      {/* Quick Metrics Strip */}
      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>94%</Text>
          <Text style={styles.metricLabel}>Attendance</Text>
          <View style={styles.presentBadge}>
            <Text style={styles.presentBadgeText}>✓ Present</Text>
          </View>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>5</Text>
          <Text style={styles.metricLabel}>Periods Today</Text>
          <Text style={styles.metricSub}>Next in 15m</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>{homeworkList.length}</Text>
          <Text style={styles.metricLabel}>Pending HW</Text>
          <Text style={styles.metricSubUrgent}>1 Due Soon</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricVal}>A+</Text>
          <Text style={styles.metricLabel}>Term Grade</Text>
          <Text style={styles.metricSub}>92.4% Avg</Text>
        </View>
      </View>

      {/* Quick Access Menu Tabs */}
      <View style={styles.quickNav}>
        <TouchableOpacity style={styles.quickNavBtn}>
          <Text style={styles.quickNavIcon}>⏱️</Text>
          <Text style={styles.quickNavText}>Timetable</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickNavBtn}>
          <Text style={styles.quickNavIcon}>📝</Text>
          <Text style={styles.quickNavText}>Homework</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickNavBtn}>
          <Text style={styles.quickNavIcon}>🏆</Text>
          <Text style={styles.quickNavText}>Results</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickNavBtn}>
          <Text style={styles.quickNavIcon}>📚</Text>
          <Text style={styles.quickNavText}>Materials</Text>
        </TouchableOpacity>
      </View>

      {/* Section: Today's Class Schedule */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📅 Today&apos;s Class Schedule</Text>
        <Text style={styles.sectionBadge}>5 Periods</Text>
      </View>

      <View style={styles.timelineList}>
        {classesList.map((item: any, idx: number) => {
          const isDone = item.status === "completed" || idx === 0;
          const isCurrent = item.status === "ongoing" || idx === 1;

          return (
            <View key={idx} style={[styles.classCard, isCurrent && styles.classCardActive]}>
              <View style={styles.periodCol}>
                <Text style={[styles.periodNumber, isCurrent && styles.periodNumberActive]}>
                  P{item.period || idx + 1}
                </Text>
                <Text style={styles.periodTime}>{item.time || "09:00 AM"}</Text>
              </View>

              <View style={styles.classInfo}>
                <View style={styles.classTitleRow}>
                  <Text style={styles.classSubject}>{item.subject}</Text>
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

                <Text style={styles.classTopic}>{item.topic || "Core Curriculum Lecture"}</Text>
                <View style={styles.classFooter}>
                  <Text style={styles.classTeacher}>🧑‍🏫 {item.teacher || "Class Faculty"}</Text>
                  <Text style={styles.classRoom}>📍 {item.room || "Room 102"}</Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Section: Pending Homework & Tasks */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📝 Pending Homework</Text>
        <Text style={styles.sectionBadge}>{homeworkList.length} Tasks</Text>
      </View>

      {homeworkList.map((hw: any, idx: number) => (
        <View key={hw.id || idx} style={styles.hwCard}>
          <View style={styles.hwHeader}>
            <View style={styles.hwSubjectBadge}>
              <Text style={styles.hwSubjectText}>{hw.subject || "Mathematics"}</Text>
            </View>
            <Text style={styles.hwDue}>{hw.due || "Due this week"}</Text>
          </View>
          <Text style={styles.hwTitle}>{hw.title}</Text>
          <View style={styles.hwActionRow}>
            <TouchableOpacity style={styles.submitBtn}>
              <Text style={styles.submitBtnText}>Submit Homework</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.viewNotesBtn}>
              <Text style={styles.viewNotesBtnText}>Teacher Remarks</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {/* Section: Upcoming Examinations */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📊 Upcoming Examinations</Text>
        <Text style={styles.sectionBadge}>Term 1</Text>
      </View>

      {examsList.map((exam: any, idx: number) => (
        <View key={idx} style={styles.examCard}>
          <View style={styles.examIconBox}>
            <Text style={styles.examEmoji}>✍️</Text>
          </View>
          <View style={styles.examInfo}>
            <Text style={styles.examName}>{exam.exam || "Mid-Term Examination"}</Text>
            <Text style={styles.examSubject}>{exam.subject} · Syllabus: Units 1 to 4</Text>
            <Text style={styles.examDate}>🗓️ Scheduled: {new Date(exam.date).toLocaleDateString()}</Text>
          </View>
          <View style={styles.countdownBadge}>
            <Text style={styles.countdownNumber}>{(idx + 1) * 3}d</Text>
            <Text style={styles.countdownLabel}>left</Text>
          </View>
        </View>
      ))}

      {/* Daily Notice / Tip */}
      <View style={styles.tipCard}>
        <Text style={styles.tipEmoji}>💡</Text>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>School Tip of the Day</Text>
          <Text style={styles.tipText}>
            Revision notes for General Science Chapter 3 are available in the Study Materials tab. Remember to bring your geometry set tomorrow.
          </Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b1329",
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
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#60a5fa",
  },
  avatarText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  studentName: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
  },
  studentClass: {
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
    backgroundColor: "#2563eb25",
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
  presentBadge: {
    backgroundColor: "#065f46",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  presentBadgeText: {
    color: "#34d399",
    fontSize: 9,
    fontWeight: "800",
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
    backgroundColor: "#172554",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1e40af",
  },
  quickNavIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  quickNavText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#93c5fd",
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
    color: "#60a5fa",
    fontWeight: "700",
  },
  timelineList: {
    marginBottom: 16,
    gap: 8,
  },
  classCard: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 12,
  },
  classCardActive: {
    borderColor: "#3b82f6",
    backgroundColor: "#1e293b",
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  periodCol: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: "#334155",
    width: 60,
  },
  periodNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: "#94a3b8",
  },
  periodNumberActive: {
    color: "#60a5fa",
  },
  periodTime: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
    textAlign: "center",
  },
  classInfo: {
    flex: 1,
  },
  classTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  classSubject: {
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
  classTopic: {
    fontSize: 11,
    color: "#cbd5e1",
    marginBottom: 6,
  },
  classFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  classTeacher: {
    fontSize: 10,
    color: "#94a3b8",
  },
  classRoom: {
    fontSize: 10,
    color: "#64748b",
  },
  hwCard: {
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 10,
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
  hwDue: {
    fontSize: 10,
    color: "#f87171",
    fontWeight: "700",
  },
  hwTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: 18,
    marginBottom: 12,
  },
  hwActionRow: {
    flexDirection: "row",
    gap: 8,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  submitBtnText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  viewNotesBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#334155",
  },
  viewNotesBtnText: {
    color: "#cbd5e1",
    fontSize: 11,
    fontWeight: "600",
  },
  examCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 8,
    gap: 12,
  },
  examIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#4338ca30",
    alignItems: "center",
    justifyContent: "center",
  },
  examEmoji: {
    fontSize: 18,
  },
  examInfo: {
    flex: 1,
  },
  examName: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
  examSubject: {
    fontSize: 11,
    color: "#94a3b8",
    marginTop: 1,
  },
  examDate: {
    fontSize: 10,
    color: "#60a5fa",
    marginTop: 2,
    fontWeight: "600",
  },
  countdownBadge: {
    backgroundColor: "#312e81",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  countdownNumber: {
    fontSize: 14,
    fontWeight: "800",
    color: "#a5b4fc",
  },
  countdownLabel: {
    fontSize: 8,
    color: "#818cf8",
    textTransform: "uppercase",
  },
  tipCard: {
    flexDirection: "row",
    backgroundColor: "#1e1b4b",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#3730a3",
    marginTop: 6,
    marginBottom: 10,
    gap: 10,
  },
  tipEmoji: {
    fontSize: 20,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: "#c7d2fe",
    marginBottom: 2,
  },
  tipText: {
    fontSize: 11,
    color: "#a5b4fc",
    lineHeight: 16,
  },
});