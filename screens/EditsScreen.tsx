import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import ViewShot from 'react-native-view-shot';
import Slider from '@react-native-community/slider';

import { GRID_LAYOUTS } from '../constants/layouts'; // your file

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_PADDING = 20;
const PREVIEW_SIZE = SCREEN_WIDTH - PREVIEW_PADDING * 2;

const EditsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedGrid } = route.params || { selectedGrid: GRID_LAYOUTS[0] };

  const viewShotRef = useRef(null);

  const [photos, setPhotos] = useState([]); // array of { id, uri }
  const [brightness, setBrightness] = useState(1);
  const [contrast, setContrast] = useState(1);
  const [saturation, setSaturation] = useState(1);
  const [text, setText] = useState('');
  const [activeTab, setActiveTab] = useState('adjust');

  // ──────────────────────────────────────────────
  // 1. IMAGE PICKER
  // ──────────────────────────────────────────────
  const pickImage = async () => {
    if (photos.length >= (selectedGrid.slots || 9)) {
      Alert.alert('Limit reached', `This layout supports up to ${selectedGrid.slots || 9} photos.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.85,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotos(prev => [
        ...prev,
        { id: Date.now().toString(), uri: result.assets[0].uri },
      ]);
    }
  };

  const removePhoto = (id) => {
    setPhotos(prev => prev.filter(p => p.id !== id));
  };

  // ──────────────────────────────────────────────
  // 2. SIMPLE DYNAMIC GRID PREVIEW
  // ──────────────────────────────────────────────
  const renderGrid = () => {
    const count = selectedGrid.slots || 4;
    const perRow = Math.ceil(Math.sqrt(count));

    return (
      <View
        style={[
          styles.gridContainer,
          {
            aspectRatio: 1,
            width: PREVIEW_SIZE,
            flexDirection: 'row',
            flexWrap: 'wrap',
          },
        ]}
      >
        {Array(count).fill(0).map((_, index) => {
          const photo = photos[index];
          return (
            <View
              key={index}
              style={[
                styles.gridCell,
                { width: `${100 / perRow}%`, height: `${100 / perRow}%` },
              ]}
            >
              {photo ? (
                <>
                  <Image source={{ uri: photo.uri }} style={styles.gridImage} />
                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removePhoto(photo.id)}
                  >
                    <Ionicons name="close-circle" size={28} color="#FF5A5F" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.emptyCell} onPress={pickImage}>
                  <Ionicons name="add" size={40} color="#ccc" />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  // ──────────────────────────────────────────────
  // 3. EXPORT / SAVE
  // ──────────────────────────────────────────────
  const captureCollage = async () => {
    if (photos.length === 0) {
      Alert.alert('Nothing to save', 'Please add at least one photo.');
      return;
    }

    try {
      const uri = await viewShotRef.current?.capture?.();
      if (uri) {
        // Here you can:
        // 1. Save to gallery (expo-media-library)
        // 2. Share (expo-sharing)
        // 3. Upload to server
        Alert.alert('Saved!', `Collage captured.\nURI: ${uri.substring(0, 60)}...`);
        // navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Error', 'Could not save collage');
      console.error(e);
    }
  };

  // ──────────────────────────────────────────────
  // UI
  // ──────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Collage</Text>
        <TouchableOpacity onPress={captureCollage}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      {/* Preview */}
      <View style={styles.previewWrapper}>
        <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 0.92 }}>
          <View style={styles.canvas}>
            {renderGrid()}
            {text ? <Text style={styles.previewTextOverlay}>{text}</Text> : null}
          </View>
        </ViewShot>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {['adjust', 'text', 'sticker', 'bg'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && { color: '#FF5A5F' }]}>
              {tab === 'adjust' ? 'Adjust' : tab === 'text' ? 'Text' : tab === 'sticker' ? 'Stickers' : 'BG'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <ScrollView style={styles.controls}>
        {activeTab === 'adjust' && (
          <>
            <Text style={styles.controlLabel}>Brightness</Text>
            <Slider value={brightness} onValueChange={setBrightness} minimumValue={0} maximumValue={2} style={styles.slider} />

            <Text style={styles.controlLabel}>Contrast</Text>
            <Slider value={contrast} onValueChange={setContrast} minimumValue={0} maximumValue={2} style={styles.slider} />

            <Text style={styles.controlLabel}>Saturation</Text>
            <Slider value={saturation} onValueChange={setSaturation} minimumValue={0} maximumValue={2} style={styles.slider} />
          </>
        )}

        {activeTab === 'text' && (
          <>
            <Text style={styles.controlLabel}>Overlay Text</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Type something..."
              value={text}
              onChangeText={setText}
              multiline
            />
          </>
        )}

        {activeTab === 'sticker' && (
          <Text style={styles.comingSoon}>Stickers – coming soon</Text>
        )}

        {activeTab === 'bg' && (
          <Text style={styles.comingSoon}>Background colors/patterns – coming soon</Text>
        )}
      </ScrollView>

      {/* Quick add button */}
      <TouchableOpacity style={styles.fab} onPress={pickImage}>
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  saveText: { fontSize: 17, color: '#FF5A5F', fontWeight: '600' },

  previewWrapper: {
    padding: PREVIEW_PADDING,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  canvas: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  gridContainer: { overflow: 'hidden' },
  gridCell: {
    borderWidth: 1,
    borderColor: '#eee',
    position: 'relative',
  },
  gridImage: { flex: 1 },
  emptyCell: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'white',
    borderRadius: 14,
  },
  previewTextOverlay: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },

  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabActive: { borderBottomWidth: 3, borderBottomColor: '#FF5A5F' },
  tabText: { fontSize: 14, color: '#555', fontWeight: '500' },

  controls: { padding: 16 },
  controlLabel: { fontSize: 16, marginTop: 16, marginBottom: 8, fontWeight: '600' },
  slider: { height: 40 },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    marginTop: 8,
  },
  comingSoon: {
    marginTop: 40,
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
  },

  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF5A5F',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
});

export default EditsScreen;