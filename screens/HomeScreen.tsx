import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  BIRTHDAY_TEMPLATES,
  DESIGN_OPTIONS,
  GRID_LAYOUTS,
  TEMPLATES,
} from "../constants/layouts";
import { GridLayout, Template, DesignOption } from "../types";
import GridItem from "../components/GridItem";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const TopNavIcon = ({ name, label }: { name: string; label: string }) => (
    <TouchableOpacity style={styles.topNavItem}>
      <View style={styles.topNavIconContainer}>
        <Ionicons name={name} size={24} color={"#FFF"} />
      </View>
      <Text style={styles.topNavLabel}>{label}</Text>
    </TouchableOpacity>
  );
  const DesignOptionItem = ({
    item,
    onPress,
  }: {
    item: DesignOption;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.designOptionItem}>
      <Ionicons name={item?.icon} size={24} color={"#888"} />
      <Text style={styles.designOptionLabel}>{item?.name}</Text>
    </TouchableOpacity>
  );

  const TemplateItem = ({
    item,
    onPress,
  }: {
    item: Template;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.templateItem}>
      <View style={styles.templatePreview}>
        <Image
          source={{ uri: item?.image }}
          style={styles.templateImage}
          resizeMode="cover"
        />
        <View style={styles.freeBadge}>
          <Text style={styles.freeBadgeText}>Free</Text>
        </View>

        <Text style={styles.templateName}>{item?.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleGridSelect = (grid: GridLayout) => {
    navigation.navigate("Collage", {
      selectedGrid: grid,
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.settingsIcon}>
            <Ionicons name={"settings-outline"} size={24} color={"#000"} />
          </TouchableOpacity>
          <View style={styles.searchContainer}>
            <Ionicons
              name={"search-outline"}
              size={20}
              color={"#888"}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Birthday, Love, Sale.."
            />
          </View>
          <TouchableOpacity style={styles.shopIcon}>
            <Ionicons name={"storefront-outline"} size={24} color={"#000"} />
          </TouchableOpacity>
        </View>

        <View style={styles.topNavIcons}>
          <TopNavIcon name="sparkles-outline" label="AI Tools" />
          <TopNavIcon name="cut-outline" label="AI Tools" />
          <TopNavIcon name="grid-outline" label="AI Tools" />
          <TopNavIcon name="happy-outline" label="AI Tools" />
          <TopNavIcon name="color-palette-outline" label="AI Tools" />
        </View>

        <View style={styles.section}>
          <FlatList
            horizontal
            data={DESIGN_OPTIONS}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            renderItem={({ item }) => (
              <DesignOptionItem
                item={item}
                onPress={() => handleDesignOptionSelect(item)}
              />
            )}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Grid</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={GRID_LAYOUTS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <GridItem item={item} onPress={() => handleGridSelect(item)} />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Spring Story</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={TEMPLATES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TemplateItem
                item={item}
                onPress={() => handleTemplateSelect(item)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Happy Birthday Card</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            data={BIRTHDAY_TEMPLATES}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TemplateItem
                item={item}
                onPress={() => handleTemplateSelect(item)}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  topNav: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingsIcon: {
    marginRight: 6,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  shopIcon: {
    marginLeft: 8,
  },
  topNavIcons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  topNavItem: {
    alignItems: "center",
  },
  topNavIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FF5A5F",
    justifyContent: "center",
    alignItems: "center",
  },
  topNavLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
  },
  section: {
    marginVertical: 20,
  },
  designOptionItem: {
    alignItems: "center",
    marginRight: 20,
  },
  designOptionLabel: {
    marginTop: 6,
    fontSize: 12,
    color: "#666",
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  seeAll: {
    fontSize: 14,
    color: "#FF5A5F",
    fontWeight: "600",
  },
  templateItem: {
    marginRight: 12,
  },
  templatePreview: {
    width: 120,
    height: 200,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  templateImage: {
    width: 120,
    height: 200,
    borderRadius: 12,
  },
  freeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#000",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freeBadgeText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "bold",
  },
  templateName: {
    position: "absolute",
    bottom: 8,
    fontSize: 12,
    color: "#333",
    fontWeight: "500",
    textAlign: "center",
    width: "100%",
    paddingVertical: 2,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
});
