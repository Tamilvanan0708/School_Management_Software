import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { api, setAuthToken } from "../lib/api";

function decodeJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    if (typeof atob === "function") {
      return JSON.parse(atob(base64));
    }
    // Fallback simple base64 decoder
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let str = "";
    for (let i = 0; i < base64.length; i += 4) {
      const a = chars.indexOf(base64.charAt(i));
      const b = chars.indexOf(base64.charAt(i + 1));
      const c = chars.indexOf(base64.charAt(i + 2));
      const d = chars.indexOf(base64.charAt(i + 3));
      str += String.fromCharCode((a << 2) | (b >> 4));
      if (c !== 64 && c !== -1) str += String.fromCharCode(((b & 15) << 4) | (c >> 2));
      if (d !== 64 && d !== -1) str += String.fromCharCode(((c & 3) << 6) | d);
    }
    return JSON.parse(str);
  } catch {
    return null;
  }
}

const MOBILE_DEMO_ACCOUNTS = [
  { role: "Parent", email: "parent@demo.com", pass: "password123", icon: "👨‍👩‍👦", subtitle: "Attendance & Fees" },
  { role: "Student", email: "aarav@demo.com", pass: "password123", icon: "🎓", subtitle: "Homework & Timetable" },
  { role: "Teacher", email: "teacher@demo.com", pass: "password123", icon: "🧑‍🏫", subtitle: "Take Attendance & Marks" },
  { role: "School Owner", email: "owner@demo.com", pass: "owner123", icon: "👑", subtitle: "Executive Overview" },
];

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (customEmail?: string, customPass?: string) => {
    const targetEmail = customEmail || email;
    const targetPass = customPass || password;

    if (!targetEmail || !targetPass) {
      Alert.alert("Required", "Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(targetEmail, targetPass);
      setAuthToken(res.accessToken);
      const decoded = decodeJwt(res.accessToken);
      const roles: string[] = decoded?.roles || [];
      const primaryRole = roles[0] || "";

      if (primaryRole === "teacher") {
        router.replace("/teacher/today" as any);
      } else if (primaryRole === "parent") {
        router.replace("/parent/today" as any);
      } else if (primaryRole === "owner" || primaryRole === "principal" || primaryRole === "admin") {
        router.replace("/owner/today" as any);
      } else {
        router.replace("/student/today" as any);
      }
    } catch (err: any) {
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const quickDemoLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    handleLogin(demoEmail, demoPass);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoIcon}>🎓</Text>
        </View>
        <Text style={styles.schoolName}>Demo International School</Text>
        <Text style={styles.appTagline}>Official Mobile Portal</Text>
      </View>

      {/* Form Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Sign In</Text>
        <Text style={styles.cardSubtitle}>Access your student, parent, or faculty dashboard</Text>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="name@school.edu"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => handleLogin()}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Sign In ➔</Text>
          )}
        </TouchableOpacity>

        {/* 1-Click Role Switcher */}
        <View style={styles.demoSection}>
          <View style={styles.demoHeader}>
            <Text style={styles.demoTitle}>⚡ 1-CLICK DEMO LOGIN</Text>
            <Text style={styles.demoHint}>Tap role to test</Text>
          </View>

          <View style={styles.demoGrid}>
            {MOBILE_DEMO_ACCOUNTS.map((item) => (
              <TouchableOpacity
                key={item.role}
                style={styles.demoButton}
                onPress={() => quickDemoLogin(item.email, item.pass)}
                activeOpacity={0.7}
              >
                <Text style={styles.demoIcon}>{item.icon}</Text>
                <View style={styles.demoTextContainer}>
                  <Text style={styles.demoRole}>{item.role}</Text>
                  <Text style={styles.demoSubtitle} numberOfLines={1}>{item.subtitle}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.footerText}>© 2026 Demo International School · All Rights Reserved</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#0f172a",
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#2563eb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  logoIcon: {
    fontSize: 32,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: -0.3,
  },
  appTagline: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#0f172a",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
    marginBottom: 20,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    fontSize: 14,
    color: "#0f172a",
    backgroundColor: "#f8fafc",
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
  demoSection: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  demoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  demoTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#64748b",
    letterSpacing: 0.5,
  },
  demoHint: {
    fontSize: 11,
    color: "#94a3b8",
  },
  demoGrid: {
    gap: 8,
  },
  demoButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#f8fafc",
  },
  demoIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  demoTextContainer: {
    flex: 1,
  },
  demoRole: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1e293b",
  },
  demoSubtitle: {
    fontSize: 10,
    color: "#64748b",
    marginTop: 1,
  },
  footerText: {
    textAlign: "center",
    color: "#64748b",
    fontSize: 11,
    marginTop: 24,
  },
});