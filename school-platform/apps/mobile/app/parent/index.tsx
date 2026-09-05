import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function ParentHomeScreen() {
  const router = useRouter();

  const menuItems = [
    { title: "Today", route: "/parent/today", icon: "📅" },
    { title: "Children", route: "/parent/children", icon: "👶" },
    { title: "Attendance", route: "/parent/attendance", icon: "✅" },
    { title: "Homework", route: "/parent/homework", icon: "📝" },
    { title: "Assignments", route: "/parent/assignments", icon: "📋" },
    { title: "Exams", route: "/parent/exams", icon: "📊" },
    { title: "Results", route: "/parent/results", icon: "🏆" },
    { title: "Fees", route: "/parent/fees", icon: "💰" },
    { title: "Timetable", route: "/parent/timetable", icon: "📚" },
    { title: "Messages", route: "/parent/messages", icon: "💬" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Parent Dashboard</Text>
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
  greeting: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  row: { justifyContent: "space-between" },
  card: { flex: 1, backgroundColor: "#fff", padding: 20, margin: 6, borderRadius: 12, alignItems: "center", elevation: 2 },
  icon: { fontSize: 28, marginBottom: 8 },
  cardTitle: { fontSize: 14, fontWeight: "600" },
});