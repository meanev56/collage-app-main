import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { use, useRef, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { GridLayout } from "../types";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { captureRef } from "react-native-view-shot";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CANVAS_SIZE = SCREEN_WIDTH - 40;

const ASPECT_RATIOS = [
  { name: "Free Crop", icon: "crop-outline", ratio: null },
  { name: "1:1", icon: "square-outline", ratio: 1 / 1 },
  { name: "4:5", icon: "crop-outline", ratio: 4 / 5 },
  { name: "3:4", icon: "crop-outline", ratio: 3 / 4 },
  { name: "9:16", icon: "crop-outline", ratio: 9 / 16 },
  { name: "16:9", icon: "crop-outline", ratio: 16 / 9 },
  { name: "3:2", icon: "crop-outline", ratio: 3 / 2 },
  { name: "2:3", icon: "crop-outline", ratio: 2 / 3 },
];

const CollageScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedGrid } = route?.params as { selectedGrid: GridLayout };

  const totalContainers = selectedGrid.layout
    .flat()
    .filter((v, i, a) => a.indexOf(v) === i).length;
  const [images, setImages] = useState<(string | null)[]>(
    Array(totalContainers).fill(null)
  );
  const layoutRef = useRef<View>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState<
    number | null
  >(null);
  const [cropPosition, setCropPosition] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  });
  const [isDownloading, setIsDownloading] = useState(false);

  const pickImage = async (containerIndex: number) => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Denied",
        "Permission to access gallery is required"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setPreviewImage(result.assets[0].uri);
      setSelectedContainerIndex(containerIndex);
      setModalVisible(true);
    }
  };

  const createPanResponder = (edge: "top" | "bottom" | "left" | "right") =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        setCropPosition((prev) => {
          const maxCrop =
            edge == "top" || edge == "bottom"
              ? (SCREEN_HEIGHT * 0.7 - 150) * 0.4
              : (SCREEN_WIDTH - 80) * 0.4;

          const minCrop = 0;
          let newValue =
            prev[edge] +
            (edge === "top" || edge == "left"
              ? -gestureState.dy
              : gestureState.dy);
          if (edge === "left" || edge === "right") {
            newValue =
              prev[edge] +
              (edge === "left" ? -gestureState.dx : gestureState.dx);
          }
          newValue = Math.max(minCrop, Math.min(newValue, maxCrop));
          if (
            edge === "top" &&
            prev.bottom + newValue > (SCREEN_HEIGHT * 0.7 - 150) * 0.8 - 50
          )
            return prev;
          if (
            edge === "bottom" &&
            prev.top + newValue > (SCREEN_HEIGHT * 0.7 - 150) * 0.8 - 50
          )
            return prev;
          if (edge === "left" && prev.right + newValue > SCREEN_WIDTH - 80 - 50)
            return prev;
          if (edge === "right" && prev.left + newValue > SCREEN_WIDTH - 80 - 50)
            return prev;
          return { ...prev, [edge]: newValue };
        });
      },
    });

  const topPanResponder = createPanResponder("top");
  const bottomPanResponder = createPanResponder("bottom");
  const leftPanResponder = createPanResponder("left");
  const rightPanResponder = createPanResponder("right");

  const renderLayout = () => {
    const layoutStyle = {
      ...styles.layoutContainer,
      ...(isDownloading && styles.noBorder),
      ...(selectedGrid.shape === "heart" || selectedGrid.shape === "clover"
        ? { width: CANVAS_SIZE * 0.7, height: CANVAS_SIZE * 0.7 }
        : selectedGrid.shape === "circle"
        ? {
            width:
              CANVAS_SIZE * 0.2 * selectedGrid.layout[0].length +
              20 * (selectedGrid.layout[0].length - 1),
            height: CANVAS_SIZE * 0.2,
          }
        : selectedGrid.shape === "hexagon" && selectedGrid.cols !== 1
        ? {
            width:
              CANVAS_SIZE * 0.25 * selectedGrid.layout[0].length +
              10 * (selectedGrid.layout[0].length - 1),
            height: CANVAS_SIZE * 0.28,
          }
        : {}),
    };

    switch (selectedGrid.shape) {
      case "heart":
        return (
          <View style={layoutStyle} ref={layoutRef} collapsable={false}>
            <TouchableOpacity
              onPress={() => pickImage(0)}
              style={[styles.heartShape, isDownloading && styles.noBorder]}
            >
              {images[0] ? (
                <Image
                  source={{ uri: images[0] }}
                  style={[
                    styles.image,
                    styles.heartShape,
                    isDownloading && { borderWidth: 0 },
                  ]}
                />
              ) : (
                <Ionicons name="add" size={40} color="#888" />
              )}
            </TouchableOpacity>
          </View>
        );
      case "circle":
        return (
          <View style={layoutStyle} ref={layoutRef} collapsable={false}>
            {selectedGrid.layout[0].map((_, j) => (
              <TouchableOpacity
                key={j}
                onPress={() => pickImage(j)}
                style={[
                  styles.circleShape,
                  { marginHorizontal: 10 },
                  isDownloading && styles.noBorder,
                ]}
              >
                {images[j] ? (
                  <Image
                    source={{ uri: images[j] }}
                    style={[
                      styles.image,
                      styles.circleShape,
                      isDownloading && { borderWidth: 0 },
                    ]}
                  />
                ) : (
                  <Ionicons name="add" size={24} color="#888" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );
      case "clover":
        return (
          <View style={layoutStyle} ref={layoutRef} collapsable={false}>
            <TouchableOpacity
              onPress={() => pickImage(0)}
              style={[styles.cloverShape, isDownloading && styles.noBorder]}
            >
              {images[0] ? (
                <Image
                  source={{ uri: images[0] }}
                  style={[
                    styles.image,
                    styles.cloverShape,
                    isDownloading && { borderWidth: 0 },
                  ]}
                />
              ) : (
                <Ionicons name="add" size={40} color="#888" />
              )}
            </TouchableOpacity>
          </View>
        );
      case "hexagon":
        return selectedGrid.cols === 1 ? (
          <View
            style={[
              layoutStyle,
              { width: CANVAS_SIZE * 0.25, height: CANVAS_SIZE * 0.28 },
            ]}
            ref={layoutRef}
            collapsable={false}
          >
            <TouchableOpacity
              onPress={() => pickImage(0)}
              style={[styles.hexagonShape, isDownloading && styles.noBorder]}
            >
              {images[0] ? (
                <Image
                  source={{ uri: images[0] }}
                  style={[
                    styles.image,
                    styles.hexagonShape,
                    isDownloading && { borderWidth: 0 },
                  ]}
                />
              ) : (
                <Ionicons name="add" size={30} color="#888" />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <View style={layoutStyle} ref={layoutRef} collapsable={false}>
            {selectedGrid.layout[0].map((_, j) => (
              <TouchableOpacity
                key={j}
                onPress={() => pickImage(j)}
                style={[
                  styles.hexagonShape,
                  { marginHorizontal: 5 },
                  isDownloading && styles.noBorder,
                ]}
              >
                {images[j] ? (
                  <Image
                    source={{ uri: images[j] }}
                    style={[
                      styles.image,
                      styles.hexagonShape,
                      isDownloading && { borderWidth: 0 },
                    ]}
                  />
                ) : (
                  <Ionicons name="add" size={24} color="#888" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );
      default:
        return (
          <View style={layoutStyle} ref={layoutRef} collapsable={false}>
            {selectedGrid.layout.map((row, i) => (
              <View key={i} style={styles.gridRow}>
                {row.map((cell, j) => {
                  const containerIndex =
                    selectedGrid.layout
                      .slice(0, i)
                      .flat()
                      .filter((v, idx, a) => a.indexOf(v) === idx).length +
                    row
                      .slice(0, j + 1)
                      .filter((v, idx, a) => a.indexOf(v) === idx).length -
                    1;
                  return (
                    <TouchableOpacity
                      key={j}
                      onPress={() => pickImage(containerIndex)}
                      style={[
                        styles.gridCell,
                        {
                          flex:
                            Math.max(...row.filter((_, idx) => idx !== j)) ===
                            cell
                              ? 2
                              : 1,
                        },
                        isDownloading && styles.noBorder,
                      ]}
                    >
                      {images[containerIndex] ? (
                        <Image
                          source={{ uri: images[containerIndex] }}
                          style={[
                            styles.image,
                            isDownloading && { borderWidth: 0 },
                          ]}
                        />
                      ) : (
                        <Ionicons name="add" size={40} color="#888" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        );
    }
  };

  const handleDownload = async () => {
    if(images.some((image) => image  == null)){
      Alert.alert("Incomplete Collage","Please add images to all containers before downloading");
      return
    };

    const permissionResult = await MediaLibrary.requestPermissionsAsync();
    if(!permissionResult.granted){
      Alert.alert("Permission Denied","Permission to access media library is required to save the collage");
      return;
    };

    try{
      setIsDownloading(true);
      await new Promise((resolve) => setTimeout(resolve,100));
      if(!layoutRef.current){
        throw new Error("layout reference is not set");
      }
      const uri = await captureRef(layoutRef,{
        format:"png",
        quality:1
      });

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert("Success","Collage has been saved to your gallery");
    } catch(error){
      console.log("Errror",error)
    }finally{
      setIsDownloading(false)
    }
  }

  const applyImage = () => {
    if(previewImage && selectedContainerIndex !== null){
      const newImages = [...images];
      newImages[selectedContainerIndex] = previewImage;
      setImages(newImages);
      setModalVisible(false);
      setPreviewImage(null);
      setSelectedRatio(null);
      setCropPosition({top:0,left:0,right:0,bottom:0})
    }
  }

  const renderAspectRatioItem = ({
    item,
  }: {
    item: { name: string; icon: string; ratio: number | null };
  }) => (
    <TouchableOpacity
    onPress={() => {
      if(item?.name == "Free Crop"){
        setSelectedRatio(null);
      }else{
        setSelectedRatio(item.ratio);
        setCropPosition({top:0,bottom:0,left:0,right:0})
      }
    }}
      style={[
        styles.ratioItem,
        selectedRatio === item.ratio &&
          item.ratio !== null &&
          styles.selectedRatioItem,
        item.name === "Free Crop" &&
          selectedRatio === null &&
          styles.selectedRatioItem,
      ]}
    >
      <Ionicons
        name={item?.icon}
        size={24}
        color={
          selectedRatio == item?.ratio ||
          (item.name == "Free crop" && selectedRatio == null)
            ? "#FF5A5F"
            : "#888"
        }
      />
      <Text
        style={[
          styles.ratioLabel,

          selectedRatio == item?.ratio ||
          (item.name == "Free crop" && selectedRatio == null)
            ? styles.selectedRatioLabel
            : {},
        ]}
      >
        {item?.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name={"chevron-back"} size={24} color={"#000"} />
        </TouchableOpacity>
        <View style={styles.topBarActions}>
          <TouchableOpacity>
            <Ionicons name={"arrow-undo-outline"} size={24} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name={"arrow-redo-outline"} size={24} color={"#000"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDownload}>
            <Ionicons name={"download-outline"} size={24} color={"#000"} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.canvasArea, isDownloading && styles.noBackground]}>
        {renderLayout()}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.previewContainer}>
              {previewImage && (
                <View
                  style={[
                    styles.imageWrapper,
                    selectedRatio !== null && { aspectRatio: selectedRatio },
                  ]}
                >
                  <View
                    style={[
                      styles.cropContainer,
                      selectedRatio === null && {
                        width:
                          SCREEN_WIDTH -
                          80 -
                          (cropPosition.left + cropPosition.right),
                        height:
                          (SCREEN_HEIGHT * 0.7 - 150) * 0.8 -
                          (cropPosition.top + cropPosition.bottom),
                        top: cropPosition.top,
                        left: cropPosition.left,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: previewImage }}
                      style={[
                        styles.previewImage,
                        selectedRatio !== null
                          ? { aspectRatio: selectedRatio }
                          : { width: "100%", height: "100%" },
                      ]}
                      resizeMode="cover"
                    />
                  </View>
                  {selectedRatio === null && (
                    <>
                      <View
                        style={[styles.cropHandle, styles.topHandle]}
                        {...topPanResponder.panHandlers}
                      >
                        <View style={styles.handleLine} />
                      </View>
                      <View
                        style={[styles.cropHandle, styles.bottomHandle]}
                        {...bottomPanResponder.panHandlers}
                      >
                        <View style={styles.handleLine} />
                      </View>
                      <View
                        style={[styles.cropHandle, styles.leftHandle]}
                        {...leftPanResponder.panHandlers}
                      >
                        <View
                          style={[styles.handleLine, { width: 4, height: 40 }]}
                        />
                      </View>
                      <View
                        style={[styles.cropHandle, styles.rightHandle]}
                        {...rightPanResponder.panHandlers}
                      >
                        <View
                          style={[styles.handleLine, { width: 4, height: 40 }]}
                        />
                      </View>
                    </>
                  )}
                </View>
              )}
            </View>

            <View style={styles.ratioContainer}>
              <FlatList
                horizontal
                data={ASPECT_RATIOS}
                renderItem={renderAspectRatioItem}
                keyExtractor={(item) => item.name}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.ratioList}
              />
            </View>

            <TouchableOpacity style={styles.confirmButton} onPress={applyImage}>
              <Ionicons name="checkmark" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CollageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  topBarActions: {
    flexDirection: "row",
    gap: 10,
  },
  canvasArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noBackground: {
    backgroundColor: "transparent",
    padding: 0,
  },
  layoutContainer: {
    width: CANVAS_SIZE,
    height: CANVAS_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#1E90FF",
    borderStyle: "dashed",
    borderRadius: 4,
    backgroundColor: "transparent",
  },
  noBorder: {
    borderWidth: 0,
    borderColor: "transparent",
  },
  gridRow: {
    flex: 1,
    flexDirection: "row",
  },
  gridCell: {
    flex: 1,
    borderWidth: 2,
    borderColor: "#1E90FF",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heartShape: {
    width: CANVAS_SIZE * 0.7,
    height: CANVAS_SIZE * 0.7,
    borderRadius: CANVAS_SIZE * 0.35,
    transform: [{ rotate: "45deg" }],
    position: "relative",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#1E90FF",
    borderStyle: "dashed",
  },
  circleShape: {
    width: CANVAS_SIZE * 0.2,
    height: CANVAS_SIZE * 0.2,
    borderRadius: CANVAS_SIZE * 0.1,
    borderWidth: 2,
    borderColor: "#1E90FF",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cloverShape: {
    width: CANVAS_SIZE * 0.7,
    height: CANVAS_SIZE * 0.7,
    borderRadius: CANVAS_SIZE * 0.35,
    position: "relative",
    borderWidth: 2,
    borderColor: "#1E90FF",
    borderStyle: "dashed",
    overflow: "hidden",
  },
  hexagonShape: {
    width: CANVAS_SIZE * 0.25,
    height: CANVAS_SIZE * 0.28,
    borderWidth: 2,
    borderColor: "#1E90FF",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.7,
    padding: 20,
    flexDirection: "column",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: SCREEN_WIDTH - 80,
    height: (SCREEN_HEIGHT * 0.7 - 150) * 0.8,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    overflow: "hidden",
  },
  cropContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    position: "relative",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cropHandle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  topHandle: {
    top: 0,
    width: "100%",
    height: 20,
  },
  bottomHandle: {
    bottom: 0,
    width: "100%",
    height: 20,
  },
  leftHandle: {
    left: 0,
    width: 20,
    height: "100%",
  },
  rightHandle: {
    right: 0,
    width: 20,
    height: "100%",
  },
  handleLine: {
    width: 40,
    height: 4,
    backgroundColor: "#FF5A5F",
    borderRadius: 2,
  },
  ratioContainer: {
    marginBottom: 60,
  },
  ratioList: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  ratioItem: {
    alignItems: "center",
    marginRight: 20,
    paddingVertical: 8,
  },
  selectedRatioItem: {
    borderBottomWidth: 2,
    borderBottomColor: "#FF5A5F",
  },
  ratioLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  selectedRatioLabel: {
    color: "#FF5A5F",
    fontWeight: "bold",
  },
  confirmButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF5A5F",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
