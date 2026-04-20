import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CallIcon,
  ChatIcon,
  MenuIcon,
  NotificationIcon,
  SettingsIcon,
} from '../../assets';
import { colors } from '../../constants/colors';

export const TabAnimation = () => {
  const [activeTab, setActiveTab] = React.useState('chat');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <MenuIcon />
        <Text style={styles.bold}>Home</Text>
        <NotificationIcon />
      </View>
      <View style={styles.tabView}>
        <TouchableOpacity
          onPress={() => setActiveTab('call')}
          style={[
            styles.iconContainer,
            activeTab === 'call' && styles.activeTab,
          ]}
        >
          <CallIcon />
          <Text>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('chat')}
          style={[
            styles.iconContainer,
            activeTab === 'chat' && styles.activeTab,
          ]}
        >
          <ChatIcon />
          <Text>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('settings')}
          style={[
            styles.iconContainer,
            activeTab === 'settings' && styles.activeTab,
          ]}
        >
          <SettingsIcon />
          <Text>Settings</Text>
        </TouchableOpacity>
      </View>
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
});
