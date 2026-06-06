import React, { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
  Animated,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CallIcon,
  ChatIcon,
  MenuIcon,
  NotificationIcon,
  SettingsIcon,
} from '../../assets';
import { colors } from '../../constants/colors';
const { width: windowWidth } = Dimensions.get('window');

export const TabAnimation: React.FC = () => {
  const [activeTab, setActiveTab] = useState('call');
  const [containerWidth, setContainerWidth] = useState(0);
  const tabs = ['call', 'chat', 'settings'];

  const flatlistRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const tabWidth = containerWidth / tabs.length;
  const translateX = scrollX.interpolate({
    inputRange: tabs.map((_, index) => index * windowWidth),
    outputRange: tabs.map((_, index) => index * tabWidth),
    extrapolate: 'clamp',
  });

  const _renderPageItems = ({ item }: { item: string }) => {
    let color = colors.primary;

    if (item === 'chat') {
      color = colors.secondary;
    } else if (item === 'settings') {
      color = colors.tertiary;
    }

    const _renderItem = () => {
      return (
        <View style={[styles.skeletonContainer, { backgroundColor: color }]}>
          <View style={styles.skeletonCircle} />
          <View style={styles.skeletonLine} />
          <View style={styles.skeletonLine} />
        </View>
      );
    };
    return (
      <View style={{ width: windowWidth }} key={item}>
        <FlatList
          data={[1, 2, 3, 4, 5, 7, 8, 9, 10, 11]}
          numColumns={2}
          renderItem={_renderItem}
          contentContainerStyle={styles.flatlistItems}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <MenuIcon />
        <Text style={styles.bold}>Home</Text>
        <NotificationIcon />
      </View>
      <View
        style={styles.tabView}
        onLayout={(e: LayoutChangeEvent) => {
          setContainerWidth(e.nativeEvent.layout.width);
        }}
      >
        <Animated.View
          style={[
            styles.animatedPill,
            {
              width: tabWidth,
              transform: [{ translateX }],
            },
          ]}
        />
        <TouchableOpacity
          onPress={() => {
            setActiveTab('call');
            flatlistRef.current?.scrollToIndex({ index: 0, animated: true });
          }}
          style={styles.iconContainer}
        >
          <CallIcon />
          <Text style={activeTab === 'call' ? styles.activeText : {}}>
            Call
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab('chat');
            flatlistRef.current?.scrollToIndex({ index: 1, animated: true });
          }}
          style={styles.iconContainer}
        >
          <ChatIcon />
          <Text style={activeTab === 'chat' ? styles.activeText : {}}>
            Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setActiveTab('settings');
            flatlistRef.current?.scrollToIndex({ index: 2, animated: true });
          }}
          style={styles.iconContainer}
        >
          <SettingsIcon />
          <Text style={activeTab === 'settings' ? styles.activeText : {}}>
            Settings
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatlistRef}
        data={tabs}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        renderItem={_renderPageItems}
        getItemLayout={(data, index) => ({
          length: windowWidth,
          offset: windowWidth * index,
          index,
        })}
        onMomentumScrollEnd={e => {
          const contentOffsetX = e.nativeEvent.contentOffset.x;
          const newIndex = Math.round(contentOffsetX / windowWidth);
          setActiveTab(tabs[newIndex]);
        }}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bold: {
    fontWeight: '400',
    fontSize: 20,
  },
  tabView: {
    backgroundColor: colors.bg,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 12,
    marginTop: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
    padding: 12,
    width: '33%',
  },
  activeTab: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    width: '33%',
  },
  animatedPill: {
    position: 'absolute',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  skeletonContainer: {
    height: 100,
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 0.48,
    marginLeft: 12,
  },
  skeletonLine: {
    height: 10,
    width: 70,
    backgroundColor: colors.skeleton,
    borderRadius: 10,
    marginTop: 10,
    marginLeft: 10,
  },
  skeletonCircle: {
    height: 30,
    width: 30,
    backgroundColor: colors.skeleton,
    padding: 10,
    borderRadius: 30,
    marginTop: 10,
    marginLeft: 10,
  },
  flatlistItems: {
    gap: 10,
    marginTop: 20,
  },
  activeText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
