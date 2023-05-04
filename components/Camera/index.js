import React, { useState, useEffect } from "react";
import { Image, View, Platform, TextInput, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import { Button, Icon } from "@rneui/themed";
const BASE_URL =
  // "https://e3cc-2001-ee0-4c4c-9510-f490-27d6-4a18-556f.ngrok-free.app";
  "http://192.168.1.4:8888";
export default function ImagePickerExample() {
  const [image, setImage] = useState(null);
  const [selectedValue, setSelectedValue] = useState("RNN");

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
    });

    // Explore the result
    console.log(result);

    if (!result.canceled) {
      setImage(result.uri);
      console.log(result.uri);
    }
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const [first, setfirst] = useState();
  useEffect(() => {
    if (!image) return;
    const datas = new FormData();

    datas.append("file", {
      uri: Platform.OS === "android" ? image : image.replace("file://", ""),
      name: "image.jpg",
      type: "image/jpeg",
    });
    axios({
      method: "POST",
      url: BASE_URL + "/api/upload",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Content-Type": "multipart/form-data", // add this
      },
      data: datas,
    })
      .then((e) => {
        if (e?.data?.[0]) {
          setfirst(e?.data?.[0]);
        }
      })
      .catch((e) => {
        alert(e?.response?.data?.message || e?.message);
      });
  }, [image]);
  const [rs, setRS] = useState();
  useEffect(() => {
    if (!first) return;

    axios({
      method: "POST",
      url: BASE_URL + "/api/predict",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: { text: first, model: selectedValue },
    })
      .then((e) => {
        setRS(e?.data);
        // alert(e?.data);
      })
      .catch((e) => {
        alert(e?.response?.data?.message || e?.message);
      });
  }, [first, selectedValue]);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        // justifyContent: "center",
        width: "100%",
        // backgroundColor: "red",
      }}
    >
      <Text
        style={{
          fontSize: 30,
          fontWeight: "bold",
          marginTop: 40,
        }}
      >
        News Detection
      </Text>
      <View
        style={{
          marginTop: 50,
          marginBottom: 20,
          flexDirection: "row",
          // backgroundColor: "yellow",
        }}
      >
        <View style={{ marginRight: 100 }}>
          <Button
            onPress={openCamera}
            icon={{
              name: "camera",
              type: "ant",
              color: "#3C486B",
              size: 60,
            }}
            type="outline"
            buttonStyle={{
              width: 100,
              height: 100,
              borderRadius: 100,
              borderColor: "#3C486B",
              borderWidth: 2,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 16,
              color: "#3C486B",
            }}
          >
            Take Photo
          </Text>
        </View>
        <View style={{ height: 150 }}>
          <Button
            onPress={pickImage}
            icon={{
              name: "photo",
              type: "ant",
              color: "#3C486B",
              size: 60,
            }}
            type="outline"
            buttonStyle={{
              width: 100,
              height: 100,
              borderRadius: 100,
              borderColor: "#3C486B",
              borderWidth: 2,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 16,
              color: "#3C486B",
            }}
          >
            Choose Photo
          </Text>
        </View>
      </View>

      <View
        style={{
          width: 400,
          height: 200,
          borderRadius: 10,
          backgroundColor: "#F6F1F1",
          justifyContent: "center",
          marginBottom:10
        }}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ flex: 1, width: null, height: null }}
            resizeMode="contain"
          />
        ) : (
          <Text
            style={{
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 24,
              color: "#146C94",
            }}
          >
            Image View
          </Text>
        )}
      </View>
      <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 300, color: "#3C486B" }}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item value="RNN" label="Model:  LSTM" />
        <Picker.Item value="NB" label="Model:  Naive Bayes" />
        <Picker.Item value="DT" label="Model:  Decision Tree" />
        <Picker.Item value="SVM" label="Model:  SVM" />
      </Picker>
      {first && (
        <TextInput
          style={{
            marginTop: 10,
            marginBottom: 20,
            width: 400,
            height: 200,
            backgroundColor: "#F6F1F1",
            padding: 5,
            borderRadius: 10,
            color: "#222222",
            textAlign: "center",
          }}
          value={first}
          numberOfLines={10}
          multiline={true}
        />
      )}
      {rs && (
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#146C94" }}>
          Predict:{" "}
          {rs.split(";")[0] === "0"
            ? "Real"
            : rs.split(";")[0] === "2"
            ? "No Text Selected"
            : "Unsubstantiated"}
        </Text>
      )}
      {rs && (
        <Text style={{ fontSize: 24, fontWeight: "bold", color: "#146C94" }}>
          Topic: {rs.split(";")[1]}
        </Text>
      )}
    </View>
  );
}