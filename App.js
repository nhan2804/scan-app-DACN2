// import { ThemeProvider, createTheme } from "@rneui/themed";
import { Button } from "@rneui/base";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
// import ScanPage from "./components/Scan";
import ImagePickerExample from "./components/Camera";
// const theme = createTheme({
//   components: {
//     Button: {
//       raised: true,
//     },
//   },
// });
export default function App() {
  return (
    // <ThemeProvider theme={theme}>
    <View style={styles.container}>
      <ImagePickerExample />
    </View>
    // </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
