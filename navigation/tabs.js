import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Home, Settings } from '../screens';
import { icons, COLORS } from '../constants';
import { Image } from 'react-native';

import Report from '../screens/Report';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.home}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? COLORS.primary : COLORS.secondary,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Report"
        component={Report}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.search}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? COLORS.primary : COLORS.secondary,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: ({ focused }) => (
            <Image
              source={icons.settings}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? COLORS.primary : COLORS.secondary,
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
