import { Button } from "@rneui/base";
import { StyleSheet, Text, View } from "react-native";
import ImageCropPicker from "react-native-image-crop-picker";
const ScanPage = () => {
  const Open = () => {
    // ImageCropPicker.openCamera({
    //   width: 300,
    //   height: 400,
    //   cropping: true,
    // }).then((image) => {
    //   console.log(image);
    // });
    console.log({ ImageCropPicker });
  };
  return <Button onPress={Open}>openCamera</Button>;
};

export default ScanPage;
