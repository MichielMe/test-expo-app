import { View, StyleSheet, ImageSourcePropType, Platform } from "react-native";
import ImageViewer from "@/components/ImageViewer";
import Button from "@/components/Button";
import CircleButton from "@/components/CircleButton";
import IconButton from "@/components/IconButton";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, useRef } from "react";
import EmojiPicker from "@/components/EmojiPicker";
import React from "react";
import EmojiList from "@/components/EmojiList";
import EmojiSticker from "@/components/EmojiSticker";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";
import { Image } from "react-native";
import domtoimage from "dom-to-image";
const PlaceholderImage = require("@/assets/images/background-image.png");

export default function Index() {
  const imageRef = useRef(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (permissionResponse?.granted) {
      requestPermission();
    }
  }, []);

  const [pickedEmoji, setPickedEmoji] = useState<
    ImageSourcePropType | undefined
  >(undefined);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
    } else {
      alert("You need to provide a photo");
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onAddSticker = () => {
    console.log("Add sticker");
    setIsModalVisible(true);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS === "web") {
      try {
        // @ts-ignore
        const dataUrl = await domtoimage.toJpeg(imageRef.current, {
          quality: 0.95,
          width: 800,
          height: 600,
        });
        let link = document.createElement("a");
        link.download = "image.jpeg";
        link.href = dataUrl;

        link.click();
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Save image");
      try {
        const localUri = await captureRef(imageRef, {
          height: 400,
          quality: 1,
        });
        await MediaLibrary.saveToLibraryAsync(localUri);
        if (localUri) {
          alert("Saved");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View collapsable={false} ref={imageRef} style={styles.imageContainer}>
        <ImageViewer imgSource={selectedImage || PlaceholderImage} />
        {pickedEmoji !== undefined && (
          <EmojiSticker imageSize={50} stickerSource={pickedEmoji} />
        )}
      </View>

      {showAppOptions ? (
        <View style={styles.optionsContainer}>
          <View style={styles.optionsRow}>
            <IconButton icon="refresh" label="Reset" onPress={onReset} />
            <CircleButton onPress={onAddSticker} />
            <IconButton
              icon="save-alt"
              label="Save"
              onPress={onSaveImageAsync}
            />
          </View>
        </View>
      ) : (
        <View style={styles.footerContainer}>
          <Button
            onPress={pickImageAsync}
            label="Choose a photo"
            theme="primary"
          />
          <Button
            label="Use this photo"
            onPress={() => setShowAppOptions(true)}
          />
        </View>
      )}
      <EmojiPicker isVisible={isModalVisible} onClose={onModalClose}>
        <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
      </EmojiPicker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#25292e",
    flex: 1,
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
});
