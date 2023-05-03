import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
const BASE_URL =
  "https://e3cc-2001-ee0-4c4c-9510-f490-27d6-4a18-556f.ngrok-free.app";
export default function ImagePickerExample() {
  const [image, setImage] = useState(null);

  const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({});

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
      aspect: [4, 3],
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
      data: datas,
    })
      .then((e) => {
        setRS(e?.data);
      })
      .catch((e) => {
        alert(e?.response?.data?.message || e?.message);
      });
  }, [first]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="With camera " onPress={openCamera} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      {first && <TextInput value={first} numberOfLines={10} multiline={true} />}
    </View>
  );
}
