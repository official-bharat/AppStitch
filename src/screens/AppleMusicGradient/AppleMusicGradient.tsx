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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, {
  Circle,
  Defs,
  Filter,
  FeGaussianBlur,
  Rect,
} from 'react-native-svg';

import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  RewindIcon,
  StarIcon,
  MoreIcon,
  VolumeLowIcon,
  VolumeHighIcon,
  LyricsIcon,
  AirPlayIcon,
  QueueIcon,
} from '../../assets';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

// Define Animated SVG Components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Playlist dataset of 10 songs with matching color profiles for the background
const SONGS = [
  {
    id: '1',
    title: 'The Lake',
    artist: 'Apple Music',
    cover: require('../../assets/the_lake.png'),
    duration: 271, // 4:31
    colors: ['#275c47', '#704e38', '#3d334d', '#4f5c35'], // teal, copper brown, deep plum, olive
  },
  {
    id: '2',
    title: 'The River',
    artist: 'Peak Flow',
    cover: require('../../assets/the_river.png'),
    duration: 215, // 3:35
    colors: ['#22485e', '#234a30', '#3b2c47', '#4b5435'], // river blue, moss green, deep violet, dark sage
  },
  {
    id: '3',
    title: 'The Mountain',
    artist: 'Dawn Ridge',
    cover: require('../../assets/the_mountain.png'),
    duration: 312, // 5:12
    colors: ['#5c2e49', '#784432', '#2e385c', '#4a5c2e'], // mountain sunset purple, dusty terracotta, cold navy, forest edge
  },
  {
    id: '4',
    title: 'The Forest',
    artist: 'Pine Grove',
    cover: require('../../assets/the_forest.png'),
    duration: 248, // 4:08
    colors: ['#163328', '#332f18', '#182833', '#2f1833'], // deep spruce, golden straw, dark sky, shadow orchid
  },
  {
    id: '5',
    title: 'The Desert',
    artist: 'Sand Dune',
    cover: require('../../assets/the_desert.png'),
    duration: 189, // 3:09
    colors: ['#4a2119', '#5c4119', '#1d1933', '#41194a'], // hot copper, sunset gold, deep indigo, dune shadow purple
  },
  {
    id: '6',
    title: 'The Ocean',
    artist: 'Ocean Wave',
    cover: require('../../assets/the_ocean.png'),
    duration: 295, // 4:55
    colors: ['#183f4a', '#184a38', '#33184a', '#4a1833'], // deep sea blue, kelp green, ocean abyss, coral pink
  },
  {
    id: '7',
    title: 'The Valley',
    artist: 'Wild Meadow',
    cover: require('../../assets/the_valley.png'),
    duration: 224, // 3:44
    colors: ['#314a2b', '#4a462b', '#2b3a4a', '#4a2b3a'], // valley grass, wild mustard, cloud shadow, heather purple
  },
  {
    id: '8',
    title: 'The Canyon',
    artist: 'Red Rock',
    cover: require('../../assets/the_canyon.png'),
    duration: 280, // 4:40
    colors: ['#69342c', '#694e2c', '#2c4e69', '#4e2c69'], // canyon clay, sandstone orange, shadow blue, royal plum
  },
  {
    id: '9',
    title: 'The Sky',
    artist: 'Cumulus Cloud',
    cover: require('../../assets/the_sky.png'),
    duration: 260, // 4:20
    colors: ['#4b2f5c', '#754d73', '#2f515c', '#5c422f'], // sky twilight purple, warm cloud pink, dusk blue, golden highlight
  },
  {
    id: '10',
    title: 'The Meadow',
    artist: 'Summer Bloom',
    cover: require('../../assets/the_meadow.png'),
    duration: 202, // 3:22
    colors: ['#3e2f5c', '#2f5c4c', '#5c2f41', '#515c2f'], // lavender purple, green leaf, summer bloom pink, field grass yellow
  },
];

// --- Animated Dynamic Background component ---
interface DynamicBackgroundProps {
  width: number;
  height: number;
  colors: string[];
}

