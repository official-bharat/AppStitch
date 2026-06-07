import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Easing,
  PanResponder,
  StatusBar,
  ImageStyle,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  RewindIcon,
  StarIcon,
  MoreIcon,
} from '../../assets';
import { SONGS } from './songs.constants';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Playlist dataset of 10 songs with matching color profiles for the background

// --- Animated Dynamic Background component ---
interface DynamicBackgroundProps {
  colors: string[];
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({ colors }) => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors[0]} stopOpacity={1} />
            <Stop offset="35%" stopColor={colors[1]} stopOpacity={1} />
            <Stop offset="70%" stopColor={colors[2]} stopOpacity={1} />
            <Stop offset="100%" stopColor={colors[3]} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bgGrad)" />
      </Svg>

      {/* Dynamic Overlay to dim and bind colors nicely */}
      <View style={[styles.darkeningOverlay, styles.darkeningOverlayColor]} />
    </View>
  );
};

export const AppleMusicGradient: React.FC = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const currentSong = SONGS[currentSongIndex];
  const duration = currentSong.duration;

  // Track Layout sizes for slider responders
  const [scrubberWidth, setScrubberWidth] = useState<number>(0);

  // FlatList ref for paging the album art
  const flatListRef = useRef<FlatList>(null);

  // Animations values
  const albumArtScale = useRef(new Animated.Value(0.9)).current;
  const albumArtShadow = useRef(new Animated.Value(0.3)).current;

  // Track timers for slider gestures
  const startTouchX = useRef<number>(0);
  const startValPercent = useRef<number>(0);

  // Scrubber timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => {
          if (prevTime >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPlaying, duration]);

  // Album art zoom animation when play/pause toggles
  useEffect(() => {
    Animated.parallel([
      Animated.timing(albumArtScale, {
        toValue: isPlaying ? 1.0 : 0.9,
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: false,
      }),
      Animated.timing(albumArtShadow, {
        toValue: isPlaying ? 1.0 : 0.3,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // Scrubber PanResponder gesture controls
  const scrubberPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, _gestureState) => {
        startTouchX.current = evt.nativeEvent.locationX;
        const initialPercent = Math.max(
          0,
          Math.min(100, (evt.nativeEvent.locationX / scrubberWidth) * 100),
        );
        setCurrentTime(Math.round((initialPercent / 100) * duration));
        startValPercent.current = initialPercent;
      },
      onPanResponderMove: (evt, gestureState) => {
        const deltaPercent = (gestureState.dx / scrubberWidth) * 100;
        const newPercent = Math.max(
          0,
          Math.min(100, startValPercent.current + deltaPercent),
        );
        setCurrentTime(Math.round((newPercent / 100) * duration));
      },
    }),
  ).current;

  // Utility helpers
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleFavorite = () => setIsFavorite(!isFavorite);

  const handlePrev = () => {
    const prevIndex = (currentSongIndex - 1 + SONGS.length) % SONGS.length;
    setCurrentTime(0);
    setCurrentSongIndex(prevIndex);
    flatListRef.current?.scrollToIndex({ index: prevIndex, animated: true });
  };

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % SONGS.length;
    setCurrentTime(0);
    setCurrentSongIndex(nextIndex);
    flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const handleScrollEnd = (e: any) => {
    const contentOffset = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / windowWidth);
    if (index !== currentSongIndex && index >= 0 && index < SONGS.length) {
      setCurrentSongIndex(index);
      setCurrentTime(0);
    }
  };

  const progressPercent = (currentTime / duration) * 100;

  // Render core player contents
  const renderPlayer = () => {
    // Dynamic Shadow Styles
    const shadowOpacity = albumArtShadow.interpolate({
      inputRange: [0.3, 1.0],
      outputRange: [0.2, 0.45],
    });
    const shadowRadius = albumArtShadow.interpolate({
      inputRange: [0.3, 1.0],
      outputRange: [10, 24],
    });

    return (
      <View style={[styles.playerWrapper]}>
        {/* Static Gradient Background inside the screen */}
        <DynamicBackground colors={currentSong.colors} />

        <View style={styles.playerInnerContent}>
          {/* 1. Album Art Paging Section */}
          <FlatList
            ref={flatListRef}
            data={SONGS}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            getItemLayout={(_, index) => ({
              length: windowWidth,
              offset: windowWidth * index,
              index,
            })}
            onMomentumScrollEnd={handleScrollEnd}
            style={styles.albumArtFlatList}
            contentContainerStyle={styles.albumArtFlatListContent}
            renderItem={({ item }) => (
              <View style={styles.albumArtPage}>
                <Animated.View
                  style={[
                    styles.albumArtShadowBox,
                    {
                      transform: [{ scale: albumArtScale }],
                      shadowOpacity: shadowOpacity,
                      shadowRadius: shadowRadius,
                    },
                  ]}
                >
                  <Image
                    source={item.cover}
                    style={styles.albumArtImage as ImageStyle}
                    resizeMode="cover"
                  />
                </Animated.View>
              </View>
            )}
          />

          {/* 2. Song Details Row */}
          <View style={[styles.detailsContainer, styles.fullPlayerDetails]}>
            <View style={styles.songInfo}>
              <Text style={styles.songTitle} numberOfLines={1}>
                {currentSong.title}
              </Text>
              <Text style={styles.songArtist} numberOfLines={1}>
                {currentSong.artist}
              </Text>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                onPress={toggleFavorite}
                style={styles.circleActionButton}
              >
                <StarIcon
                  filled={isFavorite}
                  width={15}
                  height={15}
                  fill="#ffffff"
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.circleActionButton}>
                <MoreIcon width={15} height={15} fill="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 3. Custom Scrubber / Progress Slider */}
          <View style={styles.scrubberContainer}>
            <View
              style={styles.sliderTrack}
              {...scrubberPanResponder.panHandlers}
              onLayout={e => setScrubberWidth(e.nativeEvent.layout.width)}
            >
              <View style={styles.sliderBackground} />
              <View
                style={[
                  styles.sliderProgress,
                  { width: `${progressPercent}%` },
                ]}
              />
              <View
                style={[styles.sliderKnob, { left: `${progressPercent}%` }]}
              />
            </View>

            <View style={styles.timeLabelsContainer}>
              <Text style={styles.timeLabelText}>
                {formatTime(currentTime)}
              </Text>
              <Text style={styles.timeLabelText}>
                -{formatTime(duration - currentTime)}
              </Text>
            </View>
          </View>

          {/* 4. Playback Controls Section */}
          <View style={[styles.controlsContainer, styles.fullPlayerControls]}>
            <TouchableOpacity
              onPress={handlePrev}
              activeOpacity={0.7}
              style={styles.controlButton}
            >
              <RewindIcon width={32} height={32} fill="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlay}
              activeOpacity={0.8}
              style={styles.playButton}
            >
              {isPlaying ? (
                <PauseIcon width={40} height={40} fill="#ffffff" />
              ) : (
                <PlayIcon
                  width={40}
                  height={40}
                  fill="#ffffff"
                  style={styles.playIconOffset}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.7}
              style={styles.controlButton}
            >
              <ForwardIcon width={32} height={32} fill="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <SafeAreaView style={styles.fullScreenSafeArea} edges={[]}>
        {renderPlayer()}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  fullScreenSafeArea: {
    flex: 1,
    backgroundColor: '#131b17',
  },
  darkeningOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  darkeningOverlayColor: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  playerWrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  playerInnerContent: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: 'space-around',
    zIndex: 1,
  },
  // --- Flat Style variations for mockup/full screen ---
  fullPlayerDetails: {
    marginVertical: 12,
  },
  fullPlayerControls: {
    marginVertical: 20,
  },
  // --- Album Art Style ---
  albumArtFlatList: {
    flexGrow: 0,
    width: windowWidth,
    marginHorizontal: -28,
    marginTop: windowHeight * 0.04,
    marginBottom: windowHeight * 0.02,
  },
  albumArtFlatListContent: {
    alignItems: 'center',
  },
  albumArtPage: {
    width: windowWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  albumArtShadowBox: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 300,
    borderRadius: 20,
    backgroundColor: '#000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    elevation: 15,
  },
  albumArtImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  // --- Song details / Star & More ---
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  songInfo: {
    flex: 1,
    paddingRight: 10,
  },
  songTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },
  songArtist: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.55)',
    marginTop: 2,
    fontWeight: '400',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  circleActionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // --- Custom Scrubber ---
  scrubberContainer: {
    width: '100%',
  },
  sliderTrack: {
    height: 24,
    justifyContent: 'center',
    width: '100%',
  },
  sliderBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 1.5,
    width: '100%',
    position: 'absolute',
  },
  sliderProgress: {
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
    position: 'absolute',
  },
  sliderKnob: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    position: 'absolute',
    transform: [{ translateX: -3 }],
  },
  timeLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeLabelText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.45)',
    fontVariant: ['tabular-nums'],
  },
  // --- Controls ---
  controlsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  controlButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  playIconOffset: {
    marginLeft: 3,
  },
});
