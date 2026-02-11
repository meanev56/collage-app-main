import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  PinchGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PREVIEW_SIZE = Math.min(SCREEN_WIDTH * 0.92, 440);

const TemplatePreviewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Example template data – in real app this comes from route.params
  const template = route.params?.template || {
    id: 'tpl-001',
    name: 'Vintage Summer Memories',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    description:
      'Warm tones, elegant frames, and vintage overlays — perfect for travel, family, and summer moments.',
    slots: 6,
    category: 'Travel • Lifestyle',
    free: true,
    tags: ['Vintage', 'Warm', 'Summer', 'Memories', 'Collage'],
    author: {
      name: 'CreativeStudio',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
  };

  // Example: number of photos user already selected (passed via navigation or context)
  const userSelectedPhotos = route.params?.userSelectedPhotos || 3;

  const [isFavorite, setIsFavorite] = useState(false);

  // ─── Zoom & Pan Animation Values ───────────────────────────────
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchHandler = {
    onStart: (_, ctx) => {
      ctx.startScale = scale.value;
    },
    onActive: (event, ctx) => {
      scale.value = ctx.startScale * event.scale;
    },
    onEnd: () => {
      savedScale.value = scale.value;
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      }
    },
  };

  const panHandler = {
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      if (scale.value > 1.05) {
        translateX.value = ctx.startX + event.translationX / scale.value;
        translateY.value = ctx.startY + event.translationY / scale.value;
      }
    },
    onEnd: () => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    },
  };

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  const handleUseTemplate = () => {
    if (userSelectedPhotos < template.slots) {
      Alert.alert(
        'Not enough photos',
        `This template requires ${template.slots} photos.\nYou currently have ${userSelectedPhotos}.\n\nWould you like to select more photos first?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Add Photos', onPress: () => navigation.navigate('GalleryPicker') },
        ]
      );
      return;
    }

    navigation.navigate('Collage', {
      selectedTemplate: template,
      userPhotos: route.params?.userPhotos || [],
    });
  };

  // Similar templates (you can fetch these based on category/tags in real app)
  const similarTemplates = [
    {
      id: 'tpl-002',
      name: 'Minimal Travel Diary',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    },
    {
      id: 'tpl-003',
      name: 'Cozy Autumn Moments',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
    },
    {
      id: 'tpl-004',
      name: 'City Lights Collage',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400',
    },
    {
      id: 'tpl-005',
      name: 'Romantic Sunset',
      image: 'https://images.unsplash.com/photo-1519741497674-281450d6b7e0?w=400',
    },
  ];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Template Preview</Text>
          <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? '#FF5A5F' : '#666'}
            />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Zoomable Preview */}
          <View style={styles.previewContainer}>
            <PinchGestureHandler onGestureEvent={pinchHandler}>
              <Animated.View>
                <PanGestureHandler onGestureEvent={panHandler}>
                  <Animated.Image
                    source={{ uri: template.image }}
                    style={[styles.previewImage, animatedImageStyle]}
                    resizeMode="contain"
                  />
                </PanGestureHandler>
              </Animated.View>
            </PinchGestureHandler>

            {template.free && (
              <View style={styles.freeBadge}>
                <Text style={styles.freeBadgeText}>Free</Text>
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.content}>
            <Text style={styles.templateName}>{template.name}</Text>

            <View style={styles.photoCountContainer}>
              <Text style={styles.photoCountLabel}>
                Required photos:{' '}
                <Text style={styles.requiredCount}>{template.slots}</Text>
              </Text>
              <Text style={styles.photoCountLabel}>
                You have:{' '}
                <Text
                  style={
                    userSelectedPhotos >= template.slots
                      ? styles.enoughPhotos
                      : styles.missingPhotos
                  }
                >
                  {userSelectedPhotos}
                </Text>
              </Text>

              {userSelectedPhotos < template.slots && (
                <Text style={styles.missingHint}>
                  You need {template.slots - userSelectedPhotos} more photo
                  {template.slots - userSelectedPhotos > 1 ? 's' : ''}
                </Text>
              )}
            </View>

            {template.author && (
              <View style={styles.authorContainer}>
                <Image source={{ uri: template.author.avatar }} style={styles.authorAvatar} />
                <Text style={styles.authorText}>
                  Created by <Text style={styles.authorName}>{template.author.name}</Text>
                </Text>
              </View>
            )}

            <View style={styles.tagsRow}>
              {template.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{template.description}</Text>

            {/* Action Button */}
            <TouchableOpacity style={styles.useButton} onPress={handleUseTemplate}>
              <Text style={styles.useButtonText}>Use This Template</Text>
            </TouchableOpacity>

            {/* Similar Templates */}
            <Text style={styles.sectionTitle}>Similar Templates</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.similarScroll}>
              {similarTemplates.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.similarItem}
                  onPress={() => {
                    // In real app: navigate to another preview or swap template
                    Alert.alert('Selected', item.name);
                  }}
                >
                  <Image source={{ uri: item.image }} style={styles.similarImage} />
                  <Text style={styles.similarName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default TemplatePreviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },

  previewContainer: {
    height: PREVIEW_SIZE + 40,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  previewImage: {
    width: PREVIEW_SIZE,
    height: PREVIEW_SIZE,
    borderRadius: 16,
  },
  freeBadge: {
    position: 'absolute',
    top: 36,
    right: 24,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  freeBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  templateName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },

  photoCountContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  photoCountLabel: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  requiredCount: {
    fontWeight: 'bold',
    color: '#333',
  },
  enoughPhotos: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  missingPhotos: {
    fontWeight: 'bold',
    color: '#FF5A5F',
  },
  missingHint: {
    marginTop: 8,
    fontSize: 14,
    color: '#FF5A5F',
    fontWeight: '500',
  },

  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorText: {
    fontSize: 15,
    color: '#555',
  },
  authorName: {
    fontWeight: '600',
    color: '#222',
  },

  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  tagText: {
    fontSize: 13,
    color: '#555',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 28,
  },

  useButton: {
    backgroundColor: '#FF5A5F',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 32,
    shadowColor: '#FF5A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  useButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

  similarScroll: {
    marginTop: 8,
  },
  similarItem: {
    width: 140,
    marginRight: 16,
    alignItems: 'center',
  },
  similarImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  similarName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
});