const DynamicBackground: React.FC<DynamicBackgroundProps> = ({
  width,
  height,
  colors,
}) => {
  // Normalized values (0 to 1) to animate position scale independently of device sizes
  const normX1 = useRef(new Animated.Value(0.15)).current;
  const normY1 = useRef(new Animated.Value(0.2)).current;

  const normX2 = useRef(new Animated.Value(0.85)).current;
  const normY2 = useRef(new Animated.Value(0.25)).current;

  const normX3 = useRef(new Animated.Value(0.25)).current;
  const normY3 = useRef(new Animated.Value(0.75)).current;

  const normX4 = useRef(new Animated.Value(0.75)).current;
  const normY4 = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animConfig = (
      val: Animated.Value,
      startVal: number,
      toVal: number,
      duration: number,
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(val, {
            toValue: toVal,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(val, {
            toValue: startVal,
            duration,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      );

    const animations = [
      animConfig(normX1, 0.15, 0.45, 14000),
      animConfig(normY1, 0.2, 0.4, 16000),
      animConfig(normX2, 0.85, 0.55, 18000),
      animConfig(normY2, 0.25, 0.55, 15000),
      animConfig(normX3, 0.25, 0.5, 17000),
      animConfig(normY3, 0.75, 0.5, 19000),
      animConfig(normX4, 0.75, 0.4, 15500),
      animConfig(normY4, 0.8, 0.65, 17500),
    ];

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Interpolate normalized coordinate values to current layout dimensions
  const cx1 = normX1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });
  const cy1 = normY1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height],
  });

  const cx2 = normX2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });
  const cy2 = normY2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height],
  });

  const cx3 = normX3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });
  const cy3 = normY3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height],
  });

  const cx4 = normX4.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width],
  });
  const cy4 = normY4.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height],
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <Filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
            <FeGaussianBlur stdDeviation={width * 0.18} />
          </Filter>
        </Defs>
        <Rect width="100%" height="100%" fill="#131b17" />

        {/* Floating gradient colors blobs */}
        <AnimatedCircle
          cx={cx1}
          cy={cy1}
          r={width * 0.5}
          fill={colors[0]}
          filter="url(#blur)"
        />
        <AnimatedCircle
          cx={cx2}
          cy={cy2}
          r={width * 0.55}
          fill={colors[1]}
          filter="url(#blur)"
        />
        <AnimatedCircle
          cx={cx3}
          cy={cy3}
          r={width * 0.5}
          fill={colors[2]}
          filter="url(#blur)"
        />
        <AnimatedCircle
          cx={cx4}
          cy={cy4}
          r={width * 0.45}
          fill={colors[3]}
          filter="url(#blur)"
        />
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
  const [volume, setVolume] = useState<number>(65); // 0 to 100

  const currentSong = SONGS[currentSongIndex];
  const duration = currentSong.duration;

  // Track Layout sizes for slider responders
  const [scrubberWidth, setScrubberWidth] = useState<number>(0);
  const [volumeWidth, setVolumeWidth] = useState<number>(0);

  // Animations values
  const albumArtScale = useRef(new Animated.Value(0.9)).current;
  const albumArtShadow = useRef(new Animated.Value(0.3)).current;

  // Track timers for slider gestures
  const startTouchX = useRef<number>(0);
  const startValPercent = useRef<number>(0);
  const startVolPercent = useRef<number>(0);

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

  // Volume PanResponder gesture controls
  const volumePanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, _gestureState) => {
        startTouchX.current = evt.nativeEvent.locationX;
        const initialPercent = Math.max(
          0,
          Math.min(100, (evt.nativeEvent.locationX / volumeWidth) * 100),
        );
        setVolume(initialPercent);
        startVolPercent.current = initialPercent;
      },
      onPanResponderMove: (evt, gestureState) => {
        const deltaPercent = (gestureState.dx / volumeWidth) * 100;
        const newPercent = Math.max(
          0,
          Math.min(100, startVolPercent.current + deltaPercent),
        );
        setVolume(newPercent);
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
    setCurrentTime(0);
    setCurrentSongIndex(
      prevIndex => (prevIndex - 1 + SONGS.length) % SONGS.length,
    );
  };

  const handleNext = () => {
    setCurrentTime(0);
    setCurrentSongIndex(prevIndex => (prevIndex + 1) % SONGS.length);
  };

  const progressPercent = (currentTime / duration) * 100;

  // Render core player contents
  const renderPlayer = (contentWidth: number, contentHeight: number) => {
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
        {/* Dynamic Gradient Background inside the screen */}
        <DynamicBackground
          width={contentWidth}
          height={contentHeight}
          colors={currentSong.colors}
        />

        <View style={styles.playerInnerContent}>
          {/* 1. Album Art Section */}
          <View
            style={[styles.albumArtContainer, styles.fullPlayerArtContainer]}
          >
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
                source={currentSong.cover}
                style={styles.albumArtImage as ImageStyle}
                resizeMode="cover"
              />
            </Animated.View>
          </View>

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

          {/* 5. Volume Slider Control */}
          <View style={[styles.volumeContainer, styles.fullPlayerVolume]}>
            <VolumeLowIcon
              width={13}
              height={13}
              fill="rgba(255,255,255,0.4)"
            />
            <View
              style={styles.volumeTrack}
              {...volumePanResponder.panHandlers}
              onLayout={e => setVolumeWidth(e.nativeEvent.layout.width)}
            >
              <View style={styles.volumeBackground} />
              <View style={[styles.volumeProgress, { width: `${volume}%` }]} />
              <View style={[styles.volumeKnob, { left: `${volume}%` }]} />
            </View>
            <VolumeHighIcon
              width={13}
              height={13}
              fill="rgba(255,255,255,0.4)"
            />
          </View>

          {/* 6. Bottom Utility Actions */}
          <View style={[styles.bottomBarContainer, styles.fullPlayerBottomBar]}>
            <TouchableOpacity style={styles.bottomBarButton}>
              <LyricsIcon
                width={18}
                height={18}
                fill="rgba(255,255,255,0.65)"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomBarButton}>
              <AirPlayIcon
                width={18}
                height={18}
                fill="rgba(255,255,255,0.65)"
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomBarButton}>
              <QueueIcon width={18} height={18} fill="rgba(255,255,255,0.65)" />
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

      <SafeAreaView style={styles.fullScreenSafeArea} edges={['top', 'bottom']}>
        {renderPlayer(windowWidth, windowHeight)}
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
  fullPlayerArtContainer: {
    marginTop: windowHeight * 0.04,
    marginBottom: windowHeight * 0.02,
  },
  fullPlayerDetails: {
    marginVertical: 12,
  },
  fullPlayerControls: {
    marginVertical: 20,
  },
  fullPlayerVolume: {
    marginVertical: 15,
  },
  fullPlayerBottomBar: {
    marginBottom: windowHeight * 0.02,
  },
  // --- Album Art Style ---
  albumArtContainer: {
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
  // --- Volume Slider ---
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 5,
  },
  volumeTrack: {
    flex: 1,
    height: 24,
    justifyContent: 'center',
  },
  volumeBackground: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 1.5,
    width: '100%',
    position: 'absolute',
  },
  volumeProgress: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 1.5,
    position: 'absolute',
  },
  volumeKnob: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    position: 'absolute',
    transform: [{ translateX: -3 }],
  },
  // --- Bottom Utility Bar ---
  bottomBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bottomBarButton: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
