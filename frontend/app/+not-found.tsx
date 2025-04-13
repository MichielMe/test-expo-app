import { Text, View, StyleSheet } from "react-native";
import { Link, Stack } from "expo-router";
import React from "react";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          Go to home!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25292e",
  },
  text: {
    color: "#fff",
  },
  link: {
    color: "#25292e",
    marginTop: 20,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
});
