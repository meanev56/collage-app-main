import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  GRID_LAYOUTS,
  TEMPLATES,
  BIRTHDAY_TEMPLATES,
  DESIGN_OPTIONS,
} from '../constants/layouts';
import { GridLayout, Template, DesignOption } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // two cards per row with spacing

const CreateScreen = () => {
  const navigation = useNavigation();

  // Navigate to editing screen with selected layout
  const handleStartCollage = (layout: GridLayout) => {
    navigation.navigate('Collage', {
      selectedGrid: layout,
    });
  };

  const handleSelectTemplate = (template: Template) => {
    // You can pass template info if you want pre-filled collage
    navigation.navigate('Collage', {
      selectedGrid: GRID_LAYOUTS.find(g => g.id === template.gridId) || GRID_LAYOUTS[0],
      templateId: template.id,
    });
  };

  // Reusable small card for layouts / templates
  const LayoutCard = ({ item, onPress }: { item: GridLayout; onPress: () => void }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.cardImageContainer}>
        {/* Simple visual representation of the grid */}
        <View style={[styles.gridPreview, { aspectRatio: item.aspectRatio || 1 }]}>
          {Array(item.slots || 4)
            .fill(0)
            .map((_, i) => (
              <View
                key={i}
                style={[
                  styles.gridCellPreview,
                  {
                    flex: 1,
                    backgroundColor: '#e0e0e0',
                    margin: 2,
                    borderRadius: 4,
                  },
                ]}
              />
            ))}
        </View>
      </View>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text style={styles.cardSubtitle}>{item.slots || 4} photos</Text>
    </TouchableOpacity>
  );

  const TemplateCard = ({ item, onPress }: { item: Template; onPress: () => void }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: item.image }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        {item.free && (
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>Free</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const TopActionButton = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={28} color="#FFF" />
      </View>
      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header / Search */}
        <View style={styles.topBar}>
          <Text style={styles.screenTitle}>Create</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Quick Start Actions */}
        <View style={styles.quickActions}>
          <TopActionButton
            icon="images-outline"
            label="Blank Canvas"
            onPress={() => handleStartCollage(GRID_LAYOUTS[0])}
          />
          <TopActionButton
            icon="grid-outline"
            label="Choose Layout"
            onPress={() => {} /* could scroll to layouts section */}
          />
          <TopActionButton
            icon="sparkles-outline"
            label="AI Collage"
            onPress={() => Alert.alert('Coming soon', 'AI-powered collage generation')}
          />
        </View>

        {/* Popular Layouts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Layouts</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={GRID_LAYOUTS.slice(0, 6)}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.gridList}
            renderItem={({ item }) => (
              <LayoutCard item={item} onPress={() => handleStartCollage(item)} />
            )}
          />
        </View>

        {/* Templates / Themes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Templates</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={TEMPLATES.slice(0, 6)}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.gridList}
            renderItem={({ item }) => (
              <TemplateCard item={item} onPress={() => handleSelectTemplate(item)} />
            )}
          />
        </View>

        {/* Birthday / Special Occasion */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Birthday & Celebration</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={BIRTHDAY_TEMPLATES.slice(0, 4)}
            keyExtractor={item => item.id}
            numColumns={2}
            contentContainerStyle={styles.gridList}
            renderItem={({ item }) => (
              <TemplateCard item={item} onPress={() => handleSelectTemplate(item)} />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  searchButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },

  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FF5A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
  },

  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
  },
  seeAll: {
    fontSize: 15,
    color: '#FF5A5F',
    fontWeight: '600',
  },

  gridList: {
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardImageContainer: {
    backgroundColor: '#f8f8f8',
  },
  cardImage: {
    width: '100%',
    height: CARD_WIDTH * 1.3,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  gridPreview: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    padding: 6,
  },
  gridCellPreview: {
    backgroundColor: '#ddd',
  },
  cardOverlay: {
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#777',
  },
  freeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});