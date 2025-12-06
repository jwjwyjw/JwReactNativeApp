import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Image, View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_ICON_SIZE = 125;
const ADD_ICON_SIZE = 36;

// Custom image icon for tabs
function TabImageIcon({ focused, iconName }: { focused: boolean; iconName: 'home' | 'summary' }) {
  const icons = {
    home: {
      active: require('@/assets/images/tabs/home-active.png'),
      inactive: require('@/assets/images/tabs/home-inactive.png'),
    },
    summary: {
      active: require('@/assets/images/tabs/summary-active.png'),
      inactive: require('@/assets/images/tabs/summary-inactive.png'),
    },
  };

  return (
    <View
      style={[
        tabStyles.iconContainer,
        iconName === 'home' ? { marginLeft: 60 } : { marginRight: 60 },
      ]}
    >
      <Image
        source={focused ? icons[iconName].active : icons[iconName].inactive}
        style={tabStyles.iconImage}
        resizeMode="contain"
      />
    </View>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    width: TAB_ICON_SIZE,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  iconImage: {
    width: TAB_ICON_SIZE,
    height: 100,
  },
  addButtonWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    width: ADD_ICON_SIZE,
    height: ADD_ICON_SIZE,
  },
  tabBar: {
    backgroundColor: '#280947',
    borderTopWidth: 0,
    height: 120,
    paddingBottom: 26,
    paddingTop: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: 'absolute',
    overflow: 'hidden',
  },
});

export default function TabLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === 'android' ? Math.max(insets.bottom, 20) : insets.bottom;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: [tabStyles.tabBar, { paddingBottom: 30 + bottomPadding }],
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabImageIcon focused={focused} iconName="home" />
          ),
        }}
      />
      <Tabs.Screen
        name="add-note"
        options={{
          title: '',
          tabBarButton: () => (
            <TouchableOpacity
              style={tabStyles.addButtonWrapper}
              onPress={() => router.push('/new-note')}
            >
              <Image
                source={require('@/assets/images/icons/plus.png')}
                style={tabStyles.addIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: '',
          tabBarIcon: ({ focused }: { focused: boolean }) => (
            <TabImageIcon focused={focused} iconName="summary" />
          ),
        }}
      />
    </Tabs>
  );
}
