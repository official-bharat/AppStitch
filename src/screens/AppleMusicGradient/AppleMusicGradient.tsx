import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  Image,
  Dimensions,
  Text,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
  Easing,
} from 'react-native';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SONGS } from './songs.constants';
import {
  ForwardIcon,
  MoreIcon,
  PauseIcon,
  PlayIcon,
  RewindIcon,
  StarIcon,
} from '../../assets';
import { getPalette } from '@somesoap/react-native-image-palette';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const DynamicBackground = React.memo(({ colors }: { colors: string[] }) => {
  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="bgGrid" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors[0]} stopOpacity={1} />
            <Stop offset="30%" stopColor={colors[1]} stopOpacity={1} />
            <Stop offset="67%" stopColor={colors[2]} stopOpacity={1} />
            <Stop offset="100%" stopColor={colors[3]} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#bgGrid)" />
      </Svg>
      {/* this is optional if you want to use the dim overlay */}
      <View style={styles.darkeningOverlay} />
    </View>
  );
});
export const AppleMusicGradient = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0);
  const flatlistRef = useRef<FlatList>(null);
  const [colors, setColors] = useState<string[]>([]);

  const currentSong = useMemo(
    () => SONGS[currentSongIndex],
    [currentSongIndex],
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${mins}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const songArtScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(songArtScale, {
        toValue: isPlaying ? 1.0 : 0.9,
        duration: 400,
        easing: Easing.out(Easing.back(1.5)),
        useNativeDriver: false,
      }),
    ]).start();
  }, [isPlaying, songArtScale]);

  const _renderItem = ({ item }: { item: (typeof SONGS)[number] }) => {
    return (
      <View style={styles.albumArtPage}>
        <Animated.View
          style={[
            styles.albumArtBox,
            {
              transform: [{ scale: songArtScale }],
            },
          ]}
        >
          <Image
            source={item.cover}
            style={styles.albumCoverArt}
            resizeMode="cover"
          />
        </Animated.View>
      </View>
    );
  };

  const togglePlay = useCallback(() => setIsPlaying(prev => !prev), []);

  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % SONGS.length;
    setCurrentSongIndex(nextIndex);
    flatlistRef.current?.scrollToIndex({ index: nextIndex, animated: true });
  };

  const handlePrevious = () => {
    const prevIndex = (currentSongIndex - 1 + SONGS.length) % SONGS.length;
    setCurrentSongIndex(prevIndex);
    flatlistRef.current?.scrollToIndex({ index: prevIndex, animated: true });
  };

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / windowWidth);
    if (index !== currentSongIndex && index >= 0 && index < SONGS.length) {
      setCurrentSongIndex(0);
    }
  };

  useEffect(() => {
    getPalette(currentSong.cover).then(palette => {
      console.log(palette, '');
      setColors(Object.values(palette));
    });
  }, [currentSong]);

  return (
    <View style={styles.screenContainer}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <SafeAreaView style={styles.fullScreen} edges={[]}>
        <View style={styles.playerWrapper}>
          <DynamicBackground colors={colors} />
          <View style={styles.playerInnerContent}>
            <FlatList
              ref={flatlistRef}
              data={SONGS}
              renderItem={_renderItem}
              horizontal
              pagingEnabled
              initialNumToRender={1}
              windowSize={3}
              style={styles.albumArtFlatlist}
              keyExtractor={item => item.id}
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews
              getItemLayout={(_, index) => ({
                length: windowWidth,
                offset: windowWidth * index,
                index,
              })}
              onMomentumScrollEnd={handleScrollEnd}
            />

            <View style={styles.detailsContainer}>
              <View style={styles.songsDetails}>
                <Text style={styles.songName}>{currentSong.title}</Text>
                <Text style={styles.songArtist}>{currentSong.artist}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity>
                  <StarIcon />
                </TouchableOpacity>
                <TouchableOpacity>
                  <MoreIcon />
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <View style={styles.sliderTrack}>
                <View style={styles.sliderBackground} />
                <View style={styles.sliderKnob} />
              </View>
              <View style={styles.timeLabelContainer}>
                <Text style={styles.timeLabelText}>0:00</Text>
                <Text style={styles.timeLabelText}>
                  {formatTime(currentSong.duration)}
                </Text>
              </View>
            </View>
            <View style={styles.controlsContainer}>
              <TouchableOpacity onPress={handlePrevious}>
                <RewindIcon height={32} width={32} />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlay}>
                {isPlaying ? (
                  <PauseIcon height={40} width={40} />
                ) : (
                  <PlayIcon height={40} width={40} />
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNext}>
                <ForwardIcon height={32} width={32} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#000',
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
  albumArtFlatlist: {
    flexGrow: 0,
    width: windowWidth,
    marginHorizontal: -28,
    marginTop: windowHeight * 0.04,
    marginBottom: windowHeight * 0.02,
  },
  albumArtBox: {
    width: '100%',
    aspectRatio: 1,
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    elevation: 10, //for android
  },
  albumArtPage: {
    width: windowWidth,
    alignItems: 'center',
  },
  albumCoverArt: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  songsDetails: {
    paddingRight: 10,
  },
  songName: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: '700',
  },
  songArtist: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '400',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderTrack: {
    height: 24,
    justifyContent: 'center',
    width: '100%',
  },
  sliderBackground: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 1.5,
    position: 'absolute',
    width: '100%',
  },
  sliderKnob: {
    width: 6,
    height: 6,
    borderRadius: 6,
    backgroundColor: '#ffffff',
    position: 'absolute',
    transform: [{ translateX: -3 }],
  },
  timeLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeLabelText: {
    color: '#fff',
    fontSize: 11,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  darkeningOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});
