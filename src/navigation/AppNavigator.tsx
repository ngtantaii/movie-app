import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/Home';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DetailsScreen } from '../screens/Details';
import { WatchlistScreen } from '../screens/Watchlist';
import { Icon } from '../components';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
    </HomeStack.Navigator>
  );
};

export const AppNavigator = () => {

    const insets = useSafeAreaInsets();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#01B4E4',
          tabBarInactiveTintColor: '#FFFFFF',
          tabBarStyle: {
            backgroundColor: '#032541',
            borderTopWidth: 0,
            height: 60,
            paddingBottom: insets?.bottom ?? 8,
            paddingTop: 8,
          },
        }}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeStackNavigator}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color }) => <Icon name="Home" color={color} size={24} />,
          }}
        />
        <Tab.Screen
          name="WatchlistTab"
          component={WatchlistScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color }) => <Icon name={"Watchlist"} color={color} size={24} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};