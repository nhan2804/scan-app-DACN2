import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, TextInput, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
const BASE_URL =
  "https://1139-2001-ee0-4c76-8c40-4167-7a93-1e27-8151.ngrok-free.app/";
export default function ImagePickerExample() {
  const [image, setImage] = useState(null);

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
      // aspect: [4, 3],
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
    datas.append("text", "Nhaan test");
    axios({
      method: "POST",
      url: BASE_URL + "/api/upload",
      headers: {
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
    const datas = new FormData();

    datas.append("text", first);
    datas.append("model", "RNN");

    axios({
      method: "POST",
      url: BASE_URL + "/api/predict",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: { text: first, model: "RNN" },
    })
      .then((e) => {
        setRS(e?.data);
        alert(e?.data || "oke");
      })
      .catch((e) => {
        alert(e?.response?.data?.message || e?.message);
      });
  }, [first]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from camera rolls" onPress={pickImage} />
      <Button title="With camera " onPress={openCamera} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      {first && <TextInput value={first} numberOfLines={10} multiline={true} />}
      {rs && (
        <Text>
          {rs.split(";")[0] === "0"
            ? "Real"
            : rs.split(";")[0] === "2"
            ? "No Text Selected"
            : "Fake"}
        </Text>
      )}
    </View>
  );
}
