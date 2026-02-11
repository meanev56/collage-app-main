import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { GridLayout } from "../types";

const GridItem = ({
  item,
  onPress,
}: {
  item: GridLayout;
  onPress: () => void;
}) => {
  const renderShape = () => {
    switch (item?.shape) {
      case "heart":
        return <View style={[styles.gridCell, styles.heartShape]} />;
      case "circle":
        return item.layout[0].map((_, j) => (
          <View key={j} style={[styles.gridCell, styles.circleShape]} />
        ));
      case "clover":
        return <View style={[styles.gridCell, styles.cloverShape]} />;
      case "hexagon":
        return item.layout[0].map((_, j) => (
          <View key={j} style={[styles.gridCell, styles.hexagonShape]} />
        ));
      default:
        return item.layout.map((row, i) => (
          <View key={i} style={styles.gridRow}>
            {row.map((cell, j) => (
              <View
                key={j}
                style={[
                  styles.gridCell,
                  {
                    flex:
                      Math.max(...row.filter((_, idx) => idx !== j)) === cell
                        ? 2
                        : 1,
                  },
                ]}
              />
            ))}
          </View>
        ));
    }
  };
  return (
    <TouchableOpacity style={styles.gridItem} onPress={onPress}>
      <View style={styles.gridPreview}>{renderShape()}</View>
    </TouchableOpacity>
  );
};

export default GridItem;

const styles = StyleSheet.create({
  gridItem: {
    marginRight: 12,
  },
  gridPreview: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  gridRow: {
    flex: 1,
    flexDirection: "row",
  },
  gridCell: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#F9F9F9",
  },
  heartShape: {
    width: 60,
    height: 60,
    backgroundColor: "#F9F9F9",
    borderRadius: 30,
    transform: [{ rotate: "45deg" }],
    position: "relative",
    overflow: "hidden",
  },
  circleShape: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
    marginHorizontal: 4,
  },
  cloverShape: {
    width: 60,
    height: 60,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 30,
    position: 'relative',
  },
  hexagonShape: {
    width: 30,
    height: 34,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginHorizontal: 4,
    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
  },
});
