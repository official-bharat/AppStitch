import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import React, { useCallback, useRef, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { CheckmarkIcon } from '../../assets';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// dynamic island hardware dimensions

const ISLAND_COLLAPSED_WIDTH = 130;
const ISLAND_COLLAPSED_HEIGHT = 40;
const ISLAND_EXPANDED_WIDTH = SCREEN_WIDTH - 24;
const ISLAND_EXPANDED_HEIGHT = 90;

const AUTO_COLLAPSE_DELAY = 3000;

export const DynamicIsland = () => {
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const expandedAnim = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const [isExpanded, setIsExpanded] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const insets = useSafeAreaInsets();

  const collapsedTop = (insets.top - ISLAND_COLLAPSED_HEIGHT) / 2;
  const expandedTop = 11;

  const onPressIn = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.95, //You can adjust according to your need
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const isLandHeight = expandedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [ISLAND_COLLAPSED_HEIGHT, ISLAND_EXPANDED_HEIGHT],
  });

  const isLandWidth = expandedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [ISLAND_COLLAPSED_WIDTH, ISLAND_EXPANDED_WIDTH],
  });
  const borderRadius = expandedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 60],
  });

  const isLandLeft = expandedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      (SCREEN_WIDTH - ISLAND_COLLAPSED_WIDTH) / 2,
      (SCREEN_WIDTH - ISLAND_EXPANDED_WIDTH) / 2,
    ],
  });

  const isLandTop = expandedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [collapsedTop, expandedTop],
  });

  const collapse = useCallback(() => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
    }

    Animated.timing(contentOpacity, {
      toValue: 0,
      useNativeDriver: true,
      duration: 150,
    }).start();
    Animated.spring(expandedAnim, {
      toValue: 0,
      useNativeDriver: false,
      friction: 80,
      tension: 12,
    }).start();
  }, [contentOpacity, expandedAnim]);

  const expand = useCallback(() => {
    if (isExpanded) {
      return;
    }
    setIsExpanded(true);
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
    }

    Animated.spring(expandedAnim, {
      toValue: 1,
      useNativeDriver: false,
      friction: 11,
      tension: 65,
    }).start();

    Animated.timing(contentOpacity, {
      toValue: 1,
      useNativeDriver: true,
      duration: 300,
      delay: 150,
    }).start(() => {
      setIsExpanded(false);
    });

    collapseTimer.current = setTimeout(() => {
      collapse();
    }, AUTO_COLLAPSE_DELAY);
  }, [collapse, expandedAnim, isExpanded, contentOpacity]);

  return (
    <View style={styles.flex}>
      <StatusBar barStyle="dark-content" />

      {/* Dynamic Island Toast */}
      <View pointerEvents="box-none" style={styles.toastOverlay}>
        <Animated.View
          style={[
            styles.island,
            {
              width: isLandWidth,
              height: isLandHeight,
              borderRadius,
              left: isLandLeft,
              top: isLandTop,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.contentContainer}
            activeOpacity={1}
            onPress={() => {}}
          >
            <Animated.View
              style={[styles.expandingContent, { opacity: contentOpacity }]}
            >
              <View style={styles.iconContainer}>
                <CheckmarkIcon />
              </View>
              <View>
                <Text style={styles.titleStyle}>Payment Sucessful</Text>
                <Text style={styles.subtitleStyle}>
                  $2500 sent to App Stitch
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>
      </View>

      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.content}>
          <Text style={styles.title}>Dynamic Island Toast</Text>
          <Text style={styles.subtitle}>
            Work on all devices - with or without the Dynamic Island hardware
          </Text>
          <View style={styles.buttonContainerStyle}>
            <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
              <TouchableOpacity
                onPressIn={onPressIn}
                onPressOut={onPressOut}
                onPress={expand}
                style={[styles.button, styles.successButton]}
                activeOpacity={0.9}
              >
                <CheckmarkIcon />
                <Text style={styles.buttonText}>Show Success</Text>
              </TouchableOpacity>
            </Animated.View>
            <TouchableOpacity
              onPress={collapse}
              activeOpacity={0.9}
              style={[styles.button, styles.collapseButton]}
            >
              <Text style={styles.buttonTextDark}>Collapse</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>How It works</Text>
            <View style={styles.row}>
              <View style={styles.infoDot} />
              <Text style={styles.infoText}>
                Device with Dynamic Island (iPhone 14 Pro+): toast grows from
                notch area
              </Text>
            </View>
            <View style={styles.row}>
              <View style={[styles.infoDot, styles.blue]} />
              <Text style={styles.infoText}>
                Device with notch: toast appears below the notch area
              </Text>
            </View>
            <View style={styles.row}>
              <View style={[styles.infoDot, styles.orange]} />
              <Text style={styles.infoText}>
                Older Devices: toast appears at the top with safe padding
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeAreaView: {
    flex: 1,
  },
  content: {
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 34,
    color: '#000',
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  subtitle: {
    color: 'rgba(0,0,0,0.45)',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 40,
  },
  buttonContainerStyle: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 12,
    justifyContent: 'center',
  },
  successButton: {
    backgroundColor: '#1C1C1E',
  },
  buttonText: {
    color: 'rgba(255,255,255,1)',
    fontSize: 17,
    fontWeight: '600',
  },
  collapseButton: {
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  buttonTextDark: {
    color: 'rgba(0,0,0,0.55)',
    fontSize: 17,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    marginTop: 32,
    padding: 20,
    borderRadius: 16,
    alignItems: 'flex-start',
  },
  infoTitle: {
    color: 'rgba(0,0,0,0.4)',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 16,
  },
  infoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginTop: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 10,
  },
  infoText: {
    color: 'rgba(0,0,0,0.6)',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  blue: {
    backgroundColor: '#007AFF',
  },
  orange: {
    backgroundColor: '#FF9500',
  },
  toastOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
  island: {
    position: 'absolute',
    backgroundColor: '#000',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(52, 199, 89, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  subtitleStyle: {
    color: '#rgba(255, 255, 255, 0.55)',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  expandingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 16,
  },
  contentContainer: { flex: 1, justifyContent: 'flex-end' },
});
