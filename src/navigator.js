import React from 'react';
import { View, Text } from 'react-native';
import { TabNavigator } from 'react-navigation'; // 1.0.0-beta.14
import Ionicons from 'react-native-vector-icons/Ionicons'; // 4.4.2
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // 4.4.2
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

import { FlatList, ScrollView } from 'react-native';

import ProfileScreen from './pages/Profile'
import PriceList from './pages/PriceList/router'
import Category from './pages/Category/router'
import Home from './pages/Home/router'
import EventPage from './pages/EventPage/router'


const RootTabs = TabNavigator({
    EventPage: {
        screen: EventPage,
        navigationOptions: {
            tabBarLabel: '最新活动*',
            tabBarIcon: ({ tintColor, focused }) => (
                <FontAwesome
                    name='volume-up'
                    size={26}
                    style={{ color: tintColor, backgroundColor: 'transparent' }}
                />
            ),
        },
    },
    PriceList: {
        screen: PriceList,
        navigationOptions: {
            tabBarLabel: '报价表',
            tabBarIcon: ({ tintColor, focused }) => (
                <FontAwesome
                    name={focused ? 'list-alt' : 'list-alt'}
                    size={26}
                    style={{ color: tintColor, backgroundColor: 'transparent' }}
                />
            ),
        },
    },
    Home: {
        screen: Home,
        navigationOptions: {
            tabBarLabel: '澳购商城',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-home' : 'ios-home-outline'}
                    size={26}
                    style={{ color: tintColor, backgroundColor: 'transparent' }}
                />
            ),
        },
    },
    Category: {
        screen: Category,
        navigationOptions: {
            tabBarLabel: '分类',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name='md-list-box'
                    size={26}
                    style={{ color: tintColor, backgroundColor: 'transparent' }}
                />
            ),
        },
    },
    Profile: {
        screen: ProfileScreen,
        navigationOptions: {
            tabBarLabel: '个人中心',
            tabBarIcon: ({ tintColor, focused }) => (
                <Ionicons
                    name={focused ? 'ios-person' : 'ios-person-outline'}
                    size={26}
                    style={{ color: tintColor, backgroundColor: 'transparent' }}
                />
            ),
        },
    },
}, {
        initialRouteName: 'Home',
        tabBarPosition: 'bottom',
        swipeEnabled: false,
        animationEnabled: false,
        tabBarOptions: {
            style: {
                height: 44
            },
            activeBackgroundColor: 'white',
            activeTintColor: '#f04134',
            inactiveBackgroundColor: 'white',
            inactiveTintColor: '#aaa',
            showLabel: true
        }
    });

export default RootTabs;