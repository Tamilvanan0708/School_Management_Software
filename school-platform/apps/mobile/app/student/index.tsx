import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { api } from "../../lib/api";

export default function StudentHomeScreen() {
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    api.dashboard.today().then(setProfile).catch(() => {});
  }, []);

  const menuItems = [
    { title: "Today", route: "/student/today", icon: "📅" },
    { title: "Timetable", route: "/student/timetable", icon: "📚" },
    { title: "Homework", route: "/student/homework", icon: "📝" },
    { title: "Assignments", route: "/student/assignments", icon: "📋" },
    { title: "Attendance", route: "/student/attendance", icon: "✅" },
    { title: "Exams", route: "/student/exams", icon: "📊" },
    { title: "Results", route: "/student/results", icon: "🏆" },
    { title: "Materials", route: "/student/materials", icon: "📖" },
    { title: "Calendar", route: "/student/calendar", icon: "🗓️" },
    { title: "Messages", route: "/student/messages", icon: "💬" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        Welcome{profile?.name ? `, ${profile.name}` : ""}!
      </Text>
      {profile?.className && (
        <Text style={styles.info}>
          {profile.className} - {profile.section}
        </Text>
      )}
      <FlatList
        data={menuItems}
        numColumns={2}
        keyExtractor={(item) => item.route}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(item.route as any)}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  greeting: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  info: { fontSize: 14, color: "#666", marginBottom: 16 },
  row: { justifyContent: "space-between" },
  card: { flex: 1, backgroundColor: "#fff", padding: 20, margin: 6, borderRadius: 12, alignItems: "center", elevation: 2 },
  icon: { fontSize: 28, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: "600" },
});